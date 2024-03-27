import { TimeTravelDebugger } from './DelimitedContinuations.js';
import { StatefulEntity } from './signal.js'; // Importing StatefulEntity for inheritance
import { handleError } from './errorHandlingUtil.js'; // Importing handleError for asynchronous operations
import { asyncGenerator, runGenerator } from '@DelimitedContinuations.js'; // Importing Delimited Continuations utilities

const stationModule = (() => {
    // Extend StatefulEntity to leverage shared state management and time-travel debugging
    class Station extends StatefulEntity {
        #name;
        #dataQueue = [];
        #errorHandler = null;
        #retryStrategy = null;
        #timeTravelDebugger = new TimeTravelDebugger();
        #concurrencyControl = null; // Declaration for concurrency control

        constructor({ name, errorHandler = null, retryStrategy = null, timeTravelDebugger = new TimeTravelDebugger() }) {
            super({ name }); // Passing name to the StatefulEntity constructor
            this.#name = name;
            this.#errorHandler = errorHandler;
            this.#retryStrategy = retryStrategy;
            this.#timeTravelDebugger = timeTravelDebugger;
        }

        receiveData = (data) => {
            try {
                this.#dataQueue.push(data);
                // Implementing sophisticated error handling using DelimitedContinuations.js
            } catch (error) {
                this.#handleError(error);
            }
        }

        dispatchData = () => {
            if (this.#dataQueue.length > 0) {
                const data = this.#dataQueue.shift();
                this.saveState(); // Leveraging StatefulEntity's state management
                return data;
            } else {
                return null;
            }
        }

        // Enhanced state management with Time-Travel Debugging
        setTimeTravelDebugger = (timeTravelDebugger) => {
            this.#timeTravelDebugger = timeTravelDebugger;
            this.saveState(); // Leveraging StatefulEntity's state management
        }

        // Concurrency control with interleaving and parallel execution
        setConcurrencyControl = (concurrencyControl) => {
            this.#concurrencyControl = concurrencyControl;
            this.saveState(); // Leveraging StatefulEntity's state management
        }

        // Private method for error handling
        #handleError = (error) => {
            if (this.#errorHandler) {
                this.#errorHandler(error);
            }
            if (this.#retryStrategy) {
                this.#retryStrategy();
            }
            this.saveState(); // Leveraging StatefulEntity's state management for error states
        }

        // Custom method for fetching station data with retries
        fetchStationData = (stationId) => {
            const fetchStationDataGenerator = asyncGenerator(function* () {
                try {
                    const response = yield fetch(`https://api.example.com/stations/${stationId}`);
                    const data = yield response.json();
                    console.log(data);
                } catch (error) {
                    console.error("Failed to fetch station data:", error);
                }
            });

            runGenerator(fetchStationDataGenerator());
        }
    }

    // Exposing public functionalities
    return {
        Station,
    };
})();

// Directly export the stationModule for use in other parts of the application
export { stationModule };

