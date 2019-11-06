import { combineReducers } from 'redux';
import coloursReducer from './coloursReducer';
import alterableColoursReducer from './alterableColoursReducer';
import setVariantReducer from './setVariantReducer';
import setPatternUrlReducer from './setPatternUrlReducer';
import setPatternLoadedReducer from './setPatternLoadedReducer';

export default combineReducers({
  colours: coloursReducer,
  alterableColours: alterableColoursReducer,
  variant: setVariantReducer,
  patternUrl: setPatternUrlReducer,
  patternLoaded: setPatternLoadedReducer
});