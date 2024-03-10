// StatefulElement.js
import EventManager from './EventManager.js';
import ElementManager from './ElementManager.js';
import { asyncGenerator, runContinuation } from './utils/DelimitedContinuationsUtils.js';

export default class StatefulElement {
    #state = {};
    #eventManager = new EventManager();
    #elementManager;

    static get observedAttributes() {
        return ['data-state'];
    }

    constructor() {
        this.#state = {};
        this.#initialize();
    }

    attributeChangedCallback = (name, oldValue, newValue) => {
        if (name === 'data-state' && oldValue !== newValue) {
            this.setState(JSON.parse(newValue));
        }
    }

    connectedCallback() {
        if (this.hasAttribute('data-state')) {
            this.setState(JSON.parse(this.getAttribute('data-state')));
        }
    }

    #initialize = asyncGenerator(function* () {
        this.#elementManager = new ElementManager(this.#eventManager);
        this.#setupEventListeners();
    }.bind(this));

    #setupEventListeners = asyncGenerator(function* () {
        yield runContinuation(this.#eventManager.addEventListener('click', this.#handleActionClicks));
    }.bind(this));

    #handleActionClicks = asyncGenerator(function* (event) {
        const { target } = event;
        if (target.matches('[data-action]')) {
            yield runContinuation(this.#triggerActionEvent(target.dataset.action, { target }));
        }
    }.bind(this));

    #triggerActionEvent = (action, detail) => {
        this.#eventManager.dispatchEvent(action, detail);
    }

    #notifyStateChange = (eventName = 'statechange', detail = {}) => {
        this.#eventManager.dispatchEvent(eventName, { detail: { ...detail, state: this.#state }, bubbles: true, composed: true });
    }

    setState = asyncGenerator(function* (newState) {
        this.#state = { ...this.#state, ...newState };
        yield runContinuation(this.#notifyStateChange());
        yield runContinuation(this.#elementManager.updateUI(this.#state));
        return this.#state; // Return the updated state
    }.bind(this));

    getState = () => ({ ...this.#state });

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

    manageListeners = asyncGenerator(function* (groupName, callback, action = 'add') {
        this.#eventManager.manageStateListeners(groupName, callback, action);
    }.bind(this));

    watchState = asyncGenerator(function* (callback) {
        this.#eventManager.addEventListener('statechange', callback);
    }.bind(this));

    addState = asyncGenerator(function* (stateName, value = true) {
        this.#state = { ...this.#state, [stateName]: value };
        yield runContinuation(this.#notifyStateChange('stateAdded', { stateName, value }));
    }.bind(this));

    removeState = asyncGenerator(function* (stateName) {
        if (!(stateName in this.#state)) return;

        const newState = { ...this.#state };
        delete newState[stateName];
        this.#state = newState;
        yield runContinuation(this.#notifyStateChange('stateRemoved', { stateName }));
    }.bind(this));

    hasState = (stateName) => stateName in this.#state;

    resetState = asyncGenerator(function* () {
        this.#state = {};
        yield runContinuation(this.#notifyStateChange('stateReset'));
    }.bind(this));
}