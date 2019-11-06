import cloudinary from 'cloudinary-core';
import queryString from 'query-string';

import {
  ALTER_COLOURS,
  GET_ALTERABLE_COLOURS,
  SET_VARIANT,
  SET_PATTERN_URL,
  SET_PATTERN_LOADED
} from './types';
import GFHAPI from '../../GFHAPI';
import  { extractIndexedColours } from 'gfh-js-utilities';
import { updateQueryString } from 'gfh-js-utilities';

/**
 * Update a single colours.
 *
 * Thoughts: Because this doesn't have it's own dispatch call, with an
 * action type, should this be included in this file?
 *
 * @param index Integer
 *   The index position of the colour to be updated in the colours array.
 *
 * @param colour Object { name, hex }
 *   The new colour.
 */
export const alterColour = (index, colour)  => async (dispatch, getState) => {
  // Set the pattern to unloaded, so the UI can respond accordingly.
  await dispatch(setPatternLoaded(false, `colour-${index}`));

  // Replace the old colour with the newsetPatternLoaded colour.
  let colours = getState().colours;
  colours[index] = colour;

  // Propogate the new colours state.
  await dispatch(alterColours(colours));
};

export const getAlterableColours = ({ globalId, customColours, availableColours, material }, reset=false) => async dispatch => {

  // Connect to Cloudinary
  const cl = cloudinary.Cloudinary.new( { cloud_name: "gh"});

  // Helper?
  // Input globalId
  // output

  let cloudinaryPublicId = `experiments/variants/${globalId}/cad/flat-web.gif`;

  // The raw method... let's load the image to canvas.
  let srcImg = document.createElement('img');
  // The cross origin attribute MUST be set before img.src, or we get CORS issues.
  srcImg.setAttribute('crossOrigin', 'anonymous');
  srcImg.src = await cl.url(cloudinaryPublicId);

  srcImg.onload = async () => {
    // Once the image has loaded, we extract an array of its indexed hex colours.
    let indexedColours = extractIndexedColours(srcImg);

    // Filter the list of alterable colours to those specified in both the variant and
    // extracted by the extractIndexedColours operation.
    let alterableColours = customColours.filter(({ hex }) => indexedColours.indexOf(hex) >= 0);

    // Set the initial colours to the alterable (default) colours.
    let initialColours = alterableColours.slice();

    // @todo! Needs refactor as the number of alterable colours is now dynamic!
    // For now, we're testing with 7 for this one product, but as soon as others
    // are introduced this needs fixing.

    // If the user has specific colours in the URL, use those for the initial
    // colours instead.
    if (!reset) {
      let { c1, c2, c3, c4, c5, c6, c7 } = queryString.parse(window.location.search);
      if (c1 && c2 && c3 && c4 && c5 && c6 && c7) {
        // Count the number of colours in the url that are valid members of
        // the variant's colour pallete.
        let valid = [c1, c2, c3, c4, c5, c6, c7].reduce((found, hex) => {
          if (availableColours.find(available => available.hex === hex)) {
            found += 1;
          } else if (customColours.find(available => available.hex === hex)) {
            found += 1;
          }
          return found;
        }, 0);

        console.log('valid', valid);
        // Only use the url param colours if all are valid.
        if (valid === alterableColours.length) {
          initialColours = [
            {hex: c1, name: availableColours.find(c => c.hex === c1)?.name},
            {hex: c2, name: availableColours.find(c => c.hex === c2)?.name},
            {hex: c3, name: availableColours.find(c => c.hex === c3)?.name},
            {hex: c4, name: availableColours.find(c => c.hex === c4)?.name},
            {hex: c5, name: availableColours.find(c => c.hex === c5)?.name},
            {hex: c6, name: availableColours.find(c => c.hex === c6)?.name},
            {hex: c7, name: availableColours.find(c => c.hex === c7)?.name}
          ];
        }
      }
    }

    console.log(alterableColours);

    await dispatch({ type: GET_ALTERABLE_COLOURS, payload: alterableColours });

    // Set the colours to the initial colours.
    await dispatch(alterColours(initialColours));
  };
};

export const alterColours = (colours) => async (dispatch, getState) => {
  // Update the url query parameters with the newly selected colours.
  let params = {};
  for (let [ i, { hex} ] of colours.entries()) {
    params[`c${i + 1}`] = hex;
  }
  updateQueryString(params);

  console.log('colours', colours);

  await dispatch({ type: ALTER_COLOURS, payload: colours });

  // Since the colours have been updated, we should also update the pattern url with
  // the new colours.
  let { globalId, material, customColours } = getState().variant;
  await dispatch(setPatternUrl(globalId, getState().alterableColours, colours, material));
};

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

  await dispatch(getAlterableColours(variant));

  dispatch({ type: SET_VARIANT, payload: variant });
};



export const setPatternUrl = (globalId, alterableColours, replacementColours) => async dispatch => {

  console.log('replacementColours', replacementColours);

  // Connect to Cloudinary
  const cl = cloudinary.Cloudinary.new( { cloud_name: "gh"});

  let cloudinaryPublicId = `experiments/variants/${globalId}/cad/flat-web.gif`;

  let transformations = {transformation: []};

  // Why is colours only 3? Why not 7?
  if (alterableColours) {
    alterableColours.forEach((alterableColour, i) => {
      if (replacementColours[i] !== alterableColour) {
        transformations.transformation.push({effect: `replace_color:${replacementColours[i].hex.replace(/#/g, '')}:0.00000001:${alterableColour.hex.replace(/#/g, '')}`});
      }
    });
  }

  transformations.transformation.push({effect: "blur:45"});
  transformations.transformation.push({effect: "multiply", flags: ["relative", "tiled"], opacity: 100});

  transformations.transformation.push({
    // Apply Cloudinary auto quality optimisation.
    quality: 'auto',
    // Allows serving in Webp format or lossy gif when appropriate (automatically determined
    // by cloudinary).
    fetchFormat: 'auto'
  });

  let url = await cl.url(cloudinaryPublicId, transformations);

  console.log(url);

  dispatch({ type: SET_PATTERN_URL, payload: url });
};

export const setPatternLoaded = (loaded=true, source=null, reset=false) => async dispatch => {
  dispatch({ type: SET_PATTERN_LOADED, payload: { loaded, source, reset } });
};
