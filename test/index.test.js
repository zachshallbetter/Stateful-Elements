import { JSDOM } from 'jsdom';
import StatefulElement from '../src/StatefulElement';

describe('StatefulElement', () => {
  let dom;
  let document;
  let window;
  let element;

  beforeAll(() => {
    // Define HTMLElement globally
    global.HTMLElement = class HTMLElement { };

    dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
    window = dom.window;
    document = window.document;
    global.window = window;
    global.document = document;
    customElements.define('test-stateful-element', StatefulElement);
  });

  beforeEach(() => {
    element = document.createElement('test-stateful-element');
    document.body.appendChild(element);
  });

  afterEach(() => {
    document.body.removeChild(element);
  });

  test('should initialize with an empty state', () => {
    expect(element.getState()).toEqual({});
  });

  test('should set and get state correctly', () => {
    element.setState({ key: 'value' });
    expect(element.getState()).toEqual({ key: 'value' });
  });

  test('should merge state correctly', () => {
    element.setState({ firstKey: 'firstValue' });
    element.mergeState({ secondKey: 'secondValue' });
    expect(element.getState()).toEqual({ firstKey: 'firstValue', secondKey: 'secondValue' });
  });

  test('should toggle state correctly', () => {
    element.addState('toggleKey');
    element.toggleState('toggleKey');
    expect(element.getState().toggleKey).toBe(false);
  });

  test('should add and remove state correctly', () => {
    element.addState('newKey', 'newValue');
    expect(element.getState()).toHaveProperty('newKey', 'newValue');
    element.removeState('newKey');
    expect(element.getState()).not.toHaveProperty('newKey');
  });

  test('should handle custom state change events', (done) => {
    element.watchState((event) => {
      expect(event.detail.currentStates).toHaveProperty('eventKey', 'eventValue');
      done();
    });
    element.addState('eventKey', 'eventValue');
  });
});
