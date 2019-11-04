import { combineReducers } from 'redux';
import setVariantReducer from './setVariantReducer';

export default combineReducers({
  variant: setVariantReducer
});