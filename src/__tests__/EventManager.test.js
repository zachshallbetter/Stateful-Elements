import EventManager from '../EventManager.js';

describe('EventManager', () => {
    let eventManager;

    beforeEach(() => {
        eventManager = new EventManager();
    });

    afterEach(() => {
        eventManager = null;
    });

    // test('adding and removing event listeners', () => {
    //     const callback = jest.fn();
    //     eventManager.addEventListener('testEvent', callback);
    //     eventManager.dispatchEvent('testEvent');
    //     console.log(`Test event dispatched with callback count: ${callback.mock.calls.length}`);
    //     eventManager.removeEventListener('testEvent', callback);
    //     eventManager.dispatchEvent('testEvent');
    //     console.log(`Test event dispatched after removing listener with callback count: ${callback.mock.calls.length}`);
    // });

    // test('managing state listeners', () => {
    //     const callback = jest.fn();
    //     eventManager.manageStateListeners('testGroup', callback);
    //     eventManager.notifyStateChange('testGroup', { testState: 'testValue' });
    //     console.log(`State change notified with callback detail: ${JSON.stringify(callback.mock.calls[0][0])}`);
    //     eventManager.clearStateListeners('testGroup');
    //     eventManager.notifyStateChange('testGroup', { testState: 'testValue' });
    //     console.log(`State change notified after clearing listeners with callback count: ${callback.mock.calls.length}`);
    // });

    // test('clearing all state listeners', () => {
    //     const callback = jest.fn();
    //     eventManager.manageStateListeners('testGroup', callback);
    //     eventManager.clearAllStateListeners();
    //     eventManager.notifyStateChange('testGroup', { testState: 'testValue' });
    //     console.log(`State change notified after clearing all listeners with callback count: ${callback.mock.calls.length}`);
    // });

    // test('dispatching events', () => {
    //     const callback = jest.fn();
    //     eventManager.addEventListener('testEvent', callback);
    //     eventManager.dispatchEvent('testEvent');
    //     console.log(`Test event dispatched with callback count: ${callback.mock.calls.length}`);
    // });
});
