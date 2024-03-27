import { createStateManager, createState, TimeTravelDebugger, asyncGenerator, runGenerator, parallel } from './DelimitedContinuations.js';

export class StatefulEntity {
  #stateHistory = [];
  static #stateManager = createStateManager(createState({}));
  static #timeTravelDebugger = new TimeTravelDebugger();

  constructor(initialState = {}) {
    this.#recordInitialState(initialState);
  }

  #recordInitialState = (initialState) => {
    const state = this.serializeState(initialState);
    StatefulEntity.#stateManager.set(state); // Fixed to use the set method as per createStateManager API
    StatefulEntity.#timeTravelDebugger.record(state);
    this.#stateHistory.push(state);
  };

  serializeState = (state) => state;

  restoreState = (serializedState) => {
    Object.assign(this, serializedState);
  };

  saveState = () => {
    const currentState = this.serializeState();
    this.#stateHistory.push(currentState);
    StatefulEntity.#stateManager.set(currentState); // Fixed to use the set method as per createStateManager API
    StatefulEntity.#timeTravelDebugger.record(currentState);
  };

  rewind = (steps) => {
    const targetIndex = Math.max(this.#stateHistory.length - 1 - steps, 0);
    const targetState = this.#stateHistory[targetIndex];
    this.restoreState(targetState);
    StatefulEntity.#timeTravelDebugger.rewind(steps);
  };

  replay = (steps) => {
    const targetIndex = Math.min(steps, this.#stateHistory.length - 1);
    const targetState = this.#stateHistory[targetIndex];
    this.restoreState(targetState);
    StatefulEntity.#timeTravelDebugger.replay(steps);
  };
}

export class Signal extends StatefulEntity {
  #position;
  #isRed;

  constructor({ position, isRed = false } = {}) {
    super({ position, isRed }); // Moved validation inside the constructor to ensure parameters are correct before proceeding
    this.#validateConstructorParams(position, isRed);
    this.#position = position;
    this.#isRed = isRed;
  }

  #validateConstructorParams = (position, isRed) => {
    if (typeof position !== 'number') {
      throw new Error('Position must be a number');
    }
    if (typeof isRed !== 'boolean') {
      throw new Error('isRed must be a boolean');
    }
  };

  serializeState = () => ({
    position: this.#position,
    isRed: this.#isRed
  });

  signalTrackControllerModule = (() => {
    class SignalTrackController {
      #renderingModule;
      #eventRegistrationModule;
      #stateUpdateModule;
      #tracks = []; // Added to maintain track data
      #signals = []; // Added to maintain signal data

      constructor({ renderingModule, eventRegistrationModule, stateUpdateModule, tracks = [], signals = [] }) {
        this.#renderingModule = renderingModule;
        this.#eventRegistrationModule = eventRegistrationModule;
        this.#stateUpdateModule = stateUpdateModule;
        this.#tracks = tracks;
        this.#signals = signals;
      }

      initialize() {
        runGenerator(this.#registerEventListeners());
        runGenerator(this.#renderInitialState());
      }

      #registerEventListeners = asyncGenerator(function* () {
        yield this.#eventRegistrationModule.registerClickListeners({
          onSignalClick: this.#handleSignalClick,
          onTrackClick: this.#handleTrackClick,
        });
      });

      #renderInitialState = asyncGenerator(function* () {
        yield this.#renderingModule.render({ tracks: this.#tracks, signals: this.#signals });
      });

      #handleSignalClick = asyncGenerator(function* (signalId) {
        const signal = yield this.#signals.find(signal => signal.id === signalId);
        if (signal) {
          signal.isRed = !signal.isRed; // Toggle signal state
          yield this.#stateUpdateModule.updateState({ tracks: this.#tracks, signals: this.#signals });
          yield this.#renderingModule.render({ tracks: this.#tracks, signals: this.#signals });
          console.info(`Signal ${signalId} toggled to ${signal.isRed ? 'red' : 'green'}`);
        }
      });

      #handleTrackClick = asyncGenerator(function* (trackId) {
        console.info(`Track ${trackId} clicked`);
      });

      updateState = asyncGenerator(function* ({ tracks, signals }) {
        this.#tracks = [...tracks];
        this.#signals = [...signals];
        yield this.#stateUpdateModule.updateState({ tracks, signals });
        yield this.#renderingModule.render({ tracks, signals });
      });
    }

    const createSignalTrackController = ({ renderingModule, eventRegistrationModule, stateUpdateModule, tracks = [], signals = [] }) => {
      return new SignalTrackController({ renderingModule, eventRegistrationModule, stateUpdateModule, tracks, signals });
    };

    const initialTracks = []; // Placeholder for initial track data
    const initialSignals = []; // Placeholder for initial signal data

    const controller = createSignalTrackController({
      renderingModule: {
        render: asyncGenerator(function* ({ tracks, signals }) {
          // Rendering logic for tracks and signals
        }),
      },
      eventRegistrationModule: {
        registerClickListeners: asyncGenerator(function* ({ onSignalClick, onTrackClick }) {
          // Event registration logic
        })
      },
      stateUpdateModule: {
        updateState: asyncGenerator(function* ({ tracks, signals }) {
          // State update logic
        })
      },
      tracks: initialTracks,
      signals: initialSignals
    });

    const initializeController = () => {
      runGenerator(controller.initialize());
    };

    return {
      initializeController,
    };
  })();

  getSignalTrackControllerModule = () => {
    return this.signalTrackControllerModule;
  };
}
// Initialize the Signal instance and its controller module for setup
const signalInstance = new Signal({ position: 0, isRed: false });
signalInstance.getSignalTrackControllerModule().initializeController();

// Define a function to retrieve the signal track controller module
const getSignalTrackControllerModule = () => signalInstance.getSignalTrackControllerModule();

// Export the function for external access
export { getSignalTrackControllerModule as signalTrackControllerModule };
