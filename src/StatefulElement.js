class StatefulElement extends HTMLElement {
    #state;
    #listeners = new Map();

    constructor() {
        super();
        this.#state = {};
        this.#initializeEventListeners();
    }

    #initializeEventListeners() {
        this.addEventListener('statechange', this.#handleStateChange.bind(this));

        this.addEventListener('click', event => {
            const target = event.target.closest('[data-action]');
            if (target) {
                const action = target.dataset.action;
                this.dispatchEvent(new CustomEvent(action, { detail: { target }, bubbles: true, composed: true }));
            }
        });
    }

    #handleStateChange(event) {
        console.log('State changed:', event.detail);
    }

    #dispatchStateChange(eventName = 'statechange', detail = {}) {
        this.dispatchEvent(new CustomEvent(eventName, { detail: { ...detail, currentStates: this.#state }, bubbles: true, composed: true }));
    }

    setState(newState) {
        Object.assign(this.#state, newState);
        this.#dispatchStateChange();
    }

    async setStateAsync(newState) {
        return new Promise(resolve => {
            Object.assign(this.#state, newState);
            this.#dispatchStateChange();
            resolve(this.#state);
        });
    }

    getState() {
        return { ...this.#state };
    }

    mergeState(partialState) {
        this.setState({ ...partialState });
    }

    async mergeStateAsync(partialState) {
        await this.setStateAsync({ ...partialState });
    }

    groupState(groupName, stateIds) {
        if (!Array.isArray(stateIds) || stateIds.length === 0) {
            console.error('State IDs must be an array with at least one element.');
            return;
        }

        const groupedState = stateIds.reduce((acc, id) => {
            if (id in this.#state) {
                acc[id] = this.#state[id];
            } else {
                console.warn(`State ID '${id}' not found.`);
            }
            return acc;
        }, {});

        this.setState({ [groupName]: { ...groupedState, listeners: [] } });
        this.#dispatchStateChange('groupStateUpdated', { groupName, groupedState });
    }

    async groupStateAsync(groupName, stateIds) {
        if (!Array.isArray(stateIds) || stateIds.length === 0) {
            console.error('State IDs must be an array with at least one element.');
            return;
        }

        const groupedState = await stateIds.reduce(async (accPromise, id) => {
            const acc = await accPromise;
            if (id in this.#state) {
                acc[id] = this.#state[id];
            } else {
                console.warn(`State ID '${id}' not found.`);
            }
            return acc;
        }, Promise.resolve({}));

        await this.setStateAsync({ [groupName]: { ...groupedState, listeners: [] } });
        this.#dispatchStateChange('groupStateUpdated', { groupName, groupedState });
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

    updateGroupState(groupName, partialState) {
        if (groupName in this.#state) {
            Object.assign(this.#state[groupName], partialState);
            this.manageListeners(groupName, null, 'notify');
            this.#dispatchStateChange('groupStateUpdated', { groupName, groupedState: this.#state[groupName] });
        }
    }

    async updateGroupStateAsync(groupName, partialState) {
        if (groupName in this.#state) {
            await this.setStateAsync({ [groupName]: { ...this.#state[groupName], ...partialState } });
            this.manageListeners(groupName, null, 'notify');
            this.#dispatchStateChange('groupStateUpdated', { groupName, groupedState: this.#state[groupName] });
        }
    }

    watchState(callback) {
        this.addEventListener('statechange', callback);
    }

    addState(stateName, value = true) {
        this.setState({ [stateName]: value });
        this.#dispatchStateChange('stateAdded', { stateName, value });
    }

    async addStateAsync(stateName, value = true) {
        await this.setStateAsync({ [stateName]: value });
        this.#dispatchStateChange('stateAdded', { stateName, value });
    }

    removeState(stateName) {
        if (stateName in this.#state) {
            const { [stateName]: _, ...rest } = this.#state;
            this.#state = rest;
            this.#dispatchStateChange('stateRemoved', { stateName });
        }
    }

    async removeStateAsync(stateName) {
        if (stateName in this.#state) {
            const { [stateName]: _, ...rest } = this.#state;
            this.#state = rest;
            await this.#dispatchStateChange('stateRemoved', { stateName });
        }
    }

    hasState(stateName) {
        return stateName in this.#state;
    }
}

customElements.define('stateful-element', StatefulElement);

export default StatefulElement;
