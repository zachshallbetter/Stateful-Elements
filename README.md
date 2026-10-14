# Stateful DOM Elements Library

The Stateful (DOM) Elements Library is a small, early-stage JavaScript library that keeps state on a DOM element. It defines a `StatefulElement` custom element (a customized built-in `div`) that stores a private state object, exposes methods to set, merge, group and read that state, and notifies listeners registered with `watchState` when `setState` runs. State changes do not update the DOM: nothing re-renders, and the internal `ElementManager.updateUI` only records values in an internal `Map`. The library is three source files with no build step.

## Installation

The library is not published to npm. Clone the repository and copy the files in `src/` into your project:

```bash
git clone https://github.com/zachshallbetter/Stateful-Elements.git
cp Stateful-Elements/src/*.js path/to/your/project/
```

The files are ES modules, so load the entry file with a module script tag. Importing `StatefulElement.js` registers the element as `stateful-element`:

```html
<script type="module" src="StatefulElement.js"></script>
<div is="stateful-element"></div>
```

`StatefulElement` extends `HTMLDivElement`, so it needs a browser that supports customized built-in elements (the `is` attribute). Safari does not.

## Usage

The methods below are called on a `StatefulElement` instance. The element also has `mergeState`, `groupState`, `updateGroupState`, `removeState` and `resetState`. Clicking a child with a `data-action` attribute dispatches an internal event named after the action, but there is no public method to listen for it yet.

### `setState`

The `setState` method merges new values into the element's state object and notifies `watchState` listeners.

#### Syntax

```jsx
element.setState(newState);
```

- `newState`: An object of state keys and values to merge into the current state.

#### Parameters

- `newState`: (Required) An object of state keys and values to merge into the current state.

#### Return Value

- None.

#### Examples

```jsx
const element = document.querySelector('div[is="stateful-element"]');

// Set the state 'active' to true
element.setState({ active: true });
```

```jsx
// Set the state 'error' to false
element.setState({ error: false });
```

```jsx
// Update multiple states at once
element.setState({
  'loading': true,
  'visible': false
});
```

### `getState`

The `getState` method returns a copy of the element's whole state object.

#### Syntax

```jsx
element.getState();
```

#### Parameters

- None.

#### Return Value

- Returns a shallow copy of the current state object.

#### Examples

```jsx
// Read the current value of 'active'
const isActive = element.getState().active;
console.log(isActive); // Output: true
```

```jsx
// Read the current value of 'error'
const isError = element.getState().error;
console.log(isError); // Output: false
```

### `watchState`

The `watchState` method registers a callback that runs every time `setState` is called. It does not filter by state name, and it is not called by `mergeState`, `groupState` or the other methods.

#### Syntax

```jsx
element.watchState(callback);
```

- `callback`: A function to be executed when `setState` runs.

#### Parameters

- `callback`: (Required) A function to be executed when `setState` runs. It receives an object whose `detail.state` holds the full state after the update. This is a plain callback, not a DOM event.

#### Examples

```jsx
// Log the state after each setState call
element.watchState((event) => {
    console.log('State changed:', event.detail.state);
});
```

## State Set Methods

These are methods on `StatefulElement` that work on its own state object. They are not polyfills: the library does not use `ElementInternals` or `CustomStateSet`, and the states do not match the `:state()` CSS selector.

- `addState:` Adds a key to the element's state.
- `hasState:` Checks if a key exists in the element's state.
- `removeState:` Removes a key from the element's state.

### `addState`

The `addState` method adds a key to the element's state, with a value of `true` unless another value is given.

#### Syntax

```jsx
element.addState(stateName, value);
```

- `stateName`: A string representing the name of the state to be added.
- `value`: The value to store. Defaults to `true`.

#### Parameters

- `stateName`: (Required) A string representing the name of the state to be added.
- `value`: (Optional) The value to store. Defaults to `true`.

#### Return Value

- None.

#### Examples

```jsx
// Add the state 'active'
element.addState('active');
```

### `hasState`

The `hasState` method checks if a key exists in the element's state.

#### Syntax

```jsx
element.hasState(stateName);
```

- `stateName`: A string representing the name of the state to check.

#### Parameters

- `stateName`: (Required) A string representing the name of the state to check.

#### Return Value

- Returns a boolean indicating whether the specified key exists.

#### Examples

```jsx
// Check if the state 'active' exists
const isActive = element.hasState('active');
console.log(isActive); // Output: true
```

### `removeState`

The `removeState` method removes a key from the element's state.

#### Syntax

```jsx
element.removeState(stateName);
```

- `stateName`: A string representing the name of the state to be removed.

#### Parameters

- `stateName`: (Required) A string representing the name of the state to be removed.

#### Return Value

- None.

#### Examples

```jsx
// Remove the state 'active'
element.removeState('active');
```


## Documentation

For detailed documentation and examples, see the [docs](docs/) folder in the repository. The docs describe the design ideas, including `ElementInternals`, and some of what they describe is not implemented yet.

## Contributing

Contributions to the Stateful DOM Elements Library are welcome! Please refer to the [contribution guidelines](CONTRIBUTING.md) for more information.

## License

This library is licensed under the [MIT License](LICENSE). Feel free to use, modify, and distribute it as per the terms of the license.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS ORIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THEAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHERLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THESOFTWARE.EOT