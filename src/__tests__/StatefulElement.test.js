import StatefulElement from '../StatefulElement.js';
// Utility function to generate a random color for state testing

const generateRandomColor = () => {
    const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'];
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
};

describe('StatefulElement', () => {
    let statefulElement;

    beforeEach(() => {
        statefulElement = new StatefulElement();
    });

    afterEach(() => {
        statefulElement = null;
    });

    test('statefulElement initialization and method existence', async () => {
        // Check if statefulElement has been initialized
        expect(statefulElement).toBeDefined();

        // Dynamically check for the existence of methods from StatefulElement.js
        const expectedMethods = [
            'attributeChangedCallback',
            'connectedCallback',
            'setState',
            'getState',
            'mergeState',
            'groupState',
            'updateGroupState',
            'manageListeners',
            'watchState',
            'addState',
            'removeState',
            'hasState',
            'resetState'
        ];

        expectedMethods.forEach(method => {
            expect(typeof statefulElement[method]).toBe('function');
        });

        console.info(`StatefulElement has been initialized and contains all expected methods: ${expectedMethods.join(', ')}.`);
    });

    test('initial state should be empty', () => {
        const initialState = statefulElement.getState();
        console.debug('Initial state:', initialState);
        expect(initialState).toEqual({});
    });

    test('should be able to change state to a different color', () => {
        const randomColor = generateRandomColor();
        statefulElement.setState(randomColor);
        const currentState = statefulElement.getState();
        expect(currentState).toEqual(randomColor);

        const newRandomColor = generateRandomColor();
        statefulElement.setState(newRandomColor);
        const updatedState = statefulElement.getState();
        expect(updatedState).toEqual(newRandomColor);
    });

    test('should be able to respond to attribute changes', () => {
        const randomColor = generateRandomColor();
        const randomKey = Object.keys(randomColor)[0];
        const randomValue = randomColor[randomKey];
        statefulElement.attributeChangedCallback(randomKey, null, randomValue);
        const currentState = statefulElement.getState();
        expect(currentState).toEqual(randomColor);
    });

    test('should be able to react to state changes on unconnected elements', async () => {
        const randomColor = generateRandomColor();
        const randomKey = Object.keys(randomColor)[0];
        const randomValue = randomColor[randomKey];
        statefulElement.setState(randomColor);
        const currentState = statefulElement.getState();
        expect(currentState).toEqual(randomColor);
        statefulElement.attributeChangedCallback(randomKey, null, randomValue);
        const updatedState = statefulElement.getState();
        expect(updatedState).toEqual(randomColor);
    });
});
