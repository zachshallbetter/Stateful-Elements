// ElementManager.js
import EventManager from './EventManager.js';

export default class ElementManager {
    #statefulElements = new Map();
    #eventManager;

    constructor(eventManager = new EventManager()) {
        this.#eventManager = eventManager;
        this.#initialize();
    }

    #initialize = () => {
        this.#eventManager.addEventListener('statechange', this.#handleStateChange);
    }

    #handleStateChange = ({ detail: { state } }) => {
        this.#updateStatefulElements(state);
    }

    #updateStatefulElements = (state) => {
        Object.entries(state).forEach(([key, value]) => {
            const element = this.#statefulElements.get(key) || { value };
            element.value = value;
            this.#statefulElements.set(key, element);
        });
        console.debug('Stateful elements updated:', this.#statefulElements);
    }

    #updateState = (stateName, stateValue) => {
        const detail = { stateName, stateValue };
        this.#eventManager.dispatchEvent('updateState', detail);
        console.debug(`Update state event triggered with name: ${stateName} and value: ${stateValue}`);
    }

    #chainElementInteraction = (key) => new Promise((resolve, reject) => {
        this.#statefulElements.has(key) ? resolve(key) : reject(`No stateful element found for key: ${key}`);
    });

    handleElementInteraction = (event) => {
        const key = event.currentTarget.dataset.key;
        this.#chainElementInteraction(key)
            .then(key => this.#updateState(key, this.#statefulElements.get(key).value))
            .catch(error => console.error(`Error handling interaction: ${error}`));
    }

    addStatefulElement = (key, element) => {
        this.#statefulElements.set(key, element);
        console.debug(`Stateful element added: ${key}`);
    }

    removeStatefulElement = (key) => {
        if (this.#statefulElements.delete(key)) {
            console.debug(`Stateful element removed: ${key}`);
        }
    }

    updateUI = (state) => {
        this.#updateStatefulElements(state);
    }
}