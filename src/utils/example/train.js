import { continuation, runContinuation } from './DelimitedContinuations.js';
import { StatefulEntity } from './signal.js';
import { stationModule } from './station.js';

const trainModule = (() => {
    let signals = []; // Array to hold signal instances

    class Train extends StatefulEntity {
        #color = 'red'; // Represents the type of async operation
        #position = 0; // Current position on the track
        #isPaused = false; // Indicates whether the train is currently paused
        #trackLength = 100; // Defines the length of the track to set movement boundaries

        constructor({ color = 'red', position = 0, isPaused = false, trackLength = 100 } = {}) {
            super({ color, position, isPaused, trackLength }); // Pass configuration to the base class
            this.#color = color;
            this.#position = position;
            this.#isPaused = isPaused;
            this.#trackLength = trackLength;
            this.#validateAndSetPosition(position);
            this.setPosition(position);
            this.nextStation = stationModule.Station.getNextStation();
        }

        get color() {
            return this.#color;
        }

        get position() {
            return this.#position;
        }

        setPosition(newPosition) {
            this.#validateAndSetPosition(newPosition);
            this.saveState(); // Leverage StatefulEntity's state management
        }

        get isPaused() {
            return this.#isPaused;
        }

        setIsPaused(value) {
            this.#isPaused = value;
            this.saveState(); // Leverage StatefulEntity's state management
        }

        move = (path, cancellationToken) => { // Modified to include cancellationToken
            let currentStep = 0;

            const step = continuation(() => {
                if (currentStep >= path.length || this.#isPaused || cancellationToken.cancelled) { // Check cancellation token
                    console.log('Train has reached its destination, is paused, or movement was cancelled');
                    return; // Movement completed, paused, or cancelled
                }

                const nextStep = path[currentStep++];
                checkSignal(nextStep, continuation(() => {
                    this.#position = nextStep; // Update train position
                    console.log('Train moved to', nextStep);
                    this.saveState(); // Leverage StatefulEntity's state management

                    // Schedule the next step, simulating continuation
                    runContinuation(step); // Continue movement after a delay
                }));
            });

            runContinuation(step); // Start the movement
        }

        #validateAndSetPosition(position) {
            if (Number.isInteger(position) && position >= 0 && position <= this.#trackLength) {
                this.#position = position;
            } else {
                throw new Error('Invalid position');
            }
        }
    }

    // Signal checking and waiting for clearance using continuations
    function checkSignal(step, continueMovement) {
        getSignalStateAtStep(step, (signalState) => {
            if (signalState === 'stop') {
                console.log('Train waiting at signal');
                waitForSignalToClear(step, continueMovement);
            } else {
                continueMovement(); // Continue moving if the signal is clear
            }
        });
    }

    function waitForSignalToClear(step, continueMovement) {
        console.log(`Waiting for signal at ${step} to clear...`);
        setTimeout(() => { // Simulate signal clearance with a timeout
            console.log(`Signal at ${step} cleared.`);
            continueMovement(); // Resume movement
        }, 1000); // Simulate wait time
    }

    // Exposing public functionalities
    return {
        Train,
    };
})();

// Directly export the trainModule for use in other parts of the application
export { trainModule };

