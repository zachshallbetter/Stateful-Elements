import ElementManager from '../ElementManager.js';

describe('ElementManager', () => {
    let elementManager;

    beforeEach(() => {
        elementManager = new ElementManager();
    });

    afterEach(() => {
        elementManager = null;
    });

    // test('adding and removing stateful elements', async () => {
    //     const testCases = [
    //         { key: 'testKey1', element: { value: 'testValue1' } },
    //         { key: 'testKey2', element: { value: 'testValue2' } },
    //         { key: 'testKey3', element: { value: 'testValue3' } }
    //     ];
    //     for (const testCase of testCases) {
    //         await elementManager.addStatefulElement(testCase.key, testCase.element);
    //         console.debug(`Stateful element added: ${testCase.key}`);
    //         try {
    //             await expect(elementManager.getStatefulElement(testCase.key)).resolves.toEqual(testCase.element);
    //         } catch (error) {
    //             console.error(`Error while adding stateful element ${testCase.key}: ${error}`);
    //         }
    //         await elementManager.removeStatefulElement(testCase.key);
    //         console.debug(`Stateful element removed: ${testCase.key}`);
    //         try {
    //             await expect(elementManager.getStatefulElement(testCase.key)).resolves.toBeUndefined();
    //         } catch (error) {
    //             console.error(`Error while removing stateful element ${testCase.key}: ${error}`);
    //         }
    //     }
    // });

    // test('updating UI', async () => {
    //     const state = { testKey: 'testValue' };
    //     await elementManager.updateUI(state);
    //     console.debug(`UI updated with state: ${JSON.stringify(state)}`);
    //     try {
    //         await expect(elementManager.getStatefulElement('testKey').value).resolves.toEqual('testValue');
    //     } catch (error) {
    //         console.error(`Error while updating UI: ${error}`);
    //     }
    // });

});

