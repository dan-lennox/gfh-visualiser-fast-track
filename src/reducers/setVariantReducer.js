import { SET_VARIANT } from '../actions/types';

export default function(state = [], action) {
  switch (action.type) {
    case SET_VARIANT:
      return action.payload;
    default:
      return state;
  }
}