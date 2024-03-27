# Delimited Continuations Utilities

The Delimited Continuations Utilities module provides a set of tools that simplify the management of asynchronous operations in JavaScript. It is designed to abstract the complexity of using delimited continuations directly, offering advanced control over asynchronous operations. This module is ideal for developers who need robust solutions for managing async generator functions, simplifying error handling, supporting flexible retry strategies, and facilitating graceful cancellation of ongoing operations. With the Delimited Continuations Utilities, you can dive into a world where asynchronous code is clean, efficient, and resilient.

## Warning

This README is a comprehensive guide for utilizing the Delimited Continuations Utilities module in your projects. It covers everything you need to know to leverage the module's capabilities effectively, from simple tasks to advanced asynchronous operation management. If you're new to the concept of delimited continuations or need a refresher, we recommend reading the "Understanding Delimited Continuations" section to gain a solid understanding of the underlying principles and benefits of this programming construct.

## Understanding Delimited Continuations

Delimited Continuations provide a mechanism to control the flow of asynchronous operations, allowing functions to pause execution and resume at a later time. This concept is particularly useful in JavaScript, where non-blocking operations are a cornerstone of the language's ability to handle concurrent tasks efficiently. Here are some key questions and answers to help you understand the use and significance of Delimited Continuations in your applications.

### What are Delimited Continuations?

Delimited Continuations are a programming construct that allows the capture of the continuation of a computation (a snapshot of its future execution state) at a given point, to be resumed later. This can be thought of as putting a bookmark in your code's execution to return to it after performing other tasks.

### How do Delimited Continuations differ from regular continuations?

Regular continuations capture the entire future execution state of a function, including the entire call stack, making them less granular and harder to manage. Delimited Continuations, on the other hand, capture the continuation up to a specific point in the code, allowing for more fine-grained control over the execution state. This makes them more flexible and easier to work with in complex asynchronous scenarios.

### Why are Delimited Continuations useful?

Asynchronous programming involves operations that do not complete immediately, such as fetching data from a server or reading a file from disk. Delimited Continuations allow these operations to be paused and resumed, providing a way to manage asynchronous code more effectively. This improves code readability, error handling, and resource management, making asynchronous code easier to write, understand, and debug.

### Comparing Delimited Continuations to Promises and Callbacks

While Promises and Callbacks are common tools for managing asynchronous operations in JavaScript, Delimited Continuations offer a more granular and flexible approach. Promises represent a single future value, while Delimited Continuations can capture and resume the entire execution state of a function. Callbacks, on the other hand, are less composable and harder to reason about than Delimited Continuations, which provide a more structured and predictable way to manage asynchronous code. Examples of Delimited Continuations in JavaScript include async generator functions, which use the `yield` keyword to pause execution and return a value, and the `async` and `await` keywords, which provide syntactic sugar for working with Promises and Delimited Continuations.

```javascript
// Example of async generator function
async function* asyncNumbers() {
  yield 1;
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate async operation
  yield 2;
}
```

versus

```javascript
// Example of async function
async function asyncNumbers() {
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate async operation
  return 2;
}
```

### How do Delimited Continuations improve error handling and retries?

Delimited Continuations provide a natural way to capture and handle errors at the point of their occurrence, allowing for more granular and context-aware error management. This makes it easier to implement retry strategies, where the continuation can be captured and resumed after a transient error occurs, without losing the context of the operation. This is particularly useful for managing network requests, database queries, and other I/O-bound operations that may encounter temporary failures.

### How does the Delimited Continuations Utilities module help?

The Delimited Continuations Utilities module provides tools that abstract the complexity of using delimited continuations directly. It offers utility functions for managing async generator functions, handling retries and errors, and supporting cancellations in a way that leverages the concept of delimited continuations. Here's how it helps:

- **Async Generator Wrapping and Execution**: Simplifies the use of async generators as object methods while preserving their context, making asynchronous code more modular and maintainable.
- **Error Handling and Retries**: Automatically manages transient errors and provides customizable retry strategies, reducing boilerplate code and improving application resilience.
- **Cancellation Tokens**: Facilitates the graceful cancellation of asynchronous operations, allowing for better resource management and cleanup.

By leveraging these utilities, developers can harness the power of delimited continuations without the need for deep understanding of the underlying complexity, leading to more robust and efficient asynchronous code.

## Features

Delimited Continuations Utilities offers a comprehensive suite of features designed to enhance the management and implementation of asynchronous operations in JavaScript. Below, we detail these features from a technical standpoint, illustrating their functionality and benefits in real-world applications.

### Async Generator Management

#### How It Works

The module provides functionality to wrap async generator functions, ensuring the correct `this` context is preserved when these functions are used as methods within objects. This is particularly useful for object-oriented programming, where maintaining context is crucial for accessing instance properties and methods.

#### Technical Advantages

- **Context Preservation**: Automatically binds the `this` context, eliminating common errors related to context loss in asynchronous callbacks.
- **Enhanced Method Chaining**: Facilitates a fluent interface by allowing async generator methods to be chained with other object methods seamlessly.

### Enhanced Error Handling and Retries

#### How It Works

The module identifies transient errors (e.g., temporary network failures) and implements a retry mechanism. Developers can customize the criteria for what constitutes a transient error, the maximum number of retry attempts, and the delay between retries.

#### Technical Advantages

- **Robustness**: Increases the robustness of applications by automatically handling and recovering from transient errors.
- **Customizable Retry Logic**: Offers flexible configuration of retry strategies, including fixed delays, exponential backoff, and custom delay functions, allowing developers to tailor error handling to specific use cases.

### Cancellation Tokens

#### How It Works

Cancellation tokens provide a way to abort asynchronous operations. These tokens can be passed to async functions or generators, which periodically check the token to see if a cancellation request has been made, allowing the operation to be terminated gracefully.

#### Technical Advantages

- **Resource Management**: Prevents resource leaks by ensuring that asynchronous operations can be cancelled and cleaned up properly.
- **User Experience**: Improves responsiveness and user experience in applications by allowing long-running operations to be cancelled, freeing up the UI for other interactions.

### Observability and Metrics

#### How It Works

The module includes hooks and callbacks that can be used to observe the execution of async operations, providing insights into their behavior. Metrics such as execution time, number of yields, and error rates can be collected and analyzed to optimize performance.

#### Technical Advantages

- **Insightful Metrics**: Enables detailed monitoring and logging of asynchronous operation performance, aiding in troubleshooting and optimization efforts.
- **Operational Visibility**: Increases visibility into the asynchronous flow of the application, allowing developers to identify bottlenecks and inefficiencies.

## Installation

Installing the Delimited Continuations Utilities module is straightforward, regardless of your project's complexity or environment. Below, find the method that best suits your development scenario.

### For Node.js Projects

#### Using npm

Run the following command in your project's root directory:

```bash
npm install delimited-continuations-utils --save
```

This command adds the module to your project's dependencies, ensuring it's installed and ready for use.

#### Using yarn

If you prefer yarn over npm, run:

```bash
yarn add delimited-continuations-utils
```

This achieves the same outcome as the npm command but uses yarn's package management capabilities.

### For Browser-Based Projects

For projects that run in the browser and use a module bundler (like Webpack, Rollup, or Parcel), the installation process is the same as for Node.js projects. The bundler takes care of making the module available in your browser environment.

#### Webpack/Rollup/Parcel

After installing the module via npm or yarn, import the utilities you need directly into your JavaScript files:

```javascript
import { asyncGenerator, runGenerator } from 'delimited-continuations-utils';
```

Your bundler will include the module in your final bundle according to its configuration.

### For Projects Without a Module Bundler

If you're working on a simpler project or a quick prototype without a module bundler, you can include the module directly from a CDN like unpkg. Add the following script tag to your HTML:

```html
<script src="https://unpkg.com/delimited-continuations-utils"></script>
```

This will make the module available globally. You can access the utilities via the global variable `DelimitedContinuationsUtils`.

#### Example Usage

```html
<script>
  const { runGenerator } = DelimitedContinuationsUtils;
  // Your code here
</script>
```

### TypeScript Support

The module includes TypeScript definitions to enhance development experience with type checking and auto-completion in supported editors. No additional setup is required for TypeScript projects; just install the module, and you're good to go.

### Verifying the Installation

To ensure the module is properly installed and can be used in your project, you can create a simple test file that imports a utility and logs a message:

```javascript
import { wait } from 'delimited-continuations-utils';

async function test() {
  console.log('Waiting for 1 second...');
  await wait(1000);
  console.log('Done!');
}

test();
```

Run this file with your JavaScript runtime (Node.js or a browser with your bundler's development server). If you see the expected output without errors, the module is correctly installed and ready for use in your project.

## Usage Examples

Below are several usage examples demonstrating how to leverage the Delimited Continuations Utilities module in your projects. These examples cover basic usage, error handling, retries, and cancellations, providing you with practical insights into integrating these utilities into real-world applications.

### Basic Async Generator Wrapping and Execution

This example demonstrates how to wrap and execute an async generator function, maintaining the correct `this` context and enabling seamless method chaining.

```javascript
import { asyncGenerator, runGenerator } from 'delimited-continuations-utils';

// Define an async generator function
async function* asyncNumbers() {
  yield 1;
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate async operation
  yield 2;
}

// Wrap the async generator function
const wrappedGenerator = asyncGenerator(asyncNumbers);

// Execute the generator to completion
runGenerator(wrappedGenerator()).then(result => console.log('Completed with result:', result));
```

### Handling Transient Errors with Retries

This example showcases how to handle transient errors automatically, with customizable retry logic for robust error recovery.

```javascript
import { isTransientError, runGenerator } from 'delimited-continuations-utils';

async function* fetchData() {
  // Simulate fetch operation that may fail with transient errors
}

const options = {
  retryOptions: {
    retries: 3,
    delayStrategy: 'exponentialBackoff',
    retryCondition: (error) => isTransientError(error, undefined, undefined, {
      statusCodes: [429, 503] // Custom transient conditions for HTTP status codes
    })
  }
};

runGenerator(fetchData(), options);
```

### Using Cancellation Tokens for Operation Abortion

In this example, a `CancellationToken` is used to gracefully abort a long-running asynchronous operation, demonstrating the module's capability for effective resource management and user experience enhancement.

```javascript
import { CancellationToken, runGenerator } from 'delimited-continuations-utils';

const cancellationToken = new CancellationToken();
setTimeout(() => cancellationToken.cancel(), 5000); // Cancel after 5 seconds

async function* longRunningOperation() {
  // Long-running operation logic
}

runGenerator(longRunningOperation(), {}, cancellationToken).then(() => {
  console.log('Operation completed or cancelled.');
});
```

### Advanced Retry Strategy Configuration

This example illustrates a more advanced setup for retry strategies, using exponential backoff with a custom base delay and growth factor.

```javascript
import { runGenerator } from 'delimited-continuations-utils';

async function* complexOperation() {
  // Operation that might fail and require retries
}

const options = {
  retryOptions: {
    retries: 5,
    delayStrategy: (attempt, options) => options.baseDelay * options.growthFactor ** attempt,
    baseDelay: 100, // 100 milliseconds
    growthFactor: 2,
    retryCondition: (error) => error.statusCode === 503
  }
};

runGenerator(complexOperation(), options).then(result => {
  console.log('Operation result:', result);
});
```

### Observing Generator Execution

Monitor your async generator's execution, collecting metrics such as execution time and throughput, to optimize performance and troubleshoot issues.

```javascript
import { asyncGenerator, runGenerator } from 'delimited-continuations-utils';

async function* dataProcessingTask() {
  // Data processing logic with multiple yield points
}

const wrappedTask = asyncGenerator(dataProcessingTask, {
  onStart: () => console.log('Task started.'),
  onYield: (value) => console.log('Yielded value:', value),
  onCompletion: (result, metrics) => console.log('Task completed.', result, metrics),
  onError: (error) => console.error('Error during task execution:', error)
});

runGenerator(wrappedTask());
```

## Contributing

We warmly welcome contributions to the Delimited Continuations Utilities module. Whether you're fixing a bug, adding new features, or improving the documentation, your help is valuable to us. Please refer to our contribution guidelines for more information on getting started.

## Support

Encountering issues or have questions? Please file an issue on our GitHub repository. Our community and maintainers are here to help with answers, guidance, and fixes.

## Future Enhancements

- **Enhanced Type Definitions**: While the module currently offers basic TypeScript definitions, we plan to expand these to cover every utility and option in detail, providing developers with improved type safety, better development-time checks, and autocompletion in IDEs that support TypeScript.
- **Efficiency Improvements**: We are continuously seeking ways to optimize the performance of the module, reducing its runtime overhead, and ensuring that it scales gracefully in applications with high concurrency and throughput requirements.
- **Customizable Retry Strategies**: Beyond fixed delays and exponential backoff, we intend to introduce more flexible and dynamic retry strategies, including support for rate-limiting responses, adaptive retry based on network conditions, and integration with third-party retry libraries for more complex scenarios.
- **Fine-Grained Cancellation Control**: Future versions will offer more nuanced control over cancellation, allowing developers to specify cancellation behaviors at different stages of an async operation or generator execution. This includes partial rollback, state saving for resumption, and conditional cancellation based on custom logic.
- **Richer Metrics and Logging**: Enhancements in observability will include more detailed metrics on async operation performance, including time spent in waiting states, detailed error logging with stack traces for retries, and integration with external monitoring tools.
- **Community Feedback Loop**: We actively encourage the community to propose new features, improvements, and use cases. Your feedback is invaluable in shaping the module's direction, ensuring it meets the real-world needs of JavaScript developers.
- **Guides and Best Practices**: To help developers get the most out of the module, we plan to release a series of guides, tutorials, and best practice recommendations, covering everything from basic usage to advanced patterns for managing asynchronous code.

-------

## To add/update in this file

The expanded module offers a wider range of control flow mechanisms, inspired by the features of delimited continuations, several enhancements and new functionalities could be introduced. The goal would be to create a more versatile and powerful toolset that allows for advanced control over asynchronous execution flows, error handling, state management, and more.

### 1. Enhanced Checkpointing and State Restoration

Implement functions to explicitly save and restore the state of asynchronous operations. This could involve capturing the current state of a generator and allowing it to be resumed from that exact state at a later time.

```javascript
export function saveState(generator) {
  // Implementation to capture the current state of the generator
}

export function restoreState(savedState) {
  // Implementation to resume a generator from a saved state
}
```

### 2. Dynamic Rewind and Replay Mechanism

Add functionality to rewind and replay parts of an asynchronous operation based on certain conditions. This could be useful for error recovery, testing, and simulations.

```javascript
export function rewind(generator, steps) {
  // Implementation to rewind the execution by a certain number of steps
}

export function replay(generator, condition) {
  // Implementation to replay the execution as long as the condition is met
}
```

### 3. Advanced Asynchronous Control Structures

Introduce utilities for creating custom asynchronous control structures, such as specialized loops, conditional executions, and event-driven flows.

```javascript
export function asyncLoop(condition, body) {
  // Custom loop that works with asynchronous conditions and bodies
}

export function whenEvent(emitter, eventName, handler) {
  // Executes the handler asynchronously in response to an event
}
```

### 4. Effect Management and Interception

Enhance the utility with mechanisms for managing and intercepting effects such as logging, error handling, and state changes. This could involve middleware-like constructs that wrap asynchronous operations.

```javascript
export function applyMiddleware(generator, ...middlewares) {
  // Wraps the generator with middleware for effect management
}
```

### 5. Improved State Management and Time-Travel Debugging

Provide utilities for more sophisticated state management, including undo/redo capabilities and time-travel debugging for asynchronous operations.

```javascript
export class TimeTravelDebugger {
  constructor() {
    this.history = [];
    this.currentIndex = -1;
  }

  // Methods to record state, undo, redo, and jump to specific states
}
```

### 6. Computation Interleaving and Parallel Execution

Offer functions that enable the interleaving of asynchronous computations and support for parallel execution patterns, enhancing concurrency control.

```javascript
export function parallel(...generators) {
  // Runs multiple generators in parallel, managing their states collectively
}

export function interleave(generators, strategy) {
  // Interleaves the execution of multiple generators according to a given strategy
}
```

### Incorporating TypeScript for Type Safety and IntelliSense

Consider using TypeScript to define the types and interfaces for the utility functions and classes. This will provide compile-time type checking, better documentation through type annotations, and enhanced editor support for IntelliSense, making the utility easier to use and integrate into projects.

```typescript
// TypeScript interface examples for the proposed functions and classes
interface GeneratorState { /* ... */ }
interface Middleware { /* ... */ }
class TimeTravelDebugger { /* ... */ }
```

Blending the proposed enhancements into the existing utility module to expand its capabilities involves integrating new functions and classes while maintaining backward compatibility and the module's original purpose. This integration aims to make the module a more versatile tool for managing asynchronous operations in JavaScript, drawing inspiration from delimited continuations. Here's how the enhancements can be smoothly incorporated:

### Refine Existing Structures

- **Enhance Existing Functions:** Review functions like `asyncGenerator`, `runGenerator`, and `CancellationToken` to identify opportunities for integration with new features, such as state management and effect interception.
- **Update Documentation:** Ensure that the enhanced functionalities and new additions are well-documented, explaining their purposes, use cases, and examples.

### Integrate New Functionalities

1. **Checkpointing and State Restoration:**
   - Implement `saveState` and `restoreState` as part of the `runGenerator` execution context. These functions can utilize generator's internals to capture and restore states.

2. **Dynamic Rewind and Replay:**
   - Extend the `asyncGenerator` wrapper to include optional rewind and replay capabilities. This might involve tracking the yield points and allowing re-execution from those points.

3. **Custom Asynchronous Control Structures:**
   - Offer these structures as standalone functions that can be imported and used where needed. Ensure they are designed to work seamlessly with async generators and promises.

4. **Effect Management and Interception:**
   - Introduce `applyMiddleware` as a higher-order function that wraps around the generator function. Middleware functions can intercept yielded values for logging, error handling, or other side effects.

5. **Sophisticated State Management and Time-Travel Debugging:**
   - The `TimeTravelDebugger` class should be designed to wrap around or be integrated with the `runGenerator` function, allowing it to track and manipulate the state of asynchronous operations.

6. **Computation Interleaving and Parallel Execution:**
   - Implement `parallel` and `interleave` functions to manage and control the execution of multiple async generators. Ensure these functions handle synchronization, error propagation, and cancellation effectively.

### Ensure Compatibility and Usability

- **Backward Compatibility:** Make sure new features do not break existing functionalities. Introduce changes in a way that existing codebases using the utility module can opt into new features without mandatory modifications.
- **TypeScript Integration (Optional):** If transitioning to TypeScript, provide type definitions for existing and new functionalities. This helps with auto-completion, error checking, and documentation.
- **Examples and Testing:** Update examples to demonstrate how to use the new features in combination with the existing ones. Include comprehensive tests for both new functionalities and their interactions with the existing code.
