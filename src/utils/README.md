# Delimited Continuations Utilities

Enhance your JavaScript applications with the Delimited Continuations Utilities module, offering advanced control over asynchronous operations. Designed for developers who need robust solutions for managing async generator functions, this module simplifies error handling, supports flexible retry strategies, and facilitates graceful cancellation of ongoing operations. Dive into a world where asynchronous code is clean, efficient, and resilient.

## Features

**Async Generator Management**: Easily integrate async generator functions into your objects while maintaining the correct 'this' context, enabling powerful method chaining and observability.

**Enhanced Error Handling and Retries**: Automatically detect and handle transient errors with customizable criteria, including HTTP status codes. Implement sophisticated retry logic tailored to your application's needs, with support for exponential backoff and custom retry conditions.

**Cancellation Tokens**: Introduce cancellation tokens into your asynchronous workflows to manage operation cancellation seamlessly, supporting cleanup actions and external cancellation signals.

**Observability and Metrics**: Gain insights into the performance of your asynchronous operations through detailed observability and metrics, enabling informed optimizations and troubleshooting.

## Installation

To start using the Delimited Continuations Utilities in your project, install the package via npm:

```bash
npm install delimited-continuations-utils
```

## Usage Examples

Below are examples demonstrating how to use the module's features effectively.

### Basic Async Generator Wrapping and Execution

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

### Using Cancellation Tokens

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