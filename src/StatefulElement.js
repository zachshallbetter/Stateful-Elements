export class EventManager {
    #listeners = new Map();
    #stateListeners = new Map();

    constructor() { }

    addEventListener(eventType, callback) {
        if (!this.#listeners.has(eventType)) {
            this.#listeners.set(eventType, []);
        }
        this.#listeners.get(eventType).push(callback);
    }

    dispatchEvent(eventType, detail) {
        if (this.#listeners.has(eventType)) {
            this.#listeners.get(eventType).forEach(callback => callback(detail));
        }
    }

    manageStateListeners(groupName, callback, action = 'add') {
        let listeners = this.#stateListeners.get(groupName) || [];
        if (action === 'add') {
            if (typeof callback === 'function') {
                listeners = [...listeners, callback];
                this.#stateListeners.set(groupName, listeners);
            } else {
                console.error(`Callback is not a function.`);
            }
        } else if (action === 'remove') {
            listeners = listeners.filter(listener => listener !== callback);
            this.#stateListeners.set(groupName, listeners);
        }
    }

    notifyStateChange(groupName, state) {
        const listeners = this.#stateListeners.get(groupName) || [];
        listeners.forEach(callback => callback(state));
    }
}

export class ElementManager {
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
            if (!this.#statefulElements.has(key)) {
                // Create a new object for each key to ensure unique state
                this.#statefulElements.set(key, { value });
            } else {
                // Directly update the value if the element already exists
                const element = this.#statefulElements.get(key);
                element.value = value;
            }
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

export class StatefulElement extends HTMLElement {
    #state = {};
    #eventManager = new EventManager();
    #elementManager;

    constructor() {
        super();
        this.#initialize();
    }

    #initialize = () => {
        this.#elementManager = new ElementManager(this.#eventManager);
        this.#setupEventListeners();
    }

    #setupEventListeners = () => {
        this.#eventManager.addEventListener('click', event => this.#handleActionClicks(event));
    }

    #handleActionClicks = (event) => {
        let { target } = event;
        while (target && target !== this) {
            if (target.matches('[data-action]')) {
                this.#triggerActionEvent(target.dataset.action, { target });
                break;
            }
            target = target.parentNode;
        }
    }

    #triggerActionEvent = (action, detail) => {
        this.#eventManager.dispatchEvent(action, detail);
    }

    #notifyStateChange = (eventName = 'statechange', detail = {}) => {
        this.#eventManager.dispatchEvent(eventName, { detail: { ...detail, state: this.#state }, bubbles: true, composed: true });
    }

    setState = (newState) => {
        Object.assign(this.#state, newState);
        this.#notifyStateChange();
        this.#elementManager.updateUI(this.#state);
    }

    getState = () => ({ ...this.#state });

    mergeState = (partialState) => {
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

    groupState = (groupName, stateIds = []) => {
        if (!Array.isArray(stateIds) || !stateIds.length) {
            console.error('stateIds must be a non-empty array.');
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

        let existingGroupData = this.#state[groupName];
        // Ensure existingGroupData is an object before attempting to merge
        if (typeof existingGroupData !== 'object' || existingGroupData === null) {
            console.warn(`Existing group data for '${groupName}' is not an object. Initializing as an empty object.`);
            existingGroupData = {};
        }
        const mergedGroupState = { ...existingGroupData, ...newGroupedState };

        this.#state[groupName] = mergedGroupState;

        // Notify about the entire mergedGroupState changes instead of just newGroupedState
        const updatedKeys = Object.keys(mergedGroupState);
        const updatedValues = updatedKeys.reduce((acc, key) => {
            acc[key] = mergedGroupState[key];
            return acc;
        }, {});

        this.#notifyStateChange('stateUpdated', { updatedKeys, updatedValues });
    }

    updateGroupState = (groupName, partialState) => {
        const groupState = this.#state[groupName];
        if (!(groupName in this.#state) || typeof groupState !== 'object' || Array.isArray(groupState)) {
            console.warn(`Group name '${groupName}' does not exist, is not an object, or is an array.`);
            return;
        }

        // Merge the partialState into the existing group state
        this.#state[groupName] = { ...groupState, ...partialState };

        const updatedKeys = Object.keys(partialState);
        const updatedValues = updatedKeys.reduce((acc, key) => {
            acc[key] = partialState[key];
            return acc;
        }, {});
        this.#notifyStateChange('groupStateUpdated', { groupName, groupedState: this.#state[groupName], updatedKeys, updatedValues });
    }
    manageListeners = (groupName, callback, action = 'add') => {
        if (action === 'add') {
            this.#eventManager.addEventListener(groupName, callback);
        } else if (action === 'remove') {
            this.#eventManager.removeEventListener(groupName, callback);
        }
    }

    watchState = (callback) => {
        this.#eventManager.addEventListener('statechange', callback);
    }

    addState = (stateName, value = true) => {
        this.#state = { ...this.#state, [stateName]: value };
        this.#notifyStateChange('stateAdded', { stateName, value });
    }

    removeState = (stateName) => {
        if (!(stateName in this.#state)) return;

        const newState = { ...this.#state };
        delete newState[stateName];
        this.#state = newState;
        this.#notifyStateChange('stateRemoved', { stateName });
    }

    hasState = (stateName) => stateName in this.#state;

    resetState = () => {
        this.#state = {};
        this.#notifyStateChange('stateReset');
    }
}
