# watchState

### `watchState` Method (or Event Listener for State Changes)

The `watchState` method (or event listener) allows developers to monitor changes to a specific custom state associated with a DOM element.

### Syntax

```jsx
element.watchState(stateName, callback);

```

- `stateName`: A string representing the name of the custom state to monitor.
- `callback`: A function to be executed when the specified custom state changes.

### Parameters

- `stateName`: (Required) A string representing the name of the custom state to monitor.
- `callback`: (Required) A function to be executed when the specified custom state changes. This function receives an event object as its argument, which contains information about the state change.

### Examples

```jsx
// Watch for changes to the custom state 'active'
element.watchState('active', (event) => {
    console.log('Active state changed:', event.detail.state);
});

```

In this example, the `watchState` method is called on the `element` object to monitor changes to the custom state named 'active'. When the state changes, the provided callback function is executed, logging the updated state value to the console.

Developers can use the `watchState` method (or event listener) to react to changes in custom states and update the DOM or application state accordingly.