// EventManager.js
import { asyncGenerator, runContinuation } from './utils/DelimitedContinuationsUtils.js';
export default class EventManager {
    // Private state variables
    #listeners = new Map();
    #stateListeners = new Map();

    // Add event listener method
    addEventListener = asyncGenerator(function* (eventType, callback) {
        if (!this.#listeners.has(eventType)) {
            this.#listeners.set(eventType, []);
        }
        this.#listeners.get(eventType).push(callback);
    }.bind(this));

    // Remove event listener method
    removeEventListener = asyncGenerator(function* (eventType, callback) {
        const listeners = this.#listeners.get(eventType);
        if (listeners) {
            const updatedListeners = listeners.filter(listener => listener !== callback);
            this.#listeners.set(eventType, updatedListeners);
        }
    }.bind(this));

    // Dispatch event method
    dispatchEvent = asyncGenerator(function* (eventType, detail) {
        const callbacks = this.#listeners.get(eventType);
        callbacks?.forEach(callback => callback(detail));
    }.bind(this));

    // Manage state listeners method
    manageStateListeners = asyncGenerator(function* (groupName, callback, action = 'add') {
        const listeners = this.#stateListeners.get(groupName) || [];
        const updatedListeners = action === 'add'
            ? [...listeners, callback]
            : listeners.filter(listener => listener !== callback);
        this.#stateListeners.set(groupName, updatedListeners);
    }.bind(this));

    // Notify state change method
    notifyStateChange = asyncGenerator(function* (groupName, state) {
        const listeners = this.#stateListeners.get(groupName) || [];
        listeners.forEach(callback => callback(state));
    }.bind(this));

    // Clear state listeners method
    clearStateListeners = asyncGenerator(function* (groupName) {
        this.#stateListeners.delete(groupName);
    }.bind(this));

    // Clear all state listeners method
    clearAllStateListeners = asyncGenerator(function* () {
        this.#stateListeners.clear();
    }.bind(this));
}