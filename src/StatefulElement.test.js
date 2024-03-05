const { StatefulElement } = require('./StatefulElement.js');

describe('StatefulElement', () => {
    let statefulElement;

    beforeEach(() => {
        statefulElement = new StatefulElement();
    });

    afterEach(() => {
        statefulElement = null;
    });

    test('initial state should be empty', () => {
        expect(statefulElement.getState()).toEqual({});
    });

    test('setting and getting state', () => {
        statefulElement.setState({ count: 1 });
        expect(statefulElement.getState()).toEqual({ count: 1 });
    });

    test('merging state', () => {
        statefulElement.setState({ count: 1 });
        statefulElement.mergeState({ count: 2, newProp: 'test' });
        expect(statefulElement.getState()).toEqual({ count: 2, newProp: 'test' });
    });

    test('adding and removing state', () => {
        statefulElement.addState('isLoading');
        expect(statefulElement.hasState('isLoading')).toBeTruthy();
        statefulElement.removeState('isLoading');
        expect(statefulElement.hasState('isLoading')).toBeFalsy();
    });
});
