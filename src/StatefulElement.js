// StatefulElement.js
import EventManager from './EventManager.js';
import ElementManager from './ElementManager.js';

export default class StatefulElement extends HTMLDivElement {
    #state = {};
    #eventManager = new EventManager();
    #elementManager;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.#initialize();
    }

    #initialize = () => {
        this.#elementManager = new ElementManager(this.#eventManager);
        this.#setupEventListeners();
    }

    #setupEventListeners = () => {
        this.addEventListener('click', this.#handleActionClicks);
    }

    #handleActionClicks = (event) => {
        const { target } = event;
        if (target.matches('[data-action]')) {
            this.#triggerActionEvent(target.dataset.action, { target });
        }
    }

    #triggerActionEvent = (action, detail) => {
        this.#eventManager.dispatchEvent(action, detail);
    }

    #notifyStateChange = (eventName = 'statechange', detail = {}) => {
        this.#eventManager.dispatchEvent(eventName, { detail: { ...detail, state: this.#state }, bubbles: true, composed: true });
    }

    setState = (newState) => {
        this.#state = { ...this.#state, ...newState };
        this.#notifyStateChange();
        this.#elementManager.updateUI(this.#state);
    }

    getState = () => ({ ...this.#state });

    mergeState = (partialState) => {
        const prevState = { ...this.#state };
        this.#state = { ...this.#state, ...partialState };

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

        this.#notifyStateChange('stateUpdated', { updatedKeys, updatedValues });
    }

    updateGroupState = (groupName, partialState) => {
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
        this.#notifyStateChange('groupStateUpdated', { groupName, groupedState: this.#state[groupName], updatedKeys, updatedValues });
    }

    manageListeners = (groupName, callback, action = 'add') => {
        this.#eventManager.manageStateListeners(groupName, callback, action);
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

customElements.define('stateful-element', StatefulElement, { extends: 'div' });