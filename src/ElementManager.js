// ElementManager.js
import EventManager from './EventManager.js';
import { asyncGenerator, runContinuation } from './utils/DelimitedContinuationsUtils.js';

export default class ElementManager {
    #statefulElements = new Map();
    #eventManager;

    constructor(eventManager = new EventManager()) {
        this.#eventManager = eventManager;
        this.#initialize();
    }

    #initialize = asyncGenerator(function* () {
        yield runContinuation(this.#eventManager.addEventListener('statechange', this.#handleStateChange));
    }.bind(this));

    #handleStateChange = asyncGenerator(function* ({ detail: { state } }) {
        yield runContinuation(this.#updateStatefulElements(state));
    }.bind(this));

    #updateStatefulElements = asyncGenerator(function* (state) {
        Object.entries(state).forEach(([key, value]) => {
            const element = this.#statefulElements.get(key) || { value };
            element.value = value;
            this.#statefulElements.set(key, element);
        });
        console.debug('Stateful elements updated:', this.#statefulElements);
    }.bind(this));

    #updateState = asyncGenerator(function* (stateName, stateValue) {
        const detail = { stateName, stateValue };
        yield runContinuation(this.#eventManager.dispatchEvent('updateState', detail));
        console.debug(`Update state event triggered with name: ${stateName} and value: ${stateValue}`);
    }.bind(this));

    #chainElementInteraction = asyncGenerator(function* (key) {
        if (this.#statefulElements.has(key)) {
            return key;
        } else {
            throw new Error(`No stateful element found for key: ${key}`);
        }
    }.bind(this));

    handleElementInteraction = asyncGenerator(function* (event) {
        const key = event.currentTarget.dataset.key;
        try {
            const resolvedKey = yield runContinuation(this.#chainElementInteraction(key));
            yield runContinuation(this.#updateState(resolvedKey, this.#statefulElements.get(resolvedKey).value));
        } catch (error) {
            console.error(`Error handling interaction: ${error}`);
        }
    }.bind(this));

    addStatefulElement = asyncGenerator(function* (key, element) {
        this.#statefulElements.set(key, element);
        console.debug(`Stateful element added: ${key}`);
    }.bind(this));

    removeStatefulElement = asyncGenerator(function* (key) {
        if (this.#statefulElements.delete(key)) {
            console.debug(`Stateful element removed: ${key}`);
        }
    }.bind(this));

    updateUI = asyncGenerator(function* (state) {
        yield runContinuation(this.#updateStatefulElements(state));
    }.bind(this));
}
