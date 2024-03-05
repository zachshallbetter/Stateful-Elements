class StatefulElement extends HTMLElement {
    #state;
    #listeners = new Map();

    constructor() {
        super();
        this.#state = {};
        this.#initializeEventListeners();
    }

    async #initializeEventListeners() {
        this.addEventListener('statechange', this.#handleStateChange.bind(this));

        this.addEventListener('click', async event => {
            const target = event.target.closest('[data-action]');
            if (target) {
                const action = target.dataset.action;
                this.dispatchEvent(new CustomEvent(action, { detail: { target }, bubbles: true, composed: true }));
            }
        });
    }

    async #handleStateChange(event) {
        console.log('State changed:', event.detail);
    }

    async #dispatchStateChange(eventName = 'statechange', detail = {}) {
        this.dispatchEvent(new CustomEvent(eventName, { detail: { ...detail, currentStates: this.#state }, bubbles: true, composed: true }));
    }

    async setState(newState) {
        Object.assign(this.#state, newState);
        await this.#dispatchStateChange();
    }

    async getState() {
        return { ...this.#state };
    }

    async mergeState(partialState) {
        await this.setState({ ...partialState });
    }

    async groupState(groupName, stateIds) {
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

        await this.setState({ [groupName]: { ...groupedState, listeners: [] } });
        await this.#dispatchStateChange('groupStateUpdated', { groupName, groupedState });
    }
    async manageListeners(groupName, callback, action) {
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
                listeners.forEach(async callback => await callback(groupState));
            }
        }
    }

    async updateGroupState(groupName, partialState) {
        if (groupName in this.#state) {
            Object.assign(this.#state[groupName], partialState);
            await this.manageListeners(groupName, null, 'notify');
            await this.#dispatchStateChange('groupStateUpdated', { groupName, groupedState: this.#state[groupName] });
        }
    }

    async watchState(callback) {
        this.addEventListener('statechange', callback);
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
