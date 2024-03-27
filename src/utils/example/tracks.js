import { trainModule } from './train.js';
import { stationModule } from './station.js';
import { parallel, runContinuation, continuation, asyncGenerator, runGenerator } from './DelimitedContinuations.js';

export const tracksModule = (() => {
  // Main execution path using Delimited Continuations Utilities
  const mainTrack = asyncGenerator(function* () {
    const loop = continuation(() => {
      console.info('Processing trains and stations...');
      parallel([processTrains, processStations]).then(() => {
        runContinuation(loop); // Continue the loop after processing
      });
    });
    runContinuation(loop); // Start the loop
  });

  // Process trains on the track using continuation for movement logic
  const processTrains = asyncGenerator(function* () {
    const trains = trainModule.trainStateHandlers.get();
    trains.forEach(train => {
      if (train.canMove()) {
        runContinuation(() => train.move(train.path));
      }
    });
  });

  // Process stations along the track
  const processStations = asyncGenerator(function* () {
    const station = new stationModule.Station({ name: 'Central Station' });
    station.receiveData({ data: 'Sample data' });
    const dispatchedData = station.dispatchData();
    if (dispatchedData) {
      console.info(`Data dispatched from ${station.name}:`, dispatchedData);
    }
  });

  // Start the main track processing using Delimited Continuations Utilities
  const start = () => {
    try {
      runGenerator(mainTrack());
    } catch (error) {
      console.error('Error starting tracks processing:', error);
    }
  };

  return { start };
})();

tracksModule.start().catch((error) => console.error('Error in tracks module:', error));
