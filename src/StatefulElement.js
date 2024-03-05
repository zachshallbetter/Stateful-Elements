class StatefulElement extends HTMLElement {
    #state;
    #listeners = new Map();

    constructor() {
        super();
        this.#state = {};
        this.#initializeEventListeners();
    }

    #initializeEventListeners() {
        this.addEventListener('click', event => {
            let target = event.target;
            while (target && target !== this) {
                if (target.matches('[data-action]')) {
                    const action = target.dataset.action;
                    this.dispatchEvent(new CustomEvent(action, { detail: { target }, bubbles: true, composed: true }));
                    break;
                }
                target = target.parentNode;
            }
        });
    }

    #dispatchStateChange(eventName = 'statechange', detail = {}) {
        const eventDetail = { ...detail, currentStates: this.#state };
        const eventOptions = { detail: eventDetail, bubbles: true, composed: true };
        this.dispatchEvent(new CustomEvent(eventName, eventOptions));
    }

    setState(newState) {
        this.#state = { ...this.#state, ...newState };
        this.#dispatchStateChange();
    }

    getState() {
        return { ...this.#state };
    }

    mergeState(partialState) {
        Object.assign(this.#state, partialState);
        this.#dispatchStateChange();
    }

    groupState(groupName, stateIds) {
        if (!Array.isArray(stateIds) || !stateIds.length) {
            console.error('State IDs must be an array with at least one element.');
            return;
        }

        const groupedState = stateIds.reduce((accumulator, id) => {
            if (this.#state.hasOwnProperty(id)) {
                accumulator[id] = this.#state[id];
            } else {
                console.warn(`State ID '${id}' not found.`);
            }
            return accumulator;
        }, {});

        this.#state[groupName] = { ...this.#state[groupName], ...groupedState, listeners: this.#state[groupName]?.listeners || [] };
        this.#dispatchStateChange('groupStateUpdated', { groupName, groupedState: this.#state[groupName] });
    }

    updateGroupState(groupName, partialState) {
        if (groupName in this.#state && typeof this.#state[groupName] === 'object') {
            Object.assign(this.#state[groupName], partialState);
            this.manageListeners(groupName, null, 'notify');
            this.#dispatchStateChange('groupStateUpdated', { groupName, groupedState: this.#state[groupName] });
        }
    }

    manageListeners(groupName, callback, action) {
        const listeners = this.#listeners.get(groupName) || [];
        if (action === 'add') {
            if (groupName in this.#state && typeof callback === 'function') {
                listeners.push(callback);
                this.#listeners.set(groupName, listeners);
            } else {
                console.error(`Group '${groupName}' not found or callback is not a function.`);
            }
        } else if (action === 'notify') {
            if (listeners.length) {
                const groupState = this.#state[groupName];
                listeners.forEach(callback => callback(groupState));
            }
        }
    }

    watchState(callback) {
        this.addEventListener('statechange', callback);
    }

    addState(stateName, value = true) {
        this.setState({ [stateName]: value });
        this.#dispatchStateChange('stateAdded', { stateName, value });
    }

    removeState(stateName) {
        if (stateName in this.#state) {
            const { [stateName]: _, ...rest } = this.#state;
            this.#state = rest;
            this.#dispatchStateChange('stateRemoved', { stateName });
        }
    }

    hasState(stateName) {
        return stateName in this.#state;
    }
}

customElements.define('stateful-element', StatefulElement);

export default StatefulElement;
