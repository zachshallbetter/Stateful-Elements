// EventManager.js

export default class EventManager {
    #listeners = new Map();
    #stateListeners = new Map();

    addEventListener(eventType, callback) {
        if (!this.#listeners.has(eventType)) {
            this.#listeners.set(eventType, []);
        }
        this.#listeners.get(eventType).push(callback);
    }

    removeEventListener(eventType, callback) {
        const listeners = this.#listeners.get(eventType);
        if (listeners) {
            const updatedListeners = listeners.filter(listener => listener !== callback);
            this.#listeners.set(eventType, updatedListeners);
        }
    }

    dispatchEvent(eventType, detail) {
        const callbacks = this.#listeners.get(eventType);
        callbacks?.forEach(callback => callback(detail));
    }

    manageStateListeners(groupName, callback, action = 'add') {
        const listeners = this.#stateListeners.get(groupName) || [];
        const updatedListeners = action === 'add'
            ? [...listeners, callback]
            : listeners.filter(listener => listener !== callback);
        this.#stateListeners.set(groupName, updatedListeners);
    }

    notifyStateChange(groupName, state) {
        const listeners = this.#stateListeners.get(groupName) || [];
        listeners.forEach(callback => callback(state));
    }

    clearStateListeners(groupName) {
        this.#stateListeners.delete(groupName);
    }

    clearAllStateListeners() {
        this.#stateListeners.clear();
    }
}