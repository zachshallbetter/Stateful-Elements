# Stateful DOM Elements Library

The Stateful DOM Elements Library is an advanced JavaScript library designed to significantly enhance the Document Object Model (DOM) by seamlessly integrating state management capabilities directly into DOM elements. By doing so, it offers developers an exceptionally convenient and efficient method for managing the state of DOM elements, thereby substantially improving code organization, readability, and maintainability. This library stands as a pivotal tool for developers seeking to streamline their web development processes and ensure a more structured and intuitive handling of dynamic content and user interactions.

## Installation

You can install the Stateful DOM Elements Library via npm:

```bash
npm install stateful-dom-elements
```

Alternatively, you can include the library directly in your HTML file using a script tag:

```html
<script src="stateful-dom-elements.js"></script>
```

## Usage

### `setState`

The `setState` method is used to update the custom states associated with a DOM element.

#### Syntax

```jsx
elementInternals.setState(stateName, value);
```

- `stateName`: A string representing the name of the custom state to be updated.
- `value`: The new value of the custom state.

#### Parameters

- `stateName`: (Required) A string representing the name of the custom state to be updated.
- `value`: (Required) The new value of the custom state.

#### Return Value

- None.

#### Examples

```jsx
// Update the custom state 'active' to true
elementInternals.setState('active', true);
```

```jsx
// Update the custom state 'error' to false
elementInternals.setState('error', false);
```

```jsx
// Update multiple custom states at once
elementInternals.setState({
  'loading': true,
  'visible': false
});
```

### `getState`

The `getState` method is used to retrieve the current value of a custom state associated with a DOM element.

#### Syntax

```jsx
elementInternals.getState(stateName);
```

- `stateName`: A string representing the name of the custom state to retrieve.

#### Parameters

- `stateName`: (Required) A string representing the name of the custom state to retrieve.

#### Return Value

- Returns the current value of the specified custom state.

#### Examples

```jsx
// Retrieve the current value of the custom state 'active'
const isActive = elementInternals.getState('active');
console.log(isActive); // Output: true
```

```jsx
// Retrieve the current value of the custom state 'error'
const isError = elementInternals.getState('error');
console.log(isError); // Output: false
```

### `watchState`

The `watchState` method (or event listener) allows developers to monitor changes to a specific custom state associated with a DOM element.

#### Syntax

```jsx
element.watchState(stateName, callback);
```

- `stateName`: A string representing the name of the custom state to monitor.
- `callback`: A function to be executed when the specified custom state changes.

#### Parameters

- `stateName`: (Required) A string representing the name of the custom state to monitor.
- `callback`: (Required) A function to be executed when the specified custom state changes. This function receives an event object as its argument, which contains information about the state change.

#### Examples

```jsx
// Watch for changes to the custom state 'active'
element.watchState('active', (event) => {
    console.log('Active state changed:', event.detail.state);
});
```

## Polyfills for Unsupported Browsers
To ensure compatibility with browsers that do not support certain features, the Stateful DOM Elements Library includes polyfills for essential state management functionality:

- `addState:` Adds a custom state to the set of states associated with a DOM element.
- `hasState:` Checks if a custom state exists in the set of states associated with a DOM element.
- `deleteState:` Removes a custom state from the set of states associated with a DOM element.

These polyfills ensure that essential state management functionality is available across a wide range of browsers, providing a consistent experience for users regardless of their browser choice.

### `addState`

The `addState` polyfill is used to add a custom state to the set of states associated with a DOM element.

#### Syntax

```jsx
elementInternals.addState(stateName);
```

- `stateName`: A string representing the name of the custom state to be added.

#### Parameters

- `stateName`: (Required) A string representing the name of the custom state to be added.

#### Return Value

- None.

#### Examples

```jsx
// Add the custom state 'active'
elementInternals.addState('active');
```

### `hasState`

The `hasState` polyfill is used to check if a custom state exists in the set of states associated with a DOM element.

#### Syntax

```jsx
elementInternals.hasState(stateName);
```

- `stateName`: A string representing the name of the custom state to check.

#### Parameters

- `stateName`: (Required) A string representing the name of the custom state to check.

#### Return Value

- Returns a boolean indicating whether the specified custom state exists.

#### Examples

```jsx
// Check if the custom state 'active' exists
const isActive = elementInternals.hasState('active');
console.log(isActive); // Output: true
```

### `deleteState`

The `deleteState` polyfill is used to remove a custom state from the set of states associated with a DOM element.

#### Syntax

```jsx
elementInternals.deleteState(stateName);
```

- `stateName`: A string representing the name of the custom state to be removed.

#### Parameters

- `stateName`: (Required) A string representing the name of the custom state to be removed.

#### Return Value

- None.

#### Examples

```jsx
// Remove the custom state 'active'
elementInternals.deleteState('active');
```

These polyfills ensure that essential state management functionality is available across a wide range of browsers, providing a consistent experience for users regardless of their browser choice.


## Documentation

For detailed documentation and examples, refer to the [API Reference](#) and [Usage Guide](#) provided in the repository.

## Contributing

Contributions to the Stateful DOM Elements Library are welcome! Please refer to the [contribution guidelines](CONTRIBUTING.md) for more information.

## License

This library is licensed under the [MIT License](LICENSE). Feel free to use, modify, and distribute it as per the terms of the license.
