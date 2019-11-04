import {
  SET_VARIANT
} from './types';
import GFHAPI from '../../GFHAPI';

export const setVariant = (globalId) => async dispatch => {
  // Update the url query parameters with the new variant.
  //updateQueryString({ globalId });

  // Unset the pattern url so the UI goes into a loading state while the new
  // pattern is built.
  // await dispatch({ type: SET_PATTERN_URL, payload: null });

  let variant = await GFHAPI.getVariant(globalId);

  if (!variant) {
    console.error('GFH Visualiser: Variant not found.');
    return;
  }

  // await dispatch(getAlterableColours(variant, reset));

  dispatch({ type: SET_VARIANT, payload: variant });
};