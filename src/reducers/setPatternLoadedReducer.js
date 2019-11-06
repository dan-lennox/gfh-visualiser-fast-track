import { SET_PATTERN_LOADED } from '../actions/types';

export default function(state = [], action) {
  switch (action.type) {
    case SET_PATTERN_LOADED:

      /**
       * Each time setPatternLoaded is called, it's sent a
       * 'source' parameter which is an ID referring to instance/trigger
       * of the caller. This ensures only the source trigger shows a loading
       * spinner or other indication that the pattern is loading (and not all
       * of them).
       *
       * If multiple sources are active at once, the logic below manages their
       * states in a queue (newState.instances) in a queue allowing each source
       * to check to see if it's completed.
       *
       * This is not an ideal implementation... could use some simplification.
       */

      let newState = action.payload;

      // If the reset flag is received, stop all loading instances.
      if (newState.reset) {
        newState.instances = [];
        return newState;
      }

      if (!newState?.loaded) {
        // In instance has been flagged as loading.
        if (state.instances?.length) {
          // Add a new instance containing the source id of the load operation
          // to the queue of loading instances.
          newState.instances = state.instances;
          if (!newState.instances.includes(newState.source)) {
            newState.instances.push(newState.source);
          }
        }
        else {
          // If there's nothing on the queue, then add this source id as the
          // first item.
          newState.instances = [newState.source];
        }
      }
      else if (state.instances?.length) {
        // Loading for one of the instances has finished.
        // Remove an item from the queue of loading instances.
        // There's no guarantee it will always be the right one, but most times
        // it will be and the visual delay should be minimal.
        newState.instances = state.instances;
        newState.instances.shift();
      }

      return newState;
    default:
      return state;
  }
}