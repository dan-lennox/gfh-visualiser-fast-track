import { ALTER_COLOURS } from '../actions/types';

export default function(state = [], action) {
  switch (action.type) {
    case ALTER_COLOURS:
      // Return a NEW array, otherwise redux thinks the state hasn't actually changed, even though
      // the arrays contents have.
      return [...action.payload];
    default:
      return state;
  }
}