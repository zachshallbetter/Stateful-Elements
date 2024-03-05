# getState

The `getState` method is used to retrieve the current value of a custom state associated with a DOM element.

### Syntax

```jsx
elementInternals.getState(stateName);

```

- `stateName`: A string representing the name of the custom state to retrieve.

### Parameters

- `stateName`: (Required) A string representing the name of the custom state to retrieve.

### Return Value

- Returns the current value of the specified custom state.

### Examples

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

In the examples above, the `getState` method is called on the `elementInternals` object to retrieve the current value of a custom state associated with a DOM element. The method accepts the name of the custom state as a parameter and returns its current value, allowing developers to access and use the state information in their application logic.