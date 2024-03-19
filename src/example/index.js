import { StatefulElement } from '../StatefulElement.js';
const element = new StatefulElement();

// Function to append events
const appendEvents = (button, action) => {
    button.addEventListener('click', () => {
        console.log('Button clicked');
        element.setState({ counter: action(element.getState().counter) });
    });
};

// Function to show state changes as a data object
const showStateChanges = (stateName, element) => {
    if (element instanceof StatefulElement) {
        element.watchState((event) => {
            if (event.detail.state[stateName] !== undefined) {
                stateDataElement.textContent = JSON.stringify(event.detail.state);
            }
        });
    } else {
        console.error('Element is not an instance of StatefulElement');
    }
};

// Grab the DOM elements
const incrementButton = document.getElementById('increment');
const resetButton = document.getElementById('reset');
const counterElement = document.getElementById('counter');
const stateDataElement = document.getElementById('state-data');
const eventOccuranceElement = document.getElementById('event-occurance');

// Initialize the state
element.setState({ counter: 0 });

// Append events
appendEvents(incrementButton, (counter) => counter + 1);
appendEvents(resetButton, () => 0);

// Show state changes
showStateChanges('counter', element);

// Show event occurance
element.manageListeners('statechange', (event) => {
    eventOccuranceElement.textContent = `Event: ${event.type}`;
});