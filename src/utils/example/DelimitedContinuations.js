/**
 * @fileoverview A set of utility functions for managing asynchronous operations with async generator functions in JavaScript.
 * @description This module provides a set of utility functions for managing asynchronous operations with async generator functions in JavaScript. It includes functions for error handling, retries, and cancellations, as well as a cancellation token class. These utilities are designed to enhance the control and robustness of asynchronous code, making it easier to write clean, efficient, and reliable applications.
 * @module DelimitedContinuationsUtils
 * @exports isTransientError
 * @exports wait
 * @exports asyncGenerator
 * @exports runGenerator
 * @exports CancellationToken
 * @exports exponentialBackoff
 * @exports applyMiddleware
 * @exports TimeTravelDebugger
 * @exports createState
 * @exports createStateManager
 * @exports createEffectInterceptor
 * @exports continuation
 * @exports runContinuation
 * @exports parallel // Added export for parallel
 */

/**
 * @function isTransientError - Determines if an error is transient and should be retried.
 * @description This function determines if an error is transient and should be retried. It checks for common transient error codes and status codes, and provides an interface for custom transient error conditions.
 * @param {Object} error - The error object to check.
 * @param {number} [retryCount=0] - The current retry count.
 * @param {number} [maxRetries=3] - The maximum number of retries.
 * @param {Object} [customTransientConditions={}] - Custom transient error conditions.
 * @returns {boolean} - Returns true if the error is transient and should be retried, otherwise false.
 * @example
 * const error = new Error('ECONNRESET');
 * if (isTransientError(error)) {
 *     // Retry the operation
 * }
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
 * @example
 * async function example() {
 *     await wait(1000); // Wait for 1 second
 *     console.log('Done');
 * }
 */
export const wait = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds));

/**
 * @function asyncGenerator - Wraps an async generator function for execution.
 * @param {Function} genFunc - The async generator function to wrap.
 * @param {Object} [options={}] - Additional options for the async generator.
 * @returns {Function} - An async function that runs the wrapped async generator.
 * @example
 * const generator = asyncGenerator(function* () {
 *     yield wait(1000);
 *     return 'Done';
 * });
 * runGenerator(generator).then(result => console.log(result));
 */
export const asyncGenerator = (genFunc, options = {}) => async function (...args) {
    const generator = genFunc.apply(this, args);
    if (typeof options.onStart === 'function') options.onStart();
    return runGenerator(generator, options);
};

/**
 * @function applyMiddleware - Applies middleware functions to the async generator.
 * @param {Function} genFunc - The async generator function to wrap.
 * @param {Function[]} middlewareFunctions - The middleware functions to apply.
 * @param {Object} [options={}] - Additional options for the async generator.
 * @returns {Function} - An async function that runs the wrapped async generator with applied middleware.
 * @example
...(about 282 lines omitted)...
 * @example
 * const state = createState({ count: 0 });
 * state.set({ count: state.get().count + 1 });
 */
export const createState = initialState => {
    let state = initialState;
    return {
        get: () => state,
        set: newState => state = newState
    };
}

/**
 * @function createStateManager - Creates a state manager for a given state.
 * @param {Object} state - The state to manage.
 * @param {Function[]} [middlewares=[]] - The middlewares to apply to state changes.
 * @returns {Object} - The state manager.
 * @example
 * const state = createState({ count: 0 });
 * const stateManager = createStateManager(state, [middleware]);
 * stateManager.subscribe(newState => console.log(newState));
 * stateManager.set({ count: stateManager.get().count + 1 });
 */
export const createStateManager = (state, middlewares = []) => {
    let listeners = [];
    const dispatch = action => {
        state.set(middlewares.reduce((acc, middleware) => middleware(acc), action));
        listeners.forEach(listener => listener(state.get()));
    };
    return {
        get: () => state.get(),
        set: newState => dispatch(newState),
        subscribe: listener => {
            listeners.push(listener);
            return () => {
                listeners = listeners.filter(l => l !== listener);
            };
        }
    };
}

/**
 * @function createEffectInterceptor - Creates an effect interceptor for a given effect function.
 * @param {Function} effect - The effect function to intercept.
 * @returns {Function} - The intercepted effect function.
 * @example
 * const effect = createEffectInterceptor(fetch);
 * effect.subscribe(response => console.log(response));
 * effect('https://api.example.com/data');
 */
export const createEffectInterceptor = effect => {
    let listeners = [];
    return {
        effect: (...args) => {
            const result = effect(...args);
            listeners.forEach(listener => listener(result));
            return result;
        },
        subscribe: listener => {
            listeners.push(listener);
            return () => {
                listeners = listeners.filter(l => l !== listener);
            };
        }
    };
}

/**
 * @function exponentialBackoff - Calculates the delay for an exponential backoff strategy.
 * @param {number} attempt - The current retry attempt.
 * @param {Object} options - The options for the exponential backoff strategy.
 * @returns {number} - The delay in milliseconds.
 * @example
 * const delay = exponentialBackoff(3, { baseDelay: 1000, growthFactor: 2 });
 */
export const exponentialBackoff = (attempt, options) => {
    return options.baseDelay * Math.pow(options.growthFactor, attempt);
}

/**
 * @function calculateRetryDelay - Calculates the delay for a retry attempt.
 * @param {number} attempt - The current retry attempt.
 * @param {Object} options - The options for the retry strategy.
 * @returns {number} - The delay in milliseconds.
 * @example
 * const delay = calculateRetryDelay(3, { baseDelay: 1000, growthFactor: 2 });
 */
export const calculateRetryDelay = (attempt, options) => {
    if (options.delayStrategy === 'exponentialBackoff') {
        return exponentialBackoff(attempt, options);
    }
}

/**
 * @function continuation - Placeholder function for continuation.
 * @description This function is a placeholder for continuation operations.
 * @returns {void}
 * @example
 * continuation();
 */
export const continuation = () => {
    // Placeholder for continuation operations
}

/**
 * @function runContinuation - Executes a continuation function.
 * @description This function is designed to execute a continuation function, facilitating the continuation of asynchronous operations.
 * @param {Function} continuationFunc - The continuation function to execute.
 * @returns {void}
 * @example
 * runContinuation(() => {
 *     console.log('Continuation function executed');
 * });
 */
export const runContinuation = asyncGenerator(function* (continuationFunc) {
    if (typeof continuationFunc !== 'function') {
        console.error('Error executing continuation function: TypeError: continuationFunc is not a function');
        return;
    }
    // Using asyncGenerator handles errors internally, no need for explicit try-catch
    yield continuationFunc();
});

/**
 * @function parallel - Executes multiple asynchronous operations in parallel.
 * @description This function is designed to execute multiple asynchronous operations in parallel, improving efficiency and performance.
 * @param {Function[]} operations - The asynchronous operations to execute in parallel.
 * @returns {Promise} - A promise that resolves when all operations have completed.
 * @example
 * parallel([asyncOperation1, asyncOperation2]).then(() => {
 *     console.log('All operations completed');
 * });
 */
export const parallel = asyncGenerator(function* (operations) {
    // Wrap each operation in asyncGenerator and use runGenerator for execution
    const wrappedOperations = operations.map(op => asyncGenerator(op));
    yield Promise.all(wrappedOperations.map(wrappedOp => runGenerator(wrappedOp())));
});

/**
 * TimeTravelDebugger class to manage debugging with time travel capabilities.
 */
export class TimeTravelDebugger {
    #history = [];

    record(state) {
        this.#history.push(state);
    }

    rewind(steps) {
        const targetIndex = Math.max(this.#history.length - steps - 1, 0);
        return this.#history[targetIndex];
    }

    replay(steps) {
        const targetIndex = Math.min(steps, this.#history.length - 1);
        return this.#history[targetIndex];
    }
}