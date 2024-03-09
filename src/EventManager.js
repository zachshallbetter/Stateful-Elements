// EventManager.js
import { asyncGenerator, runContinuation } from './utils/DelimitedContinuationsUtils.js';

export default class EventManager {
    #listeners = new Map();
    #stateListeners = new Map();

    addEventListener = asyncGenerator(function* (eventType, callback) {
        if (!this.#listeners.has(eventType)) {
            this.#listeners.set(eventType, []);
        }
        this.#listeners.get(eventType).push(callback);
    }.bind(this));

    removeEventListener = asyncGenerator(function* (eventType, callback) {
        const listeners = this.#listeners.get(eventType);
        if (listeners) {
            const updatedListeners = listeners.filter(listener => listener !== callback);
            this.#listeners.set(eventType, updatedListeners);
        }
    }.bind(this));

    dispatchEvent = asyncGenerator(function* (eventType, detail) {
        const callbacks = this.#listeners.get(eventType);
        callbacks?.forEach(callback => callback(detail));
    }.bind(this));

    manageStateListeners = asyncGenerator(function* (groupName, callback, action = 'add') {
        const listeners = this.#stateListeners.get(groupName) || [];
        const updatedListeners = action === 'add'
            ? [...listeners, callback]
            : listeners.filter(listener => listener !== callback);
        this.#stateListeners.set(groupName, updatedListeners);
    }.bind(this));

    notifyStateChange = asyncGenerator(function* (groupName, state) {
        const listeners = this.#stateListeners.get(groupName) || [];
        listeners.forEach(callback => callback(state));
    }.bind(this));

    clearStateListeners = asyncGenerator(function* (groupName) {
        this.#stateListeners.delete(groupName);
    }.bind(this));

    clearAllStateListeners = asyncGenerator(function* () {
        this.#stateListeners.clear();
    }.bind(this));
}