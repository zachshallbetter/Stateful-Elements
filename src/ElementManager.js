// ElementManager.js
import EventManager from './EventManager.js';
import { asyncGenerator, runContinuation } from './utils/DelimitedContinuationsUtils.js';

export default class ElementManager {
    // Private stateful elements map
    #statefulElements = new Map();
    // Private event manager instance
    #eventManager;

    // Constructor
    constructor(eventManager = new EventManager()) {
        this.#eventManager = eventManager;
        this.#initialize();
    }

    // Private initialize method
    #initialize = asyncGenerator(function* () {
        yield runContinuation(this.#eventManager.addEventListener('statechange', this.#handleStateChange));
    }.bind(this));

    // Private handle state change method
    #handleStateChange = asyncGenerator(function* ({ detail: { state } }) {
        yield runContinuation(this.#updateStatefulElements(state));
    }.bind(this));

    // Private update stateful elements method
    #updateStatefulElements = asyncGenerator(function* (state) {
        Object.entries(state).forEach(([key, value]) => {
            const element = this.#statefulElements.get(key) || { value };
            element.value = value;
            this.#statefulElements.set(key, element);
        });
        // console.debug('Stateful elements updated:', this.#statefulElements);
    }.bind(this));

    // Private update state method
    #updateState = asyncGenerator(function* (stateName, stateValue) {
        const detail = { stateName, stateValue };
        yield runContinuation(this.#eventManager.dispatchEvent('updateState', detail));
        // console.debug(`State updated: ${stateName} - ${stateValue}`);
    }.bind(this));

    // Private chain element interaction method
    #chainElementInteraction = asyncGenerator(function* (key) {
        if (this.#statefulElements.has(key)) {
            return key;
        } else {
            throw new Error(`No stateful element found for key: ${key}`);
        }
    }.bind(this));

    // Handle element interaction method
    handleElementInteraction = asyncGenerator(function* (event) {
        const key = event.currentTarget.dataset.key;
        try {
            const resolvedKey = yield runContinuation(this.#chainElementInteraction(key));
            yield runContinuation(this.#updateState(resolvedKey, this.#statefulElements.get(resolvedKey).value));
        } catch (error) {
            console.error(`Error handling interaction: ${error}`);
        }
    }.bind(this));

    // Get stateful element method
    getStatefulElement = asyncGenerator(function* (key) {
        return this.#statefulElements.get(key);
    }.bind(this));

    // Add stateful element method
    addStatefulElement = asyncGenerator(function* (key, element) {
        this.#statefulElements.set(key, element);
        console.debug(`Stateful element added: ${key}`);
    }.bind(this));

    // Remove stateful element method
    removeStatefulElement = asyncGenerator(function* (key) {
        if (this.#statefulElements.delete(key)) {
            console.debug(`Stateful element removed: ${key}`);
        }
    }.bind(this));

    // Update UI method
    updateUI = asyncGenerator(function* (state) {
        yield runContinuation(this.#updateStatefulElements(state));
    }.bind(this));
}
