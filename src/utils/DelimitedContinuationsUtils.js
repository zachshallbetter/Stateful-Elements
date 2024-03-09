// DelimitedContinuationsUtils.js

/**
 * Wraps an async generator function, enabling it to be used as a method
 * within an object while preserving the 'this' context.
 * @param {Function} genFunc The async generator function.
 * @returns {Function} A wrapped function that can be called as an object method.
 */
export function asyncGenerator(genFunc) {
    return function (...args) {
        const generator = genFunc.apply(this, args);
        return runGenerator(generator);
    };
}

/**
 * Runs an async generator to completion, effectively managing the yields and
 * continuing execution until the generator is done.
 * @param {AsyncGenerator} generator The async generator instance to run.
 * @returns {Promise} A promise that resolves when the generator completes.
 */
async function runGenerator(generator) {
    let result = { value: undefined, done: false };

    while (!result.done) {
        try {
            result = await generator.next(result.value);
        } catch (err) {
            // If an error occurs within the generator, throw it to be caught by the caller
            throw err;
        }
    }

    return result.value;
}

/**
 * A utility function for running continuations. It assumes that the continuation
 * is a promise and awaits its resolution before proceeding.
 * @param {Promise} promise The promise to run as part of the continuation.
 * @returns {Promise} The resolved value of the promise.
 */
export function runContinuation(promise) {
    return promise; // In this simplified example, we directly return the promise.
}
