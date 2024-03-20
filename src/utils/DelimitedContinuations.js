/**
 * @fileoverview A set of utility functions for managing asynchronous operations with async generator functions in JavaScript.
 * @description This module provides a set of utility functions for managing asynchronous operations with async generator functions in JavaScript. It includes functions for error handling, retries, and cancellations, as well as a cancellation token class. These utilities are designed to enhance the control and robustness of asynchronous code, making it easier to write clean, efficient, and reliable applications.
 * @module DelimitedContinuationsUtils
 * @exports isTransientError
 * @exports wait
 * @exports asyncGenerator
 * @exports runGenerator
 * @exports runContinuation
 * @exports CancellationToken
 * @exports exponentialBackoff
 */

/**
 * @function isTransientError - Determines if an error is transient and should be retried.
 * @description This function determines if an error is transient and should be retried. It checks for common transient error codes and status codes, and provides an interface for custom transient error conditions.
 * @param {Object} error - The error object to check.
 * @param {number} [retryCount=0] - The current retry count.
 * @param {number} [maxRetries=3] - The maximum number of retries.
 * @param {Object} [customTransientConditions={}] - Custom transient error conditions.
 * @returns {boolean} - Returns true if the error is transient and should be retried, otherwise false.
 */
export function isTransientError(error, retryCount = 0, maxRetries = 3, customTransientConditions = {}) {
    const transientErrorCodes = ['ECONNRESET', 'ETIMEDOUT', 'ECONNREFUSED'];
    const transientStatusCodes = [502, 503, 504];
    let isTransient = false;

    if ((error.code && transientErrorCodes.includes(error.code)) ||
        (error.statusCode && transientStatusCodes.includes(error.statusCode))) {
        isTransient = true;
    }

    if (typeof customTransientConditions === 'function') {
        isTransient = customTransientConditions(error);
    } else if (typeof customTransientConditions === 'object') {
        if ((customTransientConditions.codes && customTransientConditions.codes.includes(error.code)) ||
            (customTransientConditions.statusCodes && customTransientConditions.statusCodes.includes(error.statusCode))) {
            isTransient = true;
        }
    }

    return isTransient && retryCount < maxRetries;
}
/**
 * @function wait - Delays the execution for a specified number of milliseconds.
 * @param {number} milliseconds - The number of milliseconds to wait.
 * @returns {Promise} - A promise that resolves after the specified delay.
 */
export const wait = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds));

/**
 * @function asyncGenerator - Wraps an async generator function for execution.
 * @param {Function} genFunc - The async generator function to wrap.
 * @param {Object} [options={}] - Additional options for the async generator.
 * @returns {Function} - An async function that runs the wrapped async generator.
 */
export const asyncGenerator = (genFunc, options = {}) => async function (...args) {
    const generator = genFunc.apply(this, args);
    if (typeof options.onStart === 'function') options.onStart();
    return runGenerator(generator, options);
};

/**
 * @function runGenerator - Executes an async generator with support for retries and error handling.
 * @param {Object} generator - The async generator to run.
 * @param {Object} [options={}] - Additional options for running the generator.
 * @param {Object} [cancellationToken] - A token for cancelling the operation.
 * @returns {Promise} - A promise that resolves after running the generator.
 */
export async function runGenerator(generator, options = {}, cancellationToken) {
    const {
        retryOptions = {
            retries: 3,
            delayStrategy: 'exponentialBackoff',
            baseDelay: 1000,
            growthFactor: 2,
            retryCondition: (err) => true
        },
        onYield, onCompletion, onError, onCancel, saveState, restoreState, rewind, replay
    } = options;

    let attempt = 0;
    let result, numYields = 0, numErrors = 0, startTime = performance.now();
    let generatorState, yieldPoints = [];

    async function executeGenerator() {
        try {
            while (true) {
                if (cancellationToken?.isCancelled) {
                    if (onCancel) onCancel();
                    return;
                }
                result = await generator.next(result?.value);
                if (result.done) break;
                if (onYield) onYield(result.value);
                numYields++;
                generatorState = result;
                if (saveState) saveState(generatorState);
                if (rewind) yieldPoints.push(generatorState);
                if (replay && yieldPoints.length > 0) {
                    generatorState = yieldPoints.pop();
                    result = { value: generatorState.value, done: false };
                }
            }
        } catch (err) {
            if (onError) onError(err);
            numErrors++;
            if (retryOptions.retryCondition(err) && attempt < retryOptions.retries) {
                const delay = calculateRetryDelay(attempt, retryOptions);
                await wait(delay);
                attempt++;
                if (restoreState) restoreState();
                return executeGenerator();
            } else {
                throw err;
            }
        }
    }

    await executeGenerator();

    const endTime = performance.now(), executionTime = endTime - startTime;
    if (onCompletion) {
        const throughput = numYields / (executionTime / 1000);
        const errorRate = numErrors / (attempt + 1);
        onCompletion(result?.value, { numYields, executionTime, throughput, errorRate });
    }
    return result?.value;
}

/**
 * @function runContinuation - Runs a continuation promise.
 * @param {Promise} promise - The promise to run as a continuation.
 * @returns {Promise} - The input promise itself.
 */
export const runContinuation = promise => promise;

/**
 * @class CancellationToken - Represents a token for cancelling an operation.
 */
export class CancellationToken {
    /**
     * @constructor
     * @param {EventTarget} externalSignal - An external signal for cancellation.
     */
    constructor(externalSignal) {
        this.isCancelled = false;
        this.onCancelActions = [];

        if (externalSignal) {
            externalSignal.addEventListener('cancel', () => this.cancel());
        }
    }

    /**
     * Registers a cancellation action.
     * @param {Function} action - The action to register for cancellation.
     */
    register(action) {
        if (typeof action === 'function') {
            this.onCancelActions.push(action);
        }
    }

    /**
     * Cancels the operation.
     */
    cancel() {
        if (!this.isCancelled) {
            this.isCancelled = true;
            for (const action of this.onCancelActions) {
                action();
            }
        }
    }
}
