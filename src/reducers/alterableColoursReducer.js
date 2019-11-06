import { GET_ALTERABLE_COLOURS } from '../actions/types';

export default function(state = [], action) {
  switch (action.type) {
    case GET_ALTERABLE_COLOURS:
      return action.payload;
    default:
      return state;
  }
}