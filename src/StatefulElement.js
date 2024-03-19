// StatefulElement.js
import EventManager from './EventManager.js';
import ElementManager from './ElementManager.js';
import { asyncGenerator, runContinuation } from './utils/DelimitedContinuationsUtils.js';

// Stateful element class should extend HTMLElement. It currently does not because of the limitations of the current environment.
export class StatefulElement {
    // Private state variable
    #state = {};
    // Private event manager instance
    #eventManager = new EventManager();
    // Private element manager instance
    #elementManager;

    // Define the observed attributes
    // This is basically the oposite of what I want to do. I want to be able to set the state from the outside and have the component update accordingly without having to use the connectedCallback or attributeChangedCallback.
    static get observedAttributes() {
        return ['data-state'];
    }

    // Constructor
    constructor() {
        this.#state = {};
        this.#initialize();
    }

    // Attribute changed callback
    attributeChangedCallback = (name, oldValue, newValue) => {
        if (name === 'data-state' && oldValue !== newValue) {
            this.setState(JSON.parse(newValue));
        }
    }

    // Connected callback
    // I'm going to move on from this approach I'd rather not have to deal with the async nature of the connectedCallback or the attributeChangedCallback. 
    connectedCallback() {
        if (this.hasAttribute('data-state')) {
            this.setState(JSON.parse(this.getAttribute('data-state')));
        }
    }

    // Private initialize method
    #initialize = asyncGenerator(function* () {
        this.#elementManager = new ElementManager(this.#eventManager);
        this.#setupEventListeners();
    }.bind(this));

    // Private setup event listeners method
    #setupEventListeners = asyncGenerator(function* () {
        yield runContinuation(this.#eventManager.addEventListener('click', this.#handleActionClicks));
    }.bind(this));

    // Private handle action clicks method
    #handleActionClicks = asyncGenerator(function* (event) {
        const { target } = event;
        if (target.matches('[data-action]')) {
            yield runContinuation(this.#triggerActionEvent(target.dataset.action, { target }));
        }
    }.bind(this));

    // Private trigger action event method
    #triggerActionEvent = (action, detail) => {
        this.#eventManager.dispatchEvent(action, detail);
    }

    // Private notify state change method
    #notifyStateChange = (eventName = 'statechange', detail = {}) => {
        this.#eventManager.dispatchEvent(eventName, { detail: { ...detail, state: this.#state }, bubbles: true, composed: true });
    }

    // Set state method
    setState = asyncGenerator(function* (newState) {
        this.#state = { ...this.#state, ...newState };
        yield runContinuation(this.#notifyStateChange());
        yield runContinuation(this.#elementManager.updateUI(this.#state));
        return this.#state; // Return the updated state
    }.bind(this));

    // Get state method
    getState = () => ({ ...this.#state });

    // Merge state method
    mergeState = asyncGenerator(function* (partialState) {
        const prevState = { ...this.#state };
        this.#state = { ...this.#state, ...partialState };

        const updatedState = Object.keys(partialState).reduce((acc, key) => {
            if (prevState[key] !== this.#state[key]) {
                acc[key] = this.#state[key];
            }
            return acc;
        }, {});

        if (Object.keys(updatedState).length > 0) {
            yield runContinuation(this.#notifyStateChange('stateUpdated', { updatedKeys: Object.keys(updatedState), updatedValues: updatedState }));
        }
    }.bind(this));

    // Group state method
    groupState = asyncGenerator(function* (groupName, stateIds = []) {
        if (!Array.isArray(stateIds) || !stateIds.length) {
            console.error('stateIds must be a non-empty array.');
            return;
        }

        const newGroupedState = stateIds.reduce((accumulator, id) => {
            accumulator[id] = this.#state[id] || undefined;
            return accumulator;
        }, {});

        const existingGroupData = this.#state[groupName] || {};
        const mergedGroupState = { ...existingGroupData, ...newGroupedState };

        this.#state[groupName] = mergedGroupState;

        const updatedKeys = Object.keys(mergedGroupState);
        const updatedValues = updatedKeys.reduce((acc, key) => {
            acc[key] = mergedGroupState[key];
            return acc;
        }, {});

        yield runContinuation(this.#notifyStateChange('stateUpdated', { updatedKeys, updatedValues }));
    }.bind(this));

    // Update group state method
    updateGroupState = asyncGenerator(function* (groupName, partialState) {
        const groupState = this.#state[groupName];
        if (!groupState || typeof groupState !== 'object' || Array.isArray(groupState)) {
            console.warn(`Group name '${groupName}' does not exist, is not an object, or is an array.`);
            return;
        }

        this.#state[groupName] = { ...groupState, ...partialState };

        const updatedKeys = Object.keys(partialState);
        const updatedValues = updatedKeys.reduce((acc, key) => {
            acc[key] = partialState[key];
            return acc;
        }, {});
        yield runContinuation(this.#notifyStateChange('groupStateUpdated', { groupName, groupedState: this.#state[groupName], updatedKeys, updatedValues }));
    }.bind(this));

    // Manage listeners method
    manageListeners = asyncGenerator(function* (groupName, callback, action = 'add') {
        this.#eventManager.manageStateListeners(groupName, callback, action);
    }.bind(this));

    // Watch state method
    watchState = asyncGenerator(function* (stateName, callback) {
        this.#eventManager.manageStateListeners(stateName, callback);
    }.bind(this));

    // Add state method
    addState = asyncGenerator(function* (stateName, value = true) {
        this.#state = { ...this.#state, [stateName]: value };
        yield runContinuation(this.#notifyStateChange('stateAdded', { stateName, value }));
    }.bind(this));
    // Remove state method
    removeState = asyncGenerator(function* (stateName) {
        if (!(stateName in this.#state)) return;

        const newState = { ...this.#state };
        delete newState[stateName];
        this.#state = newState;
        yield runContinuation(this.#notifyStateChange('stateRemoved', { stateName }));
    }.bind(this));

    // Check if state exists method
    hasState = (stateName) => stateName in this.#state;

    // Reset state method
    resetState = asyncGenerator(function* () {
        this.#state = {};
        yield runContinuation(this.#notifyStateChange('stateReset'));
    }.bind(this));
}