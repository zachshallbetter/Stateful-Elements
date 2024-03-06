// src/StatefulElement.js
export default class StatefulElement extends HTMLElement {
    #state = {};
    #eventManager;
    #listeners = new Map(); // Declaration added to fix linting errors

    constructor() {
        super();
        this.#eventManager = new EventManager();
        this.#initialize();
    }

    #initialize() {
        this.#setupEventListeners();
    }

    #setupEventListeners() {
        this.#setupEventListener('click', this.#handleActionClicks.bind(this));
    }

    #setupEventListener(eventType, handler) {
        this.addEventListener(eventType, handler);
    }

    #handleActionClicks(event) {
        let { target } = event;
        while (target && target !== this) {
            if (target.matches('[data-action]')) {
                this.#triggerActionEvent(target.dataset.action, { target });
                break;
            }
            target = target.parentNode;
        }
    }

    #triggerActionEvent(action, detail) {
        this.#eventManager.dispatchEvent(action, detail);
    }

    #notifyStateChange(eventName = 'statechange', detail = {}) {
        this.dispatchEvent(new CustomEvent(eventName, { detail: { ...detail, state: this.#state }, bubbles: true, composed: true }));
    }

    setState(newState) {
        Object.assign(this.#state, newState);
        this.#notifyStateChange();
    }

    getState() {
        return { ...this.#state };
    }

    mergeState(partialState) {
        const prevState = { ...this.#state };
        Object.entries(partialState).forEach(([key, value]) => {
            if (prevState[key] !== value) {
                this.#state[key] = value;
            }
        });

        const updatedState = Object.keys(partialState).reduce((acc, key) => {
            if (prevState[key] !== this.#state[key]) {
                acc[key] = this.#state[key];
            }
            return acc;
        }, {});

        if (Object.keys(updatedState).length > 0) {
            this.#notifyStateChange('stateUpdated', { updatedKeys: Object.keys(updatedState), updatedValues: updatedState });
        }
    }

    groupState(groupName, stateIds = []) {
        if (!stateIds.length) {
            console.error('State IDs must be a non-empty array.');
            return;
        }

        const newGroupedState = stateIds.reduce((accumulator, id) => {
            if (id in this.#state) {
                accumulator[id] = this.#state[id];
            } else {
                console.warn(`State ID '${id}' not found.`);
            }
            return accumulator;
        }, {});

        // Merge new grouped state with existing group data, excluding listeners to avoid overwriting them
        const existingGroupData = { ...this.#state[groupName] };
        delete existingGroupData.listeners; // Remove listeners from the existing group data to prevent overwriting
        const mergedGroupState = { ...existingGroupData, ...newGroupedState };

        // Preserve and append to the existing listeners array
        const existingListeners = this.#state[groupName]?.listeners || [];
        this.#state[groupName] = { ...mergedGroupState, listeners: existingListeners };

        // Calculate the updated keys and values for detailed notification
        const updatedKeys = Object.keys(newGroupedState);
        const updatedValues = updatedKeys.reduce((acc, key) => {
            acc[key] = newGroupedState[key];
            return acc;
        }, {});

        this.#notifyStateChange('groupStateUpdated', { groupName, groupedState: this.#state[groupName], updatedKeys, updatedValues });
    }

    updateGroupState(groupName, partialState) {
        if (groupName in this.#state && typeof this.#state[groupName] === 'object') {
            Object.assign(this.#state[groupName], partialState);
            this.#notifyListeners(groupName);

            // Calculate the updated keys and values for detailed notification
            const updatedKeys = Object.keys(partialState);
            const updatedValues = updatedKeys.reduce((acc, key) => {
                acc[key] = partialState[key];
                return acc;
            }, {});

            this.#notifyStateChange('groupStateUpdated', { groupName, groupedState: this.#state[groupName], updatedKeys, updatedValues });
        }
    }

    #notifyListeners(groupName) {
        const listeners = this.#listeners.get(groupName) || [];
        listeners.forEach(callback => callback(this.#state[groupName]));
    }

    manageListeners(groupName, callback, action = 'add') {
        let listeners = this.#listeners.get(groupName) || [];
        if (action === 'add') {
            if (groupName in this.#state && typeof callback === 'function') {
                listeners = [...listeners, callback];
                this.#listeners.set(groupName, listeners);
            } else {
                console.error(`Group '${groupName}' not found or callback is not a function.`);
            }
        } else if (action === 'remove') {
            listeners = listeners.filter(listener => listener !== callback);
            this.#listeners.set(groupName, listeners);
        }
    }

    watchState(callback) {
        this.#eventManager.addEventListener('statechange', callback);
    }

    addState(stateName, value = true) {
        this.#state = { ...this.#state, [stateName]: value };
        this.#notifyStateChange('stateAdded', { stateName, value });
    }

    removeState(stateName) {
        if (stateName in this.#state) {
            const newState = Object.assign({}, this.#state);
            delete newState[stateName];
            this.#state = newState;
            this.#notifyStateChange('stateRemoved', { stateName });
        }
    }

    hasState(stateName) {
        return stateName in this.#state;
    }

    resetState() {
        this.#state = {}; // Reset the state to an empty object
        this.#notifyStateChange('stateReset'); // Notify listeners of the state reset
    }
}
