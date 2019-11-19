import queryString from 'query-string';

/**
 * Decode HTML entities from an encoded string
 * https://stackoverflow.com/a/7394787/1293256
 *
 * @param html
 *   Encoded html string.
 *
 * @return {string}
 *   String with decoded html entities.
 */
var decodeHTML = (function (html) {
  var txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
});

/**
 * Retrieve an array of indexed colours within a given image
 * in hex format.
 *
 * Reference - https://stackoverflow.com/a/5624139
 *
 * @todo: Let's add a unit test for this one.
 *
 * @param {HTMLImageElement} img
 *    The image element to extract colours from.
 *
 * @return {Array<string>}
 */
var extractIndexedColours = (function (img) {
  var indexedColours = [];
  var canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  var context = canvas.getContext('2d');
  context.drawImage(img, 0, 0, img.width, img.height);
  var pixels = context.getImageData(0, 0, img.width, img.height).data;

  function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  }

  function rgbToHex(r, g, b) {
    return componentToHex(r) + componentToHex(g) + componentToHex(b);
  } // https://stackoverflow.com/a/5624139


  var _loop = function _loop(i, n) {
    var r = pixels[i];
    var g = pixels[i + 1];
    var b = pixels[i + 2];
    var hex = rgbToHex(r, g, b);
    var index = indexedColours.findIndex(function (indexed) {
      return indexed.hex === hex;
    });

    if (index >= 0) {
      indexedColours[index].pixelCount++;
    } else {
      indexedColours.push({
        hex: hex,
        pixelCount: 1
      });
    }
  };

  for (var i = 0, n = pixels.length; i < n; i += 4) {
    _loop(i);
  } // Calculate each colour's representation in the image as a percentage.


  var individualPixels = pixels.length / 4;
  indexedColours.forEach(function (colour, index) {
    indexedColours[index].percentage = Math.round(colour.pixelCount / individualPixels * 100);
  });
  return indexedColours;
});

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit(arr, i) {
  if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) {
    return;
  }

  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance");
}

/**
 * Update the URL with new query parameters.
 *
 * @param {string} newParams
 *    An object containing key value pairs for any query params
 *    that need to be updated.
 *
 * @return {void}
 */

var updateQueryString = (function (newParams) {
  var params = queryString.parse(location.search);

  for (var _i = 0, _Object$entries = Object.entries(newParams); _i < _Object$entries.length; _i++) {
    var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
        key = _Object$entries$_i[0],
        value = _Object$entries$_i[1];

    params[key] = value;
  }

  history.pushState(null, null, '?' + queryString.stringify(params));
});

export { decodeHTML, extractIndexedColours, updateQueryString };
//# sourceMappingURL=index.js.map
