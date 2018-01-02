/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _embedder = __webpack_require__(1);

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const originalImageElement = document.getElementById('original');
const embeddedImageElement = document.getElementById('embedded');

const form = document.querySelector('form');
const exampleSelect = document.getElementById('exampleSelect');
const fileButton = form.querySelector('form button');
const fileInput = form.querySelector('input[type="file"]');
const fileName = document.getElementById('filename');

const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

const exampleImages = {
  cats: {
    imagePath: 'images/cats.jpg',
    altText: 'two maine coon cats posing in front of a blue background'
  },
  bird: {
    imagePath: 'images/bird.jpg',
    altText: 'a small bird standing on a cherry blossom tree branch'
  },
  coffee: {
    imagePath: 'images/coffee.jpg',
    altText: 'a cup of coffee on a table in front of a hand writing in a notebook'
  }
};

const loadImage = (() => {
  var _ref = _asyncToGenerator(function* (url) {
    const response = yield fetch(url).catch(console.error);
    const blob = yield response.blob();
    const objectURL = URL.createObjectURL(blob);
    return objectURL;
  });

  return function loadImage(_x) {
    return _ref.apply(this, arguments);
  };
})();

const drawImage = url => {
  return new Promise((resolve, reject) => {
    originalImageElement.onload = () => {
      canvas.height = originalImageElement.naturalHeight;
      canvas.width = originalImageElement.naturalWidth;
      context.drawImage(originalImageElement, 0, 0);
      resolve();
    };
    originalImageElement.src = url;
  });
};

const run = (() => {
  var _ref2 = _asyncToGenerator(function* (imagePath, altText) {
    let imageDataURL;
    if (typeof imagePath === 'string') {
      imageDataURL = yield loadImage(imagePath).catch(console.error);
    } else {
      imageDataURL = imagePath;
    }
    yield drawImage(imageDataURL);

    var _ref3 = [originalImageElement.naturalHeight, originalImageElement.naturalWidth];
    const w = _ref3[0],
          h = _ref3[1];

    const imageData = context.getImageData(0, 0, w, h);

    const embeddedImageData = (0, _embedder.embedDescription)(altText, imageData);
    context.putImageData(embeddedImageData, 0, 0);
    canvas.toBlob(function (blob) {
      return embeddedImageElement.src = URL.createObjectURL(blob);
    });

    const extraction = (0, _embedder.extractDescription)(embeddedImageData);
    embeddedImageElement.setAttribute('alt', extraction);

    console.log('description length:', (0, _embedder.getDescriptionLength)(embeddedImageData));
    console.log('extracted description:', extraction);
  });

  return function run(_x2, _x3) {
    return _ref2.apply(this, arguments);
  };
})();

form.addEventListener('submit', event => {
  event.preventDefault();
  const altText = event.target.querySelector('input[type="text"]').value;
  const files = event.target.querySelector('input[type="file"]').files;
  const dataURL = URL.createObjectURL(files[0]);
  run(dataURL, altText);
});

fileButton.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', event => {
  const file = event.target.files[0];
  fileName.textContent = file.name;
});

exampleSelect.addEventListener('change', event => {
  const example = exampleImages[event.target.value];
  run(example.imagePath, example.altText);
});

run(exampleImages.cats.imagePath, exampleImages.cats.altText);

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.extractDescription = exports.getDescriptionLength = exports.embedDescription = undefined;

var _seedRandom = __webpack_require__(2);

var _seedRandom2 = _interopRequireDefault(_seedRandom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const seed = 42;

const generateIndices = (seed, length, range) => {
  const indices = [];
  const r = (0, _seedRandom2.default)(seed);
  for (let i = 0; i < length; i++) {
    // the min 8 reserves the first 8 red LSBs for the header (msg length)
    const index = Math.floor(r() * (range - 8) + 8) * 4;
    indices.push(index);
  };
  return indices;
};

const embedByte = (byte, imageData, indices) => {
  for (let i = 7; i >= 0; i--) {
    const shiftByte = byte >>> i;
    const currentBit = shiftByte & 1;
    const index = indices.shift();

    if (!currentBit) {
      imageData.data[index] &= ~0x01;
    } else {
      imageData.data[index] |= 0x01;
    }
  }
};

const embedHeader = (byte, imageData) => {
  const indices = [0, 4, 8, 12, 16, 20, 24, 28];
  embedByte(byte, imageData, indices);
};

const embedDescription = exports.embedDescription = (description, imageData) => {
  const messageLength = description.length;
  embedHeader(messageLength, imageData);

  const length = messageLength * 8;
  const range = imageData.data.length / 4;
  const pixelIndices = generateIndices(seed, length, range);

  description.split('').forEach((char, i) => {
    const start = i * 8;
    const end = start + 8;
    const byteIndices = pixelIndices.slice(start, end);

    const byte = char.charCodeAt();
    embedByte(byte, imageData, byteIndices);
  });

  return imageData;
};

const extractByte = (imageData, indices) => {
  const byteString = indices.reduce((byte, i) => byte += imageData.data[i] & 1, '');
  const byteInt = parseInt(byteString, 2);

  return byteInt;
};

const extractHeader = imageData => {
  const indices = [0, 4, 8, 12, 16, 20, 24, 28];

  return extractByte(imageData, indices);
};

const getDescriptionLength = exports.getDescriptionLength = extractHeader;

const extractDescription = exports.extractDescription = imageData => {
  const messageLength = extractHeader(imageData);

  const length = messageLength * 8;
  const range = imageData.data.length / 4;
  const pixelIndices = generateIndices(seed, length, range);
  const extraction = [];

  for (let i = 0; i < messageLength; i++) {
    const start = i * 8;
    const end = start + 8;
    const byteIndices = pixelIndices.slice(start, end);
    const byte = extractByte(imageData, byteIndices);
    extraction.push(byte);
  };

  const charExtraction = extraction.map(b => String.fromCharCode(b));

  return charExtraction.join('');
};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

var width = 256;// each RC4 output is 0 <= x < 256
var chunks = 6;// at least six RC4 outputs for each double
var digits = 52;// there are 52 significant digits in a double
var pool = [];// pool: entropy pool starts empty
var GLOBAL = typeof global === 'undefined' ? window : global;

//
// The following constants are related to IEEE 754 limits.
//
var startdenom = Math.pow(width, chunks),
    significance = Math.pow(2, digits),
    overflow = significance * 2,
    mask = width - 1;


var oldRandom = Math.random;

//
// seedrandom()
// This is the seedrandom function described above.
//
module.exports = function(seed, options) {
  if (options && options.global === true) {
    options.global = false;
    Math.random = module.exports(seed, options);
    options.global = true;
    return Math.random;
  }
  var use_entropy = (options && options.entropy) || false;
  var key = [];

  // Flatten the seed string or build one from local entropy if needed.
  var shortseed = mixkey(flatten(
    use_entropy ? [seed, tostring(pool)] :
    0 in arguments ? seed : autoseed(), 3), key);

  // Use the seed to initialize an ARC4 generator.
  var arc4 = new ARC4(key);

  // Mix the randomness into accumulated entropy.
  mixkey(tostring(arc4.S), pool);

  // Override Math.random

  // This function returns a random double in [0, 1) that contains
  // randomness in every bit of the mantissa of the IEEE 754 value.

  return function() {         // Closure to return a random double:
    var n = arc4.g(chunks),             // Start with a numerator n < 2 ^ 48
        d = startdenom,                 //   and denominator d = 2 ^ 48.
        x = 0;                          //   and no 'extra last byte'.
    while (n < significance) {          // Fill up all significant digits by
      n = (n + x) * width;              //   shifting numerator and
      d *= width;                       //   denominator and generating a
      x = arc4.g(1);                    //   new least-significant-byte.
    }
    while (n >= overflow) {             // To avoid rounding up, before adding
      n /= 2;                           //   last byte, shift everything
      d /= 2;                           //   right using integer Math until
      x >>>= 1;                         //   we have exactly the desired bits.
    }
    return (n + x) / d;                 // Form the number within [0, 1).
  };
};

module.exports.resetGlobal = function () {
  Math.random = oldRandom;
};

//
// ARC4
//
// An ARC4 implementation.  The constructor takes a key in the form of
// an array of at most (width) integers that should be 0 <= x < (width).
//
// The g(count) method returns a pseudorandom integer that concatenates
// the next (count) outputs from ARC4.  Its return value is a number x
// that is in the range 0 <= x < (width ^ count).
//
/** @constructor */
function ARC4(key) {
  var t, keylen = key.length,
      me = this, i = 0, j = me.i = me.j = 0, s = me.S = [];

  // The empty key [] is treated as [0].
  if (!keylen) { key = [keylen++]; }

  // Set up S using the standard key scheduling algorithm.
  while (i < width) {
    s[i] = i++;
  }
  for (i = 0; i < width; i++) {
    s[i] = s[j = mask & (j + key[i % keylen] + (t = s[i]))];
    s[j] = t;
  }

  // The "g" method returns the next (count) outputs as one number.
  (me.g = function(count) {
    // Using instance members instead of closure state nearly doubles speed.
    var t, r = 0,
        i = me.i, j = me.j, s = me.S;
    while (count--) {
      t = s[i = mask & (i + 1)];
      r = r * width + s[mask & ((s[i] = s[j = mask & (j + t)]) + (s[j] = t))];
    }
    me.i = i; me.j = j;
    return r;
    // For robust unpredictability discard an initial batch of values.
    // See http://www.rsa.com/rsalabs/node.asp?id=2009
  })(width);
}

//
// flatten()
// Converts an object tree to nested arrays of strings.
//
function flatten(obj, depth) {
  var result = [], typ = (typeof obj)[0], prop;
  if (depth && typ == 'o') {
    for (prop in obj) {
      try { result.push(flatten(obj[prop], depth - 1)); } catch (e) {}
    }
  }
  return (result.length ? result : typ == 's' ? obj : obj + '\0');
}

//
// mixkey()
// Mixes a string seed into a key that is an array of integers, and
// returns a shortened string seed that is equivalent to the result key.
//
function mixkey(seed, key) {
  var stringseed = seed + '', smear, j = 0;
  while (j < stringseed.length) {
    key[mask & j] =
      mask & ((smear ^= key[mask & j] * 19) + stringseed.charCodeAt(j++));
  }
  return tostring(key);
}

//
// autoseed()
// Returns an object for autoseeding, using window.crypto if available.
//
/** @param {Uint8Array=} seed */
function autoseed(seed) {
  try {
    GLOBAL.crypto.getRandomValues(seed = new Uint8Array(width));
    return tostring(seed);
  } catch (e) {
    return [+new Date, GLOBAL, GLOBAL.navigator && GLOBAL.navigator.plugins,
            GLOBAL.screen, tostring(pool)];
  }
}

//
// tostring()
// Converts an array of charcodes to a string
//
function tostring(a) {
  return String.fromCharCode.apply(0, a);
}

//
// When seedrandom.js is loaded, we immediately mix a few bits
// from the built-in RNG into the entropy pool.  Because we do
// not want to intefere with determinstic PRNG state later,
// seedrandom will not call Math.random on its own again after
// initialization.
//
mixkey(Math.random(), pool);

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ }),
/* 3 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNmMzM2YwZTIyYjFjOWU0NDUxNzAiLCJ3ZWJwYWNrOi8vLy4vanMvc3JjL21haW4uanMiLCJ3ZWJwYWNrOi8vLy4vanMvc3JjL2VtYmVkZGVyLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9zZWVkLXJhbmRvbS9pbmRleC5qcyIsIndlYnBhY2s6Ly8vKHdlYnBhY2spL2J1aWxkaW4vZ2xvYmFsLmpzIl0sIm5hbWVzIjpbIm9yaWdpbmFsSW1hZ2VFbGVtZW50IiwiZG9jdW1lbnQiLCJnZXRFbGVtZW50QnlJZCIsImVtYmVkZGVkSW1hZ2VFbGVtZW50IiwiZm9ybSIsInF1ZXJ5U2VsZWN0b3IiLCJleGFtcGxlU2VsZWN0IiwiZmlsZUJ1dHRvbiIsImZpbGVJbnB1dCIsImZpbGVOYW1lIiwiY2FudmFzIiwiY29udGV4dCIsImdldENvbnRleHQiLCJleGFtcGxlSW1hZ2VzIiwiY2F0cyIsImltYWdlUGF0aCIsImFsdFRleHQiLCJiaXJkIiwiY29mZmVlIiwibG9hZEltYWdlIiwidXJsIiwicmVzcG9uc2UiLCJmZXRjaCIsImNhdGNoIiwiY29uc29sZSIsImVycm9yIiwiYmxvYiIsIm9iamVjdFVSTCIsIlVSTCIsImNyZWF0ZU9iamVjdFVSTCIsImRyYXdJbWFnZSIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0Iiwib25sb2FkIiwiaGVpZ2h0IiwibmF0dXJhbEhlaWdodCIsIndpZHRoIiwibmF0dXJhbFdpZHRoIiwic3JjIiwicnVuIiwiaW1hZ2VEYXRhVVJMIiwidyIsImgiLCJpbWFnZURhdGEiLCJnZXRJbWFnZURhdGEiLCJlbWJlZGRlZEltYWdlRGF0YSIsInB1dEltYWdlRGF0YSIsInRvQmxvYiIsImV4dHJhY3Rpb24iLCJzZXRBdHRyaWJ1dGUiLCJsb2ciLCJhZGRFdmVudExpc3RlbmVyIiwiZXZlbnQiLCJwcmV2ZW50RGVmYXVsdCIsInRhcmdldCIsInZhbHVlIiwiZmlsZXMiLCJkYXRhVVJMIiwiY2xpY2siLCJmaWxlIiwidGV4dENvbnRlbnQiLCJuYW1lIiwiZXhhbXBsZSIsInNlZWQiLCJnZW5lcmF0ZUluZGljZXMiLCJsZW5ndGgiLCJyYW5nZSIsImluZGljZXMiLCJyIiwiaSIsImluZGV4IiwiTWF0aCIsImZsb29yIiwicHVzaCIsImVtYmVkQnl0ZSIsImJ5dGUiLCJzaGlmdEJ5dGUiLCJjdXJyZW50Qml0Iiwic2hpZnQiLCJkYXRhIiwiZW1iZWRIZWFkZXIiLCJlbWJlZERlc2NyaXB0aW9uIiwiZGVzY3JpcHRpb24iLCJtZXNzYWdlTGVuZ3RoIiwicGl4ZWxJbmRpY2VzIiwic3BsaXQiLCJmb3JFYWNoIiwiY2hhciIsInN0YXJ0IiwiZW5kIiwiYnl0ZUluZGljZXMiLCJzbGljZSIsImNoYXJDb2RlQXQiLCJleHRyYWN0Qnl0ZSIsImJ5dGVTdHJpbmciLCJyZWR1Y2UiLCJieXRlSW50IiwicGFyc2VJbnQiLCJleHRyYWN0SGVhZGVyIiwiZ2V0RGVzY3JpcHRpb25MZW5ndGgiLCJleHRyYWN0RGVzY3JpcHRpb24iLCJjaGFyRXh0cmFjdGlvbiIsIm1hcCIsImIiLCJTdHJpbmciLCJmcm9tQ2hhckNvZGUiLCJqb2luIl0sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7Ozs7QUM3REE7Ozs7QUFFQSxNQUFNQSx1QkFBdUJDLFNBQVNDLGNBQVQs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QUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7OztBQzVLQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsNENBQTRDOztBQUU1QyIsImZpbGUiOiJidW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAwKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCA2YzMzZjBlMjJiMWM5ZTQ0NTE3MCIsImltcG9ydCB7IGVtYmVkRGVzY3JpcHRpb24sIGV4dHJhY3REZXNjcmlwdGlvbiwgZ2V0RGVzY3JpcHRpb25MZW5ndGggfSBmcm9tICcuL2VtYmVkZGVyLmpzJztcblxuY29uc3Qgb3JpZ2luYWxJbWFnZUVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnb3JpZ2luYWwnKTtcbmNvbnN0IGVtYmVkZGVkSW1hZ2VFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2VtYmVkZGVkJyk7XG5cbmNvbnN0IGZvcm0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdmb3JtJyk7XG5jb25zdCBleGFtcGxlU2VsZWN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2V4YW1wbGVTZWxlY3QnKTtcbmNvbnN0IGZpbGVCdXR0b24gPSBmb3JtLnF1ZXJ5U2VsZWN0b3IoJ2Zvcm0gYnV0dG9uJyk7XG5jb25zdCBmaWxlSW5wdXQgPSBmb3JtLnF1ZXJ5U2VsZWN0b3IoJ2lucHV0W3R5cGU9XCJmaWxlXCJdJyk7XG5jb25zdCBmaWxlTmFtZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmaWxlbmFtZScpO1xuXG5jb25zdCBjYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2FudmFzJyk7XG5jb25zdCBjb250ZXh0ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG5cbmNvbnN0IGV4YW1wbGVJbWFnZXMgPSB7XG4gIGNhdHM6IHtcbiAgICBpbWFnZVBhdGg6ICdpbWFnZXMvY2F0cy5qcGcnLFxuICAgIGFsdFRleHQ6ICd0d28gbWFpbmUgY29vbiBjYXRzIHBvc2luZyBpbiBmcm9udCBvZiBhIGJsdWUgYmFja2dyb3VuZCdcbiAgfSxcbiAgYmlyZDoge1xuICAgIGltYWdlUGF0aDogJ2ltYWdlcy9iaXJkLmpwZycsXG4gICAgYWx0VGV4dDogJ2Egc21hbGwgYmlyZCBzdGFuZGluZyBvbiBhIGNoZXJyeSBibG9zc29tIHRyZWUgYnJhbmNoJ1xuICB9LFxuICBjb2ZmZWU6IHtcbiAgICBpbWFnZVBhdGg6ICdpbWFnZXMvY29mZmVlLmpwZycsXG4gICAgYWx0VGV4dDogJ2EgY3VwIG9mIGNvZmZlZSBvbiBhIHRhYmxlIGluIGZyb250IG9mIGEgaGFuZCB3cml0aW5nIGluIGEgbm90ZWJvb2snXG4gIH1cbn07XG5cbmNvbnN0IGxvYWRJbWFnZSA9IGFzeW5jICh1cmwpID0+IHtcbiAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCh1cmwpLmNhdGNoKGNvbnNvbGUuZXJyb3IpO1xuICBjb25zdCBibG9iID0gYXdhaXQgcmVzcG9uc2UuYmxvYigpO1xuICBjb25zdCBvYmplY3RVUkwgPSBVUkwuY3JlYXRlT2JqZWN0VVJMKGJsb2IpO1xuICByZXR1cm4gb2JqZWN0VVJMO1xufTtcblxuY29uc3QgZHJhd0ltYWdlID0gKHVybCkgPT4ge1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIG9yaWdpbmFsSW1hZ2VFbGVtZW50Lm9ubG9hZCA9ICgpID0+IHtcbiAgICAgIGNhbnZhcy5oZWlnaHQgPSBvcmlnaW5hbEltYWdlRWxlbWVudC5uYXR1cmFsSGVpZ2h0O1xuICAgICAgY2FudmFzLndpZHRoID0gb3JpZ2luYWxJbWFnZUVsZW1lbnQubmF0dXJhbFdpZHRoO1xuICAgICAgY29udGV4dC5kcmF3SW1hZ2Uob3JpZ2luYWxJbWFnZUVsZW1lbnQsIDAsIDApOyBcbiAgICAgIHJlc29sdmUoKTtcbiAgICB9XG4gICAgb3JpZ2luYWxJbWFnZUVsZW1lbnQuc3JjID0gdXJsO1xuICB9KTtcbn07XG5cbmNvbnN0IHJ1biA9IGFzeW5jIChpbWFnZVBhdGgsIGFsdFRleHQpID0+IHtcbiAgbGV0IGltYWdlRGF0YVVSTDtcbiAgaWYgKHR5cGVvZiBpbWFnZVBhdGggPT09ICdzdHJpbmcnKSB7XG4gICAgaW1hZ2VEYXRhVVJMID0gYXdhaXQgbG9hZEltYWdlKGltYWdlUGF0aCkuY2F0Y2goY29uc29sZS5lcnJvcik7XG4gIH0gZWxzZSB7XG4gICAgaW1hZ2VEYXRhVVJMID0gaW1hZ2VQYXRoO1xuICB9XG4gIGF3YWl0IGRyYXdJbWFnZShpbWFnZURhdGFVUkwpO1xuXG4gIGNvbnN0IFt3LCBoXSA9IFtvcmlnaW5hbEltYWdlRWxlbWVudC5uYXR1cmFsSGVpZ2h0LCBvcmlnaW5hbEltYWdlRWxlbWVudC5uYXR1cmFsV2lkdGhdO1xuICBjb25zdCBpbWFnZURhdGEgPSBjb250ZXh0LmdldEltYWdlRGF0YSgwLCAwLCB3LCBoKTtcblxuICBjb25zdCBlbWJlZGRlZEltYWdlRGF0YSA9IGVtYmVkRGVzY3JpcHRpb24oYWx0VGV4dCwgaW1hZ2VEYXRhKTtcbiAgY29udGV4dC5wdXRJbWFnZURhdGEoZW1iZWRkZWRJbWFnZURhdGEsIDAsIDApOyBcbiAgY2FudmFzLnRvQmxvYigoYmxvYikgPT4gZW1iZWRkZWRJbWFnZUVsZW1lbnQuc3JjID0gVVJMLmNyZWF0ZU9iamVjdFVSTChibG9iKSk7XG5cbiAgY29uc3QgZXh0cmFjdGlvbiA9IGV4dHJhY3REZXNjcmlwdGlvbihlbWJlZGRlZEltYWdlRGF0YSk7XG4gIGVtYmVkZGVkSW1hZ2VFbGVtZW50LnNldEF0dHJpYnV0ZSgnYWx0JywgZXh0cmFjdGlvbik7XG4gIFxuICBjb25zb2xlLmxvZygnZGVzY3JpcHRpb24gbGVuZ3RoOicsIGdldERlc2NyaXB0aW9uTGVuZ3RoKGVtYmVkZGVkSW1hZ2VEYXRhKSk7XG4gIGNvbnNvbGUubG9nKCdleHRyYWN0ZWQgZGVzY3JpcHRpb246JywgZXh0cmFjdGlvbik7XG59O1xuXG5mb3JtLmFkZEV2ZW50TGlzdGVuZXIoJ3N1Ym1pdCcsIChldmVudCkgPT4ge1xuICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICBjb25zdCBhbHRUZXh0ID0gZXZlbnQudGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoJ2lucHV0W3R5cGU9XCJ0ZXh0XCJdJykudmFsdWU7XG4gIGNvbnN0IGZpbGVzID0gZXZlbnQudGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoJ2lucHV0W3R5cGU9XCJmaWxlXCJdJykuZmlsZXM7XG4gIGNvbnN0IGRhdGFVUkwgPSBVUkwuY3JlYXRlT2JqZWN0VVJMKGZpbGVzWzBdKTtcbiAgcnVuKGRhdGFVUkwsIGFsdFRleHQpO1xufSk7XG5cbmZpbGVCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiBmaWxlSW5wdXQuY2xpY2soKSk7XG5cbmZpbGVJbnB1dC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCAoZXZlbnQpID0+IHtcbiAgY29uc3QgZmlsZSA9IGV2ZW50LnRhcmdldC5maWxlc1swXTtcbiAgZmlsZU5hbWUudGV4dENvbnRlbnQgPSBmaWxlLm5hbWU7XG59KTtcblxuZXhhbXBsZVNlbGVjdC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCAoZXZlbnQpID0+IHtcbiAgY29uc3QgZXhhbXBsZSA9IGV4YW1wbGVJbWFnZXNbZXZlbnQudGFyZ2V0LnZhbHVlXTtcbiAgcnVuKGV4YW1wbGUuaW1hZ2VQYXRoLCBleGFtcGxlLmFsdFRleHQpO1xufSk7XG5cbnJ1bihleGFtcGxlSW1hZ2VzLmNhdHMuaW1hZ2VQYXRoLCBleGFtcGxlSW1hZ2VzLmNhdHMuYWx0VGV4dCk7XG5cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2pzL3NyYy9tYWluLmpzIiwiaW1wb3J0IHJhbmRvbSBmcm9tICdzZWVkLXJhbmRvbSc7XG5jb25zdCBzZWVkID0gNDI7XG5cbmNvbnN0IGdlbmVyYXRlSW5kaWNlcyA9IChzZWVkLCBsZW5ndGgsIHJhbmdlKSA9PiB7XG4gIGNvbnN0IGluZGljZXMgPSBbXTtcbiAgY29uc3QgciA9IHJhbmRvbShzZWVkKTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgIC8vIHRoZSBtaW4gOCByZXNlcnZlcyB0aGUgZmlyc3QgOCByZWQgTFNCcyBmb3IgdGhlIGhlYWRlciAobXNnIGxlbmd0aClcbiAgICBjb25zdCBpbmRleCA9IE1hdGguZmxvb3IocigpICogKHJhbmdlIC0gOCkgKyA4KSAqIDQ7XG4gICAgaW5kaWNlcy5wdXNoKGluZGV4KTsgIFxuICB9O1xuICByZXR1cm4gaW5kaWNlcztcbn07XG5cbmNvbnN0IGVtYmVkQnl0ZSA9IChieXRlLCBpbWFnZURhdGEsIGluZGljZXMpID0+IHtcbiAgZm9yIChsZXQgaSA9IDc7IGkgPj0gMDsgaS0tKSB7XG4gICAgY29uc3Qgc2hpZnRCeXRlID0gYnl0ZSA+Pj4gaTtcbiAgICBjb25zdCBjdXJyZW50Qml0ID0gc2hpZnRCeXRlICYgMTtcbiAgICBjb25zdCBpbmRleCA9IGluZGljZXMuc2hpZnQoKTtcblxuICAgIGlmICghY3VycmVudEJpdCkge1xuICAgICAgaW1hZ2VEYXRhLmRhdGFbaW5kZXhdICY9IH4weDAxO1xuICAgIH0gZWxzZSB7XG4gICAgICBpbWFnZURhdGEuZGF0YVtpbmRleF0gfD0gMHgwMTtcbiAgICB9XG4gIH1cbn07XG5cbmNvbnN0IGVtYmVkSGVhZGVyID0gKGJ5dGUsIGltYWdlRGF0YSkgPT4ge1xuICBjb25zdCBpbmRpY2VzID0gWzAsIDQsIDgsIDEyLCAxNiwgMjAsIDI0LCAyOF07XG4gIGVtYmVkQnl0ZShieXRlLCBpbWFnZURhdGEsIGluZGljZXMpO1xufTtcblxuZXhwb3J0IGNvbnN0IGVtYmVkRGVzY3JpcHRpb24gPSAoZGVzY3JpcHRpb24sIGltYWdlRGF0YSkgPT4ge1xuICBjb25zdCBtZXNzYWdlTGVuZ3RoID0gZGVzY3JpcHRpb24ubGVuZ3RoO1xuICBlbWJlZEhlYWRlcihtZXNzYWdlTGVuZ3RoLCBpbWFnZURhdGEpO1xuXG4gIGNvbnN0IGxlbmd0aCA9IG1lc3NhZ2VMZW5ndGggKiA4O1xuICBjb25zdCByYW5nZSA9IGltYWdlRGF0YS5kYXRhLmxlbmd0aCAvIDQ7IFxuICBjb25zdCBwaXhlbEluZGljZXMgPSBnZW5lcmF0ZUluZGljZXMoc2VlZCwgbGVuZ3RoLCByYW5nZSk7XG5cbiAgZGVzY3JpcHRpb24uc3BsaXQoJycpLmZvckVhY2goKGNoYXIsIGkpID0+IHtcbiAgICBjb25zdCBzdGFydCA9IGkgKiA4O1xuICAgIGNvbnN0IGVuZCA9IHN0YXJ0ICsgODtcbiAgICBjb25zdCBieXRlSW5kaWNlcyA9IHBpeGVsSW5kaWNlcy5zbGljZShzdGFydCwgZW5kKTtcblxuICAgIGNvbnN0IGJ5dGUgPSBjaGFyLmNoYXJDb2RlQXQoKTtcbiAgICBlbWJlZEJ5dGUoYnl0ZSwgaW1hZ2VEYXRhLCBieXRlSW5kaWNlcyk7XG4gIH0pO1xuXG4gIHJldHVybiBpbWFnZURhdGE7XG59O1xuXG5jb25zdCBleHRyYWN0Qnl0ZSA9IChpbWFnZURhdGEsIGluZGljZXMpID0+IHtcbiAgY29uc3QgYnl0ZVN0cmluZyA9IGluZGljZXMucmVkdWNlKChieXRlLCBpKSA9PiBieXRlICs9IGltYWdlRGF0YS5kYXRhW2ldICYgMSwgJycpO1xuICBjb25zdCBieXRlSW50ID0gcGFyc2VJbnQoYnl0ZVN0cmluZywgMik7XG5cbiAgcmV0dXJuIGJ5dGVJbnQ7XG59O1xuXG5jb25zdCBleHRyYWN0SGVhZGVyID0gKGltYWdlRGF0YSkgPT4ge1xuICBjb25zdCBpbmRpY2VzID0gWzAsIDQsIDgsIDEyLCAxNiwgMjAsIDI0LCAyOF07XG5cbiAgcmV0dXJuIGV4dHJhY3RCeXRlKGltYWdlRGF0YSwgaW5kaWNlcyk7IFxufTtcblxuZXhwb3J0IGNvbnN0IGdldERlc2NyaXB0aW9uTGVuZ3RoID0gZXh0cmFjdEhlYWRlcjtcblxuZXhwb3J0IGNvbnN0IGV4dHJhY3REZXNjcmlwdGlvbiA9IChpbWFnZURhdGEpID0+IHtcbiAgY29uc3QgbWVzc2FnZUxlbmd0aCA9IGV4dHJhY3RIZWFkZXIoaW1hZ2VEYXRhKTtcbiAgXG4gIGNvbnN0IGxlbmd0aCA9IG1lc3NhZ2VMZW5ndGggKiA4O1xuICBjb25zdCByYW5nZSA9IGltYWdlRGF0YS5kYXRhLmxlbmd0aCAvIDQ7IFxuICBjb25zdCBwaXhlbEluZGljZXMgPSBnZW5lcmF0ZUluZGljZXMoc2VlZCwgbGVuZ3RoLCByYW5nZSk7XG4gIGNvbnN0IGV4dHJhY3Rpb24gPSBbXTsgXG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBtZXNzYWdlTGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBzdGFydCA9IGkgKiA4O1xuICAgIGNvbnN0IGVuZCA9IHN0YXJ0ICsgODtcbiAgICBjb25zdCBieXRlSW5kaWNlcyA9IHBpeGVsSW5kaWNlcy5zbGljZShzdGFydCwgZW5kKTtcbiAgICBjb25zdCBieXRlID0gZXh0cmFjdEJ5dGUoaW1hZ2VEYXRhLCBieXRlSW5kaWNlcyk7XG4gICAgZXh0cmFjdGlvbi5wdXNoKGJ5dGUpO1xuICB9O1xuXG4gIGNvbnN0IGNoYXJFeHRyYWN0aW9uID0gZXh0cmFjdGlvbi5tYXAoKGIpID0+IFN0cmluZy5mcm9tQ2hhckNvZGUoYikpO1xuXG4gIHJldHVybiBjaGFyRXh0cmFjdGlvbi5qb2luKCcnKTtcbn07XG5cblxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vanMvc3JjL2VtYmVkZGVyLmpzIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIHdpZHRoID0gMjU2Oy8vIGVhY2ggUkM0IG91dHB1dCBpcyAwIDw9IHggPCAyNTZcclxudmFyIGNodW5rcyA9IDY7Ly8gYXQgbGVhc3Qgc2l4IFJDNCBvdXRwdXRzIGZvciBlYWNoIGRvdWJsZVxyXG52YXIgZGlnaXRzID0gNTI7Ly8gdGhlcmUgYXJlIDUyIHNpZ25pZmljYW50IGRpZ2l0cyBpbiBhIGRvdWJsZVxyXG52YXIgcG9vbCA9IFtdOy8vIHBvb2w6IGVudHJvcHkgcG9vbCBzdGFydHMgZW1wdHlcclxudmFyIEdMT0JBTCA9IHR5cGVvZiBnbG9iYWwgPT09ICd1bmRlZmluZWQnID8gd2luZG93IDogZ2xvYmFsO1xyXG5cclxuLy9cclxuLy8gVGhlIGZvbGxvd2luZyBjb25zdGFudHMgYXJlIHJlbGF0ZWQgdG8gSUVFRSA3NTQgbGltaXRzLlxyXG4vL1xyXG52YXIgc3RhcnRkZW5vbSA9IE1hdGgucG93KHdpZHRoLCBjaHVua3MpLFxyXG4gICAgc2lnbmlmaWNhbmNlID0gTWF0aC5wb3coMiwgZGlnaXRzKSxcclxuICAgIG92ZXJmbG93ID0gc2lnbmlmaWNhbmNlICogMixcclxuICAgIG1hc2sgPSB3aWR0aCAtIDE7XHJcblxyXG5cclxudmFyIG9sZFJhbmRvbSA9IE1hdGgucmFuZG9tO1xyXG5cclxuLy9cclxuLy8gc2VlZHJhbmRvbSgpXHJcbi8vIFRoaXMgaXMgdGhlIHNlZWRyYW5kb20gZnVuY3Rpb24gZGVzY3JpYmVkIGFib3ZlLlxyXG4vL1xyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHNlZWQsIG9wdGlvbnMpIHtcclxuICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLmdsb2JhbCA9PT0gdHJ1ZSkge1xyXG4gICAgb3B0aW9ucy5nbG9iYWwgPSBmYWxzZTtcclxuICAgIE1hdGgucmFuZG9tID0gbW9kdWxlLmV4cG9ydHMoc2VlZCwgb3B0aW9ucyk7XHJcbiAgICBvcHRpb25zLmdsb2JhbCA9IHRydWU7XHJcbiAgICByZXR1cm4gTWF0aC5yYW5kb207XHJcbiAgfVxyXG4gIHZhciB1c2VfZW50cm9weSA9IChvcHRpb25zICYmIG9wdGlvbnMuZW50cm9weSkgfHwgZmFsc2U7XHJcbiAgdmFyIGtleSA9IFtdO1xyXG5cclxuICAvLyBGbGF0dGVuIHRoZSBzZWVkIHN0cmluZyBvciBidWlsZCBvbmUgZnJvbSBsb2NhbCBlbnRyb3B5IGlmIG5lZWRlZC5cclxuICB2YXIgc2hvcnRzZWVkID0gbWl4a2V5KGZsYXR0ZW4oXHJcbiAgICB1c2VfZW50cm9weSA/IFtzZWVkLCB0b3N0cmluZyhwb29sKV0gOlxyXG4gICAgMCBpbiBhcmd1bWVudHMgPyBzZWVkIDogYXV0b3NlZWQoKSwgMyksIGtleSk7XHJcblxyXG4gIC8vIFVzZSB0aGUgc2VlZCB0byBpbml0aWFsaXplIGFuIEFSQzQgZ2VuZXJhdG9yLlxyXG4gIHZhciBhcmM0ID0gbmV3IEFSQzQoa2V5KTtcclxuXHJcbiAgLy8gTWl4IHRoZSByYW5kb21uZXNzIGludG8gYWNjdW11bGF0ZWQgZW50cm9weS5cclxuICBtaXhrZXkodG9zdHJpbmcoYXJjNC5TKSwgcG9vbCk7XHJcblxyXG4gIC8vIE92ZXJyaWRlIE1hdGgucmFuZG9tXHJcblxyXG4gIC8vIFRoaXMgZnVuY3Rpb24gcmV0dXJucyBhIHJhbmRvbSBkb3VibGUgaW4gWzAsIDEpIHRoYXQgY29udGFpbnNcclxuICAvLyByYW5kb21uZXNzIGluIGV2ZXJ5IGJpdCBvZiB0aGUgbWFudGlzc2Egb2YgdGhlIElFRUUgNzU0IHZhbHVlLlxyXG5cclxuICByZXR1cm4gZnVuY3Rpb24oKSB7ICAgICAgICAgLy8gQ2xvc3VyZSB0byByZXR1cm4gYSByYW5kb20gZG91YmxlOlxyXG4gICAgdmFyIG4gPSBhcmM0LmcoY2h1bmtzKSwgICAgICAgICAgICAgLy8gU3RhcnQgd2l0aCBhIG51bWVyYXRvciBuIDwgMiBeIDQ4XHJcbiAgICAgICAgZCA9IHN0YXJ0ZGVub20sICAgICAgICAgICAgICAgICAvLyAgIGFuZCBkZW5vbWluYXRvciBkID0gMiBeIDQ4LlxyXG4gICAgICAgIHggPSAwOyAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICBhbmQgbm8gJ2V4dHJhIGxhc3QgYnl0ZScuXHJcbiAgICB3aGlsZSAobiA8IHNpZ25pZmljYW5jZSkgeyAgICAgICAgICAvLyBGaWxsIHVwIGFsbCBzaWduaWZpY2FudCBkaWdpdHMgYnlcclxuICAgICAgbiA9IChuICsgeCkgKiB3aWR0aDsgICAgICAgICAgICAgIC8vICAgc2hpZnRpbmcgbnVtZXJhdG9yIGFuZFxyXG4gICAgICBkICo9IHdpZHRoOyAgICAgICAgICAgICAgICAgICAgICAgLy8gICBkZW5vbWluYXRvciBhbmQgZ2VuZXJhdGluZyBhXHJcbiAgICAgIHggPSBhcmM0LmcoMSk7ICAgICAgICAgICAgICAgICAgICAvLyAgIG5ldyBsZWFzdC1zaWduaWZpY2FudC1ieXRlLlxyXG4gICAgfVxyXG4gICAgd2hpbGUgKG4gPj0gb3ZlcmZsb3cpIHsgICAgICAgICAgICAgLy8gVG8gYXZvaWQgcm91bmRpbmcgdXAsIGJlZm9yZSBhZGRpbmdcclxuICAgICAgbiAvPSAyOyAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgbGFzdCBieXRlLCBzaGlmdCBldmVyeXRoaW5nXHJcbiAgICAgIGQgLz0gMjsgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgIHJpZ2h0IHVzaW5nIGludGVnZXIgTWF0aCB1bnRpbFxyXG4gICAgICB4ID4+Pj0gMTsgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICB3ZSBoYXZlIGV4YWN0bHkgdGhlIGRlc2lyZWQgYml0cy5cclxuICAgIH1cclxuICAgIHJldHVybiAobiArIHgpIC8gZDsgICAgICAgICAgICAgICAgIC8vIEZvcm0gdGhlIG51bWJlciB3aXRoaW4gWzAsIDEpLlxyXG4gIH07XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cy5yZXNldEdsb2JhbCA9IGZ1bmN0aW9uICgpIHtcclxuICBNYXRoLnJhbmRvbSA9IG9sZFJhbmRvbTtcclxufTtcclxuXHJcbi8vXHJcbi8vIEFSQzRcclxuLy9cclxuLy8gQW4gQVJDNCBpbXBsZW1lbnRhdGlvbi4gIFRoZSBjb25zdHJ1Y3RvciB0YWtlcyBhIGtleSBpbiB0aGUgZm9ybSBvZlxyXG4vLyBhbiBhcnJheSBvZiBhdCBtb3N0ICh3aWR0aCkgaW50ZWdlcnMgdGhhdCBzaG91bGQgYmUgMCA8PSB4IDwgKHdpZHRoKS5cclxuLy9cclxuLy8gVGhlIGcoY291bnQpIG1ldGhvZCByZXR1cm5zIGEgcHNldWRvcmFuZG9tIGludGVnZXIgdGhhdCBjb25jYXRlbmF0ZXNcclxuLy8gdGhlIG5leHQgKGNvdW50KSBvdXRwdXRzIGZyb20gQVJDNC4gIEl0cyByZXR1cm4gdmFsdWUgaXMgYSBudW1iZXIgeFxyXG4vLyB0aGF0IGlzIGluIHRoZSByYW5nZSAwIDw9IHggPCAod2lkdGggXiBjb3VudCkuXHJcbi8vXHJcbi8qKiBAY29uc3RydWN0b3IgKi9cclxuZnVuY3Rpb24gQVJDNChrZXkpIHtcclxuICB2YXIgdCwga2V5bGVuID0ga2V5Lmxlbmd0aCxcclxuICAgICAgbWUgPSB0aGlzLCBpID0gMCwgaiA9IG1lLmkgPSBtZS5qID0gMCwgcyA9IG1lLlMgPSBbXTtcclxuXHJcbiAgLy8gVGhlIGVtcHR5IGtleSBbXSBpcyB0cmVhdGVkIGFzIFswXS5cclxuICBpZiAoIWtleWxlbikgeyBrZXkgPSBba2V5bGVuKytdOyB9XHJcblxyXG4gIC8vIFNldCB1cCBTIHVzaW5nIHRoZSBzdGFuZGFyZCBrZXkgc2NoZWR1bGluZyBhbGdvcml0aG0uXHJcbiAgd2hpbGUgKGkgPCB3aWR0aCkge1xyXG4gICAgc1tpXSA9IGkrKztcclxuICB9XHJcbiAgZm9yIChpID0gMDsgaSA8IHdpZHRoOyBpKyspIHtcclxuICAgIHNbaV0gPSBzW2ogPSBtYXNrICYgKGogKyBrZXlbaSAlIGtleWxlbl0gKyAodCA9IHNbaV0pKV07XHJcbiAgICBzW2pdID0gdDtcclxuICB9XHJcblxyXG4gIC8vIFRoZSBcImdcIiBtZXRob2QgcmV0dXJucyB0aGUgbmV4dCAoY291bnQpIG91dHB1dHMgYXMgb25lIG51bWJlci5cclxuICAobWUuZyA9IGZ1bmN0aW9uKGNvdW50KSB7XHJcbiAgICAvLyBVc2luZyBpbnN0YW5jZSBtZW1iZXJzIGluc3RlYWQgb2YgY2xvc3VyZSBzdGF0ZSBuZWFybHkgZG91YmxlcyBzcGVlZC5cclxuICAgIHZhciB0LCByID0gMCxcclxuICAgICAgICBpID0gbWUuaSwgaiA9IG1lLmosIHMgPSBtZS5TO1xyXG4gICAgd2hpbGUgKGNvdW50LS0pIHtcclxuICAgICAgdCA9IHNbaSA9IG1hc2sgJiAoaSArIDEpXTtcclxuICAgICAgciA9IHIgKiB3aWR0aCArIHNbbWFzayAmICgoc1tpXSA9IHNbaiA9IG1hc2sgJiAoaiArIHQpXSkgKyAoc1tqXSA9IHQpKV07XHJcbiAgICB9XHJcbiAgICBtZS5pID0gaTsgbWUuaiA9IGo7XHJcbiAgICByZXR1cm4gcjtcclxuICAgIC8vIEZvciByb2J1c3QgdW5wcmVkaWN0YWJpbGl0eSBkaXNjYXJkIGFuIGluaXRpYWwgYmF0Y2ggb2YgdmFsdWVzLlxyXG4gICAgLy8gU2VlIGh0dHA6Ly93d3cucnNhLmNvbS9yc2FsYWJzL25vZGUuYXNwP2lkPTIwMDlcclxuICB9KSh3aWR0aCk7XHJcbn1cclxuXHJcbi8vXHJcbi8vIGZsYXR0ZW4oKVxyXG4vLyBDb252ZXJ0cyBhbiBvYmplY3QgdHJlZSB0byBuZXN0ZWQgYXJyYXlzIG9mIHN0cmluZ3MuXHJcbi8vXHJcbmZ1bmN0aW9uIGZsYXR0ZW4ob2JqLCBkZXB0aCkge1xyXG4gIHZhciByZXN1bHQgPSBbXSwgdHlwID0gKHR5cGVvZiBvYmopWzBdLCBwcm9wO1xyXG4gIGlmIChkZXB0aCAmJiB0eXAgPT0gJ28nKSB7XHJcbiAgICBmb3IgKHByb3AgaW4gb2JqKSB7XHJcbiAgICAgIHRyeSB7IHJlc3VsdC5wdXNoKGZsYXR0ZW4ob2JqW3Byb3BdLCBkZXB0aCAtIDEpKTsgfSBjYXRjaCAoZSkge31cclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIChyZXN1bHQubGVuZ3RoID8gcmVzdWx0IDogdHlwID09ICdzJyA/IG9iaiA6IG9iaiArICdcXDAnKTtcclxufVxyXG5cclxuLy9cclxuLy8gbWl4a2V5KClcclxuLy8gTWl4ZXMgYSBzdHJpbmcgc2VlZCBpbnRvIGEga2V5IHRoYXQgaXMgYW4gYXJyYXkgb2YgaW50ZWdlcnMsIGFuZFxyXG4vLyByZXR1cm5zIGEgc2hvcnRlbmVkIHN0cmluZyBzZWVkIHRoYXQgaXMgZXF1aXZhbGVudCB0byB0aGUgcmVzdWx0IGtleS5cclxuLy9cclxuZnVuY3Rpb24gbWl4a2V5KHNlZWQsIGtleSkge1xyXG4gIHZhciBzdHJpbmdzZWVkID0gc2VlZCArICcnLCBzbWVhciwgaiA9IDA7XHJcbiAgd2hpbGUgKGogPCBzdHJpbmdzZWVkLmxlbmd0aCkge1xyXG4gICAga2V5W21hc2sgJiBqXSA9XHJcbiAgICAgIG1hc2sgJiAoKHNtZWFyIF49IGtleVttYXNrICYgal0gKiAxOSkgKyBzdHJpbmdzZWVkLmNoYXJDb2RlQXQoaisrKSk7XHJcbiAgfVxyXG4gIHJldHVybiB0b3N0cmluZyhrZXkpO1xyXG59XHJcblxyXG4vL1xyXG4vLyBhdXRvc2VlZCgpXHJcbi8vIFJldHVybnMgYW4gb2JqZWN0IGZvciBhdXRvc2VlZGluZywgdXNpbmcgd2luZG93LmNyeXB0byBpZiBhdmFpbGFibGUuXHJcbi8vXHJcbi8qKiBAcGFyYW0ge1VpbnQ4QXJyYXk9fSBzZWVkICovXHJcbmZ1bmN0aW9uIGF1dG9zZWVkKHNlZWQpIHtcclxuICB0cnkge1xyXG4gICAgR0xPQkFMLmNyeXB0by5nZXRSYW5kb21WYWx1ZXMoc2VlZCA9IG5ldyBVaW50OEFycmF5KHdpZHRoKSk7XHJcbiAgICByZXR1cm4gdG9zdHJpbmcoc2VlZCk7XHJcbiAgfSBjYXRjaCAoZSkge1xyXG4gICAgcmV0dXJuIFsrbmV3IERhdGUsIEdMT0JBTCwgR0xPQkFMLm5hdmlnYXRvciAmJiBHTE9CQUwubmF2aWdhdG9yLnBsdWdpbnMsXHJcbiAgICAgICAgICAgIEdMT0JBTC5zY3JlZW4sIHRvc3RyaW5nKHBvb2wpXTtcclxuICB9XHJcbn1cclxuXHJcbi8vXHJcbi8vIHRvc3RyaW5nKClcclxuLy8gQ29udmVydHMgYW4gYXJyYXkgb2YgY2hhcmNvZGVzIHRvIGEgc3RyaW5nXHJcbi8vXHJcbmZ1bmN0aW9uIHRvc3RyaW5nKGEpIHtcclxuICByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseSgwLCBhKTtcclxufVxyXG5cclxuLy9cclxuLy8gV2hlbiBzZWVkcmFuZG9tLmpzIGlzIGxvYWRlZCwgd2UgaW1tZWRpYXRlbHkgbWl4IGEgZmV3IGJpdHNcclxuLy8gZnJvbSB0aGUgYnVpbHQtaW4gUk5HIGludG8gdGhlIGVudHJvcHkgcG9vbC4gIEJlY2F1c2Ugd2UgZG9cclxuLy8gbm90IHdhbnQgdG8gaW50ZWZlcmUgd2l0aCBkZXRlcm1pbnN0aWMgUFJORyBzdGF0ZSBsYXRlcixcclxuLy8gc2VlZHJhbmRvbSB3aWxsIG5vdCBjYWxsIE1hdGgucmFuZG9tIG9uIGl0cyBvd24gYWdhaW4gYWZ0ZXJcclxuLy8gaW5pdGlhbGl6YXRpb24uXHJcbi8vXHJcbm1peGtleShNYXRoLnJhbmRvbSgpLCBwb29sKTtcclxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvc2VlZC1yYW5kb20vaW5kZXguanNcbi8vIG1vZHVsZSBpZCA9IDJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwidmFyIGc7XHJcblxyXG4vLyBUaGlzIHdvcmtzIGluIG5vbi1zdHJpY3QgbW9kZVxyXG5nID0gKGZ1bmN0aW9uKCkge1xyXG5cdHJldHVybiB0aGlzO1xyXG59KSgpO1xyXG5cclxudHJ5IHtcclxuXHQvLyBUaGlzIHdvcmtzIGlmIGV2YWwgaXMgYWxsb3dlZCAoc2VlIENTUClcclxuXHRnID0gZyB8fCBGdW5jdGlvbihcInJldHVybiB0aGlzXCIpKCkgfHwgKDEsZXZhbCkoXCJ0aGlzXCIpO1xyXG59IGNhdGNoKGUpIHtcclxuXHQvLyBUaGlzIHdvcmtzIGlmIHRoZSB3aW5kb3cgcmVmZXJlbmNlIGlzIGF2YWlsYWJsZVxyXG5cdGlmKHR5cGVvZiB3aW5kb3cgPT09IFwib2JqZWN0XCIpXHJcblx0XHRnID0gd2luZG93O1xyXG59XHJcblxyXG4vLyBnIGNhbiBzdGlsbCBiZSB1bmRlZmluZWQsIGJ1dCBub3RoaW5nIHRvIGRvIGFib3V0IGl0Li4uXHJcbi8vIFdlIHJldHVybiB1bmRlZmluZWQsIGluc3RlYWQgb2Ygbm90aGluZyBoZXJlLCBzbyBpdCdzXHJcbi8vIGVhc2llciB0byBoYW5kbGUgdGhpcyBjYXNlLiBpZighZ2xvYmFsKSB7IC4uLn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZztcclxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gKHdlYnBhY2spL2J1aWxkaW4vZ2xvYmFsLmpzXG4vLyBtb2R1bGUgaWQgPSAzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJzb3VyY2VSb290IjoiIn0=