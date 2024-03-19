# Delimited Continuations Utilities

Enhance your JavaScript applications with the Delimited Continuations Utilities module, offering advanced control over asynchronous operations. Designed for developers who need robust solutions for managing async generator functions, this module simplifies error handling, supports flexible retry strategies, and facilitates graceful cancellation of ongoing operations. Dive into a world where asynchronous code is clean, efficient, and resilient.

## Understanding Delimited Continuations

Delimited Continuations provide a mechanism to control the flow of asynchronous operations, allowing functions to pause execution and resume at a later time. This concept is particularly useful in JavaScript, where non-blocking operations are a cornerstone of the language's ability to handle concurrent tasks efficiently. Here are some key questions and answers to help you understand the use and significance of Delimited Continuations in your applications.

### What are Delimited Continuations?

Delimited Continuations are a programming construct that allows the capture of the continuation of a computation (a snapshot of its future execution state) at a given point, to be resumed later. This can be thought of as putting a bookmark in your code's execution to return to it after performing other tasks.

### Why are Delimited Continuations important in asynchronous programming?

Asynchronous programming involves operations that do not complete immediately, such as fetching data from a server or reading a file from disk. Delimited Continuations allow these operations to be paused and resumed, providing a way to manage asynchronous code more effectively. This improves code readability, error handling, and resource management, making asynchronous code easier to write, understand, and debug.

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

- **TypeScript Support**: Improve typings for better integration with TypeScript projects.
- **Performance Metrics**: Expand metrics collection for deeper insights into async operations' performance.
- **Enhanced Cancellation Support**: Broaden cancellation capabilities for more complex asynchronous patterns.

---

This README is designed to be a comprehensive guide for utilizing the Delimited Continuations Utilities module in your projects. From simple tasks to advanced asynchronous operation management, our goal is to empower developers with the tools needed for modern web development.