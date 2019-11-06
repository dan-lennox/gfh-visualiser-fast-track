import { SET_PATTERN_URL } from '../actions/types';

export default function(state = [], action) {
  switch (action.type) {
    case SET_PATTERN_URL:
      return action.payload;
    default:
      return state;
  }
}