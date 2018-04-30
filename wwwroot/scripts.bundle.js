(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("auth0-js", [], factory);
	else if(typeof exports === 'object')
		exports["auth0-js"] = factory();
	else
		root["auth0"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
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
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(54);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (name, context, definition) {
	  if (typeof module !== 'undefined' && module.exports) module.exports = definition();
	  else if (true) !(__WEBPACK_AMD_DEFINE_FACTORY__ = (definition), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  else context[name] = definition();
	})('urljoin', this, function () {
	
	  function normalize (str, options) {
	
	    // make sure protocol is followed by two slashes
	    str = str.replace(/:\//g, '://');
	
	    // remove consecutive slashes
	    str = str.replace(/([^:\s])\/+/g, '$1/');
	
	    // remove trailing slash before parameters or hash
	    str = str.replace(/\/(\?|&|#[^!])/g, '$1');
	
	    // replace ? in parameters with &
	    str = str.replace(/(\?.+)\?/g, '$1&');
	
	    return str;
	  }
	
	  return function () {
	    var input = arguments;
	    var options = {};
	
	    if (typeof arguments[0] === 'object') {
	      // new syntax with array and options
	      input = arguments[0];
	      options = arguments[1] || {};
	    }
	
	    var joined = [].slice.call(input, 0).join('/');
	    return normalize(joined, options);
	  };
	
	});


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/* eslint-disable no-param-reassign */
	/* eslint-disable no-restricted-syntax */
	/* eslint-disable guard-for-in */
	
	var assert = __webpack_require__(4);
	var objectAssign = __webpack_require__(44);
	
	function pick(object, keys) {
	  return keys.reduce(function(prev, key) {
	    if (object[key]) {
	      prev[key] = object[key];
	    }
	    return prev;
	  }, {});
	}
	
	function getKeysNotIn(obj, allowedKeys) {
	  var notAllowed = [];
	  for (var key in obj) {
	    if (allowedKeys.indexOf(key) === -1) {
	      notAllowed.push(key);
	    }
	  }
	  return notAllowed;
	}
	
	function objectValues(obj) {
	  var values = [];
	  for (var key in obj) {
	    values.push(obj[key]);
	  }
	  return values;
	}
	
	function extend() {
	  var params = objectValues(arguments);
	  params.unshift({});
	  return objectAssign.get().apply(undefined, params);
	}
	
	function merge(object, keys) {
	  return {
	    base: keys ? pick(object, keys) : object,
	    with: function(object2, keys2) {
	      object2 = keys2 ? pick(object2, keys2) : object2;
	      return extend(this.base, object2);
	    }
	  };
	}
	
	function blacklist(object, blacklistedKeys) {
	  return Object.keys(object).reduce(function(p, key) {
	    if (blacklistedKeys.indexOf(key) === -1) {
	      p[key] = object[key];
	    }
	    return p;
	  }, {});
	}
	
	function camelToSnake(str) {
	  var newKey = '';
	  var index = 0;
	  var code;
	  var wasPrevNumber = true;
	  var wasPrevUppercase = true;
	
	  while (index < str.length) {
	    code = str.charCodeAt(index);
	    if (
	      (!wasPrevUppercase && code >= 65 && code <= 90) ||
	      (!wasPrevNumber && code >= 48 && code <= 57)
	    ) {
	      newKey += '_';
	      newKey += str[index].toLowerCase();
	    } else {
	      newKey += str[index].toLowerCase();
	    }
	    wasPrevNumber = code >= 48 && code <= 57;
	    wasPrevUppercase = code >= 65 && code <= 90;
	    index++;
	  }
	
	  return newKey;
	}
	
	function snakeToCamel(str) {
	  var parts = str.split('_');
	  return parts.reduce(function(p, c) {
	    return p + c.charAt(0).toUpperCase() + c.slice(1);
	  }, parts.shift());
	}
	
	function toSnakeCase(object, exceptions) {
	  if (typeof object !== 'object' || assert.isArray(object) || object === null) {
	    return object;
	  }
	  exceptions = exceptions || [];
	
	  return Object.keys(object).reduce(function(p, key) {
	    var newKey = exceptions.indexOf(key) === -1 ? camelToSnake(key) : key;
	    p[newKey] = toSnakeCase(object[key]);
	    return p;
	  }, {});
	}
	
	function toCamelCase(object, exceptions) {
	  if (typeof object !== 'object' || assert.isArray(object) || object === null) {
	    return object;
	  }
	
	  exceptions = exceptions || [];
	
	  return Object.keys(object).reduce(function(p, key) {
	    var newKey = exceptions.indexOf(key) === -1 ? snakeToCamel(key) : key;
	    p[newKey] = toCamelCase(object[key]);
	    return p;
	  }, {});
	}
	
	module.exports = {
	  toSnakeCase: toSnakeCase,
	  toCamelCase: toCamelCase,
	  blacklist: blacklist,
	  merge: merge,
	  pick: pick,
	  getKeysNotIn: getKeysNotIn,
	  extend: extend
	};


/***/ },
/* 3 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {function redirect(url) {
	  global.window.location = url;
	}
	
	function getDocument() {
	  return global.window.document;
	}
	
	function getWindow() {
	  return global.window;
	}
	
	module.exports = {
	  redirect: redirect,
	  getDocument: getDocument,
	  getWindow: getWindow
	};
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 4 */
/***/ function(module, exports) {

	var toString = Object.prototype.toString;
	
	function attribute(o, attr, type, text) {
	  type = type === 'array' ? 'object' : type;
	  if (o && typeof o[attr] !== type) {
	    throw new Error(text);
	  }
	}
	
	function variable(o, type, text) {
	  if (typeof o !== type) {
	    throw new Error(text);
	  }
	}
	
	function value(o, values, text) {
	  if (values.indexOf(o) === -1) {
	    throw new Error(text);
	  }
	}
	
	function check(o, config, attributes) {
	  if (!config.optional || o) {
	    variable(o, config.type, config.message);
	  }
	  if (config.type === 'object' && attributes) {
	    var keys = Object.keys(attributes);
	
	    for (var index = 0; index < keys.length; index++) {
	      var a = keys[index];
	      if (!attributes[a].optional || o[a]) {
	        if (!attributes[a].condition || attributes[a].condition(o)) {
	          attribute(o, a, attributes[a].type, attributes[a].message);
	          if (attributes[a].values) {
	            value(o[a], attributes[a].values, attributes[a].value_message);
	          }
	        }
	      }
	    }
	  }
	}
	
	/**
	 * Wrap `Array.isArray` Polyfill for IE9
	 * source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray
	 *
	 * @param {Array} array
	 * @private
	 */
	function isArray(array) {
	  if (this.supportsIsArray()) {
	    return Array.isArray(array);
	  }
	
	  return toString.call(array) === '[object Array]';
	}
	
	function supportsIsArray() {
	  return Array.isArray != null;
	}
	
	module.exports = {
	  check: check,
	  attribute: attribute,
	  variable: variable,
	  value: value,
	  isArray: isArray,
	  supportsIsArray: supportsIsArray
	};


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var stringify = __webpack_require__(13);
	var parse = __webpack_require__(12);
	var formats = __webpack_require__(7);
	
	module.exports = {
	    formats: formats,
	    parse: parse,
	    stringify: stringify
	};


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var error = __webpack_require__(21);
	var objectHelper = __webpack_require__(2);
	
	function wrapCallback(cb, options) {
	  options = options || {};
	  options.ignoreCasing = options.ignoreCasing ? options.ignoreCasing : false;
	
	  return function(err, data) {
	    var errObj;
	
	    if (!err && !data) {
	      return cb(error.buildResponse('generic_error', 'Something went wrong'));
	    }
	
	    if (!err && data.err) {
	      err = data.err;
	      data = null;
	    }
	
	    if (!err && data.error) {
	      err = data;
	      data = null;
	    }
	
	    if (err) {
	      errObj = {
	        original: err
	      };
	
	      if (err.response && err.response.statusCode) {
	        errObj.statusCode = err.response.statusCode;
	      }
	
	      if (err.response && err.response.statusText) {
	        errObj.statusText = err.response.statusText;
	      }
	
	      if (err.response && err.response.body) {
	        err = err.response.body;
	      }
	
	      if (err.err) {
	        err = err.err;
	      }
	
	      errObj.code = err.error || err.code || err.error_code || err.status || null;
	      errObj.description =
	        err.errorDescription ||
	        err.error_description ||
	        err.description ||
	        err.error ||
	        err.details ||
	        err.err ||
	        null;
	
	      if (err.name) {
	        errObj.name = err.name;
	      }
	
	      if (err.policy) {
	        errObj.policy = err.policy;
	      }
	
	      return cb(errObj);
	    }
	
	    if (data.type && (data.type === 'text/html' || data.type === 'text/plain')) {
	      return cb(null, data.text);
	    }
	
	    if (options.ignoreCasing) {
	      return cb(null, data.body || data);
	    }
	
	    return cb(null, objectHelper.toCamelCase(data.body || data));
	  };
	}
	
	module.exports = wrapCallback;


/***/ },
/* 7 */
/***/ function(module, exports) {

	'use strict';
	
	var replace = String.prototype.replace;
	var percentTwenties = /%20/g;
	
	module.exports = {
	    'default': 'RFC3986',
	    formatters: {
	        RFC1738: function (value) {
	            return replace.call(value, percentTwenties, '+');
	        },
	        RFC3986: function (value) {
	            return value;
	        }
	    },
	    RFC1738: 'RFC1738',
	    RFC3986: 'RFC3986'
	};


/***/ },
/* 8 */
/***/ function(module, exports) {

	'use strict';
	
	var has = Object.prototype.hasOwnProperty;
	
	var hexTable = (function () {
	    var array = [];
	    for (var i = 0; i < 256; ++i) {
	        array.push('%' + ((i < 16 ? '0' : '') + i.toString(16)).toUpperCase());
	    }
	
	    return array;
	}());
	
	exports.arrayToObject = function (source, options) {
	    var obj = options && options.plainObjects ? Object.create(null) : {};
	    for (var i = 0; i < source.length; ++i) {
	        if (typeof source[i] !== 'undefined') {
	            obj[i] = source[i];
	        }
	    }
	
	    return obj;
	};
	
	exports.merge = function (target, source, options) {
	    if (!source) {
	        return target;
	    }
	
	    if (typeof source !== 'object') {
	        if (Array.isArray(target)) {
	            target.push(source);
	        } else if (typeof target === 'object') {
	            if (options.plainObjects || options.allowPrototypes || !has.call(Object.prototype, source)) {
	                target[source] = true;
	            }
	        } else {
	            return [target, source];
	        }
	
	        return target;
	    }
	
	    if (typeof target !== 'object') {
	        return [target].concat(source);
	    }
	
	    var mergeTarget = target;
	    if (Array.isArray(target) && !Array.isArray(source)) {
	        mergeTarget = exports.arrayToObject(target, options);
	    }
	
	    if (Array.isArray(target) && Array.isArray(source)) {
	        source.forEach(function (item, i) {
	            if (has.call(target, i)) {
	                if (target[i] && typeof target[i] === 'object') {
	                    target[i] = exports.merge(target[i], item, options);
	                } else {
	                    target.push(item);
	                }
	            } else {
	                target[i] = item;
	            }
	        });
	        return target;
	    }
	
	    return Object.keys(source).reduce(function (acc, key) {
	        var value = source[key];
	
	        if (Object.prototype.hasOwnProperty.call(acc, key)) {
	            acc[key] = exports.merge(acc[key], value, options);
	        } else {
	            acc[key] = value;
	        }
	        return acc;
	    }, mergeTarget);
	};
	
	exports.decode = function (str) {
	    try {
	        return decodeURIComponent(str.replace(/\+/g, ' '));
	    } catch (e) {
	        return str;
	    }
	};
	
	exports.encode = function (str) {
	    // This code was originally written by Brian White (mscdex) for the io.js core querystring library.
	    // It has been adapted here for stricter adherence to RFC 3986
	    if (str.length === 0) {
	        return str;
	    }
	
	    var string = typeof str === 'string' ? str : String(str);
	
	    var out = '';
	    for (var i = 0; i < string.length; ++i) {
	        var c = string.charCodeAt(i);
	
	        if (
	            c === 0x2D || // -
	            c === 0x2E || // .
	            c === 0x5F || // _
	            c === 0x7E || // ~
	            (c >= 0x30 && c <= 0x39) || // 0-9
	            (c >= 0x41 && c <= 0x5A) || // a-z
	            (c >= 0x61 && c <= 0x7A) // A-Z
	        ) {
	            out += string.charAt(i);
	            continue;
	        }
	
	        if (c < 0x80) {
	            out = out + hexTable[c];
	            continue;
	        }
	
	        if (c < 0x800) {
	            out = out + (hexTable[0xC0 | (c >> 6)] + hexTable[0x80 | (c & 0x3F)]);
	            continue;
	        }
	
	        if (c < 0xD800 || c >= 0xE000) {
	            out = out + (hexTable[0xE0 | (c >> 12)] + hexTable[0x80 | ((c >> 6) & 0x3F)] + hexTable[0x80 | (c & 0x3F)]);
	            continue;
	        }
	
	        i += 1;
	        c = 0x10000 + (((c & 0x3FF) << 10) | (string.charCodeAt(i) & 0x3FF));
	        out += hexTable[0xF0 | (c >> 18)] + hexTable[0x80 | ((c >> 12) & 0x3F)] + hexTable[0x80 | ((c >> 6) & 0x3F)] + hexTable[0x80 | (c & 0x3F)]; // eslint-disable-line max-len
	    }
	
	    return out;
	};
	
	exports.compact = function (obj, references) {
	    if (typeof obj !== 'object' || obj === null) {
	        return obj;
	    }
	
	    var refs = references || [];
	    var lookup = refs.indexOf(obj);
	    if (lookup !== -1) {
	        return refs[lookup];
	    }
	
	    refs.push(obj);
	
	    if (Array.isArray(obj)) {
	        var compacted = [];
	
	        for (var i = 0; i < obj.length; ++i) {
	            if (obj[i] && typeof obj[i] === 'object') {
	                compacted.push(exports.compact(obj[i], refs));
	            } else if (typeof obj[i] !== 'undefined') {
	                compacted.push(obj[i]);
	            }
	        }
	
	        return compacted;
	    }
	
	    var keys = Object.keys(obj);
	    keys.forEach(function (key) {
	        obj[key] = exports.compact(obj[key], refs);
	    });
	
	    return obj;
	};
	
	exports.isRegExp = function (obj) {
	    return Object.prototype.toString.call(obj) === '[object RegExp]';
	};
	
	exports.isBuffer = function (obj) {
	    if (obj === null || typeof obj === 'undefined') {
	        return false;
	    }
	
	    return !!(obj.constructor && obj.constructor.isBuffer && obj.constructor.isBuffer(obj));
	};


/***/ },
/* 9 */
/***/ function(module, exports) {

	module.exports = { raw: '8.9.3' };


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	/* eslint-disable no-param-reassign */
	var request = __webpack_require__(17);
	var base64Url = __webpack_require__(20);
	var version = __webpack_require__(9);
	
	// ------------------------------------------------ RequestWrapper
	
	function RequestWrapper(req) {
	  this.request = req;
	  this.method = req.method;
	  this.url = req.url;
	  this.body = req._data;
	  this.headers = req._header;
	}
	
	RequestWrapper.prototype.abort = function() {
	  this.request.abort();
	};
	
	RequestWrapper.prototype.getMethod = function() {
	  return this.method;
	};
	
	RequestWrapper.prototype.getBody = function() {
	  return this.body;
	};
	
	RequestWrapper.prototype.getUrl = function() {
	  return this.url;
	};
	
	RequestWrapper.prototype.getHeaders = function() {
	  return this.headers;
	};
	
	// ------------------------------------------------ RequestObj
	
	function RequestObj(req) {
	  this.request = req;
	}
	
	RequestObj.prototype.set = function(key, value) {
	  this.request = this.request.set(key, value);
	  return this;
	};
	
	RequestObj.prototype.send = function(body) {
	  this.request = this.request.send(body);
	  return this;
	};
	
	RequestObj.prototype.withCredentials = function() {
	  this.request = this.request.withCredentials();
	  return this;
	};
	
	RequestObj.prototype.end = function(cb) {
	  this.request = this.request.end(cb);
	  return new RequestWrapper(this.request);
	};
	
	// ------------------------------------------------ RequestBuilder
	
	function RequestBuilder(options) {
	  this._sendTelemetry = options._sendTelemetry === false ? options._sendTelemetry : true;
	  this._telemetryInfo = options._telemetryInfo || null;
	  this._timesToRetryFailedRequests = options._timesToRetryFailedRequests;
	  this.headers = options.headers || {};
	}
	
	RequestBuilder.prototype.setCommonConfiguration = function(ongoingRequest, options) {
	  options = options || {};
	
	  if (options.noHeaders) {
	    return ongoingRequest;
	  }
	
	  var headers = this.headers;
	  ongoingRequest = ongoingRequest.set('Content-Type', 'application/json');
	
	  var keys = Object.keys(this.headers);
	
	  for (var a = 0; a < keys.length; a++) {
	    ongoingRequest = ongoingRequest.set(keys[a], headers[keys[a]]);
	  }
	
	  if (this._sendTelemetry) {
	    ongoingRequest = ongoingRequest.set('Auth0-Client', this.getTelemetryData());
	  }
	  if (this._timesToRetryFailedRequests > 0) {
	    ongoingRequest = ongoingRequest.retry(this._timesToRetryFailedRequests);
	  }
	  return ongoingRequest;
	};
	
	RequestBuilder.prototype.getTelemetryData = function() {
	  var clientInfo = this._telemetryInfo || { name: 'auth0.js', version: version.raw };
	  var jsonClientInfo = JSON.stringify(clientInfo);
	  return base64Url.encode(jsonClientInfo);
	};
	
	RequestBuilder.prototype.get = function(url, options) {
	  return new RequestObj(this.setCommonConfiguration(request.get(url), options));
	};
	
	RequestBuilder.prototype.post = function(url, options) {
	  return new RequestObj(this.setCommonConfiguration(request.post(url), options));
	};
	
	RequestBuilder.prototype.patch = function(url, options) {
	  return new RequestObj(this.setCommonConfiguration(request.patch(url), options));
	};
	
	module.exports = RequestBuilder;


/***/ },
/* 11 */
/***/ function(module, exports) {

	/* eslint-disable no-console */
	
	function Warn(options) {
	  this.disableWarnings = options.disableWarnings;
	}
	
	Warn.prototype.warning = function(message) {
	  if (this.disableWarnings) {
	    return;
	  }
	
	  console.warn(message);
	};
	
	module.exports = Warn;


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var utils = __webpack_require__(8);
	
	var has = Object.prototype.hasOwnProperty;
	
	var defaults = {
	    allowDots: false,
	    allowPrototypes: false,
	    arrayLimit: 20,
	    decoder: utils.decode,
	    delimiter: '&',
	    depth: 5,
	    parameterLimit: 1000,
	    plainObjects: false,
	    strictNullHandling: false
	};
	
	var parseValues = function parseQueryStringValues(str, options) {
	    var obj = {};
	    var parts = str.split(options.delimiter, options.parameterLimit === Infinity ? undefined : options.parameterLimit);
	
	    for (var i = 0; i < parts.length; ++i) {
	        var part = parts[i];
	        var pos = part.indexOf(']=') === -1 ? part.indexOf('=') : part.indexOf(']=') + 1;
	
	        var key, val;
	        if (pos === -1) {
	            key = options.decoder(part);
	            val = options.strictNullHandling ? null : '';
	        } else {
	            key = options.decoder(part.slice(0, pos));
	            val = options.decoder(part.slice(pos + 1));
	        }
	        if (has.call(obj, key)) {
	            obj[key] = [].concat(obj[key]).concat(val);
	        } else {
	            obj[key] = val;
	        }
	    }
	
	    return obj;
	};
	
	var parseObject = function parseObjectRecursive(chain, val, options) {
	    if (!chain.length) {
	        return val;
	    }
	
	    var root = chain.shift();
	
	    var obj;
	    if (root === '[]') {
	        obj = [];
	        obj = obj.concat(parseObject(chain, val, options));
	    } else {
	        obj = options.plainObjects ? Object.create(null) : {};
	        var cleanRoot = root.charAt(0) === '[' && root.charAt(root.length - 1) === ']' ? root.slice(1, -1) : root;
	        var index = parseInt(cleanRoot, 10);
	        if (
	            !isNaN(index) &&
	            root !== cleanRoot &&
	            String(index) === cleanRoot &&
	            index >= 0 &&
	            (options.parseArrays && index <= options.arrayLimit)
	        ) {
	            obj = [];
	            obj[index] = parseObject(chain, val, options);
	        } else {
	            obj[cleanRoot] = parseObject(chain, val, options);
	        }
	    }
	
	    return obj;
	};
	
	var parseKeys = function parseQueryStringKeys(givenKey, val, options) {
	    if (!givenKey) {
	        return;
	    }
	
	    // Transform dot notation to bracket notation
	    var key = options.allowDots ? givenKey.replace(/\.([^.[]+)/g, '[$1]') : givenKey;
	
	    // The regex chunks
	
	    var brackets = /(\[[^[\]]*])/;
	    var child = /(\[[^[\]]*])/g;
	
	    // Get the parent
	
	    var segment = brackets.exec(key);
	    var parent = segment ? key.slice(0, segment.index) : key;
	
	    // Stash the parent if it exists
	
	    var keys = [];
	    if (parent) {
	        // If we aren't using plain objects, optionally prefix keys
	        // that would overwrite object prototype properties
	        if (!options.plainObjects && has.call(Object.prototype, parent)) {
	            if (!options.allowPrototypes) {
	                return;
	            }
	        }
	
	        keys.push(parent);
	    }
	
	    // Loop through children appending to the array until we hit depth
	
	    var i = 0;
	    while ((segment = child.exec(key)) !== null && i < options.depth) {
	        i += 1;
	        if (!options.plainObjects && has.call(Object.prototype, segment[1].slice(1, -1))) {
	            if (!options.allowPrototypes) {
	                return;
	            }
	        }
	        keys.push(segment[1]);
	    }
	
	    // If there's a remainder, just add whatever is left
	
	    if (segment) {
	        keys.push('[' + key.slice(segment.index) + ']');
	    }
	
	    return parseObject(keys, val, options);
	};
	
	module.exports = function (str, opts) {
	    var options = opts || {};
	
	    if (options.decoder !== null && options.decoder !== undefined && typeof options.decoder !== 'function') {
	        throw new TypeError('Decoder has to be a function.');
	    }
	
	    options.delimiter = typeof options.delimiter === 'string' || utils.isRegExp(options.delimiter) ? options.delimiter : defaults.delimiter;
	    options.depth = typeof options.depth === 'number' ? options.depth : defaults.depth;
	    options.arrayLimit = typeof options.arrayLimit === 'number' ? options.arrayLimit : defaults.arrayLimit;
	    options.parseArrays = options.parseArrays !== false;
	    options.decoder = typeof options.decoder === 'function' ? options.decoder : defaults.decoder;
	    options.allowDots = typeof options.allowDots === 'boolean' ? options.allowDots : defaults.allowDots;
	    options.plainObjects = typeof options.plainObjects === 'boolean' ? options.plainObjects : defaults.plainObjects;
	    options.allowPrototypes = typeof options.allowPrototypes === 'boolean' ? options.allowPrototypes : defaults.allowPrototypes;
	    options.parameterLimit = typeof options.parameterLimit === 'number' ? options.parameterLimit : defaults.parameterLimit;
	    options.strictNullHandling = typeof options.strictNullHandling === 'boolean' ? options.strictNullHandling : defaults.strictNullHandling;
	
	    if (str === '' || str === null || typeof str === 'undefined') {
	        return options.plainObjects ? Object.create(null) : {};
	    }
	
	    var tempObj = typeof str === 'string' ? parseValues(str, options) : str;
	    var obj = options.plainObjects ? Object.create(null) : {};
	
	    // Iterate over the keys and setup the new object
	
	    var keys = Object.keys(tempObj);
	    for (var i = 0; i < keys.length; ++i) {
	        var key = keys[i];
	        var newObj = parseKeys(key, tempObj[key], options);
	        obj = utils.merge(obj, newObj, options);
	    }
	
	    return utils.compact(obj);
	};


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var utils = __webpack_require__(8);
	var formats = __webpack_require__(7);
	
	var arrayPrefixGenerators = {
	    brackets: function brackets(prefix) { // eslint-disable-line func-name-matching
	        return prefix + '[]';
	    },
	    indices: function indices(prefix, key) { // eslint-disable-line func-name-matching
	        return prefix + '[' + key + ']';
	    },
	    repeat: function repeat(prefix) { // eslint-disable-line func-name-matching
	        return prefix;
	    }
	};
	
	var toISO = Date.prototype.toISOString;
	
	var defaults = {
	    delimiter: '&',
	    encode: true,
	    encoder: utils.encode,
	    encodeValuesOnly: false,
	    serializeDate: function serializeDate(date) { // eslint-disable-line func-name-matching
	        return toISO.call(date);
	    },
	    skipNulls: false,
	    strictNullHandling: false
	};
	
	var stringify = function stringify( // eslint-disable-line func-name-matching
	    object,
	    prefix,
	    generateArrayPrefix,
	    strictNullHandling,
	    skipNulls,
	    encoder,
	    filter,
	    sort,
	    allowDots,
	    serializeDate,
	    formatter,
	    encodeValuesOnly
	) {
	    var obj = object;
	    if (typeof filter === 'function') {
	        obj = filter(prefix, obj);
	    } else if (obj instanceof Date) {
	        obj = serializeDate(obj);
	    } else if (obj === null) {
	        if (strictNullHandling) {
	            return encoder && !encodeValuesOnly ? encoder(prefix) : prefix;
	        }
	
	        obj = '';
	    }
	
	    if (typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean' || utils.isBuffer(obj)) {
	        if (encoder) {
	            var keyValue = encodeValuesOnly ? prefix : encoder(prefix);
	            return [formatter(keyValue) + '=' + formatter(encoder(obj))];
	        }
	        return [formatter(prefix) + '=' + formatter(String(obj))];
	    }
	
	    var values = [];
	
	    if (typeof obj === 'undefined') {
	        return values;
	    }
	
	    var objKeys;
	    if (Array.isArray(filter)) {
	        objKeys = filter;
	    } else {
	        var keys = Object.keys(obj);
	        objKeys = sort ? keys.sort(sort) : keys;
	    }
	
	    for (var i = 0; i < objKeys.length; ++i) {
	        var key = objKeys[i];
	
	        if (skipNulls && obj[key] === null) {
	            continue;
	        }
	
	        if (Array.isArray(obj)) {
	            values = values.concat(stringify(
	                obj[key],
	                generateArrayPrefix(prefix, key),
	                generateArrayPrefix,
	                strictNullHandling,
	                skipNulls,
	                encoder,
	                filter,
	                sort,
	                allowDots,
	                serializeDate,
	                formatter,
	                encodeValuesOnly
	            ));
	        } else {
	            values = values.concat(stringify(
	                obj[key],
	                prefix + (allowDots ? '.' + key : '[' + key + ']'),
	                generateArrayPrefix,
	                strictNullHandling,
	                skipNulls,
	                encoder,
	                filter,
	                sort,
	                allowDots,
	                serializeDate,
	                formatter,
	                encodeValuesOnly
	            ));
	        }
	    }
	
	    return values;
	};
	
	module.exports = function (object, opts) {
	    var obj = object;
	    var options = opts || {};
	
	    if (options.encoder !== null && options.encoder !== undefined && typeof options.encoder !== 'function') {
	        throw new TypeError('Encoder has to be a function.');
	    }
	
	    var delimiter = typeof options.delimiter === 'undefined' ? defaults.delimiter : options.delimiter;
	    var strictNullHandling = typeof options.strictNullHandling === 'boolean' ? options.strictNullHandling : defaults.strictNullHandling;
	    var skipNulls = typeof options.skipNulls === 'boolean' ? options.skipNulls : defaults.skipNulls;
	    var encode = typeof options.encode === 'boolean' ? options.encode : defaults.encode;
	    var encoder = typeof options.encoder === 'function' ? options.encoder : defaults.encoder;
	    var sort = typeof options.sort === 'function' ? options.sort : null;
	    var allowDots = typeof options.allowDots === 'undefined' ? false : options.allowDots;
	    var serializeDate = typeof options.serializeDate === 'function' ? options.serializeDate : defaults.serializeDate;
	    var encodeValuesOnly = typeof options.encodeValuesOnly === 'boolean' ? options.encodeValuesOnly : defaults.encodeValuesOnly;
	    if (typeof options.format === 'undefined') {
	        options.format = formats.default;
	    } else if (!Object.prototype.hasOwnProperty.call(formats.formatters, options.format)) {
	        throw new TypeError('Unknown format option provided.');
	    }
	    var formatter = formats.formatters[options.format];
	    var objKeys;
	    var filter;
	
	    if (typeof options.filter === 'function') {
	        filter = options.filter;
	        obj = filter('', obj);
	    } else if (Array.isArray(options.filter)) {
	        filter = options.filter;
	        objKeys = filter;
	    }
	
	    var keys = [];
	
	    if (typeof obj !== 'object' || obj === null) {
	        return '';
	    }
	
	    var arrayFormat;
	    if (options.arrayFormat in arrayPrefixGenerators) {
	        arrayFormat = options.arrayFormat;
	    } else if ('indices' in options) {
	        arrayFormat = options.indices ? 'indices' : 'repeat';
	    } else {
	        arrayFormat = 'indices';
	    }
	
	    var generateArrayPrefix = arrayPrefixGenerators[arrayFormat];
	
	    if (!objKeys) {
	        objKeys = Object.keys(obj);
	    }
	
	    if (sort) {
	        objKeys.sort(sort);
	    }
	
	    for (var i = 0; i < objKeys.length; ++i) {
	        var key = objKeys[i];
	
	        if (skipNulls && obj[key] === null) {
	            continue;
	        }
	
	        keys = keys.concat(stringify(
	            obj[key],
	            key,
	            generateArrayPrefix,
	            strictNullHandling,
	            skipNulls,
	            encode ? encoder : null,
	            filter,
	            sort,
	            allowDots,
	            serializeDate,
	            formatter,
	            encodeValuesOnly
	        ));
	    }
	
	    return keys.join(delimiter);
	};


/***/ },
/* 14 */
/***/ function(module, exports) {

	/**
	 * Check if `obj` is an object.
	 *
	 * @param {Object} obj
	 * @return {Boolean}
	 * @api private
	 */
	
	function isObject(obj) {
	  return null !== obj && 'object' === typeof obj;
	}
	
	module.exports = isObject;


/***/ },
/* 15 */
/***/ function(module, exports) {

	'use strict'
	
	exports.byteLength = byteLength
	exports.toByteArray = toByteArray
	exports.fromByteArray = fromByteArray
	
	var lookup = []
	var revLookup = []
	var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array
	
	var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
	for (var i = 0, len = code.length; i < len; ++i) {
	  lookup[i] = code[i]
	  revLookup[code.charCodeAt(i)] = i
	}
	
	revLookup['-'.charCodeAt(0)] = 62
	revLookup['_'.charCodeAt(0)] = 63
	
	function placeHoldersCount (b64) {
	  var len = b64.length
	  if (len % 4 > 0) {
	    throw new Error('Invalid string. Length must be a multiple of 4')
	  }
	
	  // the number of equal signs (place holders)
	  // if there are two placeholders, than the two characters before it
	  // represent one byte
	  // if there is only one, then the three characters before it represent 2 bytes
	  // this is just a cheap hack to not do indexOf twice
	  return b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0
	}
	
	function byteLength (b64) {
	  // base64 is 4/3 + up to two characters of the original data
	  return b64.length * 3 / 4 - placeHoldersCount(b64)
	}
	
	function toByteArray (b64) {
	  var i, j, l, tmp, placeHolders, arr
	  var len = b64.length
	  placeHolders = placeHoldersCount(b64)
	
	  arr = new Arr(len * 3 / 4 - placeHolders)
	
	  // if there are placeholders, only get up to the last complete 4 chars
	  l = placeHolders > 0 ? len - 4 : len
	
	  var L = 0
	
	  for (i = 0, j = 0; i < l; i += 4, j += 3) {
	    tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)]
	    arr[L++] = (tmp >> 16) & 0xFF
	    arr[L++] = (tmp >> 8) & 0xFF
	    arr[L++] = tmp & 0xFF
	  }
	
	  if (placeHolders === 2) {
	    tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4)
	    arr[L++] = tmp & 0xFF
	  } else if (placeHolders === 1) {
	    tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2)
	    arr[L++] = (tmp >> 8) & 0xFF
	    arr[L++] = tmp & 0xFF
	  }
	
	  return arr
	}
	
	function tripletToBase64 (num) {
	  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F]
	}
	
	function encodeChunk (uint8, start, end) {
	  var tmp
	  var output = []
	  for (var i = start; i < end; i += 3) {
	    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
	    output.push(tripletToBase64(tmp))
	  }
	  return output.join('')
	}
	
	function fromByteArray (uint8) {
	  var tmp
	  var len = uint8.length
	  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
	  var output = ''
	  var parts = []
	  var maxChunkLength = 16383 // must be multiple of 3
	
	  // go through the array every three bytes, we'll deal with trailing stuff later
	  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
	    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
	  }
	
	  // pad the end with zeros, but make sure to not forget the extra bytes
	  if (extraBytes === 1) {
	    tmp = uint8[len - 1]
	    output += lookup[tmp >> 2]
	    output += lookup[(tmp << 4) & 0x3F]
	    output += '=='
	  } else if (extraBytes === 2) {
	    tmp = (uint8[len - 2] << 8) + (uint8[len - 1])
	    output += lookup[tmp >> 10]
	    output += lookup[(tmp >> 4) & 0x3F]
	    output += lookup[(tmp << 2) & 0x3F]
	    output += '='
	  }
	
	  parts.push(output)
	
	  return parts.join('')
	}


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	var base64 = __webpack_require__(15);
	
	function padding(str) {
	  var mod = (str.length % 4);
	  var pad = 4 - mod;
	
	  if (mod === 0) {
	    return str;
	  }
	
	  return str + (new Array(1 + pad)).join('=');
	}
	
	function byteArrayToString(array) {
	  var result = "";
	  for (var i = 0; i < array.length; i++) {
	    result += String.fromCharCode(array[i]);
	  }
	  return result;
	}
	
	function stringToByteArray(str) {
	  var arr = new Array(str.length);
	  for (var a = 0; a < str.length; a++) {
	    arr[a] = str.charCodeAt(a);
	  }
	  return arr;
	}
	
	function byteArrayToHex(raw) {
	  var HEX = '';
	
	  for (var i = 0; i < raw.length; i++) {
	    var _hex = raw[i].toString(16);
	    HEX += (_hex.length === 2 ? _hex : '0' + _hex);
	  }
	
	  return HEX;
	}
	
	function encodeString(str) {
	  return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (match, p1) {
	    return String.fromCharCode('0x' + p1);
	  }))
	  .replace(/\+/g, '-') // Convert '+' to '-'
	  .replace(/\//g, '_'); // Convert '/' to '_';
	}
	
	function decodeToString(str) {
	  str = padding(str)
	    .replace(/\-/g, '+') // Convert '-' to '+'
	    .replace(/_/g, '/'); // Convert '_' to '/'
	
	  return decodeURIComponent(atob(str).split('').map(function (c) {
	    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
	  }).join(''));
	}
	
	function decodeToHEX(str) {
	  return byteArrayToHex(base64.toByteArray(padding(str)));
	}
	
	module.exports = {
	  encodeString: encodeString,
	  decodeToString: decodeToString,
	  byteArrayToString: byteArrayToString,
	  stringToByteArray: stringToByteArray,
	  padding: padding,
	  byteArrayToHex: byteArrayToHex,
	  decodeToHEX: decodeToHEX
	};


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Root reference for iframes.
	 */
	
	var root;
	if (typeof window !== 'undefined') { // Browser window
	  root = window;
	} else if (typeof self !== 'undefined') { // Web Worker
	  root = self;
	} else { // Other environments
	  console.warn("Using browser-only version of superagent in non-browser environment");
	  root = this;
	}
	
	var Emitter = __webpack_require__(23);
	var RequestBase = __webpack_require__(33);
	var isObject = __webpack_require__(14);
	var isFunction = __webpack_require__(32);
	var ResponseBase = __webpack_require__(34);
	var shouldRetry = __webpack_require__(35);
	
	/**
	 * Noop.
	 */
	
	function noop(){};
	
	/**
	 * Expose `request`.
	 */
	
	var request = exports = module.exports = function(method, url) {
	  // callback
	  if ('function' == typeof url) {
	    return new exports.Request('GET', method).end(url);
	  }
	
	  // url first
	  if (1 == arguments.length) {
	    return new exports.Request('GET', method);
	  }
	
	  return new exports.Request(method, url);
	}
	
	exports.Request = Request;
	
	/**
	 * Determine XHR.
	 */
	
	request.getXHR = function () {
	  if (root.XMLHttpRequest
	      && (!root.location || 'file:' != root.location.protocol
	          || !root.ActiveXObject)) {
	    return new XMLHttpRequest;
	  } else {
	    try { return new ActiveXObject('Microsoft.XMLHTTP'); } catch(e) {}
	    try { return new ActiveXObject('Msxml2.XMLHTTP.6.0'); } catch(e) {}
	    try { return new ActiveXObject('Msxml2.XMLHTTP.3.0'); } catch(e) {}
	    try { return new ActiveXObject('Msxml2.XMLHTTP'); } catch(e) {}
	  }
	  throw Error("Browser-only verison of superagent could not find XHR");
	};
	
	/**
	 * Removes leading and trailing whitespace, added to support IE.
	 *
	 * @param {String} s
	 * @return {String}
	 * @api private
	 */
	
	var trim = ''.trim
	  ? function(s) { return s.trim(); }
	  : function(s) { return s.replace(/(^\s*|\s*$)/g, ''); };
	
	/**
	 * Serialize the given `obj`.
	 *
	 * @param {Object} obj
	 * @return {String}
	 * @api private
	 */
	
	function serialize(obj) {
	  if (!isObject(obj)) return obj;
	  var pairs = [];
	  for (var key in obj) {
	    pushEncodedKeyValuePair(pairs, key, obj[key]);
	  }
	  return pairs.join('&');
	}
	
	/**
	 * Helps 'serialize' with serializing arrays.
	 * Mutates the pairs array.
	 *
	 * @param {Array} pairs
	 * @param {String} key
	 * @param {Mixed} val
	 */
	
	function pushEncodedKeyValuePair(pairs, key, val) {
	  if (val != null) {
	    if (Array.isArray(val)) {
	      val.forEach(function(v) {
	        pushEncodedKeyValuePair(pairs, key, v);
	      });
	    } else if (isObject(val)) {
	      for(var subkey in val) {
	        pushEncodedKeyValuePair(pairs, key + '[' + subkey + ']', val[subkey]);
	      }
	    } else {
	      pairs.push(encodeURIComponent(key)
	        + '=' + encodeURIComponent(val));
	    }
	  } else if (val === null) {
	    pairs.push(encodeURIComponent(key));
	  }
	}
	
	/**
	 * Expose serialization method.
	 */
	
	 request.serializeObject = serialize;
	
	 /**
	  * Parse the given x-www-form-urlencoded `str`.
	  *
	  * @param {String} str
	  * @return {Object}
	  * @api private
	  */
	
	function parseString(str) {
	  var obj = {};
	  var pairs = str.split('&');
	  var pair;
	  var pos;
	
	  for (var i = 0, len = pairs.length; i < len; ++i) {
	    pair = pairs[i];
	    pos = pair.indexOf('=');
	    if (pos == -1) {
	      obj[decodeURIComponent(pair)] = '';
	    } else {
	      obj[decodeURIComponent(pair.slice(0, pos))] =
	        decodeURIComponent(pair.slice(pos + 1));
	    }
	  }
	
	  return obj;
	}
	
	/**
	 * Expose parser.
	 */
	
	request.parseString = parseString;
	
	/**
	 * Default MIME type map.
	 *
	 *     superagent.types.xml = 'application/xml';
	 *
	 */
	
	request.types = {
	  html: 'text/html',
	  json: 'application/json',
	  xml: 'application/xml',
	  urlencoded: 'application/x-www-form-urlencoded',
	  'form': 'application/x-www-form-urlencoded',
	  'form-data': 'application/x-www-form-urlencoded'
	};
	
	/**
	 * Default serialization map.
	 *
	 *     superagent.serialize['application/xml'] = function(obj){
	 *       return 'generated xml here';
	 *     };
	 *
	 */
	
	 request.serialize = {
	   'application/x-www-form-urlencoded': serialize,
	   'application/json': JSON.stringify
	 };
	
	 /**
	  * Default parsers.
	  *
	  *     superagent.parse['application/xml'] = function(str){
	  *       return { object parsed from str };
	  *     };
	  *
	  */
	
	request.parse = {
	  'application/x-www-form-urlencoded': parseString,
	  'application/json': JSON.parse
	};
	
	/**
	 * Parse the given header `str` into
	 * an object containing the mapped fields.
	 *
	 * @param {String} str
	 * @return {Object}
	 * @api private
	 */
	
	function parseHeader(str) {
	  var lines = str.split(/\r?\n/);
	  var fields = {};
	  var index;
	  var line;
	  var field;
	  var val;
	
	  lines.pop(); // trailing CRLF
	
	  for (var i = 0, len = lines.length; i < len; ++i) {
	    line = lines[i];
	    index = line.indexOf(':');
	    field = line.slice(0, index).toLowerCase();
	    val = trim(line.slice(index + 1));
	    fields[field] = val;
	  }
	
	  return fields;
	}
	
	/**
	 * Check if `mime` is json or has +json structured syntax suffix.
	 *
	 * @param {String} mime
	 * @return {Boolean}
	 * @api private
	 */
	
	function isJSON(mime) {
	  return /[\/+]json\b/.test(mime);
	}
	
	/**
	 * Initialize a new `Response` with the given `xhr`.
	 *
	 *  - set flags (.ok, .error, etc)
	 *  - parse header
	 *
	 * Examples:
	 *
	 *  Aliasing `superagent` as `request` is nice:
	 *
	 *      request = superagent;
	 *
	 *  We can use the promise-like API, or pass callbacks:
	 *
	 *      request.get('/').end(function(res){});
	 *      request.get('/', function(res){});
	 *
	 *  Sending data can be chained:
	 *
	 *      request
	 *        .post('/user')
	 *        .send({ name: 'tj' })
	 *        .end(function(res){});
	 *
	 *  Or passed to `.send()`:
	 *
	 *      request
	 *        .post('/user')
	 *        .send({ name: 'tj' }, function(res){});
	 *
	 *  Or passed to `.post()`:
	 *
	 *      request
	 *        .post('/user', { name: 'tj' })
	 *        .end(function(res){});
	 *
	 * Or further reduced to a single call for simple cases:
	 *
	 *      request
	 *        .post('/user', { name: 'tj' }, function(res){});
	 *
	 * @param {XMLHTTPRequest} xhr
	 * @param {Object} options
	 * @api private
	 */
	
	function Response(req) {
	  this.req = req;
	  this.xhr = this.req.xhr;
	  // responseText is accessible only if responseType is '' or 'text' and on older browsers
	  this.text = ((this.req.method !='HEAD' && (this.xhr.responseType === '' || this.xhr.responseType === 'text')) || typeof this.xhr.responseType === 'undefined')
	     ? this.xhr.responseText
	     : null;
	  this.statusText = this.req.xhr.statusText;
	  var status = this.xhr.status;
	  // handle IE9 bug: http://stackoverflow.com/questions/10046972/msie-returns-status-code-of-1223-for-ajax-request
	  if (status === 1223) {
	      status = 204;
	  }
	  this._setStatusProperties(status);
	  this.header = this.headers = parseHeader(this.xhr.getAllResponseHeaders());
	  // getAllResponseHeaders sometimes falsely returns "" for CORS requests, but
	  // getResponseHeader still works. so we get content-type even if getting
	  // other headers fails.
	  this.header['content-type'] = this.xhr.getResponseHeader('content-type');
	  this._setHeaderProperties(this.header);
	
	  if (null === this.text && req._responseType) {
	    this.body = this.xhr.response;
	  } else {
	    this.body = this.req.method != 'HEAD'
	      ? this._parseBody(this.text ? this.text : this.xhr.response)
	      : null;
	  }
	}
	
	ResponseBase(Response.prototype);
	
	/**
	 * Parse the given body `str`.
	 *
	 * Used for auto-parsing of bodies. Parsers
	 * are defined on the `superagent.parse` object.
	 *
	 * @param {String} str
	 * @return {Mixed}
	 * @api private
	 */
	
	Response.prototype._parseBody = function(str){
	  var parse = request.parse[this.type];
	  if(this.req._parser) {
	    return this.req._parser(this, str);
	  }
	  if (!parse && isJSON(this.type)) {
	    parse = request.parse['application/json'];
	  }
	  return parse && str && (str.length || str instanceof Object)
	    ? parse(str)
	    : null;
	};
	
	/**
	 * Return an `Error` representative of this response.
	 *
	 * @return {Error}
	 * @api public
	 */
	
	Response.prototype.toError = function(){
	  var req = this.req;
	  var method = req.method;
	  var url = req.url;
	
	  var msg = 'cannot ' + method + ' ' + url + ' (' + this.status + ')';
	  var err = new Error(msg);
	  err.status = this.status;
	  err.method = method;
	  err.url = url;
	
	  return err;
	};
	
	/**
	 * Expose `Response`.
	 */
	
	request.Response = Response;
	
	/**
	 * Initialize a new `Request` with the given `method` and `url`.
	 *
	 * @param {String} method
	 * @param {String} url
	 * @api public
	 */
	
	function Request(method, url) {
	  var self = this;
	  this._query = this._query || [];
	  this.method = method;
	  this.url = url;
	  this.header = {}; // preserves header name case
	  this._header = {}; // coerces header names to lowercase
	  this.on('end', function(){
	    var err = null;
	    var res = null;
	
	    try {
	      res = new Response(self);
	    } catch(e) {
	      err = new Error('Parser is unable to parse the response');
	      err.parse = true;
	      err.original = e;
	      // issue #675: return the raw response if the response parsing fails
	      if (self.xhr) {
	        // ie9 doesn't have 'response' property
	        err.rawResponse = typeof self.xhr.responseType == 'undefined' ? self.xhr.responseText : self.xhr.response;
	        // issue #876: return the http status code if the response parsing fails
	        err.status = self.xhr.status ? self.xhr.status : null;
	        err.statusCode = err.status; // backwards-compat only
	      } else {
	        err.rawResponse = null;
	        err.status = null;
	      }
	
	      return self.callback(err);
	    }
	
	    self.emit('response', res);
	
	    var new_err;
	    try {
	      if (!self._isResponseOK(res)) {
	        new_err = new Error(res.statusText || 'Unsuccessful HTTP response');
	        new_err.original = err;
	        new_err.response = res;
	        new_err.status = res.status;
	      }
	    } catch(e) {
	      new_err = e; // #985 touching res may cause INVALID_STATE_ERR on old Android
	    }
	
	    // #1000 don't catch errors from the callback to avoid double calling it
	    if (new_err) {
	      self.callback(new_err, res);
	    } else {
	      self.callback(null, res);
	    }
	  });
	}
	
	/**
	 * Mixin `Emitter` and `RequestBase`.
	 */
	
	Emitter(Request.prototype);
	RequestBase(Request.prototype);
	
	/**
	 * Set Content-Type to `type`, mapping values from `request.types`.
	 *
	 * Examples:
	 *
	 *      superagent.types.xml = 'application/xml';
	 *
	 *      request.post('/')
	 *        .type('xml')
	 *        .send(xmlstring)
	 *        .end(callback);
	 *
	 *      request.post('/')
	 *        .type('application/xml')
	 *        .send(xmlstring)
	 *        .end(callback);
	 *
	 * @param {String} type
	 * @return {Request} for chaining
	 * @api public
	 */
	
	Request.prototype.type = function(type){
	  this.set('Content-Type', request.types[type] || type);
	  return this;
	};
	
	/**
	 * Set Accept to `type`, mapping values from `request.types`.
	 *
	 * Examples:
	 *
	 *      superagent.types.json = 'application/json';
	 *
	 *      request.get('/agent')
	 *        .accept('json')
	 *        .end(callback);
	 *
	 *      request.get('/agent')
	 *        .accept('application/json')
	 *        .end(callback);
	 *
	 * @param {String} accept
	 * @return {Request} for chaining
	 * @api public
	 */
	
	Request.prototype.accept = function(type){
	  this.set('Accept', request.types[type] || type);
	  return this;
	};
	
	/**
	 * Set Authorization field value with `user` and `pass`.
	 *
	 * @param {String} user
	 * @param {String} [pass] optional in case of using 'bearer' as type
	 * @param {Object} options with 'type' property 'auto', 'basic' or 'bearer' (default 'basic')
	 * @return {Request} for chaining
	 * @api public
	 */
	
	Request.prototype.auth = function(user, pass, options){
	  if (typeof pass === 'object' && pass !== null) { // pass is optional and can substitute for options
	    options = pass;
	  }
	  if (!options) {
	    options = {
	      type: 'function' === typeof btoa ? 'basic' : 'auto',
	    }
	  }
	
	  switch (options.type) {
	    case 'basic':
	      this.set('Authorization', 'Basic ' + btoa(user + ':' + pass));
	    break;
	
	    case 'auto':
	      this.username = user;
	      this.password = pass;
	    break;
	      
	    case 'bearer': // usage would be .auth(accessToken, { type: 'bearer' })
	      this.set('Authorization', 'Bearer ' + user);
	    break;  
	  }
	  return this;
	};
	
	/**
	 * Add query-string `val`.
	 *
	 * Examples:
	 *
	 *   request.get('/shoes')
	 *     .query('size=10')
	 *     .query({ color: 'blue' })
	 *
	 * @param {Object|String} val
	 * @return {Request} for chaining
	 * @api public
	 */
	
	Request.prototype.query = function(val){
	  if ('string' != typeof val) val = serialize(val);
	  if (val) this._query.push(val);
	  return this;
	};
	
	/**
	 * Queue the given `file` as an attachment to the specified `field`,
	 * with optional `options` (or filename).
	 *
	 * ``` js
	 * request.post('/upload')
	 *   .attach('content', new Blob(['<a id="a"><b id="b">hey!</b></a>'], { type: "text/html"}))
	 *   .end(callback);
	 * ```
	 *
	 * @param {String} field
	 * @param {Blob|File} file
	 * @param {String|Object} options
	 * @return {Request} for chaining
	 * @api public
	 */
	
	Request.prototype.attach = function(field, file, options){
	  if (file) {
	    if (this._data) {
	      throw Error("superagent can't mix .send() and .attach()");
	    }
	
	    this._getFormData().append(field, file, options || file.name);
	  }
	  return this;
	};
	
	Request.prototype._getFormData = function(){
	  if (!this._formData) {
	    this._formData = new root.FormData();
	  }
	  return this._formData;
	};
	
	/**
	 * Invoke the callback with `err` and `res`
	 * and handle arity check.
	 *
	 * @param {Error} err
	 * @param {Response} res
	 * @api private
	 */
	
	Request.prototype.callback = function(err, res){
	  // console.log(this._retries, this._maxRetries)
	  if (this._maxRetries && this._retries++ < this._maxRetries && shouldRetry(err, res)) {
	    return this._retry();
	  }
	
	  var fn = this._callback;
	  this.clearTimeout();
	
	  if (err) {
	    if (this._maxRetries) err.retries = this._retries - 1;
	    this.emit('error', err);
	  }
	
	  fn(err, res);
	};
	
	/**
	 * Invoke callback with x-domain error.
	 *
	 * @api private
	 */
	
	Request.prototype.crossDomainError = function(){
	  var err = new Error('Request has been terminated\nPossible causes: the network is offline, Origin is not allowed by Access-Control-Allow-Origin, the page is being unloaded, etc.');
	  err.crossDomain = true;
	
	  err.status = this.status;
	  err.method = this.method;
	  err.url = this.url;
	
	  this.callback(err);
	};
	
	// This only warns, because the request is still likely to work
	Request.prototype.buffer = Request.prototype.ca = Request.prototype.agent = function(){
	  console.warn("This is not supported in browser version of superagent");
	  return this;
	};
	
	// This throws, because it can't send/receive data as expected
	Request.prototype.pipe = Request.prototype.write = function(){
	  throw Error("Streaming is not supported in browser version of superagent");
	};
	
	/**
	 * Compose querystring to append to req.url
	 *
	 * @api private
	 */
	
	Request.prototype._appendQueryString = function(){
	  var query = this._query.join('&');
	  if (query) {
	    this.url += (this.url.indexOf('?') >= 0 ? '&' : '?') + query;
	  }
	
	  if (this._sort) {
	    var index = this.url.indexOf('?');
	    if (index >= 0) {
	      var queryArr = this.url.substring(index + 1).split('&');
	      if (isFunction(this._sort)) {
	        queryArr.sort(this._sort);
	      } else {
	        queryArr.sort();
	      }
	      this.url = this.url.substring(0, index) + '?' + queryArr.join('&');
	    }
	  }
	};
	
	/**
	 * Check if `obj` is a host object,
	 * we don't want to serialize these :)
	 *
	 * @param {Object} obj
	 * @return {Boolean}
	 * @api private
	 */
	Request.prototype._isHost = function _isHost(obj) {
	  // Native objects stringify to [object File], [object Blob], [object FormData], etc.
	  return obj && 'object' === typeof obj && !Array.isArray(obj) && Object.prototype.toString.call(obj) !== '[object Object]';
	}
	
	/**
	 * Initiate request, invoking callback `fn(res)`
	 * with an instanceof `Response`.
	 *
	 * @param {Function} fn
	 * @return {Request} for chaining
	 * @api public
	 */
	
	Request.prototype.end = function(fn){
	  if (this._endCalled) {
	    console.warn("Warning: .end() was called twice. This is not supported in superagent");
	  }
	  this._endCalled = true;
	
	  // store callback
	  this._callback = fn || noop;
	
	  // querystring
	  this._appendQueryString();
	
	  return this._end();
	};
	
	Request.prototype._end = function() {
	  var self = this;
	  var xhr = this.xhr = request.getXHR();
	  var data = this._formData || this._data;
	
	  this._setTimeouts();
	
	  // state change
	  xhr.onreadystatechange = function(){
	    var readyState = xhr.readyState;
	    if (readyState >= 2 && self._responseTimeoutTimer) {
	      clearTimeout(self._responseTimeoutTimer);
	    }
	    if (4 != readyState) {
	      return;
	    }
	
	    // In IE9, reads to any property (e.g. status) off of an aborted XHR will
	    // result in the error "Could not complete the operation due to error c00c023f"
	    var status;
	    try { status = xhr.status } catch(e) { status = 0; }
	
	    if (!status) {
	      if (self.timedout || self._aborted) return;
	      return self.crossDomainError();
	    }
	    self.emit('end');
	  };
	
	  // progress
	  var handleProgress = function(direction, e) {
	    if (e.total > 0) {
	      e.percent = e.loaded / e.total * 100;
	    }
	    e.direction = direction;
	    self.emit('progress', e);
	  }
	  if (this.hasListeners('progress')) {
	    try {
	      xhr.onprogress = handleProgress.bind(null, 'download');
	      if (xhr.upload) {
	        xhr.upload.onprogress = handleProgress.bind(null, 'upload');
	      }
	    } catch(e) {
	      // Accessing xhr.upload fails in IE from a web worker, so just pretend it doesn't exist.
	      // Reported here:
	      // https://connect.microsoft.com/IE/feedback/details/837245/xmlhttprequest-upload-throws-invalid-argument-when-used-from-web-worker-context
	    }
	  }
	
	  // initiate request
	  try {
	    if (this.username && this.password) {
	      xhr.open(this.method, this.url, true, this.username, this.password);
	    } else {
	      xhr.open(this.method, this.url, true);
	    }
	  } catch (err) {
	    // see #1149
	    return this.callback(err);
	  }
	
	  // CORS
	  if (this._withCredentials) xhr.withCredentials = true;
	
	  // body
	  if (!this._formData && 'GET' != this.method && 'HEAD' != this.method && 'string' != typeof data && !this._isHost(data)) {
	    // serialize stuff
	    var contentType = this._header['content-type'];
	    var serialize = this._serializer || request.serialize[contentType ? contentType.split(';')[0] : ''];
	    if (!serialize && isJSON(contentType)) {
	      serialize = request.serialize['application/json'];
	    }
	    if (serialize) data = serialize(data);
	  }
	
	  // set header fields
	  for (var field in this.header) {
	    if (null == this.header[field]) continue;
	    xhr.setRequestHeader(field, this.header[field]);
	  }
	
	  if (this._responseType) {
	    xhr.responseType = this._responseType;
	  }
	
	  // send stuff
	  this.emit('request', this);
	
	  // IE11 xhr.send(undefined) sends 'undefined' string as POST payload (instead of nothing)
	  // We need null here if data is undefined
	  xhr.send(typeof data !== 'undefined' ? data : null);
	  return this;
	};
	
	/**
	 * GET `url` with optional callback `fn(res)`.
	 *
	 * @param {String} url
	 * @param {Mixed|Function} [data] or fn
	 * @param {Function} [fn]
	 * @return {Request}
	 * @api public
	 */
	
	request.get = function(url, data, fn){
	  var req = request('GET', url);
	  if ('function' == typeof data) fn = data, data = null;
	  if (data) req.query(data);
	  if (fn) req.end(fn);
	  return req;
	};
	
	/**
	 * HEAD `url` with optional callback `fn(res)`.
	 *
	 * @param {String} url
	 * @param {Mixed|Function} [data] or fn
	 * @param {Function} [fn]
	 * @return {Request}
	 * @api public
	 */
	
	request.head = function(url, data, fn){
	  var req = request('HEAD', url);
	  if ('function' == typeof data) fn = data, data = null;
	  if (data) req.send(data);
	  if (fn) req.end(fn);
	  return req;
	};
	
	/**
	 * OPTIONS query to `url` with optional callback `fn(res)`.
	 *
	 * @param {String} url
	 * @param {Mixed|Function} [data] or fn
	 * @param {Function} [fn]
	 * @return {Request}
	 * @api public
	 */
	
	request.options = function(url, data, fn){
	  var req = request('OPTIONS', url);
	  if ('function' == typeof data) fn = data, data = null;
	  if (data) req.send(data);
	  if (fn) req.end(fn);
	  return req;
	};
	
	/**
	 * DELETE `url` with optional `data` and callback `fn(res)`.
	 *
	 * @param {String} url
	 * @param {Mixed} [data]
	 * @param {Function} [fn]
	 * @return {Request}
	 * @api public
	 */
	
	function del(url, data, fn){
	  var req = request('DELETE', url);
	  if ('function' == typeof data) fn = data, data = null;
	  if (data) req.send(data);
	  if (fn) req.end(fn);
	  return req;
	};
	
	request['del'] = del;
	request['delete'] = del;
	
	/**
	 * PATCH `url` with optional `data` and callback `fn(res)`.
	 *
	 * @param {String} url
	 * @param {Mixed} [data]
	 * @param {Function} [fn]
	 * @return {Request}
	 * @api public
	 */
	
	request.patch = function(url, data, fn){
	  var req = request('PATCH', url);
	  if ('function' == typeof data) fn = data, data = null;
	  if (data) req.send(data);
	  if (fn) req.end(fn);
	  return req;
	};
	
	/**
	 * POST `url` with optional `data` and callback `fn(res)`.
	 *
	 * @param {String} url
	 * @param {Mixed} [data]
	 * @param {Function} [fn]
	 * @return {Request}
	 * @api public
	 */
	
	request.post = function(url, data, fn){
	  var req = request('POST', url);
	  if ('function' == typeof data) fn = data, data = null;
	  if (data) req.send(data);
	  if (fn) req.end(fn);
	  return req;
	};
	
	/**
	 * PUT `url` with optional `data` and callback `fn(res)`.
	 *
	 * @param {String} url
	 * @param {Mixed|Function} [data] or fn
	 * @param {Function} [fn]
	 * @return {Request}
	 * @api public
	 */
	
	request.put = function(url, data, fn){
	  var req = request('PUT', url);
	  if ('function' == typeof data) fn = data, data = null;
	  if (data) req.send(data);
	  if (fn) req.end(fn);
	  return req;
	};


/***/ },
/* 18 */
/***/ function(module, exports) {

	var WinChan = (function() {
	  var RELAY_FRAME_NAME = "__winchan_relay_frame";
	  var CLOSE_CMD = "die";
	
	  // a portable addListener implementation
	  function addListener(w, event, cb) {
	    if(w.attachEvent) w.attachEvent('on' + event, cb);
	    else if (w.addEventListener) w.addEventListener(event, cb, false);
	  }
	
	  // a portable removeListener implementation
	  function removeListener(w, event, cb) {
	    if(w.detachEvent) w.detachEvent('on' + event, cb);
	    else if (w.removeEventListener) w.removeEventListener(event, cb, false);
	  }
	
	
	  // checking for IE8 or above
	  function isInternetExplorer() {
	    if (typeof navigator === 'undefined') {
	      return false;
	    }
	
	    var rv = -1; // Return value assumes failure.
	    var ua = navigator.userAgent;
	    if (navigator.appName === 'Microsoft Internet Explorer') {
	      var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
	      if (re.exec(ua) != null)
	        rv = parseFloat(RegExp.$1);
	    }
	    // IE > 11
	    else if (ua.indexOf("Trident") > -1) {
	      var re = new RegExp("rv:([0-9]{2,2}[\.0-9]{0,})");
	      if (re.exec(ua) !== null) {
	        rv = parseFloat(RegExp.$1);
	      }
	    }
	
	    return rv >= 8;
	  }
	
	  // checking Mobile Firefox (Fennec)
	  function isFennec() {
	    try {
	      // We must check for both XUL and Java versions of Fennec.  Both have
	      // distinct UA strings.
	      var userAgent = navigator.userAgent;
	      return (userAgent.indexOf('Fennec/') != -1) ||  // XUL
	             (userAgent.indexOf('Firefox/') != -1 && userAgent.indexOf('Android') != -1);   // Java
	    } catch(e) {}
	    return false;
	  }
	
	  // feature checking to see if this platform is supported at all
	  function isSupported() {
	    return (typeof window !== 'undefined' && window.JSON && window.JSON.stringify &&
	            window.JSON.parse && window.postMessage);
	  }
	
	  // given a URL, extract the origin. Taken from: https://github.com/firebase/firebase-simple-login/blob/d2cb95b9f812d8488bdbfba51c3a7c153ba1a074/js/src/simple-login/transports/WinChan.js#L25-L30
	  function extractOrigin(url) {
	    if (!/^https?:\/\//.test(url)) url = window.location.href;
	    var m = /^(https?:\/\/[\-_a-zA-Z\.0-9:]+)/.exec(url);
	    if (m) return m[1];
	    return url;
	  }
	
	  // find the relay iframe in the opener
	  function findRelay() {
	    var loc = window.location;
	    var frames = window.opener.frames;
	    for (var i = frames.length - 1; i >= 0; i--) {
	      try {
	        if (frames[i].location.protocol === window.location.protocol &&
	            frames[i].location.host === window.location.host &&
	            frames[i].name === RELAY_FRAME_NAME)
	        {
	          return frames[i];
	        }
	      } catch(e) { }
	    }
	    return;
	  }
	
	  var isIE = isInternetExplorer();
	
	  if (isSupported()) {
	    /*  General flow:
	     *                  0. user clicks
	     *  (IE SPECIFIC)   1. caller adds relay iframe (served from trusted domain) to DOM
	     *                  2. caller opens window (with content from trusted domain)
	     *                  3. window on opening adds a listener to 'message'
	     *  (IE SPECIFIC)   4. window on opening finds iframe
	     *                  5. window checks if iframe is "loaded" - has a 'doPost' function yet
	     *  (IE SPECIFIC5)  5a. if iframe.doPost exists, window uses it to send ready event to caller
	     *  (IE SPECIFIC5)  5b. if iframe.doPost doesn't exist, window waits for frame ready
	     *  (IE SPECIFIC5)  5bi. once ready, window calls iframe.doPost to send ready event
	     *                  6. caller upon reciept of 'ready', sends args
	     */
	    return {
	      open: function(opts, cb) {
	        if (!cb) throw "missing required callback argument";
	
	        // test required options
	        var err;
	        if (!opts.url) err = "missing required 'url' parameter";
	        if (!opts.relay_url) err = "missing required 'relay_url' parameter";
	        if (err) setTimeout(function() { cb(err); }, 0);
	
	        // supply default options
	        if (!opts.window_name) opts.window_name = null;
	        if (!opts.window_features || isFennec()) opts.window_features = undefined;
	
	        // opts.params may be undefined
	
	        var iframe;
	
	        // sanity check, are url and relay_url the same origin?
	        var origin = opts.origin || extractOrigin(opts.url);
	        if (origin !== extractOrigin(opts.relay_url)) {
	          return setTimeout(function() {
	            cb('invalid arguments: origin of url and relay_url must match');
	          }, 0);
	        }
	
	        var messageTarget;
	
	        if (isIE) {
	          // first we need to add a "relay" iframe to the document that's served
	          // from the target domain.  We can postmessage into a iframe, but not a
	          // window
	          iframe = document.createElement("iframe");
	          // iframe.setAttribute('name', framename);
	          iframe.setAttribute('src', opts.relay_url);
	          iframe.style.display = "none";
	          iframe.setAttribute('name', RELAY_FRAME_NAME);
	          document.body.appendChild(iframe);
	          messageTarget = iframe.contentWindow;
	        }
	
	        var w = opts.popup || window.open(opts.url, opts.window_name, opts.window_features);
	        if (opts.popup) {
	          w.location.href = opts.url;
	        }
	
	        if (!messageTarget) messageTarget = w;
	
	        // lets listen in case the window blows up before telling us
	        var closeInterval = setInterval(function() {
	          if (w && w.closed) {
	            cleanup();
	            if (cb) {
	              cb('User closed the popup window');
	              cb = null;
	            }
	          }
	        }, 500);
	
	        var req = JSON.stringify({a: 'request', d: opts.params});
	
	        // cleanup on unload
	        function cleanup() {
	          if (iframe) document.body.removeChild(iframe);
	          iframe = undefined;
	          if (closeInterval) closeInterval = clearInterval(closeInterval);
	          removeListener(window, 'message', onMessage);
	          removeListener(window, 'unload', cleanup);
	          if (w) {
	            try {
	              w.close();
	            } catch (securityViolation) {
	              // This happens in Opera 12 sometimes
	              // see https://github.com/mozilla/browserid/issues/1844
	              messageTarget.postMessage(CLOSE_CMD, origin);
	            }
	          }
	          w = messageTarget = undefined;
	        }
	
	        addListener(window, 'unload', cleanup);
	
	        function onMessage(e) {
	          if (e.origin !== origin) { return; }
	          try {
	            var d = JSON.parse(e.data);
	          } catch(err) {
	            if (cb) {
	              cb(err);
	            } else {
	              throw err;
	            }
	          }
	
	          if (d.a === 'ready') {
	            messageTarget.postMessage(req, origin);
	          } else if (d.a === 'error') {
	            cleanup();
	            if (cb) {
	              cb(d.d);
	              cb = null;
	            }
	          } else if (d.a === 'response') {
	            cleanup();
	            if (cb) {
	              cb(null, d.d);
	              cb = null;
	            }
	          }
	        }
	
	        addListener(window, 'message', onMessage);
	
	        return {
	          close: cleanup,
	          focus: function() {
	            if (w) {
	              try {
	                w.focus();
	              } catch (e) {
	                // IE7 blows up here, do nothing
	              }
	            }
	          }
	        };
	      },
	      onOpen: function(cb) {
	        var o = "*";
	        var msgTarget = isIE ? findRelay() : window.opener;
	        if (!msgTarget) throw "can't find relay frame";
	        function doPost(msg) {
	          msg = JSON.stringify(msg);
	          if (isIE) msgTarget.doPost(msg, o);
	          else msgTarget.postMessage(msg, o);
	        }
	
	        function onMessage(e) {
	          // only one message gets through, but let's make sure it's actually
	          // the message we're looking for (other code may be using
	          // postmessage) - we do this by ensuring the payload can
	          // be parsed, and it's got an 'a' (action) value of 'request'.
	          var d;
	          try {
	            d = JSON.parse(e.data);
	          } catch(err) { }
	          if (!d || d.a !== 'request') return;
	          removeListener(window, 'message', onMessage);
	          o = e.origin;
	          if (cb) {
	            // this setTimeout is critically important for IE8 -
	            // in ie8 sometimes addListener for 'message' can synchronously
	            // cause your callback to be invoked.  awesome.
	            setTimeout(function() {
	              cb(o, d.d, function(r) {
	                cb = undefined;
	                doPost({a: 'response', d: r});
	              });
	            }, 0);
	          }
	        }
	
	        function onDie(e) {
	          if (e.data === CLOSE_CMD) {
	            try { window.close(); } catch (o_O) {}
	          }
	        }
	        addListener(isIE ? msgTarget : window, 'message', onMessage);
	        addListener(isIE ? msgTarget : window, 'message', onDie);
	
	        // we cannot post to our parent that we're ready before the iframe
	        // is loaded. (IE specific possible failure)
	        try {
	          doPost({a: "ready"});
	        } catch(e) {
	          // this code should never be exectued outside IE
	          addListener(msgTarget, 'load', function(e) {
	            doPost({a: "ready"});
	          });
	        }
	
	        // if window is unloaded and the client hasn't called cb, it's an error
	        var onUnload = function() {
	          try {
	            // IE8 doesn't like this...
	            removeListener(isIE ? msgTarget : window, 'message', onDie);
	          } catch (ohWell) { }
	          if (cb) doPost({ a: 'error', d: 'client closed window' });
	          cb = undefined;
	          // explicitly close the window, in case the client is trying to reload or nav
	          try { window.close(); } catch (e) { }
	        };
	        addListener(window, 'unload', onUnload);
	        return {
	          detach: function() {
	            removeListener(window, 'unload', onUnload);
	          }
	        };
	      }
	    };
	  } else {
	    return {
	      open: function(url, winopts, arg, cb) {
	        setTimeout(function() { cb("unsupported browser"); }, 0);
	      },
	      onOpen: function(cb) {
	        setTimeout(function() { cb("unsupported browser"); }, 0);
	      }
	    };
	  }
	})();
	
	if (typeof module !== 'undefined' && module.exports) {
	  module.exports = WinChan;
	}


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	var urljoin = __webpack_require__(1);
	
	var RequestBuilder = __webpack_require__(10);
	var qs = __webpack_require__(5);
	var objectHelper = __webpack_require__(2);
	var assert = __webpack_require__(4);
	var responseHandler = __webpack_require__(6);
	var parametersWhitelist = __webpack_require__(45);
	var Warn = __webpack_require__(11);
	
	var PasswordlessAuthentication = __webpack_require__(41);
	var DBConnection = __webpack_require__(40);
	
	/**
	 * Creates a new Auth0 Authentication API client
	 * @constructor
	 * @param {Object} options
	 * @param {String} options.domain your Auth0 domain
	 * @param {String} options.clientID your Auth0 client identifier obtained when creating the client in the Auth0 Dashboard
	 * @param {String} [options.redirectUri] url that the Auth0 will redirect after Auth with the Authorization Response
	 * @param {String} [options.responseType] type of the response used by OAuth 2.0 flow. It can be any space separated list of the values `code`, `token`, `id_token`. {@link https://openid.net/specs/oauth-v2-multiple-response-types-1_0}
	 * @param {String} [options.responseMode] how the Auth response is encoded and redirected back to the client. Supported values are `query`, `fragment` and `form_post`. {@link https://openid.net/specs/oauth-v2-multiple-response-types-1_0.html#ResponseModes}
	 * @param {String} [options.scope] scopes to be requested during Auth. e.g. `openid email`
	 * @param {String} [options.audience] identifier of the resource server who will consume the access token issued after Auth
	 * @see {@link https://auth0.com/docs/api/authentication}
	 */
	function Authentication(options) {
	  /* eslint-disable */
	  assert.check(
	    options,
	    { type: 'object', message: 'options parameter is not valid' },
	    {
	      domain: { type: 'string', message: 'domain option is required' },
	      clientID: { type: 'string', message: 'clientID option is required' },
	      responseType: { optional: true, type: 'string', message: 'responseType is not valid' },
	      responseMode: { optional: true, type: 'string', message: 'responseMode is not valid' },
	      redirectUri: { optional: true, type: 'string', message: 'redirectUri is not valid' },
	      scope: { optional: true, type: 'string', message: 'scope is not valid' },
	      audience: { optional: true, type: 'string', message: 'audience is not valid' },
	      _disableDeprecationWarnings: {
	        optional: true,
	        type: 'boolean',
	        message: '_disableDeprecationWarnings option is not valid'
	      },
	      _sendTelemetry: {
	        optional: true,
	        type: 'boolean',
	        message: '_sendTelemetry option is not valid'
	      },
	      _telemetryInfo: {
	        optional: true,
	        type: 'object',
	        message: '_telemetryInfo option is not valid'
	      }
	    }
	  );
	  /* eslint-enable */
	
	  this.baseOptions = options;
	
	  this.baseOptions._sendTelemetry = this.baseOptions._sendTelemetry === false
	    ? this.baseOptions._sendTelemetry
	    : true;
	
	  this.baseOptions.rootUrl = 'https://' + this.baseOptions.domain;
	
	  this.request = new RequestBuilder(this.baseOptions);
	
	  this.passwordless = new PasswordlessAuthentication(this.request, this.baseOptions);
	  this.dbConnection = new DBConnection(this.request, this.baseOptions);
	
	  this.warn = new Warn({
	    disableWarnings: !!options._disableDeprecationWarnings
	  });
	}
	
	/**
	 * Builds and returns the `/authorize` url in order to initialize a new authN/authZ transaction
	 *
	 * @method buildAuthorizeUrl
	 * @param {Object} options
	 * @param {String} [options.domain] your Auth0 domain
	 * @param {String} [options.clientID] your Auth0 client identifier obtained when creating the client in the Auth0 Dashboard
	 * @param {String} options.redirectUri url that the Auth0 will redirect after Auth with the Authorization Response
	 * @param {String} options.responseType type of the response used by OAuth 2.0 flow. It can be any space separated list of the values `code`, `token`, `id_token`. {@link https://openid.net/specs/oauth-v2-multiple-response-types-1_0}
	 * @param {String} [options.responseMode] how the Auth response is encoded and redirected back to the client. Supported values are `query`, `fragment` and `form_post`. {@link https://openid.net/specs/oauth-v2-multiple-response-types-1_0.html#ResponseModes}
	 * @param {String} [options.state] value used to mitigate XSRF attacks. {@link https://auth0.com/docs/protocols/oauth2/oauth-state}
	 * @param {String} [options.nonce] value used to mitigate replay attacks when using Implicit Grant. {@link https://auth0.com/docs/api-auth/tutorials/nonce}
	 * @param {String} [options.scope] scopes to be requested during Auth. e.g. `openid email`
	 * @param {String} [options.audience] identifier of the resource server who will consume the access token issued after Auth
	 * @see {@link https://auth0.com/docs/api/authentication#authorize-client}
	 * @see {@link https://auth0.com/docs/api/authentication#social}
	 */
	Authentication.prototype.buildAuthorizeUrl = function(options) {
	  var params;
	  var qString;
	
	  assert.check(options, { type: 'object', message: 'options parameter is not valid' });
	
	  params = objectHelper
	    .merge(this.baseOptions, [
	      'clientID',
	      'responseType',
	      'responseMode',
	      'redirectUri',
	      'scope',
	      'audience'
	    ])
	    .with(options);
	
	  /* eslint-disable */
	  assert.check(
	    params,
	    { type: 'object', message: 'options parameter is not valid' },
	    {
	      clientID: { type: 'string', message: 'clientID option is required' },
	      redirectUri: { optional: true, type: 'string', message: 'redirectUri option is required' },
	      responseType: { type: 'string', message: 'responseType option is required' },
	      nonce: {
	        type: 'string',
	        message: 'nonce option is required',
	        condition: function(o) {
	          return o.responseType.indexOf('code') === -1 && o.responseType.indexOf('id_token') !== -1;
	        }
	      },
	      scope: { optional: true, type: 'string', message: 'scope option is required' },
	      audience: { optional: true, type: 'string', message: 'audience option is required' }
	    }
	  );
	  /* eslint-enable */
	
	  // eslint-disable-next-line
	  if (this.baseOptions._sendTelemetry) {
	    params.auth0Client = this.request.getTelemetryData();
	  }
	
	  if (params.connection_scope && assert.isArray(params.connection_scope)) {
	    params.connection_scope = params.connection_scope.join(',');
	  }
	
	  params = objectHelper.toSnakeCase(params, ['auth0Client']);
	  params = parametersWhitelist.oauthAuthorizeParams(this.warn, params);
	
	  qString = qs.stringify(params);
	
	  return urljoin(this.baseOptions.rootUrl, 'authorize', '?' + qString);
	};
	
	/**
	 * Builds and returns the Logout url in order to initialize a new authN/authZ transaction
	 *
	 * If you want to navigate the user to a specific URL after the logout, set that URL at the returnTo parameter. The URL should be included in any the appropriate Allowed Logout URLs list:
	 *
	 * - If the client_id parameter is included, the returnTo URL must be listed in the Allowed Logout URLs set at the client level (see Setting Allowed Logout URLs at the App Level).
	 * - If the client_id parameter is NOT included, the returnTo URL must be listed in the Allowed Logout URLs set at the account level (see Setting Allowed Logout URLs at the Account Level).
	 * @method buildLogoutUrl
	 * @param {Object} options
	 * @param {String} [options.clientID] identifier of your client
	 * @param {String} [options.returnTo] URL to be redirected after the logout
	 * @param {Boolean} [options.federated] tells Auth0 if it should logout the user also from the IdP.
	 * @see {@link https://auth0.com/docs/api/authentication#logout}
	 */
	Authentication.prototype.buildLogoutUrl = function(options) {
	  var params;
	  var qString;
	
	  assert.check(options, {
	    optional: true,
	    type: 'object',
	    message: 'options parameter is not valid'
	  });
	
	  params = objectHelper.merge(this.baseOptions, ['clientID']).with(options || {});
	
	  // eslint-disable-next-line
	  if (this.baseOptions._sendTelemetry) {
	    params.auth0Client = this.request.getTelemetryData();
	  }
	
	  params = objectHelper.toSnakeCase(params, ['auth0Client', 'returnTo']);
	
	  qString = qs.stringify(params);
	
	  return urljoin(this.baseOptions.rootUrl, 'v2', 'logout', '?' + qString);
	};
	
	/**
	 * @callback authorizeCallback
	 * @param {Error} [err] error returned by Auth0 with the reason of the Auth failure
	 * @param {Object} [result] result of the Auth request
	 * @param {String} [result.accessToken] token that allows access to the specified resource server (identified by the audience parameter or by default Auth0's /userinfo endpoint)
	 * @param {Number} [result.expiresIn] number of seconds until the access token expires
	 * @param {String} [result.idToken] token that identifies the user
	 * @param {String} [result.refreshToken] token that can be used to get new access tokens from Auth0. Note that not all clients can request them or the resource server might not allow them.
	 */
	
	/**
	 * @callback tokenCallback
	 * @param {Error} [err] error returned by Auth0 with the reason of the Auth failure
	 * @param {Object} [result] result of the Auth request
	 * @param {String} result.accessToken token that allows access to the specified resource server (identified by the audience parameter or by default Auth0's /userinfo endpoint)
	 * @param {Number} result.expiresIn number of seconds until the access token expires
	 * @param {String} [result.idToken] token that identifies the user
	 * @param {String} [result.refreshToken] token that can be used to get new access tokens from Auth0. Note that not all clients can request them or the resource server might not allow them.
	 */
	
	/**
	 * Makes a call to the `oauth/token` endpoint with `password` grant type to login to the default directory.
	 *
	 * @method loginWithDefaultDirectory
	 * @param {Object} options
	 * @param {String} options.username email or username of the user that will perform Auth
	 * @param {String} options.password the password of the user that will perform Auth
	 * @param {String} [options.scope] scopes to be requested during Auth. e.g. `openid email`
	 * @param {String} [options.audience] identifier of the resource server who will consume the access token issued after Auth
	 * @param {tokenCallback} cb function called with the result of the request
	 * @see   {@link https://auth0.com/docs/api-auth/grant/password}
	 */
	Authentication.prototype.loginWithDefaultDirectory = function(options, cb) {
	  assert.check(
	    options,
	    { type: 'object', message: 'options parameter is not valid' },
	    {
	      username: { type: 'string', message: 'username option is required' },
	      password: { type: 'string', message: 'password option is required' },
	      scope: { optional: true, type: 'string', message: 'scope option is required' },
	      audience: { optional: true, type: 'string', message: 'audience option is required' }
	    }
	  );
	
	  options.grantType = 'password';
	
	  return this.oauthToken(options, cb);
	};
	
	/**
	 * Makes a call to the `oauth/token` endpoint with `password-realm` grant type
	 *
	 * @method login
	 * @param {Object} options
	 * @param {String} options.username email or username of the user that will perform Auth
	 * @param {String} options.password the password of the user that will perform Auth
	 * @param {String} [options.scope] scopes to be requested during Auth. e.g. `openid email`
	 * @param {String} [options.audience] identifier of the resource server who will consume the access token issued after Auth
	 * @param {Object} options.realm the HRD domain or the connection name where the user belongs to. e.g. `Username-Password-Authentication`
	 * @param {tokenCallback} cb function called with the result of the request
	 * @see   {@link https://auth0.com/docs/api-auth/grant/password}
	 */
	Authentication.prototype.login = function(options, cb) {
	  assert.check(
	    options,
	    { type: 'object', message: 'options parameter is not valid' },
	    {
	      username: { type: 'string', message: 'username option is required' },
	      password: { type: 'string', message: 'password option is required' },
	      realm: { type: 'string', message: 'realm option is required' },
	      scope: { optional: true, type: 'string', message: 'scope option is required' },
	      audience: { optional: true, type: 'string', message: 'audience option is required' }
	    }
	  );
	
	  options.grantType = 'http://auth0.com/oauth/grant-type/password-realm';
	
	  return this.oauthToken(options, cb);
	};
	
	/**
	 * Makes a call to the `oauth/token` endpoint
	 *
	 * @method oauthToken
	 * @private
	 */
	Authentication.prototype.oauthToken = function(options, cb) {
	  var url;
	  var body;
	
	  assert.check(options, { type: 'object', message: 'options parameter is not valid' });
	  assert.check(cb, { type: 'function', message: 'cb parameter is not valid' });
	
	  url = urljoin(this.baseOptions.rootUrl, 'oauth', 'token');
	
	  body = objectHelper.merge(this.baseOptions, ['clientID', 'scope', 'audience']).with(options);
	
	  assert.check(
	    body,
	    { type: 'object', message: 'options parameter is not valid' },
	    {
	      clientID: { type: 'string', message: 'clientID option is required' },
	      grantType: { type: 'string', message: 'grantType option is required' },
	      scope: { optional: true, type: 'string', message: 'scope option is required' },
	      audience: { optional: true, type: 'string', message: 'audience option is required' }
	    }
	  );
	
	  body = objectHelper.toSnakeCase(body, ['auth0Client']);
	  body = parametersWhitelist.oauthTokenParams(this.warn, body);
	
	  body.grant_type = body.grant_type;
	
	  return this.request.post(url).send(body).end(responseHandler(cb));
	};
	
	/**
	 * Performs authentication calling `/oauth/ro` endpoint with username
	 * and password for a given connection name.
	 *
	 * This method is not compatible with API Auth so if you need to fetch API tokens with audience
	 * you should use {@link login} or {@link loginWithDefaultDirectory}.
	 *
	 * @method loginWithResourceOwner
	 * @param {Object} options
	 * @param {String} options.username email or username of the user that will perform Auth
	 * @param {String} options.password the password of the user that will perform Auth
	 * @param {Object} options.connection the connection name where the user belongs to. e.g. `Username-Password-Authentication`
	 * @param {String} [options.scope] scopes to be requested during Auth. e.g. `openid email`
	 * @param {String} [options.device] name of the device/browser where the Auth was requested
	 * @param {tokenCallback} cb function called with the result of the request
	 */
	Authentication.prototype.loginWithResourceOwner = function(options, cb) {
	  var url;
	  var body;
	
	  assert.check(
	    options,
	    { type: 'object', message: 'options parameter is not valid' },
	    {
	      username: { type: 'string', message: 'username option is required' },
	      password: { type: 'string', message: 'password option is required' },
	      connection: { type: 'string', message: 'connection option is required' },
	      scope: { optional: true, type: 'string', message: 'scope option is required' }
	    }
	  );
	  assert.check(cb, { type: 'function', message: 'cb parameter is not valid' });
	
	  url = urljoin(this.baseOptions.rootUrl, 'oauth', 'ro');
	
	  body = objectHelper
	    .merge(this.baseOptions, ['clientID', 'scope'])
	    .with(options, ['username', 'password', 'scope', 'connection', 'device']);
	
	  body = objectHelper.toSnakeCase(body, ['auth0Client']);
	
	  body.grant_type = body.grant_type || 'password';
	
	  return this.request.post(url).send(body).end(responseHandler(cb));
	};
	
	/**
	 * Makes a call to the `/ssodata` endpoint.
	 * We recommend to avoid using this method and rely on your tenant hosted login page and using prompt=none via {@link renewAuth} method.
	 *
	 * @method getSSOData
	 * @param {Boolean} withActiveDirectories tells Auth0 to return AD data
	 * @param {Function} cb
	 */
	Authentication.prototype.getSSOData = function(withActiveDirectories, cb) {
	  var url;
	  var params = '';
	
	  if (typeof withActiveDirectories === 'function') {
	    cb = withActiveDirectories;
	    withActiveDirectories = false;
	  }
	
	  assert.check(withActiveDirectories, {
	    type: 'boolean',
	    message: 'withActiveDirectories parameter is not valid'
	  });
	  assert.check(cb, { type: 'function', message: 'cb parameter is not valid' });
	
	  if (withActiveDirectories) {
	    params =
	      '?' +
	      qs.stringify({
	        ldaps: 1,
	        client_id: this.baseOptions.clientID
	      });
	  }
	
	  url = urljoin(this.baseOptions.rootUrl, 'user', 'ssodata', params);
	
	  return this.request.get(url, { noHeaders: true }).withCredentials().end(responseHandler(cb));
	};
	
	/**
	 * @callback userInfoCallback
	 * @param {Error} [err] error returned by Auth0
	 * @param {Object} [userInfo] user information
	 */
	
	/**
	 * Makes a call to the `/userinfo` endpoint and returns the user profile
	 *
	 * @method userInfo
	 * @param {String} accessToken token issued to a user after Auth
	 * @param {userInfoCallback} cb
	 * @see   {@link https://auth0.com/docs/api/authentication#get-user-info}
	 */
	Authentication.prototype.userInfo = function(accessToken, cb) {
	  var url;
	
	  assert.check(accessToken, { type: 'string', message: 'accessToken parameter is not valid' });
	  assert.check(cb, { type: 'function', message: 'cb parameter is not valid' });
	
	  url = urljoin(this.baseOptions.rootUrl, 'userinfo');
	
	  return this.request
	    .get(url)
	    .set('Authorization', 'Bearer ' + accessToken)
	    .end(responseHandler(cb, { ignoreCasing: true }));
	};
	
	/**
	 * @callback delegationCallback
	 * @param {Error} [err] error returned by Auth0 with the reason why the delegation failed
	 * @param {Object} [result] result of the delegation request. The payload depends on what ai type was used
	 */
	
	/**
	 * Makes a call to the `/delegation` endpoint with either an `id_token` or `refresh_token`
	 *
	 * @method delegation
	 * @param {Object} options
	 * @param {String} [options.clientID] client identifier
	 * @param {String} options.grantType  grant type used for delegation. The only valid value is `urn:ietf:params:oauth:grant-type:jwt-bearer`
	 * @param {String} [options.idToken] valid token of the user issued after Auth. If no `refresh_token` is provided this parameter is required
	 * @param {String} [options.refreshToken] valid refresh token of the user issued after Auth. If no `id_token` is provided this parameter is required
	 * @param {String} [options.target] the target client id of the delegation
	 * @param {String} [options.scope] either `openid` or `openid profile email`
	 * @param {String} [options.apiType] the api to be called
	 * @param {delegationCallback} cb
	 * @see   {@link https://auth0.com/docs/api/authentication#delegation}
	 */
	Authentication.prototype.delegation = function(options, cb) {
	  var url;
	  var body;
	
	  assert.check(
	    options,
	    { type: 'object', message: 'options parameter is not valid' },
	    {
	      grant_type: { type: 'string', message: 'grant_type option is required' }
	    }
	  );
	  assert.check(cb, { type: 'function', message: 'cb parameter is not valid' });
	
	  url = urljoin(this.baseOptions.rootUrl, 'delegation');
	
	  body = objectHelper.merge(this.baseOptions, ['clientID']).with(options);
	
	  body = objectHelper.toSnakeCase(body, ['auth0Client']);
	
	  return this.request.post(url).send(body).end(responseHandler(cb));
	};
	
	/**
	 * Fetches the user country based on the ip.
	 *
	 * @method getUserCountry
	 * @private
	 * @param {Function} cb
	 */
	Authentication.prototype.getUserCountry = function(cb) {
	  var url;
	
	  assert.check(cb, { type: 'function', message: 'cb parameter is not valid' });
	
	  url = urljoin(this.baseOptions.rootUrl, 'user', 'geoloc', 'country');
	
	  return this.request.get(url).end(responseHandler(cb));
	};
	
	module.exports = Authentication;


/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	var base64 = __webpack_require__(15);
	
	function padding(str) {
	  var mod = str.length % 4;
	  var pad = 4 - mod;
	
	  if (mod === 0) {
	    return str;
	  }
	
	  return str + new Array(1 + pad).join('=');
	}
	
	function stringToByteArray(str) {
	  var arr = new Array(str.length);
	  for (var a = 0; a < str.length; a++) {
	    arr[a] = str.charCodeAt(a);
	  }
	  return arr;
	}
	
	function byteArrayToString(array) {
	  var result = '';
	  for (var i = 0; i < array.length; i++) {
	    result += String.fromCharCode(array[i]);
	  }
	  return result;
	}
	
	function encode(str) {
	  return base64
	    .fromByteArray(stringToByteArray(str))
	    .replace(/\+/g, '-') // Convert '+' to '-'
	    .replace(/\//g, '_'); // Convert '/' to '_'
	}
	
	function decode(str) {
	  str = padding(str)
	    .replace(/-/g, '+') // Convert '-' to '+'
	    .replace(/_/g, '/'); // Convert '_' to '/'
	
	  return byteArrayToString(base64.toByteArray(str));
	}
	
	module.exports = {
	  encode: encode,
	  decode: decode
	};


/***/ },
/* 21 */
/***/ function(module, exports) {

	function buildResponse(error, description) {
	  return {
	    error: error,
	    errorDescription: description
	  };
	}
	
	function invalidJwt(description) {
	  return buildResponse('invalid_token', description);
	}
	
	module.exports = {
	  buildResponse: buildResponse,
	  invalidJwt: invalidJwt
	};


/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	var random = __webpack_require__(48);
	var storage = __webpack_require__(49);
	
	var DEFAULT_NAMESPACE = 'com.auth0.auth.';
	
	function TransactionManager(options) {
	  options = options || {};
	  this.namespace = options.namespace || DEFAULT_NAMESPACE;
	  this.keyLength = options.keyLength || 32;
	}
	
	TransactionManager.prototype.process = function(options) {
	  var transaction;
	
	  if (options.responseType.indexOf('code') !== -1) {
	    return options;
	  }
	
	  if (options.responseType.indexOf('id_token') !== -1 && !!options.nonce) {
	    return options;
	  }
	
	  transaction = this.generateTransaction(options.appState, options.state, options.nonce);
	
	  options.state = transaction.state;
	
	  if (options.responseType.indexOf('id_token') !== -1) {
	    options.nonce = transaction.nonce;
	  }
	
	  return options;
	};
	
	TransactionManager.prototype.generateTransaction = function(appState, state, nonce) {
	  var transaction = state || random.randomString(this.keyLength);
	  nonce = nonce || random.randomString(this.keyLength);
	
	  storage.setItem(this.namespace + transaction, {
	    nonce: nonce,
	    appState: appState
	  });
	
	  return {
	    state: transaction,
	    nonce: nonce
	  };
	};
	
	TransactionManager.prototype.getStoredTransaction = function(transaction) {
	  var transactionData;
	
	  transactionData = storage.getItem(this.namespace + transaction);
	  storage.removeItem(this.namespace + transaction);
	  return transactionData;
	};
	
	module.exports = TransactionManager;


/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	
	/**
	 * Expose `Emitter`.
	 */
	
	if (true) {
	  module.exports = Emitter;
	}
	
	/**
	 * Initialize a new `Emitter`.
	 *
	 * @api public
	 */
	
	function Emitter(obj) {
	  if (obj) return mixin(obj);
	};
	
	/**
	 * Mixin the emitter properties.
	 *
	 * @param {Object} obj
	 * @return {Object}
	 * @api private
	 */
	
	function mixin(obj) {
	  for (var key in Emitter.prototype) {
	    obj[key] = Emitter.prototype[key];
	  }
	  return obj;
	}
	
	/**
	 * Listen on the given `event` with `fn`.
	 *
	 * @param {String} event
	 * @param {Function} fn
	 * @return {Emitter}
	 * @api public
	 */
	
	Emitter.prototype.on =
	Emitter.prototype.addEventListener = function(event, fn){
	  this._callbacks = this._callbacks || {};
	  (this._callbacks['$' + event] = this._callbacks['$' + event] || [])
	    .push(fn);
	  return this;
	};
	
	/**
	 * Adds an `event` listener that will be invoked a single
	 * time then automatically removed.
	 *
	 * @param {String} event
	 * @param {Function} fn
	 * @return {Emitter}
	 * @api public
	 */
	
	Emitter.prototype.once = function(event, fn){
	  function on() {
	    this.off(event, on);
	    fn.apply(this, arguments);
	  }
	
	  on.fn = fn;
	  this.on(event, on);
	  return this;
	};
	
	/**
	 * Remove the given callback for `event` or all
	 * registered callbacks.
	 *
	 * @param {String} event
	 * @param {Function} fn
	 * @return {Emitter}
	 * @api public
	 */
	
	Emitter.prototype.off =
	Emitter.prototype.removeListener =
	Emitter.prototype.removeAllListeners =
	Emitter.prototype.removeEventListener = function(event, fn){
	  this._callbacks = this._callbacks || {};
	
	  // all
	  if (0 == arguments.length) {
	    this._callbacks = {};
	    return this;
	  }
	
	  // specific event
	  var callbacks = this._callbacks['$' + event];
	  if (!callbacks) return this;
	
	  // remove all handlers
	  if (1 == arguments.length) {
	    delete this._callbacks['$' + event];
	    return this;
	  }
	
	  // remove specific handler
	  var cb;
	  for (var i = 0; i < callbacks.length; i++) {
	    cb = callbacks[i];
	    if (cb === fn || cb.fn === fn) {
	      callbacks.splice(i, 1);
	      break;
	    }
	  }
	  return this;
	};
	
	/**
	 * Emit `event` with the given args.
	 *
	 * @param {String} event
	 * @param {Mixed} ...
	 * @return {Emitter}
	 */
	
	Emitter.prototype.emit = function(event){
	  this._callbacks = this._callbacks || {};
	  var args = [].slice.call(arguments, 1)
	    , callbacks = this._callbacks['$' + event];
	
	  if (callbacks) {
	    callbacks = callbacks.slice(0);
	    for (var i = 0, len = callbacks.length; i < len; ++i) {
	      callbacks[i].apply(this, args);
	    }
	  }
	
	  return this;
	};
	
	/**
	 * Return array of callbacks for `event`.
	 *
	 * @param {String} event
	 * @return {Array}
	 * @api public
	 */
	
	Emitter.prototype.listeners = function(event){
	  this._callbacks = this._callbacks || {};
	  return this._callbacks['$' + event] || [];
	};
	
	/**
	 * Check if this emitter has `event` handlers.
	 *
	 * @param {String} event
	 * @return {Boolean}
	 * @api public
	 */
	
	Emitter.prototype.hasListeners = function(event){
	  return !! this.listeners(event).length;
	};


/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	;(function (root, factory) {
		if (true) {
			// CommonJS
			module.exports = exports = factory();
		}
		else if (typeof define === "function" && define.amd) {
			// AMD
			define([], factory);
		}
		else {
			// Global (browser)
			root.CryptoJS = factory();
		}
	}(this, function () {
	
		/**
		 * CryptoJS core components.
		 */
		var CryptoJS = CryptoJS || (function (Math, undefined) {
		    /*
		     * Local polyfil of Object.create
		     */
		    var create = Object.create || (function () {
		        function F() {};
	
		        return function (obj) {
		            var subtype;
	
		            F.prototype = obj;
	
		            subtype = new F();
	
		            F.prototype = null;
	
		            return subtype;
		        };
		    }())
	
		    /**
		     * CryptoJS namespace.
		     */
		    var C = {};
	
		    /**
		     * Library namespace.
		     */
		    var C_lib = C.lib = {};
	
		    /**
		     * Base object for prototypal inheritance.
		     */
		    var Base = C_lib.Base = (function () {
	
	
		        return {
		            /**
		             * Creates a new object that inherits from this object.
		             *
		             * @param {Object} overrides Properties to copy into the new object.
		             *
		             * @return {Object} The new object.
		             *
		             * @static
		             *
		             * @example
		             *
		             *     var MyType = CryptoJS.lib.Base.extend({
		             *         field: 'value',
		             *
		             *         method: function () {
		             *         }
		             *     });
		             */
		            extend: function (overrides) {
		                // Spawn
		                var subtype = create(this);
	
		                // Augment
		                if (overrides) {
		                    subtype.mixIn(overrides);
		                }
	
		                // Create default initializer
		                if (!subtype.hasOwnProperty('init') || this.init === subtype.init) {
		                    subtype.init = function () {
		                        subtype.$super.init.apply(this, arguments);
		                    };
		                }
	
		                // Initializer's prototype is the subtype object
		                subtype.init.prototype = subtype;
	
		                // Reference supertype
		                subtype.$super = this;
	
		                return subtype;
		            },
	
		            /**
		             * Extends this object and runs the init method.
		             * Arguments to create() will be passed to init().
		             *
		             * @return {Object} The new object.
		             *
		             * @static
		             *
		             * @example
		             *
		             *     var instance = MyType.create();
		             */
		            create: function () {
		                var instance = this.extend();
		                instance.init.apply(instance, arguments);
	
		                return instance;
		            },
	
		            /**
		             * Initializes a newly created object.
		             * Override this method to add some logic when your objects are created.
		             *
		             * @example
		             *
		             *     var MyType = CryptoJS.lib.Base.extend({
		             *         init: function () {
		             *             // ...
		             *         }
		             *     });
		             */
		            init: function () {
		            },
	
		            /**
		             * Copies properties into this object.
		             *
		             * @param {Object} properties The properties to mix in.
		             *
		             * @example
		             *
		             *     MyType.mixIn({
		             *         field: 'value'
		             *     });
		             */
		            mixIn: function (properties) {
		                for (var propertyName in properties) {
		                    if (properties.hasOwnProperty(propertyName)) {
		                        this[propertyName] = properties[propertyName];
		                    }
		                }
	
		                // IE won't copy toString using the loop above
		                if (properties.hasOwnProperty('toString')) {
		                    this.toString = properties.toString;
		                }
		            },
	
		            /**
		             * Creates a copy of this object.
		             *
		             * @return {Object} The clone.
		             *
		             * @example
		             *
		             *     var clone = instance.clone();
		             */
		            clone: function () {
		                return this.init.prototype.extend(this);
		            }
		        };
		    }());
	
		    /**
		     * An array of 32-bit words.
		     *
		     * @property {Array} words The array of 32-bit words.
		     * @property {number} sigBytes The number of significant bytes in this word array.
		     */
		    var WordArray = C_lib.WordArray = Base.extend({
		        /**
		         * Initializes a newly created word array.
		         *
		         * @param {Array} words (Optional) An array of 32-bit words.
		         * @param {number} sigBytes (Optional) The number of significant bytes in the words.
		         *
		         * @example
		         *
		         *     var wordArray = CryptoJS.lib.WordArray.create();
		         *     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607]);
		         *     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607], 6);
		         */
		        init: function (words, sigBytes) {
		            words = this.words = words || [];
	
		            if (sigBytes != undefined) {
		                this.sigBytes = sigBytes;
		            } else {
		                this.sigBytes = words.length * 4;
		            }
		        },
	
		        /**
		         * Converts this word array to a string.
		         *
		         * @param {Encoder} encoder (Optional) The encoding strategy to use. Default: CryptoJS.enc.Hex
		         *
		         * @return {string} The stringified word array.
		         *
		         * @example
		         *
		         *     var string = wordArray + '';
		         *     var string = wordArray.toString();
		         *     var string = wordArray.toString(CryptoJS.enc.Utf8);
		         */
		        toString: function (encoder) {
		            return (encoder || Hex).stringify(this);
		        },
	
		        /**
		         * Concatenates a word array to this word array.
		         *
		         * @param {WordArray} wordArray The word array to append.
		         *
		         * @return {WordArray} This word array.
		         *
		         * @example
		         *
		         *     wordArray1.concat(wordArray2);
		         */
		        concat: function (wordArray) {
		            // Shortcuts
		            var thisWords = this.words;
		            var thatWords = wordArray.words;
		            var thisSigBytes = this.sigBytes;
		            var thatSigBytes = wordArray.sigBytes;
	
		            // Clamp excess bits
		            this.clamp();
	
		            // Concat
		            if (thisSigBytes % 4) {
		                // Copy one byte at a time
		                for (var i = 0; i < thatSigBytes; i++) {
		                    var thatByte = (thatWords[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
		                    thisWords[(thisSigBytes + i) >>> 2] |= thatByte << (24 - ((thisSigBytes + i) % 4) * 8);
		                }
		            } else {
		                // Copy one word at a time
		                for (var i = 0; i < thatSigBytes; i += 4) {
		                    thisWords[(thisSigBytes + i) >>> 2] = thatWords[i >>> 2];
		                }
		            }
		            this.sigBytes += thatSigBytes;
	
		            // Chainable
		            return this;
		        },
	
		        /**
		         * Removes insignificant bits.
		         *
		         * @example
		         *
		         *     wordArray.clamp();
		         */
		        clamp: function () {
		            // Shortcuts
		            var words = this.words;
		            var sigBytes = this.sigBytes;
	
		            // Clamp
		            words[sigBytes >>> 2] &= 0xffffffff << (32 - (sigBytes % 4) * 8);
		            words.length = Math.ceil(sigBytes / 4);
		        },
	
		        /**
		         * Creates a copy of this word array.
		         *
		         * @return {WordArray} The clone.
		         *
		         * @example
		         *
		         *     var clone = wordArray.clone();
		         */
		        clone: function () {
		            var clone = Base.clone.call(this);
		            clone.words = this.words.slice(0);
	
		            return clone;
		        },
	
		        /**
		         * Creates a word array filled with random bytes.
		         *
		         * @param {number} nBytes The number of random bytes to generate.
		         *
		         * @return {WordArray} The random word array.
		         *
		         * @static
		         *
		         * @example
		         *
		         *     var wordArray = CryptoJS.lib.WordArray.random(16);
		         */
		        random: function (nBytes) {
		            var words = [];
	
		            var r = (function (m_w) {
		                var m_w = m_w;
		                var m_z = 0x3ade68b1;
		                var mask = 0xffffffff;
	
		                return function () {
		                    m_z = (0x9069 * (m_z & 0xFFFF) + (m_z >> 0x10)) & mask;
		                    m_w = (0x4650 * (m_w & 0xFFFF) + (m_w >> 0x10)) & mask;
		                    var result = ((m_z << 0x10) + m_w) & mask;
		                    result /= 0x100000000;
		                    result += 0.5;
		                    return result * (Math.random() > .5 ? 1 : -1);
		                }
		            });
	
		            for (var i = 0, rcache; i < nBytes; i += 4) {
		                var _r = r((rcache || Math.random()) * 0x100000000);
	
		                rcache = _r() * 0x3ade67b7;
		                words.push((_r() * 0x100000000) | 0);
		            }
	
		            return new WordArray.init(words, nBytes);
		        }
		    });
	
		    /**
		     * Encoder namespace.
		     */
		    var C_enc = C.enc = {};
	
		    /**
		     * Hex encoding strategy.
		     */
		    var Hex = C_enc.Hex = {
		        /**
		         * Converts a word array to a hex string.
		         *
		         * @param {WordArray} wordArray The word array.
		         *
		         * @return {string} The hex string.
		         *
		         * @static
		         *
		         * @example
		         *
		         *     var hexString = CryptoJS.enc.Hex.stringify(wordArray);
		         */
		        stringify: function (wordArray) {
		            // Shortcuts
		            var words = wordArray.words;
		            var sigBytes = wordArray.sigBytes;
	
		            // Convert
		            var hexChars = [];
		            for (var i = 0; i < sigBytes; i++) {
		                var bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
		                hexChars.push((bite >>> 4).toString(16));
		                hexChars.push((bite & 0x0f).toString(16));
		            }
	
		            return hexChars.join('');
		        },
	
		        /**
		         * Converts a hex string to a word array.
		         *
		         * @param {string} hexStr The hex string.
		         *
		         * @return {WordArray} The word array.
		         *
		         * @static
		         *
		         * @example
		         *
		         *     var wordArray = CryptoJS.enc.Hex.parse(hexString);
		         */
		        parse: function (hexStr) {
		            // Shortcut
		            var hexStrLength = hexStr.length;
	
		            // Convert
		            var words = [];
		            for (var i = 0; i < hexStrLength; i += 2) {
		                words[i >>> 3] |= parseInt(hexStr.substr(i, 2), 16) << (24 - (i % 8) * 4);
		            }
	
		            return new WordArray.init(words, hexStrLength / 2);
		        }
		    };
	
		    /**
		     * Latin1 encoding strategy.
		     */
		    var Latin1 = C_enc.Latin1 = {
		        /**
		         * Converts a word array to a Latin1 string.
		         *
		         * @param {WordArray} wordArray The word array.
		         *
		         * @return {string} The Latin1 string.
		         *
		         * @static
		         *
		         * @example
		         *
		         *     var latin1String = CryptoJS.enc.Latin1.stringify(wordArray);
		         */
		        stringify: function (wordArray) {
		            // Shortcuts
		            var words = wordArray.words;
		            var sigBytes = wordArray.sigBytes;
	
		            // Convert
		            var latin1Chars = [];
		            for (var i = 0; i < sigBytes; i++) {
		                var bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
		                latin1Chars.push(String.fromCharCode(bite));
		            }
	
		            return latin1Chars.join('');
		        },
	
		        /**
		         * Converts a Latin1 string to a word array.
		         *
		         * @param {string} latin1Str The Latin1 string.
		         *
		         * @return {WordArray} The word array.
		         *
		         * @static
		         *
		         * @example
		         *
		         *     var wordArray = CryptoJS.enc.Latin1.parse(latin1String);
		         */
		        parse: function (latin1Str) {
		            // Shortcut
		            var latin1StrLength = latin1Str.length;
	
		            // Convert
		            var words = [];
		            for (var i = 0; i < latin1StrLength; i++) {
		                words[i >>> 2] |= (latin1Str.charCodeAt(i) & 0xff) << (24 - (i % 4) * 8);
		            }
	
		            return new WordArray.init(words, latin1StrLength);
		        }
		    };
	
		    /**
		     * UTF-8 encoding strategy.
		     */
		    var Utf8 = C_enc.Utf8 = {
		        /**
		         * Converts a word array to a UTF-8 string.
		         *
		         * @param {WordArray} wordArray The word array.
		         *
		         * @return {string} The UTF-8 string.
		         *
		         * @static
		         *
		         * @example
		         *
		         *     var utf8String = CryptoJS.enc.Utf8.stringify(wordArray);
		         */
		        stringify: function (wordArray) {
		            try {
		                return decodeURIComponent(escape(Latin1.stringify(wordArray)));
		            } catch (e) {
		                throw new Error('Malformed UTF-8 data');
		            }
		        },
	
		        /**
		         * Converts a UTF-8 string to a word array.
		         *
		         * @param {string} utf8Str The UTF-8 string.
		         *
		         * @return {WordArray} The word array.
		         *
		         * @static
		         *
		         * @example
		         *
		         *     var wordArray = CryptoJS.enc.Utf8.parse(utf8String);
		         */
		        parse: function (utf8Str) {
		            return Latin1.parse(unescape(encodeURIComponent(utf8Str)));
		        }
		    };
	
		    /**
		     * Abstract buffered block algorithm template.
		     *
		     * The property blockSize must be implemented in a concrete subtype.
		     *
		     * @property {number} _minBufferSize The number of blocks that should be kept unprocessed in the buffer. Default: 0
		     */
		    var BufferedBlockAlgorithm = C_lib.BufferedBlockAlgorithm = Base.extend({
		        /**
		         * Resets this block algorithm's data buffer to its initial state.
		         *
		         * @example
		         *
		         *     bufferedBlockAlgorithm.reset();
		         */
		        reset: function () {
		            // Initial values
		            this._data = new WordArray.init();
		            this._nDataBytes = 0;
		        },
	
		        /**
		         * Adds new data to this block algorithm's buffer.
		         *
		         * @param {WordArray|string} data The data to append. Strings are converted to a WordArray using UTF-8.
		         *
		         * @example
		         *
		         *     bufferedBlockAlgorithm._append('data');
		         *     bufferedBlockAlgorithm._append(wordArray);
		         */
		        _append: function (data) {
		            // Convert string to WordArray, else assume WordArray already
		            if (typeof data == 'string') {
		                data = Utf8.parse(data);
		            }
	
		            // Append
		            this._data.concat(data);
		            this._nDataBytes += data.sigBytes;
		        },
	
		        /**
		         * Processes available data blocks.
		         *
		         * This method invokes _doProcessBlock(offset), which must be implemented by a concrete subtype.
		         *
		         * @param {boolean} doFlush Whether all blocks and partial blocks should be processed.
		         *
		         * @return {WordArray} The processed data.
		         *
		         * @example
		         *
		         *     var processedData = bufferedBlockAlgorithm._process();
		         *     var processedData = bufferedBlockAlgorithm._process(!!'flush');
		         */
		        _process: function (doFlush) {
		            // Shortcuts
		            var data = this._data;
		            var dataWords = data.words;
		            var dataSigBytes = data.sigBytes;
		            var blockSize = this.blockSize;
		            var blockSizeBytes = blockSize * 4;
	
		            // Count blocks ready
		            var nBlocksReady = dataSigBytes / blockSizeBytes;
		            if (doFlush) {
		                // Round up to include partial blocks
		                nBlocksReady = Math.ceil(nBlocksReady);
		            } else {
		                // Round down to include only full blocks,
		                // less the number of blocks that must remain in the buffer
		                nBlocksReady = Math.max((nBlocksReady | 0) - this._minBufferSize, 0);
		            }
	
		            // Count words ready
		            var nWordsReady = nBlocksReady * blockSize;
	
		            // Count bytes ready
		            var nBytesReady = Math.min(nWordsReady * 4, dataSigBytes);
	
		            // Process blocks
		            if (nWordsReady) {
		                for (var offset = 0; offset < nWordsReady; offset += blockSize) {
		                    // Perform concrete-algorithm logic
		                    this._doProcessBlock(dataWords, offset);
		                }
	
		                // Remove processed words
		                var processedWords = dataWords.splice(0, nWordsReady);
		                data.sigBytes -= nBytesReady;
		            }
	
		            // Return processed words
		            return new WordArray.init(processedWords, nBytesReady);
		        },
	
		        /**
		         * Creates a copy of this object.
		         *
		         * @return {Object} The clone.
		         *
		         * @example
		         *
		         *     var clone = bufferedBlockAlgorithm.clone();
		         */
		        clone: function () {
		            var clone = Base.clone.call(this);
		            clone._data = this._data.clone();
	
		            return clone;
		        },
	
		        _minBufferSize: 0
		    });
	
		    /**
		     * Abstract hasher template.
		     *
		     * @property {number} blockSize The number of 32-bit words this hasher operates on. Default: 16 (512 bits)
		     */
		    var Hasher = C_lib.Hasher = BufferedBlockAlgorithm.extend({
		        /**
		         * Configuration options.
		         */
		        cfg: Base.extend(),
	
		        /**
		         * Initializes a newly created hasher.
		         *
		         * @param {Object} cfg (Optional) The configuration options to use for this hash computation.
		         *
		         * @example
		         *
		         *     var hasher = CryptoJS.algo.SHA256.create();
		         */
		        init: function (cfg) {
		            // Apply config defaults
		            this.cfg = this.cfg.extend(cfg);
	
		            // Set initial values
		            this.reset();
		        },
	
		        /**
		         * Resets this hasher to its initial state.
		         *
		         * @example
		         *
		         *     hasher.reset();
		         */
		        reset: function () {
		            // Reset data buffer
		            BufferedBlockAlgorithm.reset.call(this);
	
		            // Perform concrete-hasher logic
		            this._doReset();
		        },
	
		        /**
		         * Updates this hasher with a message.
		         *
		         * @param {WordArray|string} messageUpdate The message to append.
		         *
		         * @return {Hasher} This hasher.
		         *
		         * @example
		         *
		         *     hasher.update('message');
		         *     hasher.update(wordArray);
		         */
		        update: function (messageUpdate) {
		            // Append
		            this._append(messageUpdate);
	
		            // Update the hash
		            this._process();
	
		            // Chainable
		            return this;
		        },
	
		        /**
		         * Finalizes the hash computation.
		         * Note that the finalize operation is effectively a destructive, read-once operation.
		         *
		         * @param {WordArray|string} messageUpdate (Optional) A final message update.
		         *
		         * @return {WordArray} The hash.
		         *
		         * @example
		         *
		         *     var hash = hasher.finalize();
		         *     var hash = hasher.finalize('message');
		         *     var hash = hasher.finalize(wordArray);
		         */
		        finalize: function (messageUpdate) {
		            // Final message update
		            if (messageUpdate) {
		                this._append(messageUpdate);
		            }
	
		            // Perform concrete-hasher logic
		            var hash = this._doFinalize();
	
		            return hash;
		        },
	
		        blockSize: 512/32,
	
		        /**
		         * Creates a shortcut function to a hasher's object interface.
		         *
		         * @param {Hasher} hasher The hasher to create a helper for.
		         *
		         * @return {Function} The shortcut function.
		         *
		         * @static
		         *
		         * @example
		         *
		         *     var SHA256 = CryptoJS.lib.Hasher._createHelper(CryptoJS.algo.SHA256);
		         */
		        _createHelper: function (hasher) {
		            return function (message, cfg) {
		                return new hasher.init(cfg).finalize(message);
		            };
		        },
	
		        /**
		         * Creates a shortcut function to the HMAC's object interface.
		         *
		         * @param {Hasher} hasher The hasher to use in this HMAC helper.
		         *
		         * @return {Function} The shortcut function.
		         *
		         * @static
		         *
		         * @example
		         *
		         *     var HmacSHA256 = CryptoJS.lib.Hasher._createHmacHelper(CryptoJS.algo.SHA256);
		         */
		        _createHmacHelper: function (hasher) {
		            return function (message, key) {
		                return new C_algo.HMAC.init(hasher, key).finalize(message);
		            };
		        }
		    });
	
		    /**
		     * Algorithm namespace.
		     */
		    var C_algo = C.algo = {};
	
		    return C;
		}(Math));
	
	
		return CryptoJS;
	
	}));

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	;(function (root, factory) {
		if (true) {
			// CommonJS
			module.exports = exports = factory(__webpack_require__(24));
		}
		else if (typeof define === "function" && define.amd) {
			// AMD
			define(["./core"], factory);
		}
		else {
			// Global (browser)
			factory(root.CryptoJS);
		}
	}(this, function (CryptoJS) {
	
		(function (Math) {
		    // Shortcuts
		    var C = CryptoJS;
		    var C_lib = C.lib;
		    var WordArray = C_lib.WordArray;
		    var Hasher = C_lib.Hasher;
		    var C_algo = C.algo;
	
		    // Initialization and round constants tables
		    var H = [];
		    var K = [];
	
		    // Compute constants
		    (function () {
		        function isPrime(n) {
		            var sqrtN = Math.sqrt(n);
		            for (var factor = 2; factor <= sqrtN; factor++) {
		                if (!(n % factor)) {
		                    return false;
		                }
		            }
	
		            return true;
		        }
	
		        function getFractionalBits(n) {
		            return ((n - (n | 0)) * 0x100000000) | 0;
		        }
	
		        var n = 2;
		        var nPrime = 0;
		        while (nPrime < 64) {
		            if (isPrime(n)) {
		                if (nPrime < 8) {
		                    H[nPrime] = getFractionalBits(Math.pow(n, 1 / 2));
		                }
		                K[nPrime] = getFractionalBits(Math.pow(n, 1 / 3));
	
		                nPrime++;
		            }
	
		            n++;
		        }
		    }());
	
		    // Reusable object
		    var W = [];
	
		    /**
		     * SHA-256 hash algorithm.
		     */
		    var SHA256 = C_algo.SHA256 = Hasher.extend({
		        _doReset: function () {
		            this._hash = new WordArray.init(H.slice(0));
		        },
	
		        _doProcessBlock: function (M, offset) {
		            // Shortcut
		            var H = this._hash.words;
	
		            // Working variables
		            var a = H[0];
		            var b = H[1];
		            var c = H[2];
		            var d = H[3];
		            var e = H[4];
		            var f = H[5];
		            var g = H[6];
		            var h = H[7];
	
		            // Computation
		            for (var i = 0; i < 64; i++) {
		                if (i < 16) {
		                    W[i] = M[offset + i] | 0;
		                } else {
		                    var gamma0x = W[i - 15];
		                    var gamma0  = ((gamma0x << 25) | (gamma0x >>> 7))  ^
		                                  ((gamma0x << 14) | (gamma0x >>> 18)) ^
		                                   (gamma0x >>> 3);
	
		                    var gamma1x = W[i - 2];
		                    var gamma1  = ((gamma1x << 15) | (gamma1x >>> 17)) ^
		                                  ((gamma1x << 13) | (gamma1x >>> 19)) ^
		                                   (gamma1x >>> 10);
	
		                    W[i] = gamma0 + W[i - 7] + gamma1 + W[i - 16];
		                }
	
		                var ch  = (e & f) ^ (~e & g);
		                var maj = (a & b) ^ (a & c) ^ (b & c);
	
		                var sigma0 = ((a << 30) | (a >>> 2)) ^ ((a << 19) | (a >>> 13)) ^ ((a << 10) | (a >>> 22));
		                var sigma1 = ((e << 26) | (e >>> 6)) ^ ((e << 21) | (e >>> 11)) ^ ((e << 7)  | (e >>> 25));
	
		                var t1 = h + sigma1 + ch + K[i] + W[i];
		                var t2 = sigma0 + maj;
	
		                h = g;
		                g = f;
		                f = e;
		                e = (d + t1) | 0;
		                d = c;
		                c = b;
		                b = a;
		                a = (t1 + t2) | 0;
		            }
	
		            // Intermediate hash value
		            H[0] = (H[0] + a) | 0;
		            H[1] = (H[1] + b) | 0;
		            H[2] = (H[2] + c) | 0;
		            H[3] = (H[3] + d) | 0;
		            H[4] = (H[4] + e) | 0;
		            H[5] = (H[5] + f) | 0;
		            H[6] = (H[6] + g) | 0;
		            H[7] = (H[7] + h) | 0;
		        },
	
		        _doFinalize: function () {
		            // Shortcuts
		            var data = this._data;
		            var dataWords = data.words;
	
		            var nBitsTotal = this._nDataBytes * 8;
		            var nBitsLeft = data.sigBytes * 8;
	
		            // Add padding
		            dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);
		            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 14] = Math.floor(nBitsTotal / 0x100000000);
		            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 15] = nBitsTotal;
		            data.sigBytes = dataWords.length * 4;
	
		            // Hash final blocks
		            this._process();
	
		            // Return final computed hash
		            return this._hash;
		        },
	
		        clone: function () {
		            var clone = Hasher.clone.call(this);
		            clone._hash = this._hash.clone();
	
		            return clone;
		        }
		    });
	
		    /**
		     * Shortcut function to the hasher's object interface.
		     *
		     * @param {WordArray|string} message The message to hash.
		     *
		     * @return {WordArray} The hash.
		     *
		     * @static
		     *
		     * @example
		     *
		     *     var hash = CryptoJS.SHA256('message');
		     *     var hash = CryptoJS.SHA256(wordArray);
		     */
		    C.SHA256 = Hasher._createHelper(SHA256);
	
		    /**
		     * Shortcut function to the HMAC's object interface.
		     *
		     * @param {WordArray|string} message The message to hash.
		     * @param {WordArray|string} key The secret key.
		     *
		     * @return {WordArray} The HMAC.
		     *
		     * @static
		     *
		     * @example
		     *
		     *     var hmac = CryptoJS.HmacSHA256(message, key);
		     */
		    C.HmacSHA256 = Hasher._createHmacHelper(SHA256);
		}(Math));
	
	
		return CryptoJS.SHA256;
	
	}));

/***/ },
/* 26 */
/***/ function(module, exports) {

	function DummyCache() {}
	
	DummyCache.prototype.get = function () {
	  return null;
	};
	
	DummyCache.prototype.has = function () {
	  return false;
	};
	
	DummyCache.prototype.set = function () {
	};
	
	module.exports = DummyCache;


/***/ },
/* 27 */
/***/ function(module, exports) {

	function ConfigurationError(message) {
	  this.name = 'ConfigurationError';
	  this.message = (message || '');
	}
	ConfigurationError.prototype = Error.prototype;
	
	function TokenValidationError(message) {
	  this.name = 'TokenValidationError';
	  this.message = (message || '');
	}
	TokenValidationError.prototype = Error.prototype;
	
	module.exports = {
	  ConfigurationError: ConfigurationError,
	  TokenValidationError: TokenValidationError
	};


/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	var urljoin = __webpack_require__(1);
	var base64 = __webpack_require__(16);
	var request = __webpack_require__(17);
	
	function process(jwks) {
	  var modulus = base64.decodeToHEX(jwks.n);
	  var exp = base64.decodeToHEX(jwks.e);
	
	  return {
	    modulus: modulus,
	    exp: exp
	  };
	}
	
	function getJWKS(options, cb) {
	  var url = urljoin(options.iss, '.well-known', 'jwks.json');
	
	  return request
	    .get(url)
	    .end(function (err, data) {
	      var matchingKey = null;
	      var a;
	      var key;
	
	      if (err) {
	        cb(err);
	      }
	
	      // eslint-disable-next-line no-plusplus
	      for (a = 0; a < data.body.keys.length && matchingKey === null; a++) {
	        key = data.body.keys[a];
	        if (key.kid === options.kid) {
	          matchingKey = key;
	        }
	      }
	
	      cb(null, process(matchingKey));
	    });
	}
	
	module.exports = {
	  process: process,
	  getJWKS: getJWKS
	};


/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	/*
	Based on the work of Tom Wu
	http://www-cs-students.stanford.edu/~tjw/jsbn/
	http://www-cs-students.stanford.edu/~tjw/jsbn/LICENSE
	*/
	
	var BigInteger = __webpack_require__(31).BigInteger;
	var SHA256 = __webpack_require__(25);
	
	var DigestInfoHead = {
	  sha1: '3021300906052b0e03021a05000414',
	  sha224: '302d300d06096086480165030402040500041c',
	  sha256: '3031300d060960864801650304020105000420',
	  sha384: '3041300d060960864801650304020205000430',
	  sha512: '3051300d060960864801650304020305000440',
	  md2: '3020300c06082a864886f70d020205000410',
	  md5: '3020300c06082a864886f70d020505000410',
	  ripemd160: '3021300906052b2403020105000414'
	};
	
	var DigestAlgs = {
	  sha256: SHA256
	};
	
	function RSAVerifier(modulus, exp) {
	  this.n = null;
	  this.e = 0;
	
	  if (modulus != null && exp != null && modulus.length > 0 && exp.length > 0) {
	    this.n = new BigInteger(modulus, 16);
	    this.e = parseInt(exp, 16);
	  } else {
	    throw new Error('Invalid key data');
	  }
	}
	
	function getAlgorithmFromDigest(hDigestInfo) {
	  for (var algName in DigestInfoHead) {
	    var head = DigestInfoHead[algName];
	    var len = head.length;
	
	    if (hDigestInfo.substring(0, len) === head) {
	      return {
	        alg: algName,
	        hash: hDigestInfo.substring(len)
	      };
	    }
	  }
	  return [];
	}
	
	
	RSAVerifier.prototype.verify = function (msg, encsig) {
	  encsig = encsig.replace(/[^0-9a-f]|[\s\n]]/ig, '');
	
	  var sig = new BigInteger(encsig, 16);
	  if (sig.bitLength() > this.n.bitLength()) {
	    throw new Error('Signature does not match with the key modulus.');
	  }
	
	  var decryptedSig = sig.modPowInt(this.e, this.n);
	  var digest = decryptedSig.toString(16).replace(/^1f+00/, '');
	
	  var digestInfo = getAlgorithmFromDigest(digest);
	  if (digestInfo.length === 0) {
	    return false;
	  }
	
	  if (!DigestAlgs.hasOwnProperty(digestInfo.alg)) {
	    throw new Error('Hashing algorithm is not supported.');
	  }
	
	  var msgHash = DigestAlgs[digestInfo.alg](msg).toString();
	  return (digestInfo.hash === msgHash);
	};
	
	module.exports = RSAVerifier;


/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	var RSAVerifier = __webpack_require__(29);
	var base64 = __webpack_require__(16);
	var jwks = __webpack_require__(28);
	var error = __webpack_require__(27);
	var DummyCache = __webpack_require__(26);
	var supportedAlgs = ['RS256'];
	
	/**
	 * Creates a new id_token verifier
	 * @constructor
	 * @param {Object} parameters
	 * @param {String} parameters.issuer name of the issuer of the token
	 * that should match the `iss` claim in the id_token
	 * @param {String} parameters.audience identifies the recipients that the JWT is intended for
	 * and should match the `aud` claim
	 * @param {Object} [parameters.jwksCache] cache for JSON Web Token Keys. By default it has no cache
	 * @param {String} [parameters.expectedAlg='RS256'] algorithm in which the id_token was signed
	 * and will be used to validate
	 * @param {number} [parameters.leeway=0] number of seconds that the clock can be out of sync
	 * while validating expiration of the id_token
	 */
	function IdTokenVerifier(parameters) {
	  var options = parameters || {};
	
	  this.jwksCache = options.jwksCache || new DummyCache();
	  this.expectedAlg = options.expectedAlg || 'RS256';
	  this.issuer = options.issuer;
	  this.audience = options.audience;
	  this.leeway = options.leeway || 0;
	  this.__disableExpirationCheck = options.__disableExpirationCheck || false;
	
	  if (this.leeway < 0 || this.leeway > 60) {
	    throw new error.ConfigurationError('The leeway should be positive and lower than a minute.');
	  }
	
	  if (supportedAlgs.indexOf(this.expectedAlg) === -1) {
	    throw new error.ConfigurationError('Algorithm ' + this.expectedAlg +
	      ' is not supported. (Expected algs: [' + supportedAlgs.join(',') + '])');
	  }
	}
	
	/**
	 * @callback verifyCallback
	 * @param {Error} [err] error returned if the verify cannot be performed
	 * @param {boolean} [status] if the token is valid or not
	 */
	
	/**
	 * Verifies an id_token
	 *
	 * It will validate:
	 * - signature according to the algorithm configured in the verifier.
	 * - if nonce is present and matches the one provided
	 * - if `iss` and `aud` claims matches the configured issuer and audience
	 * - if token is not expired and valid (if the `nbf` claim is in the past)
	 *
	 * @method verify
	 * @param {String} token id_token to verify
	 * @param {String} [nonce] nonce value that should match the one in the id_token claims
	 * @param {verifyCallback} cb callback used to notify the results of the validation
	 */
	IdTokenVerifier.prototype.verify = function (token, nonce, cb) {
	  var jwt = this.decode(token);
	
	  if (jwt instanceof Error) {
	    return cb(jwt, false);
	  }
	
	  /* eslint-disable vars-on-top */
	  var headAndPayload = jwt.encoded.header + '.' + jwt.encoded.payload;
	  var signature = base64.decodeToHEX(jwt.encoded.signature);
	
	  var alg = jwt.header.alg;
	  var kid = jwt.header.kid;
	
	  var aud = jwt.payload.aud;
	  var iss = jwt.payload.iss;
	  var exp = jwt.payload.exp;
	  var nbf = jwt.payload.nbf;
	  var tnonce = jwt.payload.nonce || null;
	  /* eslint-enable vars-on-top */
	
	  if (this.issuer !== iss) {
	    return cb(new error.TokenValidationError('Issuer ' + iss + ' is not valid.'), false);
	  }
	
	  if (this.audience !== aud) {
	    return cb(new error.TokenValidationError('Audience ' + aud + ' is not valid.'), false);
	  }
	
	  if (this.expectedAlg !== alg) {
	    return cb(new error.TokenValidationError('Algorithm ' + alg +
	      ' is not supported. (Expected algs: [' + supportedAlgs.join(',') + '])'), false);
	  }
	
	  if (tnonce !== nonce) {
	    return cb(new error.TokenValidationError('Nonce does not match.'), false);
	  }
	
	  var expirationError = this.verifyExpAndNbf(exp, nbf); // eslint-disable-line vars-on-top
	
	  if (expirationError) {
	    return cb(expirationError, false);
	  }
	
	  return this.getRsaVerifier(iss, kid, function (err, rsaVerifier) {
	    if (err) {
	      return cb(err);
	    }
	    if (rsaVerifier.verify(headAndPayload, signature)) {
	      return cb(null, jwt.payload);
	    }
	    return cb(new error.TokenValidationError('Invalid signature.'));
	  });
	};
	
	/**
	 * Verifies that the `exp` and `nbf` claims are valid in the current moment.
	 *
	 * @method verifyExpAndNbf
	 * @param {String} exp value of `exp` claim
	 * @param {String} nbf value of `nbf` claim
	 * @return {boolean} if token is valid according to `exp` and `nbf`
	 */
	IdTokenVerifier.prototype.verifyExpAndNbf = function (exp, nbf) {
	  var now = new Date();
	  var expDate = new Date(0);
	  var nbfDate = new Date(0);
	
	  if (this.__disableExpirationCheck) {
	    return null;
	  }
	
	  expDate.setUTCSeconds(exp + this.leeway);
	
	  if (now > expDate) {
	    return new error.TokenValidationError('Expired token.');
	  }
	
	  if (typeof nbf === 'undefined') {
	    return null;
	  }
	  nbfDate.setUTCSeconds(nbf - this.leeway);
	  if (now < nbfDate) {
	    return new error.TokenValidationError('The token is not valid until later in the future. ' +
	      'Please check your computed clock.');
	  }
	
	  return null;
	};
	
	/**
	 * Verifies that the `exp` and `iat` claims are valid in the current moment.
	 *
	 * @method verifyExpAndIat
	 * @param {String} exp value of `exp` claim
	 * @param {String} iat value of `iat` claim
	 * @return {boolean} if token is valid according to `exp` and `iat`
	 */
	IdTokenVerifier.prototype.verifyExpAndIat = function (exp, iat) {
	  var now = new Date();
	  var expDate = new Date(0);
	  var iatDate = new Date(0);
	
	  if (this.__disableExpirationCheck) {
	    return null;
	  }
	
	  expDate.setUTCSeconds(exp + this.leeway);
	
	  if (now > expDate) {
	    return new error.TokenValidationError('Expired token.');
	  }
	
	  iatDate.setUTCSeconds(iat - this.leeway);
	
	  if (now < iatDate) {
	    return new error.TokenValidationError('The token was issued in the future. ' +
	      'Please check your computed clock.');
	  }
	  return null;
	};
	
	IdTokenVerifier.prototype.getRsaVerifier = function (iss, kid, cb) {
	  var _this = this;
	  var cachekey = iss + kid;
	
	  if (!this.jwksCache.has(cachekey)) {
	    jwks.getJWKS({
	      iss: iss,
	      kid: kid
	    }, function (err, keyInfo) {
	      if (err) {
	        cb(err);
	      }
	      _this.jwksCache.set(cachekey, keyInfo);
	      cb(null, new RSAVerifier(keyInfo.modulus, keyInfo.exp));
	    });
	  } else {
	    var keyInfo = this.jwksCache.get(cachekey); // eslint-disable-line vars-on-top
	    cb(null, new RSAVerifier(keyInfo.modulus, keyInfo.exp));
	  }
	};
	
	
	/**
	 * @typedef DecodedToken
	 * @type {Object}
	 * @property {Object} header - content of the JWT header.
	 * @property {Object} payload - token claims.
	 * @property {Object} encoded - encoded parts of the token.
	 */
	
	/**
	 * Decodes a well formed JWT without any verification
	 *
	 * @method decode
	 * @param {String} token decodes the token
	 * @return {DecodedToken} if token is valid according to `exp` and `nbf`
	 */
	IdTokenVerifier.prototype.decode = function (token) {
	  var parts = token.split('.');
	  var header;
	  var payload;
	
	  if (parts.length !== 3) {
	    return new error.TokenValidationError('Cannot decode a malformed JWT');
	  }
	
	  try {
	    header = JSON.parse(base64.decodeToString(parts[0]));
	    payload = JSON.parse(base64.decodeToString(parts[1]));
	  } catch (e) {
	    return new error.TokenValidationError('Token header or payload is not valid JSON');
	  }
	
	  return {
	    header: header,
	    payload: payload,
	    encoded: {
	      header: parts[0],
	      payload: parts[1],
	      signature: parts[2]
	    }
	  };
	};
	
	module.exports = IdTokenVerifier;


/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	(function(){
	
	    // Copyright (c) 2005  Tom Wu
	    // All Rights Reserved.
	    // See "LICENSE" for details.
	
	    // Basic JavaScript BN library - subset useful for RSA encryption.
	
	    // Bits per digit
	    var dbits;
	
	    // JavaScript engine analysis
	    var canary = 0xdeadbeefcafe;
	    var j_lm = ((canary&0xffffff)==0xefcafe);
	
	    // (public) Constructor
	    function BigInteger(a,b,c) {
	      if(a != null)
	        if("number" == typeof a) this.fromNumber(a,b,c);
	        else if(b == null && "string" != typeof a) this.fromString(a,256);
	        else this.fromString(a,b);
	    }
	
	    // return new, unset BigInteger
	    function nbi() { return new BigInteger(null); }
	
	    // am: Compute w_j += (x*this_i), propagate carries,
	    // c is initial carry, returns final carry.
	    // c < 3*dvalue, x < 2*dvalue, this_i < dvalue
	    // We need to select the fastest one that works in this environment.
	
	    // am1: use a single mult and divide to get the high bits,
	    // max digit bits should be 26 because
	    // max internal value = 2*dvalue^2-2*dvalue (< 2^53)
	    function am1(i,x,w,j,c,n) {
	      while(--n >= 0) {
	        var v = x*this[i++]+w[j]+c;
	        c = Math.floor(v/0x4000000);
	        w[j++] = v&0x3ffffff;
	      }
	      return c;
	    }
	    // am2 avoids a big mult-and-extract completely.
	    // Max digit bits should be <= 30 because we do bitwise ops
	    // on values up to 2*hdvalue^2-hdvalue-1 (< 2^31)
	    function am2(i,x,w,j,c,n) {
	      var xl = x&0x7fff, xh = x>>15;
	      while(--n >= 0) {
	        var l = this[i]&0x7fff;
	        var h = this[i++]>>15;
	        var m = xh*l+h*xl;
	        l = xl*l+((m&0x7fff)<<15)+w[j]+(c&0x3fffffff);
	        c = (l>>>30)+(m>>>15)+xh*h+(c>>>30);
	        w[j++] = l&0x3fffffff;
	      }
	      return c;
	    }
	    // Alternately, set max digit bits to 28 since some
	    // browsers slow down when dealing with 32-bit numbers.
	    function am3(i,x,w,j,c,n) {
	      var xl = x&0x3fff, xh = x>>14;
	      while(--n >= 0) {
	        var l = this[i]&0x3fff;
	        var h = this[i++]>>14;
	        var m = xh*l+h*xl;
	        l = xl*l+((m&0x3fff)<<14)+w[j]+c;
	        c = (l>>28)+(m>>14)+xh*h;
	        w[j++] = l&0xfffffff;
	      }
	      return c;
	    }
	    var inBrowser = typeof navigator !== "undefined";
	    if(inBrowser && j_lm && (navigator.appName == "Microsoft Internet Explorer")) {
	      BigInteger.prototype.am = am2;
	      dbits = 30;
	    }
	    else if(inBrowser && j_lm && (navigator.appName != "Netscape")) {
	      BigInteger.prototype.am = am1;
	      dbits = 26;
	    }
	    else { // Mozilla/Netscape seems to prefer am3
	      BigInteger.prototype.am = am3;
	      dbits = 28;
	    }
	
	    BigInteger.prototype.DB = dbits;
	    BigInteger.prototype.DM = ((1<<dbits)-1);
	    BigInteger.prototype.DV = (1<<dbits);
	
	    var BI_FP = 52;
	    BigInteger.prototype.FV = Math.pow(2,BI_FP);
	    BigInteger.prototype.F1 = BI_FP-dbits;
	    BigInteger.prototype.F2 = 2*dbits-BI_FP;
	
	    // Digit conversions
	    var BI_RM = "0123456789abcdefghijklmnopqrstuvwxyz";
	    var BI_RC = new Array();
	    var rr,vv;
	    rr = "0".charCodeAt(0);
	    for(vv = 0; vv <= 9; ++vv) BI_RC[rr++] = vv;
	    rr = "a".charCodeAt(0);
	    for(vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv;
	    rr = "A".charCodeAt(0);
	    for(vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv;
	
	    function int2char(n) { return BI_RM.charAt(n); }
	    function intAt(s,i) {
	      var c = BI_RC[s.charCodeAt(i)];
	      return (c==null)?-1:c;
	    }
	
	    // (protected) copy this to r
	    function bnpCopyTo(r) {
	      for(var i = this.t-1; i >= 0; --i) r[i] = this[i];
	      r.t = this.t;
	      r.s = this.s;
	    }
	
	    // (protected) set from integer value x, -DV <= x < DV
	    function bnpFromInt(x) {
	      this.t = 1;
	      this.s = (x<0)?-1:0;
	      if(x > 0) this[0] = x;
	      else if(x < -1) this[0] = x+this.DV;
	      else this.t = 0;
	    }
	
	    // return bigint initialized to value
	    function nbv(i) { var r = nbi(); r.fromInt(i); return r; }
	
	    // (protected) set from string and radix
	    function bnpFromString(s,b) {
	      var k;
	      if(b == 16) k = 4;
	      else if(b == 8) k = 3;
	      else if(b == 256) k = 8; // byte array
	      else if(b == 2) k = 1;
	      else if(b == 32) k = 5;
	      else if(b == 4) k = 2;
	      else { this.fromRadix(s,b); return; }
	      this.t = 0;
	      this.s = 0;
	      var i = s.length, mi = false, sh = 0;
	      while(--i >= 0) {
	        var x = (k==8)?s[i]&0xff:intAt(s,i);
	        if(x < 0) {
	          if(s.charAt(i) == "-") mi = true;
	          continue;
	        }
	        mi = false;
	        if(sh == 0)
	          this[this.t++] = x;
	        else if(sh+k > this.DB) {
	          this[this.t-1] |= (x&((1<<(this.DB-sh))-1))<<sh;
	          this[this.t++] = (x>>(this.DB-sh));
	        }
	        else
	          this[this.t-1] |= x<<sh;
	        sh += k;
	        if(sh >= this.DB) sh -= this.DB;
	      }
	      if(k == 8 && (s[0]&0x80) != 0) {
	        this.s = -1;
	        if(sh > 0) this[this.t-1] |= ((1<<(this.DB-sh))-1)<<sh;
	      }
	      this.clamp();
	      if(mi) BigInteger.ZERO.subTo(this,this);
	    }
	
	    // (protected) clamp off excess high words
	    function bnpClamp() {
	      var c = this.s&this.DM;
	      while(this.t > 0 && this[this.t-1] == c) --this.t;
	    }
	
	    // (public) return string representation in given radix
	    function bnToString(b) {
	      if(this.s < 0) return "-"+this.negate().toString(b);
	      var k;
	      if(b == 16) k = 4;
	      else if(b == 8) k = 3;
	      else if(b == 2) k = 1;
	      else if(b == 32) k = 5;
	      else if(b == 4) k = 2;
	      else return this.toRadix(b);
	      var km = (1<<k)-1, d, m = false, r = "", i = this.t;
	      var p = this.DB-(i*this.DB)%k;
	      if(i-- > 0) {
	        if(p < this.DB && (d = this[i]>>p) > 0) { m = true; r = int2char(d); }
	        while(i >= 0) {
	          if(p < k) {
	            d = (this[i]&((1<<p)-1))<<(k-p);
	            d |= this[--i]>>(p+=this.DB-k);
	          }
	          else {
	            d = (this[i]>>(p-=k))&km;
	            if(p <= 0) { p += this.DB; --i; }
	          }
	          if(d > 0) m = true;
	          if(m) r += int2char(d);
	        }
	      }
	      return m?r:"0";
	    }
	
	    // (public) -this
	    function bnNegate() { var r = nbi(); BigInteger.ZERO.subTo(this,r); return r; }
	
	    // (public) |this|
	    function bnAbs() { return (this.s<0)?this.negate():this; }
	
	    // (public) return + if this > a, - if this < a, 0 if equal
	    function bnCompareTo(a) {
	      var r = this.s-a.s;
	      if(r != 0) return r;
	      var i = this.t;
	      r = i-a.t;
	      if(r != 0) return (this.s<0)?-r:r;
	      while(--i >= 0) if((r=this[i]-a[i]) != 0) return r;
	      return 0;
	    }
	
	    // returns bit length of the integer x
	    function nbits(x) {
	      var r = 1, t;
	      if((t=x>>>16) != 0) { x = t; r += 16; }
	      if((t=x>>8) != 0) { x = t; r += 8; }
	      if((t=x>>4) != 0) { x = t; r += 4; }
	      if((t=x>>2) != 0) { x = t; r += 2; }
	      if((t=x>>1) != 0) { x = t; r += 1; }
	      return r;
	    }
	
	    // (public) return the number of bits in "this"
	    function bnBitLength() {
	      if(this.t <= 0) return 0;
	      return this.DB*(this.t-1)+nbits(this[this.t-1]^(this.s&this.DM));
	    }
	
	    // (protected) r = this << n*DB
	    function bnpDLShiftTo(n,r) {
	      var i;
	      for(i = this.t-1; i >= 0; --i) r[i+n] = this[i];
	      for(i = n-1; i >= 0; --i) r[i] = 0;
	      r.t = this.t+n;
	      r.s = this.s;
	    }
	
	    // (protected) r = this >> n*DB
	    function bnpDRShiftTo(n,r) {
	      for(var i = n; i < this.t; ++i) r[i-n] = this[i];
	      r.t = Math.max(this.t-n,0);
	      r.s = this.s;
	    }
	
	    // (protected) r = this << n
	    function bnpLShiftTo(n,r) {
	      var bs = n%this.DB;
	      var cbs = this.DB-bs;
	      var bm = (1<<cbs)-1;
	      var ds = Math.floor(n/this.DB), c = (this.s<<bs)&this.DM, i;
	      for(i = this.t-1; i >= 0; --i) {
	        r[i+ds+1] = (this[i]>>cbs)|c;
	        c = (this[i]&bm)<<bs;
	      }
	      for(i = ds-1; i >= 0; --i) r[i] = 0;
	      r[ds] = c;
	      r.t = this.t+ds+1;
	      r.s = this.s;
	      r.clamp();
	    }
	
	    // (protected) r = this >> n
	    function bnpRShiftTo(n,r) {
	      r.s = this.s;
	      var ds = Math.floor(n/this.DB);
	      if(ds >= this.t) { r.t = 0; return; }
	      var bs = n%this.DB;
	      var cbs = this.DB-bs;
	      var bm = (1<<bs)-1;
	      r[0] = this[ds]>>bs;
	      for(var i = ds+1; i < this.t; ++i) {
	        r[i-ds-1] |= (this[i]&bm)<<cbs;
	        r[i-ds] = this[i]>>bs;
	      }
	      if(bs > 0) r[this.t-ds-1] |= (this.s&bm)<<cbs;
	      r.t = this.t-ds;
	      r.clamp();
	    }
	
	    // (protected) r = this - a
	    function bnpSubTo(a,r) {
	      var i = 0, c = 0, m = Math.min(a.t,this.t);
	      while(i < m) {
	        c += this[i]-a[i];
	        r[i++] = c&this.DM;
	        c >>= this.DB;
	      }
	      if(a.t < this.t) {
	        c -= a.s;
	        while(i < this.t) {
	          c += this[i];
	          r[i++] = c&this.DM;
	          c >>= this.DB;
	        }
	        c += this.s;
	      }
	      else {
	        c += this.s;
	        while(i < a.t) {
	          c -= a[i];
	          r[i++] = c&this.DM;
	          c >>= this.DB;
	        }
	        c -= a.s;
	      }
	      r.s = (c<0)?-1:0;
	      if(c < -1) r[i++] = this.DV+c;
	      else if(c > 0) r[i++] = c;
	      r.t = i;
	      r.clamp();
	    }
	
	    // (protected) r = this * a, r != this,a (HAC 14.12)
	    // "this" should be the larger one if appropriate.
	    function bnpMultiplyTo(a,r) {
	      var x = this.abs(), y = a.abs();
	      var i = x.t;
	      r.t = i+y.t;
	      while(--i >= 0) r[i] = 0;
	      for(i = 0; i < y.t; ++i) r[i+x.t] = x.am(0,y[i],r,i,0,x.t);
	      r.s = 0;
	      r.clamp();
	      if(this.s != a.s) BigInteger.ZERO.subTo(r,r);
	    }
	
	    // (protected) r = this^2, r != this (HAC 14.16)
	    function bnpSquareTo(r) {
	      var x = this.abs();
	      var i = r.t = 2*x.t;
	      while(--i >= 0) r[i] = 0;
	      for(i = 0; i < x.t-1; ++i) {
	        var c = x.am(i,x[i],r,2*i,0,1);
	        if((r[i+x.t]+=x.am(i+1,2*x[i],r,2*i+1,c,x.t-i-1)) >= x.DV) {
	          r[i+x.t] -= x.DV;
	          r[i+x.t+1] = 1;
	        }
	      }
	      if(r.t > 0) r[r.t-1] += x.am(i,x[i],r,2*i,0,1);
	      r.s = 0;
	      r.clamp();
	    }
	
	    // (protected) divide this by m, quotient and remainder to q, r (HAC 14.20)
	    // r != q, this != m.  q or r may be null.
	    function bnpDivRemTo(m,q,r) {
	      var pm = m.abs();
	      if(pm.t <= 0) return;
	      var pt = this.abs();
	      if(pt.t < pm.t) {
	        if(q != null) q.fromInt(0);
	        if(r != null) this.copyTo(r);
	        return;
	      }
	      if(r == null) r = nbi();
	      var y = nbi(), ts = this.s, ms = m.s;
	      var nsh = this.DB-nbits(pm[pm.t-1]);   // normalize modulus
	      if(nsh > 0) { pm.lShiftTo(nsh,y); pt.lShiftTo(nsh,r); }
	      else { pm.copyTo(y); pt.copyTo(r); }
	      var ys = y.t;
	      var y0 = y[ys-1];
	      if(y0 == 0) return;
	      var yt = y0*(1<<this.F1)+((ys>1)?y[ys-2]>>this.F2:0);
	      var d1 = this.FV/yt, d2 = (1<<this.F1)/yt, e = 1<<this.F2;
	      var i = r.t, j = i-ys, t = (q==null)?nbi():q;
	      y.dlShiftTo(j,t);
	      if(r.compareTo(t) >= 0) {
	        r[r.t++] = 1;
	        r.subTo(t,r);
	      }
	      BigInteger.ONE.dlShiftTo(ys,t);
	      t.subTo(y,y);  // "negative" y so we can replace sub with am later
	      while(y.t < ys) y[y.t++] = 0;
	      while(--j >= 0) {
	        // Estimate quotient digit
	        var qd = (r[--i]==y0)?this.DM:Math.floor(r[i]*d1+(r[i-1]+e)*d2);
	        if((r[i]+=y.am(0,qd,r,j,0,ys)) < qd) {   // Try it out
	          y.dlShiftTo(j,t);
	          r.subTo(t,r);
	          while(r[i] < --qd) r.subTo(t,r);
	        }
	      }
	      if(q != null) {
	        r.drShiftTo(ys,q);
	        if(ts != ms) BigInteger.ZERO.subTo(q,q);
	      }
	      r.t = ys;
	      r.clamp();
	      if(nsh > 0) r.rShiftTo(nsh,r); // Denormalize remainder
	      if(ts < 0) BigInteger.ZERO.subTo(r,r);
	    }
	
	    // (public) this mod a
	    function bnMod(a) {
	      var r = nbi();
	      this.abs().divRemTo(a,null,r);
	      if(this.s < 0 && r.compareTo(BigInteger.ZERO) > 0) a.subTo(r,r);
	      return r;
	    }
	
	    // Modular reduction using "classic" algorithm
	    function Classic(m) { this.m = m; }
	    function cConvert(x) {
	      if(x.s < 0 || x.compareTo(this.m) >= 0) return x.mod(this.m);
	      else return x;
	    }
	    function cRevert(x) { return x; }
	    function cReduce(x) { x.divRemTo(this.m,null,x); }
	    function cMulTo(x,y,r) { x.multiplyTo(y,r); this.reduce(r); }
	    function cSqrTo(x,r) { x.squareTo(r); this.reduce(r); }
	
	    Classic.prototype.convert = cConvert;
	    Classic.prototype.revert = cRevert;
	    Classic.prototype.reduce = cReduce;
	    Classic.prototype.mulTo = cMulTo;
	    Classic.prototype.sqrTo = cSqrTo;
	
	    // (protected) return "-1/this % 2^DB"; useful for Mont. reduction
	    // justification:
	    //         xy == 1 (mod m)
	    //         xy =  1+km
	    //   xy(2-xy) = (1+km)(1-km)
	    // x[y(2-xy)] = 1-k^2m^2
	    // x[y(2-xy)] == 1 (mod m^2)
	    // if y is 1/x mod m, then y(2-xy) is 1/x mod m^2
	    // should reduce x and y(2-xy) by m^2 at each step to keep size bounded.
	    // JS multiply "overflows" differently from C/C++, so care is needed here.
	    function bnpInvDigit() {
	      if(this.t < 1) return 0;
	      var x = this[0];
	      if((x&1) == 0) return 0;
	      var y = x&3;       // y == 1/x mod 2^2
	      y = (y*(2-(x&0xf)*y))&0xf; // y == 1/x mod 2^4
	      y = (y*(2-(x&0xff)*y))&0xff;   // y == 1/x mod 2^8
	      y = (y*(2-(((x&0xffff)*y)&0xffff)))&0xffff;    // y == 1/x mod 2^16
	      // last step - calculate inverse mod DV directly;
	      // assumes 16 < DB <= 32 and assumes ability to handle 48-bit ints
	      y = (y*(2-x*y%this.DV))%this.DV;       // y == 1/x mod 2^dbits
	      // we really want the negative inverse, and -DV < y < DV
	      return (y>0)?this.DV-y:-y;
	    }
	
	    // Montgomery reduction
	    function Montgomery(m) {
	      this.m = m;
	      this.mp = m.invDigit();
	      this.mpl = this.mp&0x7fff;
	      this.mph = this.mp>>15;
	      this.um = (1<<(m.DB-15))-1;
	      this.mt2 = 2*m.t;
	    }
	
	    // xR mod m
	    function montConvert(x) {
	      var r = nbi();
	      x.abs().dlShiftTo(this.m.t,r);
	      r.divRemTo(this.m,null,r);
	      if(x.s < 0 && r.compareTo(BigInteger.ZERO) > 0) this.m.subTo(r,r);
	      return r;
	    }
	
	    // x/R mod m
	    function montRevert(x) {
	      var r = nbi();
	      x.copyTo(r);
	      this.reduce(r);
	      return r;
	    }
	
	    // x = x/R mod m (HAC 14.32)
	    function montReduce(x) {
	      while(x.t <= this.mt2) // pad x so am has enough room later
	        x[x.t++] = 0;
	      for(var i = 0; i < this.m.t; ++i) {
	        // faster way of calculating u0 = x[i]*mp mod DV
	        var j = x[i]&0x7fff;
	        var u0 = (j*this.mpl+(((j*this.mph+(x[i]>>15)*this.mpl)&this.um)<<15))&x.DM;
	        // use am to combine the multiply-shift-add into one call
	        j = i+this.m.t;
	        x[j] += this.m.am(0,u0,x,i,0,this.m.t);
	        // propagate carry
	        while(x[j] >= x.DV) { x[j] -= x.DV; x[++j]++; }
	      }
	      x.clamp();
	      x.drShiftTo(this.m.t,x);
	      if(x.compareTo(this.m) >= 0) x.subTo(this.m,x);
	    }
	
	    // r = "x^2/R mod m"; x != r
	    function montSqrTo(x,r) { x.squareTo(r); this.reduce(r); }
	
	    // r = "xy/R mod m"; x,y != r
	    function montMulTo(x,y,r) { x.multiplyTo(y,r); this.reduce(r); }
	
	    Montgomery.prototype.convert = montConvert;
	    Montgomery.prototype.revert = montRevert;
	    Montgomery.prototype.reduce = montReduce;
	    Montgomery.prototype.mulTo = montMulTo;
	    Montgomery.prototype.sqrTo = montSqrTo;
	
	    // (protected) true iff this is even
	    function bnpIsEven() { return ((this.t>0)?(this[0]&1):this.s) == 0; }
	
	    // (protected) this^e, e < 2^32, doing sqr and mul with "r" (HAC 14.79)
	    function bnpExp(e,z) {
	      if(e > 0xffffffff || e < 1) return BigInteger.ONE;
	      var r = nbi(), r2 = nbi(), g = z.convert(this), i = nbits(e)-1;
	      g.copyTo(r);
	      while(--i >= 0) {
	        z.sqrTo(r,r2);
	        if((e&(1<<i)) > 0) z.mulTo(r2,g,r);
	        else { var t = r; r = r2; r2 = t; }
	      }
	      return z.revert(r);
	    }
	
	    // (public) this^e % m, 0 <= e < 2^32
	    function bnModPowInt(e,m) {
	      var z;
	      if(e < 256 || m.isEven()) z = new Classic(m); else z = new Montgomery(m);
	      return this.exp(e,z);
	    }
	
	    // protected
	    BigInteger.prototype.copyTo = bnpCopyTo;
	    BigInteger.prototype.fromInt = bnpFromInt;
	    BigInteger.prototype.fromString = bnpFromString;
	    BigInteger.prototype.clamp = bnpClamp;
	    BigInteger.prototype.dlShiftTo = bnpDLShiftTo;
	    BigInteger.prototype.drShiftTo = bnpDRShiftTo;
	    BigInteger.prototype.lShiftTo = bnpLShiftTo;
	    BigInteger.prototype.rShiftTo = bnpRShiftTo;
	    BigInteger.prototype.subTo = bnpSubTo;
	    BigInteger.prototype.multiplyTo = bnpMultiplyTo;
	    BigInteger.prototype.squareTo = bnpSquareTo;
	    BigInteger.prototype.divRemTo = bnpDivRemTo;
	    BigInteger.prototype.invDigit = bnpInvDigit;
	    BigInteger.prototype.isEven = bnpIsEven;
	    BigInteger.prototype.exp = bnpExp;
	
	    // public
	    BigInteger.prototype.toString = bnToString;
	    BigInteger.prototype.negate = bnNegate;
	    BigInteger.prototype.abs = bnAbs;
	    BigInteger.prototype.compareTo = bnCompareTo;
	    BigInteger.prototype.bitLength = bnBitLength;
	    BigInteger.prototype.mod = bnMod;
	    BigInteger.prototype.modPowInt = bnModPowInt;
	
	    // "constants"
	    BigInteger.ZERO = nbv(0);
	    BigInteger.ONE = nbv(1);
	
	    // Copyright (c) 2005-2009  Tom Wu
	    // All Rights Reserved.
	    // See "LICENSE" for details.
	
	    // Extended JavaScript BN functions, required for RSA private ops.
	
	    // Version 1.1: new BigInteger("0", 10) returns "proper" zero
	    // Version 1.2: square() API, isProbablePrime fix
	
	    // (public)
	    function bnClone() { var r = nbi(); this.copyTo(r); return r; }
	
	    // (public) return value as integer
	    function bnIntValue() {
	      if(this.s < 0) {
	        if(this.t == 1) return this[0]-this.DV;
	        else if(this.t == 0) return -1;
	      }
	      else if(this.t == 1) return this[0];
	      else if(this.t == 0) return 0;
	      // assumes 16 < DB < 32
	      return ((this[1]&((1<<(32-this.DB))-1))<<this.DB)|this[0];
	    }
	
	    // (public) return value as byte
	    function bnByteValue() { return (this.t==0)?this.s:(this[0]<<24)>>24; }
	
	    // (public) return value as short (assumes DB>=16)
	    function bnShortValue() { return (this.t==0)?this.s:(this[0]<<16)>>16; }
	
	    // (protected) return x s.t. r^x < DV
	    function bnpChunkSize(r) { return Math.floor(Math.LN2*this.DB/Math.log(r)); }
	
	    // (public) 0 if this == 0, 1 if this > 0
	    function bnSigNum() {
	      if(this.s < 0) return -1;
	      else if(this.t <= 0 || (this.t == 1 && this[0] <= 0)) return 0;
	      else return 1;
	    }
	
	    // (protected) convert to radix string
	    function bnpToRadix(b) {
	      if(b == null) b = 10;
	      if(this.signum() == 0 || b < 2 || b > 36) return "0";
	      var cs = this.chunkSize(b);
	      var a = Math.pow(b,cs);
	      var d = nbv(a), y = nbi(), z = nbi(), r = "";
	      this.divRemTo(d,y,z);
	      while(y.signum() > 0) {
	        r = (a+z.intValue()).toString(b).substr(1) + r;
	        y.divRemTo(d,y,z);
	      }
	      return z.intValue().toString(b) + r;
	    }
	
	    // (protected) convert from radix string
	    function bnpFromRadix(s,b) {
	      this.fromInt(0);
	      if(b == null) b = 10;
	      var cs = this.chunkSize(b);
	      var d = Math.pow(b,cs), mi = false, j = 0, w = 0;
	      for(var i = 0; i < s.length; ++i) {
	        var x = intAt(s,i);
	        if(x < 0) {
	          if(s.charAt(i) == "-" && this.signum() == 0) mi = true;
	          continue;
	        }
	        w = b*w+x;
	        if(++j >= cs) {
	          this.dMultiply(d);
	          this.dAddOffset(w,0);
	          j = 0;
	          w = 0;
	        }
	      }
	      if(j > 0) {
	        this.dMultiply(Math.pow(b,j));
	        this.dAddOffset(w,0);
	      }
	      if(mi) BigInteger.ZERO.subTo(this,this);
	    }
	
	    // (protected) alternate constructor
	    function bnpFromNumber(a,b,c) {
	      if("number" == typeof b) {
	        // new BigInteger(int,int,RNG)
	        if(a < 2) this.fromInt(1);
	        else {
	          this.fromNumber(a,c);
	          if(!this.testBit(a-1))	// force MSB set
	            this.bitwiseTo(BigInteger.ONE.shiftLeft(a-1),op_or,this);
	          if(this.isEven()) this.dAddOffset(1,0); // force odd
	          while(!this.isProbablePrime(b)) {
	            this.dAddOffset(2,0);
	            if(this.bitLength() > a) this.subTo(BigInteger.ONE.shiftLeft(a-1),this);
	          }
	        }
	      }
	      else {
	        // new BigInteger(int,RNG)
	        var x = new Array(), t = a&7;
	        x.length = (a>>3)+1;
	        b.nextBytes(x);
	        if(t > 0) x[0] &= ((1<<t)-1); else x[0] = 0;
	        this.fromString(x,256);
	      }
	    }
	
	    // (public) convert to bigendian byte array
	    function bnToByteArray() {
	      var i = this.t, r = new Array();
	      r[0] = this.s;
	      var p = this.DB-(i*this.DB)%8, d, k = 0;
	      if(i-- > 0) {
	        if(p < this.DB && (d = this[i]>>p) != (this.s&this.DM)>>p)
	          r[k++] = d|(this.s<<(this.DB-p));
	        while(i >= 0) {
	          if(p < 8) {
	            d = (this[i]&((1<<p)-1))<<(8-p);
	            d |= this[--i]>>(p+=this.DB-8);
	          }
	          else {
	            d = (this[i]>>(p-=8))&0xff;
	            if(p <= 0) { p += this.DB; --i; }
	          }
	          if((d&0x80) != 0) d |= -256;
	          if(k == 0 && (this.s&0x80) != (d&0x80)) ++k;
	          if(k > 0 || d != this.s) r[k++] = d;
	        }
	      }
	      return r;
	    }
	
	    function bnEquals(a) { return(this.compareTo(a)==0); }
	    function bnMin(a) { return(this.compareTo(a)<0)?this:a; }
	    function bnMax(a) { return(this.compareTo(a)>0)?this:a; }
	
	    // (protected) r = this op a (bitwise)
	    function bnpBitwiseTo(a,op,r) {
	      var i, f, m = Math.min(a.t,this.t);
	      for(i = 0; i < m; ++i) r[i] = op(this[i],a[i]);
	      if(a.t < this.t) {
	        f = a.s&this.DM;
	        for(i = m; i < this.t; ++i) r[i] = op(this[i],f);
	        r.t = this.t;
	      }
	      else {
	        f = this.s&this.DM;
	        for(i = m; i < a.t; ++i) r[i] = op(f,a[i]);
	        r.t = a.t;
	      }
	      r.s = op(this.s,a.s);
	      r.clamp();
	    }
	
	    // (public) this & a
	    function op_and(x,y) { return x&y; }
	    function bnAnd(a) { var r = nbi(); this.bitwiseTo(a,op_and,r); return r; }
	
	    // (public) this | a
	    function op_or(x,y) { return x|y; }
	    function bnOr(a) { var r = nbi(); this.bitwiseTo(a,op_or,r); return r; }
	
	    // (public) this ^ a
	    function op_xor(x,y) { return x^y; }
	    function bnXor(a) { var r = nbi(); this.bitwiseTo(a,op_xor,r); return r; }
	
	    // (public) this & ~a
	    function op_andnot(x,y) { return x&~y; }
	    function bnAndNot(a) { var r = nbi(); this.bitwiseTo(a,op_andnot,r); return r; }
	
	    // (public) ~this
	    function bnNot() {
	      var r = nbi();
	      for(var i = 0; i < this.t; ++i) r[i] = this.DM&~this[i];
	      r.t = this.t;
	      r.s = ~this.s;
	      return r;
	    }
	
	    // (public) this << n
	    function bnShiftLeft(n) {
	      var r = nbi();
	      if(n < 0) this.rShiftTo(-n,r); else this.lShiftTo(n,r);
	      return r;
	    }
	
	    // (public) this >> n
	    function bnShiftRight(n) {
	      var r = nbi();
	      if(n < 0) this.lShiftTo(-n,r); else this.rShiftTo(n,r);
	      return r;
	    }
	
	    // return index of lowest 1-bit in x, x < 2^31
	    function lbit(x) {
	      if(x == 0) return -1;
	      var r = 0;
	      if((x&0xffff) == 0) { x >>= 16; r += 16; }
	      if((x&0xff) == 0) { x >>= 8; r += 8; }
	      if((x&0xf) == 0) { x >>= 4; r += 4; }
	      if((x&3) == 0) { x >>= 2; r += 2; }
	      if((x&1) == 0) ++r;
	      return r;
	    }
	
	    // (public) returns index of lowest 1-bit (or -1 if none)
	    function bnGetLowestSetBit() {
	      for(var i = 0; i < this.t; ++i)
	        if(this[i] != 0) return i*this.DB+lbit(this[i]);
	      if(this.s < 0) return this.t*this.DB;
	      return -1;
	    }
	
	    // return number of 1 bits in x
	    function cbit(x) {
	      var r = 0;
	      while(x != 0) { x &= x-1; ++r; }
	      return r;
	    }
	
	    // (public) return number of set bits
	    function bnBitCount() {
	      var r = 0, x = this.s&this.DM;
	      for(var i = 0; i < this.t; ++i) r += cbit(this[i]^x);
	      return r;
	    }
	
	    // (public) true iff nth bit is set
	    function bnTestBit(n) {
	      var j = Math.floor(n/this.DB);
	      if(j >= this.t) return(this.s!=0);
	      return((this[j]&(1<<(n%this.DB)))!=0);
	    }
	
	    // (protected) this op (1<<n)
	    function bnpChangeBit(n,op) {
	      var r = BigInteger.ONE.shiftLeft(n);
	      this.bitwiseTo(r,op,r);
	      return r;
	    }
	
	    // (public) this | (1<<n)
	    function bnSetBit(n) { return this.changeBit(n,op_or); }
	
	    // (public) this & ~(1<<n)
	    function bnClearBit(n) { return this.changeBit(n,op_andnot); }
	
	    // (public) this ^ (1<<n)
	    function bnFlipBit(n) { return this.changeBit(n,op_xor); }
	
	    // (protected) r = this + a
	    function bnpAddTo(a,r) {
	      var i = 0, c = 0, m = Math.min(a.t,this.t);
	      while(i < m) {
	        c += this[i]+a[i];
	        r[i++] = c&this.DM;
	        c >>= this.DB;
	      }
	      if(a.t < this.t) {
	        c += a.s;
	        while(i < this.t) {
	          c += this[i];
	          r[i++] = c&this.DM;
	          c >>= this.DB;
	        }
	        c += this.s;
	      }
	      else {
	        c += this.s;
	        while(i < a.t) {
	          c += a[i];
	          r[i++] = c&this.DM;
	          c >>= this.DB;
	        }
	        c += a.s;
	      }
	      r.s = (c<0)?-1:0;
	      if(c > 0) r[i++] = c;
	      else if(c < -1) r[i++] = this.DV+c;
	      r.t = i;
	      r.clamp();
	    }
	
	    // (public) this + a
	    function bnAdd(a) { var r = nbi(); this.addTo(a,r); return r; }
	
	    // (public) this - a
	    function bnSubtract(a) { var r = nbi(); this.subTo(a,r); return r; }
	
	    // (public) this * a
	    function bnMultiply(a) { var r = nbi(); this.multiplyTo(a,r); return r; }
	
	    // (public) this^2
	    function bnSquare() { var r = nbi(); this.squareTo(r); return r; }
	
	    // (public) this / a
	    function bnDivide(a) { var r = nbi(); this.divRemTo(a,r,null); return r; }
	
	    // (public) this % a
	    function bnRemainder(a) { var r = nbi(); this.divRemTo(a,null,r); return r; }
	
	    // (public) [this/a,this%a]
	    function bnDivideAndRemainder(a) {
	      var q = nbi(), r = nbi();
	      this.divRemTo(a,q,r);
	      return new Array(q,r);
	    }
	
	    // (protected) this *= n, this >= 0, 1 < n < DV
	    function bnpDMultiply(n) {
	      this[this.t] = this.am(0,n-1,this,0,0,this.t);
	      ++this.t;
	      this.clamp();
	    }
	
	    // (protected) this += n << w words, this >= 0
	    function bnpDAddOffset(n,w) {
	      if(n == 0) return;
	      while(this.t <= w) this[this.t++] = 0;
	      this[w] += n;
	      while(this[w] >= this.DV) {
	        this[w] -= this.DV;
	        if(++w >= this.t) this[this.t++] = 0;
	        ++this[w];
	      }
	    }
	
	    // A "null" reducer
	    function NullExp() {}
	    function nNop(x) { return x; }
	    function nMulTo(x,y,r) { x.multiplyTo(y,r); }
	    function nSqrTo(x,r) { x.squareTo(r); }
	
	    NullExp.prototype.convert = nNop;
	    NullExp.prototype.revert = nNop;
	    NullExp.prototype.mulTo = nMulTo;
	    NullExp.prototype.sqrTo = nSqrTo;
	
	    // (public) this^e
	    function bnPow(e) { return this.exp(e,new NullExp()); }
	
	    // (protected) r = lower n words of "this * a", a.t <= n
	    // "this" should be the larger one if appropriate.
	    function bnpMultiplyLowerTo(a,n,r) {
	      var i = Math.min(this.t+a.t,n);
	      r.s = 0; // assumes a,this >= 0
	      r.t = i;
	      while(i > 0) r[--i] = 0;
	      var j;
	      for(j = r.t-this.t; i < j; ++i) r[i+this.t] = this.am(0,a[i],r,i,0,this.t);
	      for(j = Math.min(a.t,n); i < j; ++i) this.am(0,a[i],r,i,0,n-i);
	      r.clamp();
	    }
	
	    // (protected) r = "this * a" without lower n words, n > 0
	    // "this" should be the larger one if appropriate.
	    function bnpMultiplyUpperTo(a,n,r) {
	      --n;
	      var i = r.t = this.t+a.t-n;
	      r.s = 0; // assumes a,this >= 0
	      while(--i >= 0) r[i] = 0;
	      for(i = Math.max(n-this.t,0); i < a.t; ++i)
	        r[this.t+i-n] = this.am(n-i,a[i],r,0,0,this.t+i-n);
	      r.clamp();
	      r.drShiftTo(1,r);
	    }
	
	    // Barrett modular reduction
	    function Barrett(m) {
	      // setup Barrett
	      this.r2 = nbi();
	      this.q3 = nbi();
	      BigInteger.ONE.dlShiftTo(2*m.t,this.r2);
	      this.mu = this.r2.divide(m);
	      this.m = m;
	    }
	
	    function barrettConvert(x) {
	      if(x.s < 0 || x.t > 2*this.m.t) return x.mod(this.m);
	      else if(x.compareTo(this.m) < 0) return x;
	      else { var r = nbi(); x.copyTo(r); this.reduce(r); return r; }
	    }
	
	    function barrettRevert(x) { return x; }
	
	    // x = x mod m (HAC 14.42)
	    function barrettReduce(x) {
	      x.drShiftTo(this.m.t-1,this.r2);
	      if(x.t > this.m.t+1) { x.t = this.m.t+1; x.clamp(); }
	      this.mu.multiplyUpperTo(this.r2,this.m.t+1,this.q3);
	      this.m.multiplyLowerTo(this.q3,this.m.t+1,this.r2);
	      while(x.compareTo(this.r2) < 0) x.dAddOffset(1,this.m.t+1);
	      x.subTo(this.r2,x);
	      while(x.compareTo(this.m) >= 0) x.subTo(this.m,x);
	    }
	
	    // r = x^2 mod m; x != r
	    function barrettSqrTo(x,r) { x.squareTo(r); this.reduce(r); }
	
	    // r = x*y mod m; x,y != r
	    function barrettMulTo(x,y,r) { x.multiplyTo(y,r); this.reduce(r); }
	
	    Barrett.prototype.convert = barrettConvert;
	    Barrett.prototype.revert = barrettRevert;
	    Barrett.prototype.reduce = barrettReduce;
	    Barrett.prototype.mulTo = barrettMulTo;
	    Barrett.prototype.sqrTo = barrettSqrTo;
	
	    // (public) this^e % m (HAC 14.85)
	    function bnModPow(e,m) {
	      var i = e.bitLength(), k, r = nbv(1), z;
	      if(i <= 0) return r;
	      else if(i < 18) k = 1;
	      else if(i < 48) k = 3;
	      else if(i < 144) k = 4;
	      else if(i < 768) k = 5;
	      else k = 6;
	      if(i < 8)
	        z = new Classic(m);
	      else if(m.isEven())
	        z = new Barrett(m);
	      else
	        z = new Montgomery(m);
	
	      // precomputation
	      var g = new Array(), n = 3, k1 = k-1, km = (1<<k)-1;
	      g[1] = z.convert(this);
	      if(k > 1) {
	        var g2 = nbi();
	        z.sqrTo(g[1],g2);
	        while(n <= km) {
	          g[n] = nbi();
	          z.mulTo(g2,g[n-2],g[n]);
	          n += 2;
	        }
	      }
	
	      var j = e.t-1, w, is1 = true, r2 = nbi(), t;
	      i = nbits(e[j])-1;
	      while(j >= 0) {
	        if(i >= k1) w = (e[j]>>(i-k1))&km;
	        else {
	          w = (e[j]&((1<<(i+1))-1))<<(k1-i);
	          if(j > 0) w |= e[j-1]>>(this.DB+i-k1);
	        }
	
	        n = k;
	        while((w&1) == 0) { w >>= 1; --n; }
	        if((i -= n) < 0) { i += this.DB; --j; }
	        if(is1) {	// ret == 1, don't bother squaring or multiplying it
	          g[w].copyTo(r);
	          is1 = false;
	        }
	        else {
	          while(n > 1) { z.sqrTo(r,r2); z.sqrTo(r2,r); n -= 2; }
	          if(n > 0) z.sqrTo(r,r2); else { t = r; r = r2; r2 = t; }
	          z.mulTo(r2,g[w],r);
	        }
	
	        while(j >= 0 && (e[j]&(1<<i)) == 0) {
	          z.sqrTo(r,r2); t = r; r = r2; r2 = t;
	          if(--i < 0) { i = this.DB-1; --j; }
	        }
	      }
	      return z.revert(r);
	    }
	
	    // (public) gcd(this,a) (HAC 14.54)
	    function bnGCD(a) {
	      var x = (this.s<0)?this.negate():this.clone();
	      var y = (a.s<0)?a.negate():a.clone();
	      if(x.compareTo(y) < 0) { var t = x; x = y; y = t; }
	      var i = x.getLowestSetBit(), g = y.getLowestSetBit();
	      if(g < 0) return x;
	      if(i < g) g = i;
	      if(g > 0) {
	        x.rShiftTo(g,x);
	        y.rShiftTo(g,y);
	      }
	      while(x.signum() > 0) {
	        if((i = x.getLowestSetBit()) > 0) x.rShiftTo(i,x);
	        if((i = y.getLowestSetBit()) > 0) y.rShiftTo(i,y);
	        if(x.compareTo(y) >= 0) {
	          x.subTo(y,x);
	          x.rShiftTo(1,x);
	        }
	        else {
	          y.subTo(x,y);
	          y.rShiftTo(1,y);
	        }
	      }
	      if(g > 0) y.lShiftTo(g,y);
	      return y;
	    }
	
	    // (protected) this % n, n < 2^26
	    function bnpModInt(n) {
	      if(n <= 0) return 0;
	      var d = this.DV%n, r = (this.s<0)?n-1:0;
	      if(this.t > 0)
	        if(d == 0) r = this[0]%n;
	        else for(var i = this.t-1; i >= 0; --i) r = (d*r+this[i])%n;
	      return r;
	    }
	
	    // (public) 1/this % m (HAC 14.61)
	    function bnModInverse(m) {
	      var ac = m.isEven();
	      if((this.isEven() && ac) || m.signum() == 0) return BigInteger.ZERO;
	      var u = m.clone(), v = this.clone();
	      var a = nbv(1), b = nbv(0), c = nbv(0), d = nbv(1);
	      while(u.signum() != 0) {
	        while(u.isEven()) {
	          u.rShiftTo(1,u);
	          if(ac) {
	            if(!a.isEven() || !b.isEven()) { a.addTo(this,a); b.subTo(m,b); }
	            a.rShiftTo(1,a);
	          }
	          else if(!b.isEven()) b.subTo(m,b);
	          b.rShiftTo(1,b);
	        }
	        while(v.isEven()) {
	          v.rShiftTo(1,v);
	          if(ac) {
	            if(!c.isEven() || !d.isEven()) { c.addTo(this,c); d.subTo(m,d); }
	            c.rShiftTo(1,c);
	          }
	          else if(!d.isEven()) d.subTo(m,d);
	          d.rShiftTo(1,d);
	        }
	        if(u.compareTo(v) >= 0) {
	          u.subTo(v,u);
	          if(ac) a.subTo(c,a);
	          b.subTo(d,b);
	        }
	        else {
	          v.subTo(u,v);
	          if(ac) c.subTo(a,c);
	          d.subTo(b,d);
	        }
	      }
	      if(v.compareTo(BigInteger.ONE) != 0) return BigInteger.ZERO;
	      if(d.compareTo(m) >= 0) return d.subtract(m);
	      if(d.signum() < 0) d.addTo(m,d); else return d;
	      if(d.signum() < 0) return d.add(m); else return d;
	    }
	
	    var lowprimes = [2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97,101,103,107,109,113,127,131,137,139,149,151,157,163,167,173,179,181,191,193,197,199,211,223,227,229,233,239,241,251,257,263,269,271,277,281,283,293,307,311,313,317,331,337,347,349,353,359,367,373,379,383,389,397,401,409,419,421,431,433,439,443,449,457,461,463,467,479,487,491,499,503,509,521,523,541,547,557,563,569,571,577,587,593,599,601,607,613,617,619,631,641,643,647,653,659,661,673,677,683,691,701,709,719,727,733,739,743,751,757,761,769,773,787,797,809,811,821,823,827,829,839,853,857,859,863,877,881,883,887,907,911,919,929,937,941,947,953,967,971,977,983,991,997];
	    var lplim = (1<<26)/lowprimes[lowprimes.length-1];
	
	    // (public) test primality with certainty >= 1-.5^t
	    function bnIsProbablePrime(t) {
	      var i, x = this.abs();
	      if(x.t == 1 && x[0] <= lowprimes[lowprimes.length-1]) {
	        for(i = 0; i < lowprimes.length; ++i)
	          if(x[0] == lowprimes[i]) return true;
	        return false;
	      }
	      if(x.isEven()) return false;
	      i = 1;
	      while(i < lowprimes.length) {
	        var m = lowprimes[i], j = i+1;
	        while(j < lowprimes.length && m < lplim) m *= lowprimes[j++];
	        m = x.modInt(m);
	        while(i < j) if(m%lowprimes[i++] == 0) return false;
	      }
	      return x.millerRabin(t);
	    }
	
	    // (protected) true if probably prime (HAC 4.24, Miller-Rabin)
	    function bnpMillerRabin(t) {
	      var n1 = this.subtract(BigInteger.ONE);
	      var k = n1.getLowestSetBit();
	      if(k <= 0) return false;
	      var r = n1.shiftRight(k);
	      t = (t+1)>>1;
	      if(t > lowprimes.length) t = lowprimes.length;
	      var a = nbi();
	      for(var i = 0; i < t; ++i) {
	        //Pick bases at random, instead of starting at 2
	        a.fromInt(lowprimes[Math.floor(Math.random()*lowprimes.length)]);
	        var y = a.modPow(r,this);
	        if(y.compareTo(BigInteger.ONE) != 0 && y.compareTo(n1) != 0) {
	          var j = 1;
	          while(j++ < k && y.compareTo(n1) != 0) {
	            y = y.modPowInt(2,this);
	            if(y.compareTo(BigInteger.ONE) == 0) return false;
	          }
	          if(y.compareTo(n1) != 0) return false;
	        }
	      }
	      return true;
	    }
	
	    // protected
	    BigInteger.prototype.chunkSize = bnpChunkSize;
	    BigInteger.prototype.toRadix = bnpToRadix;
	    BigInteger.prototype.fromRadix = bnpFromRadix;
	    BigInteger.prototype.fromNumber = bnpFromNumber;
	    BigInteger.prototype.bitwiseTo = bnpBitwiseTo;
	    BigInteger.prototype.changeBit = bnpChangeBit;
	    BigInteger.prototype.addTo = bnpAddTo;
	    BigInteger.prototype.dMultiply = bnpDMultiply;
	    BigInteger.prototype.dAddOffset = bnpDAddOffset;
	    BigInteger.prototype.multiplyLowerTo = bnpMultiplyLowerTo;
	    BigInteger.prototype.multiplyUpperTo = bnpMultiplyUpperTo;
	    BigInteger.prototype.modInt = bnpModInt;
	    BigInteger.prototype.millerRabin = bnpMillerRabin;
	
	    // public
	    BigInteger.prototype.clone = bnClone;
	    BigInteger.prototype.intValue = bnIntValue;
	    BigInteger.prototype.byteValue = bnByteValue;
	    BigInteger.prototype.shortValue = bnShortValue;
	    BigInteger.prototype.signum = bnSigNum;
	    BigInteger.prototype.toByteArray = bnToByteArray;
	    BigInteger.prototype.equals = bnEquals;
	    BigInteger.prototype.min = bnMin;
	    BigInteger.prototype.max = bnMax;
	    BigInteger.prototype.and = bnAnd;
	    BigInteger.prototype.or = bnOr;
	    BigInteger.prototype.xor = bnXor;
	    BigInteger.prototype.andNot = bnAndNot;
	    BigInteger.prototype.not = bnNot;
	    BigInteger.prototype.shiftLeft = bnShiftLeft;
	    BigInteger.prototype.shiftRight = bnShiftRight;
	    BigInteger.prototype.getLowestSetBit = bnGetLowestSetBit;
	    BigInteger.prototype.bitCount = bnBitCount;
	    BigInteger.prototype.testBit = bnTestBit;
	    BigInteger.prototype.setBit = bnSetBit;
	    BigInteger.prototype.clearBit = bnClearBit;
	    BigInteger.prototype.flipBit = bnFlipBit;
	    BigInteger.prototype.add = bnAdd;
	    BigInteger.prototype.subtract = bnSubtract;
	    BigInteger.prototype.multiply = bnMultiply;
	    BigInteger.prototype.divide = bnDivide;
	    BigInteger.prototype.remainder = bnRemainder;
	    BigInteger.prototype.divideAndRemainder = bnDivideAndRemainder;
	    BigInteger.prototype.modPow = bnModPow;
	    BigInteger.prototype.modInverse = bnModInverse;
	    BigInteger.prototype.pow = bnPow;
	    BigInteger.prototype.gcd = bnGCD;
	    BigInteger.prototype.isProbablePrime = bnIsProbablePrime;
	
	    // JSBN-specific extension
	    BigInteger.prototype.square = bnSquare;
	
	    // Expose the Barrett function
	    BigInteger.prototype.Barrett = Barrett
	
	    // BigInteger interfaces not implemented in jsbn:
	
	    // BigInteger(int signum, byte[] magnitude)
	    // double doubleValue()
	    // float floatValue()
	    // int hashCode()
	    // long longValue()
	    // static BigInteger valueOf(long val)
	
		// Random number generator - requires a PRNG backend, e.g. prng4.js
	
		// For best results, put code like
		// <body onClick='rng_seed_time();' onKeyPress='rng_seed_time();'>
		// in your main HTML document.
	
		var rng_state;
		var rng_pool;
		var rng_pptr;
	
		// Mix in a 32-bit integer into the pool
		function rng_seed_int(x) {
		  rng_pool[rng_pptr++] ^= x & 255;
		  rng_pool[rng_pptr++] ^= (x >> 8) & 255;
		  rng_pool[rng_pptr++] ^= (x >> 16) & 255;
		  rng_pool[rng_pptr++] ^= (x >> 24) & 255;
		  if(rng_pptr >= rng_psize) rng_pptr -= rng_psize;
		}
	
		// Mix in the current time (w/milliseconds) into the pool
		function rng_seed_time() {
		  rng_seed_int(new Date().getTime());
		}
	
		// Initialize the pool with junk if needed.
		if(rng_pool == null) {
		  rng_pool = new Array();
		  rng_pptr = 0;
		  var t;
		  if(typeof window !== "undefined" && window.crypto) {
			if (window.crypto.getRandomValues) {
			  // Use webcrypto if available
			  var ua = new Uint8Array(32);
			  window.crypto.getRandomValues(ua);
			  for(t = 0; t < 32; ++t)
				rng_pool[rng_pptr++] = ua[t];
			}
			else if(navigator.appName == "Netscape" && navigator.appVersion < "5") {
			  // Extract entropy (256 bits) from NS4 RNG if available
			  var z = window.crypto.random(32);
			  for(t = 0; t < z.length; ++t)
				rng_pool[rng_pptr++] = z.charCodeAt(t) & 255;
			}
		  }
		  while(rng_pptr < rng_psize) {  // extract some randomness from Math.random()
			t = Math.floor(65536 * Math.random());
			rng_pool[rng_pptr++] = t >>> 8;
			rng_pool[rng_pptr++] = t & 255;
		  }
		  rng_pptr = 0;
		  rng_seed_time();
		  //rng_seed_int(window.screenX);
		  //rng_seed_int(window.screenY);
		}
	
		function rng_get_byte() {
		  if(rng_state == null) {
			rng_seed_time();
			rng_state = prng_newstate();
			rng_state.init(rng_pool);
			for(rng_pptr = 0; rng_pptr < rng_pool.length; ++rng_pptr)
			  rng_pool[rng_pptr] = 0;
			rng_pptr = 0;
			//rng_pool = null;
		  }
		  // TODO: allow reseeding after first request
		  return rng_state.next();
		}
	
		function rng_get_bytes(ba) {
		  var i;
		  for(i = 0; i < ba.length; ++i) ba[i] = rng_get_byte();
		}
	
		function SecureRandom() {}
	
		SecureRandom.prototype.nextBytes = rng_get_bytes;
	
		// prng4.js - uses Arcfour as a PRNG
	
		function Arcfour() {
		  this.i = 0;
		  this.j = 0;
		  this.S = new Array();
		}
	
		// Initialize arcfour context from key, an array of ints, each from [0..255]
		function ARC4init(key) {
		  var i, j, t;
		  for(i = 0; i < 256; ++i)
			this.S[i] = i;
		  j = 0;
		  for(i = 0; i < 256; ++i) {
			j = (j + this.S[i] + key[i % key.length]) & 255;
			t = this.S[i];
			this.S[i] = this.S[j];
			this.S[j] = t;
		  }
		  this.i = 0;
		  this.j = 0;
		}
	
		function ARC4next() {
		  var t;
		  this.i = (this.i + 1) & 255;
		  this.j = (this.j + this.S[this.i]) & 255;
		  t = this.S[this.i];
		  this.S[this.i] = this.S[this.j];
		  this.S[this.j] = t;
		  return this.S[(t + this.S[this.i]) & 255];
		}
	
		Arcfour.prototype.init = ARC4init;
		Arcfour.prototype.next = ARC4next;
	
		// Plug in your RNG constructor here
		function prng_newstate() {
		  return new Arcfour();
		}
	
		// Pool size must be a multiple of 4 and greater than 32.
		// An array of bytes the size of the pool will be passed to init()
		var rng_psize = 256;
	
	  BigInteger.SecureRandom = SecureRandom;
	  BigInteger.BigInteger = BigInteger;
	  if (true) {
	    exports = module.exports = BigInteger;
	  } else {
	    this.BigInteger = BigInteger;
	    this.SecureRandom = SecureRandom;
	  }
	
	}).call(this);


/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Check if `fn` is a function.
	 *
	 * @param {Function} fn
	 * @return {Boolean}
	 * @api private
	 */
	var isObject = __webpack_require__(14);
	
	function isFunction(fn) {
	  var tag = isObject(fn) ? Object.prototype.toString.call(fn) : '';
	  return tag === '[object Function]';
	}
	
	module.exports = isFunction;


/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Module of mixed-in functions shared between node and client code
	 */
	var isObject = __webpack_require__(14);
	
	/**
	 * Expose `RequestBase`.
	 */
	
	module.exports = RequestBase;
	
	/**
	 * Initialize a new `RequestBase`.
	 *
	 * @api public
	 */
	
	function RequestBase(obj) {
	  if (obj) return mixin(obj);
	}
	
	/**
	 * Mixin the prototype properties.
	 *
	 * @param {Object} obj
	 * @return {Object}
	 * @api private
	 */
	
	function mixin(obj) {
	  for (var key in RequestBase.prototype) {
	    obj[key] = RequestBase.prototype[key];
	  }
	  return obj;
	}
	
	/**
	 * Clear previous timeout.
	 *
	 * @return {Request} for chaining
	 * @api public
	 */
	
	RequestBase.prototype.clearTimeout = function _clearTimeout(){
	  clearTimeout(this._timer);
	  clearTimeout(this._responseTimeoutTimer);
	  delete this._timer;
	  delete this._responseTimeoutTimer;
	  return this;
	};
	
	/**
	 * Override default response body parser
	 *
	 * This function will be called to convert incoming data into request.body
	 *
	 * @param {Function}
	 * @api public
	 */
	
	RequestBase.prototype.parse = function parse(fn){
	  this._parser = fn;
	  return this;
	};
	
	/**
	 * Set format of binary response body.
	 * In browser valid formats are 'blob' and 'arraybuffer',
	 * which return Blob and ArrayBuffer, respectively.
	 *
	 * In Node all values result in Buffer.
	 *
	 * Examples:
	 *
	 *      req.get('/')
	 *        .responseType('blob')
	 *        .end(callback);
	 *
	 * @param {String} val
	 * @return {Request} for chaining
	 * @api public
	 */
	
	RequestBase.prototype.responseType = function(val){
	  this._responseType = val;
	  return this;
	};
	
	/**
	 * Override default request body serializer
	 *
	 * This function will be called to convert data set via .send or .attach into payload to send
	 *
	 * @param {Function}
	 * @api public
	 */
	
	RequestBase.prototype.serialize = function serialize(fn){
	  this._serializer = fn;
	  return this;
	};
	
	/**
	 * Set timeouts.
	 *
	 * - response timeout is time between sending request and receiving the first byte of the response. Includes DNS and connection time.
	 * - deadline is the time from start of the request to receiving response body in full. If the deadline is too short large files may not load at all on slow connections.
	 *
	 * Value of 0 or false means no timeout.
	 *
	 * @param {Number|Object} ms or {response, read, deadline}
	 * @return {Request} for chaining
	 * @api public
	 */
	
	RequestBase.prototype.timeout = function timeout(options){
	  if (!options || 'object' !== typeof options) {
	    this._timeout = options;
	    this._responseTimeout = 0;
	    return this;
	  }
	
	  for(var option in options) {
	    switch(option) {
	      case 'deadline':
	        this._timeout = options.deadline;
	        break;
	      case 'response':
	        this._responseTimeout = options.response;
	        break;
	      default:
	        console.warn("Unknown timeout option", option);
	    }
	  }
	  return this;
	};
	
	/**
	 * Set number of retry attempts on error.
	 *
	 * Failed requests will be retried 'count' times if timeout or err.code >= 500.
	 *
	 * @param {Number} count
	 * @return {Request} for chaining
	 * @api public
	 */
	
	RequestBase.prototype.retry = function retry(count){
	  // Default to 1 if no count passed or true
	  if (arguments.length === 0 || count === true) count = 1;
	  if (count <= 0) count = 0;
	  this._maxRetries = count;
	  this._retries = 0;
	  return this;
	};
	
	/**
	 * Retry request
	 *
	 * @return {Request} for chaining
	 * @api private
	 */
	
	RequestBase.prototype._retry = function() {
	  this.clearTimeout();
	
	  // node
	  if (this.req) {
	    this.req = null;
	    this.req = this.request();
	  }
	
	  this._aborted = false;
	  this.timedout = false;
	
	  return this._end();
	};
	
	/**
	 * Promise support
	 *
	 * @param {Function} resolve
	 * @param {Function} [reject]
	 * @return {Request}
	 */
	
	RequestBase.prototype.then = function then(resolve, reject) {
	  if (!this._fullfilledPromise) {
	    var self = this;
	    if (this._endCalled) {
	      console.warn("Warning: superagent request was sent twice, because both .end() and .then() were called. Never call .end() if you use promises");
	    }
	    this._fullfilledPromise = new Promise(function(innerResolve, innerReject){
	      self.end(function(err, res){
	        if (err) innerReject(err); else innerResolve(res);
	      });
	    });
	  }
	  return this._fullfilledPromise.then(resolve, reject);
	}
	
	RequestBase.prototype.catch = function(cb) {
	  return this.then(undefined, cb);
	};
	
	/**
	 * Allow for extension
	 */
	
	RequestBase.prototype.use = function use(fn) {
	  fn(this);
	  return this;
	}
	
	RequestBase.prototype.ok = function(cb) {
	  if ('function' !== typeof cb) throw Error("Callback required");
	  this._okCallback = cb;
	  return this;
	};
	
	RequestBase.prototype._isResponseOK = function(res) {
	  if (!res) {
	    return false;
	  }
	
	  if (this._okCallback) {
	    return this._okCallback(res);
	  }
	
	  return res.status >= 200 && res.status < 300;
	};
	
	
	/**
	 * Get request header `field`.
	 * Case-insensitive.
	 *
	 * @param {String} field
	 * @return {String}
	 * @api public
	 */
	
	RequestBase.prototype.get = function(field){
	  return this._header[field.toLowerCase()];
	};
	
	/**
	 * Get case-insensitive header `field` value.
	 * This is a deprecated internal API. Use `.get(field)` instead.
	 *
	 * (getHeader is no longer used internally by the superagent code base)
	 *
	 * @param {String} field
	 * @return {String}
	 * @api private
	 * @deprecated
	 */
	
	RequestBase.prototype.getHeader = RequestBase.prototype.get;
	
	/**
	 * Set header `field` to `val`, or multiple fields with one object.
	 * Case-insensitive.
	 *
	 * Examples:
	 *
	 *      req.get('/')
	 *        .set('Accept', 'application/json')
	 *        .set('X-API-Key', 'foobar')
	 *        .end(callback);
	 *
	 *      req.get('/')
	 *        .set({ Accept: 'application/json', 'X-API-Key': 'foobar' })
	 *        .end(callback);
	 *
	 * @param {String|Object} field
	 * @param {String} val
	 * @return {Request} for chaining
	 * @api public
	 */
	
	RequestBase.prototype.set = function(field, val){
	  if (isObject(field)) {
	    for (var key in field) {
	      this.set(key, field[key]);
	    }
	    return this;
	  }
	  this._header[field.toLowerCase()] = val;
	  this.header[field] = val;
	  return this;
	};
	
	/**
	 * Remove header `field`.
	 * Case-insensitive.
	 *
	 * Example:
	 *
	 *      req.get('/')
	 *        .unset('User-Agent')
	 *        .end(callback);
	 *
	 * @param {String} field
	 */
	RequestBase.prototype.unset = function(field){
	  delete this._header[field.toLowerCase()];
	  delete this.header[field];
	  return this;
	};
	
	/**
	 * Write the field `name` and `val`, or multiple fields with one object
	 * for "multipart/form-data" request bodies.
	 *
	 * ``` js
	 * request.post('/upload')
	 *   .field('foo', 'bar')
	 *   .end(callback);
	 *
	 * request.post('/upload')
	 *   .field({ foo: 'bar', baz: 'qux' })
	 *   .end(callback);
	 * ```
	 *
	 * @param {String|Object} name
	 * @param {String|Blob|File|Buffer|fs.ReadStream} val
	 * @return {Request} for chaining
	 * @api public
	 */
	RequestBase.prototype.field = function(name, val) {
	
	  // name should be either a string or an object.
	  if (null === name ||  undefined === name) {
	    throw new Error('.field(name, val) name can not be empty');
	  }
	
	  if (this._data) {
	    console.error(".field() can't be used if .send() is used. Please use only .send() or only .field() & .attach()");
	  }
	
	  if (isObject(name)) {
	    for (var key in name) {
	      this.field(key, name[key]);
	    }
	    return this;
	  }
	
	  if (Array.isArray(val)) {
	    for (var i in val) {
	      this.field(name, val[i]);
	    }
	    return this;
	  }
	
	  // val should be defined now
	  if (null === val || undefined === val) {
	    throw new Error('.field(name, val) val can not be empty');
	  }
	  if ('boolean' === typeof val) {
	    val = '' + val;
	  }
	  this._getFormData().append(name, val);
	  return this;
	};
	
	/**
	 * Abort the request, and clear potential timeout.
	 *
	 * @return {Request}
	 * @api public
	 */
	RequestBase.prototype.abort = function(){
	  if (this._aborted) {
	    return this;
	  }
	  this._aborted = true;
	  this.xhr && this.xhr.abort(); // browser
	  this.req && this.req.abort(); // node
	  this.clearTimeout();
	  this.emit('abort');
	  return this;
	};
	
	/**
	 * Enable transmission of cookies with x-domain requests.
	 *
	 * Note that for this to work the origin must not be
	 * using "Access-Control-Allow-Origin" with a wildcard,
	 * and also must set "Access-Control-Allow-Credentials"
	 * to "true".
	 *
	 * @api public
	 */
	
	RequestBase.prototype.withCredentials = function(on){
	  // This is browser-only functionality. Node side is no-op.
	  if(on==undefined) on = true;
	  this._withCredentials = on;
	  return this;
	};
	
	/**
	 * Set the max redirects to `n`. Does noting in browser XHR implementation.
	 *
	 * @param {Number} n
	 * @return {Request} for chaining
	 * @api public
	 */
	
	RequestBase.prototype.redirects = function(n){
	  this._maxRedirects = n;
	  return this;
	};
	
	/**
	 * Convert to a plain javascript object (not JSON string) of scalar properties.
	 * Note as this method is designed to return a useful non-this value,
	 * it cannot be chained.
	 *
	 * @return {Object} describing method, url, and data of this request
	 * @api public
	 */
	
	RequestBase.prototype.toJSON = function(){
	  return {
	    method: this.method,
	    url: this.url,
	    data: this._data,
	    headers: this._header
	  };
	};
	
	
	/**
	 * Send `data` as the request body, defaulting the `.type()` to "json" when
	 * an object is given.
	 *
	 * Examples:
	 *
	 *       // manual json
	 *       request.post('/user')
	 *         .type('json')
	 *         .send('{"name":"tj"}')
	 *         .end(callback)
	 *
	 *       // auto json
	 *       request.post('/user')
	 *         .send({ name: 'tj' })
	 *         .end(callback)
	 *
	 *       // manual x-www-form-urlencoded
	 *       request.post('/user')
	 *         .type('form')
	 *         .send('name=tj')
	 *         .end(callback)
	 *
	 *       // auto x-www-form-urlencoded
	 *       request.post('/user')
	 *         .type('form')
	 *         .send({ name: 'tj' })
	 *         .end(callback)
	 *
	 *       // defaults to x-www-form-urlencoded
	 *      request.post('/user')
	 *        .send('name=tobi')
	 *        .send('species=ferret')
	 *        .end(callback)
	 *
	 * @param {String|Object} data
	 * @return {Request} for chaining
	 * @api public
	 */
	
	RequestBase.prototype.send = function(data){
	  var isObj = isObject(data);
	  var type = this._header['content-type'];
	
	  if (this._formData) {
	    console.error(".send() can't be used if .attach() or .field() is used. Please use only .send() or only .field() & .attach()");
	  }
	
	  if (isObj && !this._data) {
	    if (Array.isArray(data)) {
	      this._data = [];
	    } else if (!this._isHost(data)) {
	      this._data = {};
	    }
	  } else if (data && this._data && this._isHost(this._data)) {
	    throw Error("Can't merge these send calls");
	  }
	
	  // merge
	  if (isObj && isObject(this._data)) {
	    for (var key in data) {
	      this._data[key] = data[key];
	    }
	  } else if ('string' == typeof data) {
	    // default to x-www-form-urlencoded
	    if (!type) this.type('form');
	    type = this._header['content-type'];
	    if ('application/x-www-form-urlencoded' == type) {
	      this._data = this._data
	        ? this._data + '&' + data
	        : data;
	    } else {
	      this._data = (this._data || '') + data;
	    }
	  } else {
	    this._data = data;
	  }
	
	  if (!isObj || this._isHost(data)) {
	    return this;
	  }
	
	  // default to json
	  if (!type) this.type('json');
	  return this;
	};
	
	
	/**
	 * Sort `querystring` by the sort function
	 *
	 *
	 * Examples:
	 *
	 *       // default order
	 *       request.get('/user')
	 *         .query('name=Nick')
	 *         .query('search=Manny')
	 *         .sortQuery()
	 *         .end(callback)
	 *
	 *       // customized sort function
	 *       request.get('/user')
	 *         .query('name=Nick')
	 *         .query('search=Manny')
	 *         .sortQuery(function(a, b){
	 *           return a.length - b.length;
	 *         })
	 *         .end(callback)
	 *
	 *
	 * @param {Function} sort
	 * @return {Request} for chaining
	 * @api public
	 */
	
	RequestBase.prototype.sortQuery = function(sort) {
	  // _sort default to true but otherwise can be a function or boolean
	  this._sort = typeof sort === 'undefined' ? true : sort;
	  return this;
	};
	
	/**
	 * Invoke callback with timeout error.
	 *
	 * @api private
	 */
	
	RequestBase.prototype._timeoutError = function(reason, timeout, errno){
	  if (this._aborted) {
	    return;
	  }
	  var err = new Error(reason + timeout + 'ms exceeded');
	  err.timeout = timeout;
	  err.code = 'ECONNABORTED';
	  err.errno = errno;
	  this.timedout = true;
	  this.abort();
	  this.callback(err);
	};
	
	RequestBase.prototype._setTimeouts = function() {
	  var self = this;
	
	  // deadline
	  if (this._timeout && !this._timer) {
	    this._timer = setTimeout(function(){
	      self._timeoutError('Timeout of ', self._timeout, 'ETIME');
	    }, this._timeout);
	  }
	  // response timeout
	  if (this._responseTimeout && !this._responseTimeoutTimer) {
	    this._responseTimeoutTimer = setTimeout(function(){
	      self._timeoutError('Response timeout of ', self._responseTimeout, 'ETIMEDOUT');
	    }, this._responseTimeout);
	  }
	}


/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	
	/**
	 * Module dependencies.
	 */
	
	var utils = __webpack_require__(36);
	
	/**
	 * Expose `ResponseBase`.
	 */
	
	module.exports = ResponseBase;
	
	/**
	 * Initialize a new `ResponseBase`.
	 *
	 * @api public
	 */
	
	function ResponseBase(obj) {
	  if (obj) return mixin(obj);
	}
	
	/**
	 * Mixin the prototype properties.
	 *
	 * @param {Object} obj
	 * @return {Object}
	 * @api private
	 */
	
	function mixin(obj) {
	  for (var key in ResponseBase.prototype) {
	    obj[key] = ResponseBase.prototype[key];
	  }
	  return obj;
	}
	
	/**
	 * Get case-insensitive `field` value.
	 *
	 * @param {String} field
	 * @return {String}
	 * @api public
	 */
	
	ResponseBase.prototype.get = function(field){
	    return this.header[field.toLowerCase()];
	};
	
	/**
	 * Set header related properties:
	 *
	 *   - `.type` the content type without params
	 *
	 * A response of "Content-Type: text/plain; charset=utf-8"
	 * will provide you with a `.type` of "text/plain".
	 *
	 * @param {Object} header
	 * @api private
	 */
	
	ResponseBase.prototype._setHeaderProperties = function(header){
	    // TODO: moar!
	    // TODO: make this a util
	
	    // content-type
	    var ct = header['content-type'] || '';
	    this.type = utils.type(ct);
	
	    // params
	    var params = utils.params(ct);
	    for (var key in params) this[key] = params[key];
	
	    this.links = {};
	
	    // links
	    try {
	        if (header.link) {
	            this.links = utils.parseLinks(header.link);
	        }
	    } catch (err) {
	        // ignore
	    }
	};
	
	/**
	 * Set flags such as `.ok` based on `status`.
	 *
	 * For example a 2xx response will give you a `.ok` of __true__
	 * whereas 5xx will be __false__ and `.error` will be __true__. The
	 * `.clientError` and `.serverError` are also available to be more
	 * specific, and `.statusType` is the class of error ranging from 1..5
	 * sometimes useful for mapping respond colors etc.
	 *
	 * "sugar" properties are also defined for common cases. Currently providing:
	 *
	 *   - .noContent
	 *   - .badRequest
	 *   - .unauthorized
	 *   - .notAcceptable
	 *   - .notFound
	 *
	 * @param {Number} status
	 * @api private
	 */
	
	ResponseBase.prototype._setStatusProperties = function(status){
	    var type = status / 100 | 0;
	
	    // status / class
	    this.status = this.statusCode = status;
	    this.statusType = type;
	
	    // basics
	    this.info = 1 == type;
	    this.ok = 2 == type;
	    this.redirect = 3 == type;
	    this.clientError = 4 == type;
	    this.serverError = 5 == type;
	    this.error = (4 == type || 5 == type)
	        ? this.toError()
	        : false;
	
	    // sugar
	    this.accepted = 202 == status;
	    this.noContent = 204 == status;
	    this.badRequest = 400 == status;
	    this.unauthorized = 401 == status;
	    this.notAcceptable = 406 == status;
	    this.forbidden = 403 == status;
	    this.notFound = 404 == status;
	};


/***/ },
/* 35 */
/***/ function(module, exports) {

	var ERROR_CODES = [
	  'ECONNRESET',
	  'ETIMEDOUT',
	  'EADDRINFO',
	  'ESOCKETTIMEDOUT'
	];
	
	/**
	 * Determine if a request should be retried.
	 * (Borrowed from segmentio/superagent-retry)
	 *
	 * @param {Error} err
	 * @param {Response} [res]
	 * @returns {Boolean}
	 */
	module.exports = function shouldRetry(err, res) {
	  if (err && err.code && ~ERROR_CODES.indexOf(err.code)) return true;
	  if (res && res.status && res.status >= 500) return true;
	  // Superagent timeout
	  if (err && 'timeout' in err && err.code == 'ECONNABORTED') return true;
	  return false;
	};

/***/ },
/* 36 */
/***/ function(module, exports) {

	
	/**
	 * Return the mime type for the given `str`.
	 *
	 * @param {String} str
	 * @return {String}
	 * @api private
	 */
	
	exports.type = function(str){
	  return str.split(/ *; */).shift();
	};
	
	/**
	 * Return header field parameters.
	 *
	 * @param {String} str
	 * @return {Object}
	 * @api private
	 */
	
	exports.params = function(str){
	  return str.split(/ *; */).reduce(function(obj, str){
	    var parts = str.split(/ *= */);
	    var key = parts.shift();
	    var val = parts.shift();
	
	    if (key && val) obj[key] = val;
	    return obj;
	  }, {});
	};
	
	/**
	 * Parse Link header fields.
	 *
	 * @param {String} str
	 * @return {Object}
	 * @api private
	 */
	
	exports.parseLinks = function(str){
	  return str.split(/ *, */).reduce(function(obj, str){
	    var parts = str.split(/ *; */);
	    var url = parts[0].slice(1, -1);
	    var rel = parts[1].split(/ *= */)[1].slice(1, -1);
	    obj[rel] = url;
	    return obj;
	  }, {});
	};
	
	/**
	 * Strip content related fields from `header`.
	 *
	 * @param {Object} header
	 * @return {Object} header
	 * @api private
	 */
	
	exports.cleanHeader = function(header, shouldStripCookie){
	  delete header['content-type'];
	  delete header['content-length'];
	  delete header['transfer-encoding'];
	  delete header['host'];
	  if (shouldStripCookie) {
	    delete header['cookie'];
	  }
	  return header;
	};

/***/ },
/* 37 */,
/* 38 */,
/* 39 */,
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	var urljoin = __webpack_require__(1);
	
	var objectHelper = __webpack_require__(2);
	var assert = __webpack_require__(4);
	var responseHandler = __webpack_require__(6);
	
	function DBConnection(request, options) {
	  this.baseOptions = options;
	  this.request = request;
	}
	
	/**
	 * @callback signUpCallback
	 * @param {Error} [err] error returned by Auth0 with the reason why the signup failed
	 * @param {Object} [result] result of the signup request
	 * @param {Object} result.email user's email
	 * @param {Object} result.emailVerified if the user's email was verified
	 */
	
	/**
	 * Creates a new user in a Auth0 Database connection
	 *
	 * @method signup
	 * @param {Object} options
	 * @param {String} options.email user email address
	 * @param {String} options.password user password
	 * @param {String} options.connection name of the connection where the user will be created
	 * @param {Object} [options.userMetadata] additional signup attributes used for creating the user. Will be stored in `user_metadata`
	 * @param {signUpCallback} cb
	 * @see   {@link https://auth0.com/docs/api/authentication#signup}
	 */
	DBConnection.prototype.signup = function(options, cb) {
	  var url;
	  var body;
	  var metadata;
	
	  assert.check(
	    options,
	    { type: 'object', message: 'options parameter is not valid' },
	    {
	      connection: { type: 'string', message: 'connection option is required' },
	      email: { type: 'string', message: 'email option is required' },
	      password: { type: 'string', message: 'password option is required' }
	    }
	  );
	  assert.check(cb, { type: 'function', message: 'cb parameter is not valid' });
	
	  url = urljoin(this.baseOptions.rootUrl, 'dbconnections', 'signup');
	
	  body = objectHelper.merge(this.baseOptions, ['clientID']).with(options);
	
	  metadata = body.user_metadata || body.userMetadata;
	
	  body = objectHelper.blacklist(body, ['scope', 'userMetadata', 'user_metadata']);
	
	  body = objectHelper.toSnakeCase(body, ['auth0Client']);
	
	  if (metadata) {
	    body.user_metadata = metadata;
	  }
	
	  return this.request.post(url).send(body).end(responseHandler(cb));
	};
	
	/**
	 * @callback changePasswordCallback
	 * @param {Error} [err] error returned by Auth0 with the reason why the request failed
	 */
	
	/**
	 * Request an email with instruction to change a user's password
	 *
	 * @method changePassword
	 * @param {Object} options
	 * @param {String} options.email address where the user will recieve the change password email. It should match the user's email in Auth0
	 * @param {String} options.connection name of the connection where the user was created
	 * @param {changePasswordCallback} cb
	 * @see   {@link https://auth0.com/docs/api/authentication#change-password}
	 */
	DBConnection.prototype.changePassword = function(options, cb) {
	  var url;
	  var body;
	
	  assert.check(
	    options,
	    { type: 'object', message: 'options parameter is not valid' },
	    {
	      connection: { type: 'string', message: 'connection option is required' },
	      email: { type: 'string', message: 'email option is required' }
	    }
	  );
	  assert.check(cb, { type: 'function', message: 'cb parameter is not valid' });
	
	  url = urljoin(this.baseOptions.rootUrl, 'dbconnections', 'change_password');
	
	  body = objectHelper.merge(this.baseOptions, ['clientID']).with(options, ['email', 'connection']);
	
	  body = objectHelper.toSnakeCase(body, ['auth0Client']);
	
	  return this.request.post(url).send(body).end(responseHandler(cb));
	};
	
	module.exports = DBConnection;


/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	var urljoin = __webpack_require__(1);
	
	var objectHelper = __webpack_require__(2);
	var assert = __webpack_require__(4);
	var qs = __webpack_require__(5);
	var responseHandler = __webpack_require__(6);
	
	function PasswordlessAuthentication(request, options) {
	  this.baseOptions = options;
	  this.request = request;
	}
	
	PasswordlessAuthentication.prototype.buildVerifyUrl = function(options) {
	  var params;
	  var qString;
	
	  /* eslint-disable */
	  assert.check(
	    options,
	    { type: 'object', message: 'options parameter is not valid' },
	    {
	      connection: { type: 'string', message: 'connection option is required' },
	      verificationCode: { type: 'string', message: 'verificationCode option is required' },
	      phoneNumber: {
	        optional: false,
	        type: 'string',
	        message: 'phoneNumber option is required',
	        condition: function(o) {
	          return !o.email;
	        }
	      },
	      email: {
	        optional: false,
	        type: 'string',
	        message: 'email option is required',
	        condition: function(o) {
	          return !o.phoneNumber;
	        }
	      }
	    }
	  );
	  /* eslint-enable */
	
	  params = objectHelper
	    .merge(this.baseOptions, [
	      'clientID',
	      'responseType',
	      'responseMode',
	      'redirectUri',
	      'scope',
	      'audience',
	      '_csrf',
	      'state',
	      '_intstate',
	      'protocol',
	      'nonce'
	    ])
	    .with(options);
	
	  // eslint-disable-next-line
	  if (this.baseOptions._sendTelemetry) {
	    params.auth0Client = this.request.getTelemetryData();
	  }
	
	  params = objectHelper.toSnakeCase(params, ['auth0Client']);
	
	  qString = qs.stringify(params);
	
	  return urljoin(this.baseOptions.rootUrl, 'passwordless', 'verify_redirect', '?' + qString);
	};
	
	PasswordlessAuthentication.prototype.start = function(options, cb) {
	  var url;
	  var body;
	
	  /* eslint-disable */
	  assert.check(
	    options,
	    { type: 'object', message: 'options parameter is not valid' },
	    {
	      connection: { type: 'string', message: 'connection option is required' },
	      send: {
	        type: 'string',
	        message: 'send option is required',
	        values: ['link', 'code'],
	        value_message: 'send is not valid ([link, code])'
	      },
	      phoneNumber: {
	        optional: true,
	        type: 'string',
	        message: 'phoneNumber option is required',
	        condition: function(o) {
	          return o.send === 'code' || !o.email;
	        }
	      },
	      email: {
	        optional: true,
	        type: 'string',
	        message: 'email option is required',
	        condition: function(o) {
	          return o.send === 'link' || !o.phoneNumber;
	        }
	      },
	      authParams: { optional: true, type: 'object', message: 'authParams option is required' }
	    }
	  );
	  /* eslint-enable */
	
	  assert.check(cb, { type: 'function', message: 'cb parameter is not valid' });
	
	  url = urljoin(this.baseOptions.rootUrl, 'passwordless', 'start');
	
	  body = objectHelper
	    .merge(this.baseOptions, ['clientID', 'responseType', 'redirectUri', 'scope'])
	    .with(options);
	
	  if (body.scope) {
	    body.authParams = body.authParams || {};
	    body.authParams.scope = body.scope;
	  }
	
	  if (body.redirectUri) {
	    body.authParams = body.authParams || {};
	    body.authParams.redirect_uri = body.redirectUri;
	  }
	
	  if (body.responseType) {
	    body.authParams = body.authParams || {};
	    body.authParams.response_type = body.responseType;
	  }
	
	  delete body.redirectUri;
	  delete body.responseType;
	  delete body.scope;
	
	  body = objectHelper.toSnakeCase(body, ['auth0Client', 'authParams']);
	
	  return this.request.post(url).send(body).end(responseHandler(cb));
	};
	
	PasswordlessAuthentication.prototype.verify = function(options, cb) {
	  var url;
	  var cleanOption;
	
	  /* eslint-disable */
	  assert.check(
	    options,
	    { type: 'object', message: 'options parameter is not valid' },
	    {
	      connection: { type: 'string', message: 'connection option is required' },
	      verificationCode: { type: 'string', message: 'verificationCode option is required' },
	      phoneNumber: {
	        optional: false,
	        type: 'string',
	        message: 'phoneNumber option is required',
	        condition: function(o) {
	          return !o.email;
	        }
	      },
	      email: {
	        optional: false,
	        type: 'string',
	        message: 'email option is required',
	        condition: function(o) {
	          return !o.phoneNumber;
	        }
	      }
	    }
	  );
	  /* eslint-enable */
	
	  assert.check(cb, { type: 'function', message: 'cb parameter is not valid' });
	
	  cleanOption = objectHelper.pick(options, [
	    'connection',
	    'verificationCode',
	    'phoneNumber',
	    'email',
	    'auth0Client'
	  ]);
	  cleanOption = objectHelper.toSnakeCase(cleanOption, ['auth0Client']);
	
	  url = urljoin(this.baseOptions.rootUrl, 'passwordless', 'verify');
	
	  return this.request.post(url).send(cleanOption).end(responseHandler(cb));
	};
	
	module.exports = PasswordlessAuthentication;


/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	var windowHandler = __webpack_require__(3);
	var base64Url = __webpack_require__(20);
	
	function create(name, value, days) {
	  var date;
	  var expires;
	
	  if (
	    windowHandler.getDocument().cookie === undefined ||
	    windowHandler.getDocument().cookie === null
	  ) {
	    throw new Error('cookie storage not available');
	  }
	
	  if (days) {
	    var timeToExpire = days * 24 * 60 * 60 * 1000;
	    date = new Date();
	    date.setTime(date.getTime() + timeToExpire);
	    expires = '; expires=' + date.toGMTString();
	  } else {
	    expires = '';
	  }
	
	  windowHandler.getDocument().cookie = name + '=' + base64Url.encode(value) + expires + '; path=/';
	}
	
	function read(name) {
	  var i;
	  var cookie;
	  var cookies;
	  var nameEQ = name + '=';
	
	  if (
	    windowHandler.getDocument().cookie === undefined ||
	    windowHandler.getDocument().cookie === null
	  ) {
	    throw new Error('cookie storage not available');
	  }
	
	  cookies = windowHandler.getDocument().cookie.split(';');
	
	  for (i = 0; i < cookies.length; i++) {
	    cookie = cookies[i];
	    while (cookie.charAt(0) === ' ') {
	      cookie = cookie.substring(1, cookie.length);
	    }
	    if (cookie.indexOf(nameEQ) === 0) {
	      return base64Url.decode(cookie.substring(nameEQ.length, cookie.length));
	    }
	  }
	
	  return null;
	}
	
	function erase(name) {
	  create(name, '', -1);
	}
	
	module.exports = {
	  create: create,
	  read: read,
	  erase: erase
	};


/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	var windowHelper = __webpack_require__(3);
	
	function IframeHandler(options) {
	  this.url = options.url;
	  this.callback = options.callback;
	  this.timeout = options.timeout || 60 * 1000;
	  this.timeoutCallback = options.timeoutCallback || null;
	  this.eventListenerType = options.eventListenerType || 'message';
	  this.iframe = null;
	  this.timeoutHandle = null;
	  this._destroyTimeout = null;
	  this.transientMessageEventListener = null;
	  this.proxyEventListener = null;
	  // If no event identifier specified, set default
	  this.eventValidator = options.eventValidator || {
	    isValid: function() {
	      return true;
	    }
	  };
	
	  if (typeof this.callback !== 'function') {
	    throw new Error('options.callback must be a function');
	  }
	}
	
	IframeHandler.prototype.init = function() {
	  var _this = this;
	  var _window = windowHelper.getWindow();
	
	  this.iframe = _window.document.createElement('iframe');
	  this.iframe.style.display = 'none';
	  this.iframe.src = this.url;
	
	  // Workaround to avoid using bind that does not work in IE8
	  this.proxyEventListener = function(e) {
	    _this.eventListener(e);
	  };
	
	  switch (this.eventListenerType) {
	    case 'message':
	      this.eventSourceObject = _window;
	      break;
	    case 'load':
	      this.eventSourceObject = this.iframe;
	      break;
	    default:
	      throw new Error('Unsupported event listener type: ' + this.eventListenerType);
	  }
	
	  this.eventSourceObject.addEventListener(this.eventListenerType, this.proxyEventListener, false);
	
	  _window.document.body.appendChild(this.iframe);
	
	  this.timeoutHandle = setTimeout(function() {
	    _this.timeoutHandler();
	  }, this.timeout);
	};
	
	IframeHandler.prototype.eventListener = function(event) {
	  var eventData = { event: event, sourceObject: this.eventSourceObject };
	
	  if (!this.eventValidator.isValid(eventData)) {
	    return;
	  }
	
	  this.destroy();
	  this.callback(eventData);
	};
	
	IframeHandler.prototype.timeoutHandler = function() {
	  this.destroy();
	  if (this.timeoutCallback) {
	    this.timeoutCallback();
	  }
	};
	
	IframeHandler.prototype.destroy = function() {
	  var _this = this;
	  var _window = windowHelper.getWindow();
	
	  clearTimeout(this.timeoutHandle);
	
	  this._destroyTimeout = setTimeout(function() {
	    _this.eventSourceObject.removeEventListener(
	      _this.eventListenerType,
	      _this.proxyEventListener,
	      false
	    );
	    _window.document.body.removeChild(_this.iframe);
	  }, 0);
	};
	
	module.exports = IframeHandler;


/***/ },
/* 44 */
/***/ function(module, exports) {

	/* eslint-disable no-continue */
	
	function get() {
	  if (!Object.assign) {
	    return objectAssignPolyfill;
	  }
	
	  return Object.assign;
	}
	
	function objectAssignPolyfill(target) {
	  'use strict';
	  if (target === undefined || target === null) {
	    throw new TypeError('Cannot convert first argument to object');
	  }
	
	  var to = Object(target);
	  for (var i = 1; i < arguments.length; i++) {
	    var nextSource = arguments[i];
	    if (nextSource === undefined || nextSource === null) {
	      continue;
	    }
	
	    var keysArray = Object.keys(Object(nextSource));
	    for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
	      var nextKey = keysArray[nextIndex];
	      var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
	      if (desc !== undefined && desc.enumerable) {
	        to[nextKey] = nextSource[nextKey];
	      }
	    }
	  }
	  return to;
	}
	
	module.exports = {
	  get: get,
	  objectAssignPolyfill: objectAssignPolyfill
	};


/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	var objectHelper = __webpack_require__(2);
	
	var tokenParams = [
	  // auth0
	  'realm',
	  'audience',
	  // oauth2
	  'client_id',
	  'client_secret',
	  'redirect_uri',
	  'scope',
	  'code',
	  'grant_type',
	  'username',
	  'password',
	  'refresh_token',
	  'assertion',
	  'client_assertion',
	  'client_assertion_type',
	  'code_verifier'
	];
	
	var authorizeParams = [
	  // auth0
	  'connection',
	  'connection_scope',
	  'auth0Client',
	  'owp',
	  'device',
	
	  'protocol',
	  '_csrf',
	  '_intstate',
	  'login_ticket',
	
	  // oauth2
	  'client_id',
	  'response_type',
	  'response_mode',
	  'redirect_uri',
	  'audience',
	  'scope',
	  'state',
	  'nonce',
	  'display',
	  'prompt',
	  'max_age',
	  'ui_locales',
	  'claims_locales',
	  'id_token_hint',
	  'login_hint',
	  'acr_values',
	  'claims',
	  'registration',
	  'request',
	  'request_uri',
	  'code_challenge',
	  'code_challenge_method'
	];
	
	function oauthAuthorizeParams(warn, params) {
	  var notAllowed = objectHelper.getKeysNotIn(params, authorizeParams);
	
	  if (notAllowed.length > 0) {
	    warn.warning(
	      'Following parameters are not allowed on the `/authorize` endpoint: [' +
	        notAllowed.join(',') +
	        ']'
	    );
	  }
	
	  return params;
	}
	
	function oauthTokenParams(warn, params) {
	  return objectHelper.pick(params, tokenParams);
	}
	
	module.exports = {
	  oauthTokenParams: oauthTokenParams,
	  oauthAuthorizeParams: oauthAuthorizeParams
	};


/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	var version = __webpack_require__(9);
	
	function PluginHandler(webAuth, plugins) {
	  this.plugins = plugins;
	
	  for (var a = 0; a < this.plugins.length; a++) {
	    if (this.plugins[a].version !== version.raw) {
	      var pluginName = '';
	
	      if (this.plugins[a].constructor && this.plugins[a].constructor.name) {
	        pluginName = this.plugins[a].constructor.name;
	      }
	
	      throw new Error(
	        'Plugin ' +
	          pluginName +
	          ' version (' +
	          this.plugins[a].version +
	          ') ' +
	          'is not compatible with the SDK version (' +
	          version.raw +
	          ')'
	      );
	    }
	
	    this.plugins[a].setWebAuth(webAuth);
	  }
	}
	
	PluginHandler.prototype.get = function(extensibilityPoint) {
	  for (var a = 0; a < this.plugins.length; a++) {
	    if (this.plugins[a].supports(extensibilityPoint)) {
	      return this.plugins[a].init();
	    }
	  }
	
	  return null;
	};
	
	module.exports = PluginHandler;


/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	/* eslint-disable no-restricted-syntax */
	/* eslint-disable guard-for-in */
	var WinChan = __webpack_require__(18);
	
	var windowHandler = __webpack_require__(3);
	var objectHelper = __webpack_require__(2);
	var qs = __webpack_require__(5);
	
	function PopupHandler() {
	  this._current_popup = null;
	}
	
	PopupHandler.prototype.calculatePosition = function(options) {
	  var width = options.width || 500;
	  var height = options.height || 600;
	  var _window = windowHandler.getWindow();
	
	  var screenX = typeof _window.screenX !== 'undefined' ? _window.screenX : _window.screenLeft;
	  var screenY = typeof _window.screenY !== 'undefined' ? _window.screenY : _window.screenTop;
	
	  var outerWidth = typeof _window.outerWidth !== 'undefined'
	    ? _window.outerWidth
	    : _window.document.body.clientWidth;
	
	  var outerHeight = typeof _window.outerHeight !== 'undefined'
	    ? _window.outerHeight
	    : _window.document.body.clientHeight;
	
	  var left = (outerWidth - width) / 2;
	  var top = (outerHeight - height) / 2;
	
	  return { width: width, height: height, left: screenX + left, top: screenY + top };
	};
	
	PopupHandler.prototype.preload = function(options) {
	  var _this = this;
	  var _window = windowHandler.getWindow();
	  var popupPosition = this.calculatePosition(options.popupOptions || {});
	  var popupOptions = objectHelper.merge(popupPosition).with(options.popupOptions);
	  var url = options.url || 'about:blank';
	  var windowFeatures = qs.stringify(popupOptions, {
	    encode: false,
	    delimiter: ','
	  });
	
	  if (this._current_popup && !this._current_popup.closed) {
	    return this._current_popup;
	  }
	
	  this._current_popup = _window.open(url, 'auth0_signup_popup', windowFeatures);
	
	  this._current_popup.kill = function() {
	    this.close();
	    _this._current_popup = null;
	  };
	
	  return this._current_popup;
	};
	
	PopupHandler.prototype.load = function(url, relayUrl, options, cb) {
	  var _this = this;
	  var popupPosition = this.calculatePosition(options.popupOptions || {});
	  var popupOptions = objectHelper.merge(popupPosition).with(options.popupOptions);
	
	  var winchanOptions = objectHelper
	    .merge({
	      url: url,
	      relay_url: relayUrl,
	      window_features: qs.stringify(popupOptions, {
	        delimiter: ',',
	        encode: false
	      }),
	      popup: this._current_popup
	    })
	    .with(options);
	
	  var popup = WinChan.open(winchanOptions, function(err, data) {
	    _this._current_popup = null;
	    return cb(err, data);
	  });
	
	  popup.focus();
	
	  return popup;
	};
	
	module.exports = PopupHandler;


/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	var windowHelper = __webpack_require__(3);
	
	function randomString(length) {
	  // eslint-disable-next-line
	  var bytes = new Uint8Array(length);
	  var result = [];
	  var charset = '0123456789ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklmnopqrstuvwxyz-._~';
	
	  var cryptoObj = windowHelper.getWindow().crypto || windowHelper.getWindow().msCrypto;
	  if (!cryptoObj) {
	    return null;
	  }
	
	  var random = cryptoObj.getRandomValues(bytes);
	
	  for (var a = 0; a < random.length; a++) {
	    result.push(charset[random[a] % charset.length]);
	  }
	
	  return result.join('');
	}
	
	module.exports = {
	  randomString: randomString
	};


/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	var StorageHandler = __webpack_require__(52);
	var storage;
	
	function getStorage(force) {
	  if (!storage || force) {
	    storage = new StorageHandler();
	  }
	  return storage;
	}
	
	module.exports = {
	  getItem: function(key) {
	    var value = getStorage().getItem(key);
	    return value ? JSON.parse(value) : value;
	  },
	  removeItem: function(key) {
	    return getStorage().removeItem(key);
	  },
	  setItem: function(key, value) {
	    var json = JSON.stringify(value);
	    return getStorage().setItem(key, json);
	  },
	  reload: function() {
	    getStorage(true);
	  }
	};


/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	var cookies = __webpack_require__(42);
	
	function CookieStorage() {}
	
	CookieStorage.prototype.getItem = function(key) {
	  return cookies.read(key);
	};
	
	CookieStorage.prototype.removeItem = function(key) {
	  cookies.erase(key);
	};
	
	CookieStorage.prototype.setItem = function(key, value) {
	  cookies.create(key, value, 1);
	};
	
	module.exports = CookieStorage;


/***/ },
/* 51 */
/***/ function(module, exports) {

	function DummyStorage() {}
	
	DummyStorage.prototype.getItem = function() {
	  return null;
	};
	
	DummyStorage.prototype.removeItem = function() {};
	
	DummyStorage.prototype.setItem = function() {};
	
	module.exports = DummyStorage;


/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	var windowHandler = __webpack_require__(3);
	var DummyStorage = __webpack_require__(51);
	var CookieStorage = __webpack_require__(50);
	var Warn = __webpack_require__(11);
	
	function StorageHandler() {
	  this.warn = new Warn({});
	  this.storage = windowHandler.getWindow().localStorage || new CookieStorage();
	}
	
	StorageHandler.prototype.failover = function() {
	  if (this.storage instanceof DummyStorage) {
	    this.warn.warning('DummyStorage: ignore failover');
	    return;
	  } else if (this.storage instanceof CookieStorage) {
	    this.warn.warning('CookieStorage: failing over DummyStorage');
	    this.storage = new DummyStorage();
	  } else {
	    this.warn.warning('LocalStorage: failing over CookieStorage');
	    this.storage = new CookieStorage();
	  }
	};
	
	StorageHandler.prototype.getItem = function(key) {
	  try {
	    return this.storage.getItem(key);
	  } catch (e) {
	    this.warn.warning(e);
	    this.failover();
	    return this.getItem(key);
	  }
	};
	
	StorageHandler.prototype.removeItem = function(key) {
	  try {
	    return this.storage.removeItem(key);
	  } catch (e) {
	    this.warn.warning(e);
	    this.failover();
	    return this.removeItem(key);
	  }
	};
	
	StorageHandler.prototype.setItem = function(key, value) {
	  try {
	    return this.storage.setItem(key, value);
	  } catch (e) {
	    this.warn.warning(e);
	    this.failover();
	    return this.setItem(key, value);
	  }
	};
	
	module.exports = StorageHandler;


/***/ },
/* 53 */
/***/ function(module, exports) {

	// given a URL, extract the origin. Taken from: https://github.com/firebase/firebase-simple-login/blob/d2cb95b9f812d8488bdbfba51c3a7c153ba1a074/js/src/simple-login/transports/WinChan.js#L25-L30
	function extractOrigin(url) {
	  if (!/^https?:\/\//.test(url)) url = window.location.href;
	  var m = /^(https?:\/\/[-_a-zA-Z.0-9:]+)/.exec(url);
	  if (m) return m[1];
	  return url;
	}
	
	module.exports = {
	  extractOrigin: extractOrigin
	};


/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	var Authentication = __webpack_require__(19);
	var Management = __webpack_require__(55);
	var WebAuth = __webpack_require__(57);
	var version = __webpack_require__(9);
	
	module.exports = {
	  Authentication: Authentication,
	  Management: Management,
	  WebAuth: WebAuth,
	  version: version.raw
	};


/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	var urljoin = __webpack_require__(1);
	
	var RequestBuilder = __webpack_require__(10);
	var assert = __webpack_require__(4);
	var responseHandler = __webpack_require__(6);
	
	/**
	 * Auth0 Management API Client (methods allowed to be called from the browser only)
	 * @constructor
	 * @param {Object} options
	 * @param {Object} options.domain your Auth0 acount domain
	 * @param {Object} options.token a valid API token
	 */
	function Management(options) {
	  /* eslint-disable */
	  assert.check(
	    options,
	    { type: 'object', message: 'options parameter is not valid' },
	    {
	      domain: { type: 'string', message: 'domain option is required' },
	      token: { type: 'string', message: 'token option is required' },
	      _sendTelemetry: {
	        optional: true,
	        type: 'boolean',
	        message: '_sendTelemetry option is not valid'
	      },
	      _telemetryInfo: {
	        optional: true,
	        type: 'object',
	        message: '_telemetryInfo option is not valid'
	      }
	    }
	  );
	  /* eslint-enable */
	
	  this.baseOptions = options;
	
	  this.baseOptions.headers = { Authorization: 'Bearer ' + this.baseOptions.token };
	
	  this.request = new RequestBuilder(this.baseOptions);
	  this.baseOptions.rootUrl = urljoin('https://' + this.baseOptions.domain, 'api', 'v2');
	}
	
	/**
	 * @callback userCallback
	 * @param {Error} [err] failure reason for the failed request to Management API
	 * @param {Object} [result] user profile
	 */
	
	/**
	 * Returns the user profile
	 *
	 * @method getUser
	 * @param {String} userId identifier of the user to retrieve
	 * @param {userCallback} cb
	 * @see https://auth0.com/docs/api/management/v2#!/Users/get_users_by_id
	 */
	Management.prototype.getUser = function(userId, cb) {
	  var url;
	
	  assert.check(userId, { type: 'string', message: 'userId parameter is not valid' });
	  assert.check(cb, { type: 'function', message: 'cb parameter is not valid' });
	
	  url = urljoin(this.baseOptions.rootUrl, 'users', userId);
	
	  return this.request.get(url).end(responseHandler(cb, { ignoreCasing: true }));
	};
	
	/**
	 * Updates the user metdata. It will patch the user metdata with the attributes sent.
	 *
	 *
	 * @method patchUserMetadata
	 * @param {String} userId
	 * @param {Object} userMetadata
	 * @param {userCallback} cb
	 * @see   {@link https://auth0.com/docs/api/management/v2#!/Users/patch_users_by_id}
	 */
	Management.prototype.patchUserMetadata = function(userId, userMetadata, cb) {
	  var url;
	
	  assert.check(userId, { type: 'string', message: 'userId parameter is not valid' });
	  assert.check(userMetadata, { type: 'object', message: 'userMetadata parameter is not valid' });
	  assert.check(cb, { type: 'function', message: 'cb parameter is not valid' });
	
	  url = urljoin(this.baseOptions.rootUrl, 'users', userId);
	
	  return this.request
	    .patch(url)
	    .send({ user_metadata: userMetadata })
	    .end(responseHandler(cb, { ignoreCasing: true }));
	};
	
	/**
	 * Link two users
	 *
	 * @method linkUser
	 * @param {String} userId
	 * @param {String} secondaryUserToken
	 * @param {userCallback} cb
	 * @see   {@link https://auth0.com/docs/api/management/v2#!/Users/post_identities}
	 */
	Management.prototype.linkUser = function(userId, secondaryUserToken, cb) {
	  var url;
	  /* eslint-disable */
	  assert.check(userId, { type: 'string', message: 'userId parameter is not valid' });
	  assert.check(secondaryUserToken, {
	    type: 'string',
	    message: 'secondaryUserToken parameter is not valid'
	  });
	  assert.check(cb, { type: 'function', message: 'cb parameter is not valid' });
	  /* eslint-enable */
	
	  url = urljoin(this.baseOptions.rootUrl, 'users', userId, 'identities');
	
	  return this.request
	    .post(url)
	    .send({ link_with: secondaryUserToken })
	    .end(responseHandler(cb, { ignoreCasing: true }));
	};
	
	module.exports = Management;


/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	var urljoin = __webpack_require__(1);
	
	var windowHelper = __webpack_require__(3);
	var objectHelper = __webpack_require__(2);
	var RequestBuilder = __webpack_require__(10);
	
	function CrossOriginAuthentication(webAuth, options) {
	  this.webAuth = webAuth;
	  this.baseOptions = options;
	  this.request = new RequestBuilder(options);
	}
	
	function getFragment(name) {
	  var theWindow = windowHelper.getWindow();
	  var value = '&' + theWindow.location.hash.substring(1);
	  var parts = value.split('&' + name + '=');
	  if (parts.length === 2) {
	    return parts.pop().split('&').shift();
	  }
	}
	
	function createKey(origin, coId) {
	  return ['co/verifier', encodeURIComponent(origin), encodeURIComponent(coId)].join('/');
	}
	
	/**
	 * Logs in the user with username and password using the cross origin authentication (/co/authenticate) flow. You can use either `username` or `email` to identify the user, but `username` will take precedence over `email`.
	 * This only works when 3rd party cookies are enabled in the browser. After the /co/authenticate call, you'll have to use the {@link parseHash} function at the `redirectUri` specified in the constructor.
	 *
	 * @method login
	 * @param {Object} options options used in the {@link authorize} call after the login_ticket is acquired
	 * @param {String} [options.username] Username (mutually exclusive with email)
	 * @param {String} [options.email] Email  (mutually exclusive with username)
	 * @param {String} options.password Password
	 * @param {String} [options.realm] Realm used to authenticate the user, it can be a realm name or a database connection name
	 * @param {crossOriginLoginCallback} cb Callback function called only when an authentication error, like invalid username or password, occurs. For other types of errors, there will be a redirect to the `redirectUri`.
	 */
	CrossOriginAuthentication.prototype.login = function(options, cb) {
	  var _this = this;
	  var theWindow = windowHelper.getWindow();
	  var url = urljoin(this.baseOptions.rootUrl, '/co/authenticate');
	  var authenticateBody = {
	    client_id: options.clientID || this.baseOptions.clientID,
	    username: options.username || options.email
	  };
	  if (options.password) {
	    authenticateBody.password = options.password;
	  }
	  if (options.otp) {
	    authenticateBody.otp = options.otp;
	  }
	  var realm = options.realm || this.baseOptions.realm;
	
	  if (realm) {
	    var credentialType =
	      options.credentialType ||
	      this.baseOptions.credentialType ||
	      'http://auth0.com/oauth/grant-type/password-realm';
	    authenticateBody.realm = realm;
	    authenticateBody.credential_type = credentialType;
	  } else {
	    authenticateBody.credential_type = 'password';
	  }
	  this.request.post(url).withCredentials().send(authenticateBody).end(function(err, data) {
	    if (err) {
	      var errorObject = (err.response && err.response.body) || {
	        error: 'request_error',
	        error_description: JSON.stringify(err)
	      };
	      return cb(errorObject);
	    }
	    options = objectHelper.blacklist(options, ['username', 'password', 'credentialType', 'otp']);
	    var authorizeOptions = objectHelper
	      .merge(options)
	      .with({ loginTicket: data.body.login_ticket });
	    var key = createKey(_this.baseOptions.rootUrl, data.body.co_id);
	    theWindow.sessionStorage[key] = data.body.co_verifier;
	    _this.webAuth.authorize(authorizeOptions);
	  });
	};
	
	function tryGetVerifier(theWindow, key) {
	  try {
	    var verifier = theWindow.sessionStorage[key];
	    theWindow.sessionStorage.removeItem(key);
	    return verifier;
	  } catch (e) {
	    return '';
	  }
	}
	
	/**
	 * Runs the callback code for the cross origin authentication call. This method is meant to be called by the cross origin authentication callback url.
	 *
	 * @method callback
	 */
	CrossOriginAuthentication.prototype.callback = function() {
	  var targetOrigin = decodeURIComponent(getFragment('origin'));
	  var theWindow = windowHelper.getWindow();
	
	  theWindow.addEventListener('message', function(evt) {
	    if (evt.data.type !== 'co_verifier_request') {
	      return;
	    }
	    var key = createKey(evt.origin, evt.data.request.id);
	    var verifier = tryGetVerifier(theWindow, key);
	
	    evt.source.postMessage(
	      {
	        type: 'co_verifier_response',
	        response: {
	          verifier: verifier
	        }
	      },
	      evt.origin
	    );
	  });
	
	  theWindow.parent.postMessage({ type: 'ready' }, targetOrigin);
	};
	
	module.exports = CrossOriginAuthentication;


/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	var IdTokenVerifier = __webpack_require__(30);
	
	var assert = __webpack_require__(4);
	var error = __webpack_require__(21);
	var qs = __webpack_require__(5);
	var PluginHandler = __webpack_require__(46);
	var windowHelper = __webpack_require__(3);
	var objectHelper = __webpack_require__(2);
	var TransactionManager = __webpack_require__(22);
	var Authentication = __webpack_require__(19);
	var Redirect = __webpack_require__(59);
	var Popup = __webpack_require__(58);
	var SilentAuthenticationHandler = __webpack_require__(60);
	var CrossOriginAuthentication = __webpack_require__(56);
	/**
	 * Handles all the browser's AuthN/AuthZ flows
	 * @constructor
	 * @param {Object} options
	 * @param {String} options.domain your Auth0 domain
	 * @param {String} options.clientID your Auth0 client identifier obtained when creating the client in the Auth0 Dashboard
	 * @param {String} [options.redirectUri] url that the Auth0 will redirect after Auth with the Authorization Response
	 * @param {String} [options.responseType] type of the response used by OAuth 2.0 flow. It can be any space separated list of the values `code`, `token`, `id_token`. {@link https://openid.net/specs/oauth-v2-multiple-response-types-1_0}
	 * @param {String} [options.responseMode] how the Auth response is encoded and redirected back to the client. Supported values are `query`, `fragment` and `form_post`. {@link https://openid.net/specs/oauth-v2-multiple-response-types-1_0.html#ResponseModes}
	 * @param {String} [options.scope] scopes to be requested during Auth. e.g. `openid email`
	 * @param {String} [options.audience] identifier of the resource server who will consume the access token issued after Auth
	 * @param {Array} [options.plugins]
	 * @param {Number} [options._timesToRetryFailedRequests] Number of times to retry a failed request, according to {@link https://github.com/visionmedia/superagent/blob/master/lib/should-retry.js}
	 * @see {@link https://auth0.com/docs/api/authentication}
	 */
	function WebAuth(options) {
	  /* eslint-disable */
	  assert.check(
	    options,
	    { type: 'object', message: 'options parameter is not valid' },
	    {
	      domain: { type: 'string', message: 'domain option is required' },
	      clientID: { type: 'string', message: 'clientID option is required' },
	      responseType: { optional: true, type: 'string', message: 'responseType is not valid' },
	      responseMode: { optional: true, type: 'string', message: 'responseMode is not valid' },
	      redirectUri: { optional: true, type: 'string', message: 'redirectUri is not valid' },
	      scope: { optional: true, type: 'string', message: 'scope is not valid' },
	      audience: { optional: true, type: 'string', message: 'audience is not valid' },
	      leeway: { optional: true, type: 'number', message: 'leeway is not valid' },
	      plugins: { optional: true, type: 'array', message: 'plugins is not valid' },
	      _disableDeprecationWarnings: {
	        optional: true,
	        type: 'boolean',
	        message: '_disableDeprecationWarnings option is not valid'
	      },
	      _sendTelemetry: {
	        optional: true,
	        type: 'boolean',
	        message: '_sendTelemetry option is not valid'
	      },
	      _telemetryInfo: {
	        optional: true,
	        type: 'object',
	        message: '_telemetryInfo option is not valid'
	      },
	      _timesToRetryFailedRequests: {
	        optional: true,
	        type: 'number',
	        message: '_timesToRetryFailedRequests option is not valid'
	      }
	    }
	  );
	
	  if (options.overrides) {
	    assert.check(
	      options.overrides,
	      { type: 'object', message: 'overrides option is not valid' },
	      {
	        __tenant: { type: 'string', message: '__tenant option is required' },
	        __token_issuer: { type: 'string', message: '__token_issuer option is required' }
	      }
	    );
	  }
	  /* eslint-enable */
	
	  this.baseOptions = options;
	  this.baseOptions.plugins = new PluginHandler(this, this.baseOptions.plugins || []);
	
	  this.baseOptions._sendTelemetry = this.baseOptions._sendTelemetry === false
	    ? this.baseOptions._sendTelemetry
	    : true;
	
	  this.baseOptions._timesToRetryFailedRequests = options._timesToRetryFailedRequests
	    ? parseInt(options._timesToRetryFailedRequests, 0)
	    : 0;
	
	  this.baseOptions.tenant =
	    (this.baseOptions.overrides && this.baseOptions.overrides.__tenant) ||
	    this.baseOptions.domain.split('.')[0];
	
	  this.baseOptions.token_issuer =
	    (this.baseOptions.overrides && this.baseOptions.overrides.__token_issuer) ||
	    'https://' + this.baseOptions.domain + '/';
	
	  this.transactionManager = new TransactionManager(this.baseOptions.transaction);
	
	  this.client = new Authentication(this.baseOptions);
	  this.redirect = new Redirect(this.client, this.baseOptions);
	  this.popup = new Popup(this, this.baseOptions);
	  this.crossOriginAuthentication = new CrossOriginAuthentication(this, this.baseOptions);
	}
	
	/**
	 * Parse the url hash and extract the Auth response from a Auth flow started with {@link authorize}
	 *
	 * Only validates id_tokens signed by Auth0 using the RS256 algorithm using the public key exposed
	 * by the `/.well-known/jwks.json` endpoint of your account.
	 * Tokens signed with other algorithms, e.g. HS256 will not be accepted.
	 *
	 * @method parseHash
	 * @param {Object} options
	 * @param {String} options.hash the url hash. If not provided it will extract from window.location.hash
	 * @param {String} [options.state] value originally sent in `state` parameter to {@link authorize} to mitigate XSRF
	 * @param {String} [options.nonce] value originally sent in `nonce` parameter to {@link authorize} to prevent replay attacks
	 * @param {String} [options._idTokenVerification] makes parseHash perform or skip `id_token` verification. We **strongly** recommend validating the `id_token` yourself if you disable the verification.
	 * @param {authorizeCallback} cb
	 */
	WebAuth.prototype.parseHash = function(options, cb) {
	  var parsedQs;
	  var err;
	  var state;
	  var transaction;
	  var transactionNonce;
	
	  if (!cb && typeof options === 'function') {
	    cb = options;
	    options = {};
	  } else {
	    options = options || {};
	  }
	
	  options._idTokenVerification = !(options._idTokenVerification === false);
	
	  var _window = windowHelper.getWindow();
	
	  var hashStr = options.hash === undefined ? _window.location.hash : options.hash;
	  hashStr = hashStr.replace(/^#?\/?/, '');
	
	  parsedQs = qs.parse(hashStr);
	
	  if (parsedQs.hasOwnProperty('error')) {
	    err = error.buildResponse(parsedQs.error, parsedQs.error_description);
	
	    if (parsedQs.state) {
	      err.state = parsedQs.state;
	    }
	
	    return cb(err);
	  }
	
	  if (
	    !parsedQs.hasOwnProperty('access_token') &&
	    !parsedQs.hasOwnProperty('id_token') &&
	    !parsedQs.hasOwnProperty('refresh_token')
	  ) {
	    return cb(null, null);
	  }
	
	  state = parsedQs.state || options.state;
	
	  transaction = this.transactionManager.getStoredTransaction(state);
	  transactionNonce = options.nonce || (transaction && transaction.nonce) || null;
	
	  var applicationStatus = (transaction && transaction.appStatus) || null;
	  if (parsedQs.id_token && options._idTokenVerification) {
	    return this.validateToken(parsedQs.id_token, transactionNonce, function(
	      validationError,
	      payload
	    ) {
	      if (validationError) {
	        return cb(validationError);
	      }
	      return cb(null, buildParseHashResponse(parsedQs, applicationStatus, payload));
	    });
	  }
	
	  if (parsedQs.id_token) {
	    var verifier = new IdTokenVerifier({
	      issuer: this.baseOptions.token_issuer,
	      audience: this.baseOptions.clientID,
	      leeway: this.baseOptions.leeway || 0,
	      __disableExpirationCheck: this.baseOptions.__disableExpirationCheck
	    });
	
	    var decodedToken = verifier.decode(parsedQs.id_token);
	    cb(null, buildParseHashResponse(parsedQs, applicationStatus, decodedToken.payload));
	  } else {
	    cb(null, buildParseHashResponse(parsedQs, applicationStatus, null));
	  }
	};
	
	function buildParseHashResponse(qsParams, appStatus, token) {
	  return {
	    accessToken: qsParams.access_token || null,
	    idToken: qsParams.id_token || null,
	    idTokenPayload: token || null,
	    appStatus: appStatus || null,
	    refreshToken: qsParams.refresh_token || null,
	    state: qsParams.state || null,
	    expiresIn: qsParams.expires_in ? parseInt(qsParams.expires_in, 10) : null,
	    tokenType: qsParams.token_type || null,
	    scope: qsParams.scope || null
	  };
	}
	
	/**
	 * @callback validateTokenCallback
	 * @param {Error} [err] error returned by while validating the token
	 * @param {Object} [payload] claims stored in the token
	 */
	
	/**
	 * Decodes the a JWT and verifies its nonce value
	 *
	 * @method validateToken
	 * @private
	 * @param {String} token
	 * @param {String} nonce
	 * @param {validateTokenCallback} cb
	 */
	WebAuth.prototype.validateToken = function(token, nonce, cb) {
	  var verifier = new IdTokenVerifier({
	    issuer: this.baseOptions.token_issuer,
	    audience: this.baseOptions.clientID,
	    leeway: this.baseOptions.leeway || 0,
	    __disableExpirationCheck: this.baseOptions.__disableExpirationCheck
	  });
	
	  verifier.verify(token, nonce, function(err, payload) {
	    if (err) {
	      return cb(error.invalidJwt(err.message));
	    }
	
	    cb(null, payload);
	  });
	};
	
	/**
	 * Executes a silent authentication transaction under the hood in order to fetch a new tokens for the current session.
	 * This method requires that all Auth is performed with {@link authorize}
	 * Watch out! If you're not using the hosted login page to do social logins, you have to use your own [social connection keys](https://manage.auth0.com/#/connections/social). If you use Auth0's dev keys, you'll always get `login_required` as an error when calling this method.
	 *
	 * @method renewAuth
	 * @param {Object} options
	 * @param {String} [options.domain] your Auth0 domain
	 * @param {String} [options.clientID] your Auth0 client identifier obtained when creating the client in the Auth0 Dashboard
	 * @param {String} [options.redirectUri] url that the Auth0 will redirect after Auth with the Authorization Response
	 * @param {String} [options.responseType] type of the response used by OAuth 2.0 flow. It can be any space separated list of the values `code`, `token`, `id_token`. {@link https://openid.net/specs/oauth-v2-multiple-response-types-1_0}
	 * @param {String} [options.responseMode] how the Auth response is encoded and redirected back to the client. Supported values are `query`, `fragment` and `form_post`. {@link https://openid.net/specs/oauth-v2-multiple-response-types-1_0.html#ResponseModes}
	 * @param {String} [options.state] value used to mitigate XSRF attacks. {@link https://auth0.com/docs/protocols/oauth2/oauth-state}
	 * @param {String} [options.nonce] value used to mitigate replay attacks when using Implicit Grant. {@link https://auth0.com/docs/api-auth/tutorials/nonce}
	 * @param {String} [options.scope] scopes to be requested during Auth. e.g. `openid email`
	 * @param {String} [options.audience] identifier of the resource server who will consume the access token issued after Auth
	 * @param {String} [options.postMessageDataType] identifier data type to look for in postMessage event data, where events are initiated from silent callback urls, before accepting a message event is the event expected. A value of false means any postMessage event will trigger a callback.
	 * @see {@link https://auth0.com/docs/api/authentication#authorize-client}
	 */
	WebAuth.prototype.renewAuth = function(options, cb) {
	  var handler;
	  var usePostMessage = !!options.usePostMessage;
	  var postMessageDataType = options.postMessageDataType || false;
	  var _this = this;
	
	  var params = objectHelper
	    .merge(this.baseOptions, [
	      'clientID',
	      'redirectUri',
	      'responseType',
	      'scope',
	      'audience',
	      '_csrf',
	      'state',
	      '_intstate',
	      'nonce'
	    ])
	    .with(options);
	
	  params.responseType = params.responseType || 'token';
	  params.responseMode = params.responseMode || 'fragment';
	  if (!options.nonce) {
	    params = this.transactionManager.process(params);
	  }
	
	  assert.check(params, { type: 'object', message: 'options parameter is not valid' });
	  assert.check(cb, { type: 'function', message: 'cb parameter is not valid' });
	
	  params.prompt = 'none';
	
	  params = objectHelper.blacklist(params, ['usePostMessage', 'tenant', 'postMessageDataType']);
	
	  handler = SilentAuthenticationHandler.create({
	    authenticationUrl: this.client.buildAuthorizeUrl(params),
	    postMessageDataType: postMessageDataType
	  });
	
	  handler.login(usePostMessage, function(err, hash) {
	    if (typeof hash === 'object') {
	      // hash was already parsed, so we just return it.
	      // it's here to be backwards compatible and should be removed in the next major version.
	      return cb(err, hash);
	    }
	    var transaction = _this.transactionManager.getStoredTransaction(params.state);
	    var transactionNonce = options.nonce || (transaction && transaction.nonce) || null;
	    var transactionState = options.state || (transaction && transaction.state) || null;
	    _this.parseHash({ hash: hash, nonce: transactionNonce, state: transactionState }, cb);
	  });
	};
	
	/**
	 * Request an email with instruction to change a user's password
	 *
	 * @method changePassword
	 * @param {Object} options
	 * @param {String} options.email address where the user will recieve the change password email. It should match the user's email in Auth0
	 * @param {String} options.connection name of the connection where the user was created
	 * @param {changePasswordCallback} cb
	 * @see   {@link https://auth0.com/docs/api/authentication#change-password}
	 */
	WebAuth.prototype.changePassword = function(options, cb) {
	  return this.client.dbConnection.changePassword(options, cb);
	};
	
	/**
	 * Starts a passwordless authentication transaction.
	 *
	 * @method passwordlessStart
	 * @param {Object} options
	 * @param {String} options.send what will be sent via email which could be `link` or `code`. For SMS `code` is the only one valud
	 * @param {String} [options.phoneNumber] phone number where to send the `code`. This parameter is mutually exclusive with `email`
	 * @param {String} [options.email] email where to send the `code` or `link`. This parameter is mutually exclusive with `phoneNumber`
	 * @param {String} options.connection name of the passwordless connection
	 * @param {Object} [options.authParams] additional Auth parameters when using `link`
	 * @param {Function} cb
	 * @see   {@link https://auth0.com/docs/api/authentication#passwordless}
	 */
	WebAuth.prototype.passwordlessStart = function(options, cb) {
	  var authParams = objectHelper
	    .merge(this.baseOptions, [
	      'responseType',
	      'responseMode',
	      'redirectUri',
	      'scope',
	      'audience',
	      '_csrf',
	      'state',
	      '_intstate',
	      'nonce'
	    ])
	    .with(options.authParams);
	
	  options.authParams = this.transactionManager.process(authParams);
	  return this.client.passwordless.start(options, cb);
	};
	
	/**
	 * Creates a new user in a Auth0 Database connection
	 *
	 * @method signup
	 * @param {Object} options
	 * @param {String} options.email user email address
	 * @param {String} options.password user password
	 * @param {String} options.connection name of the connection where the user will be created
	 * @param {signUpCallback} cb
	 * @see   {@link https://auth0.com/docs/api/authentication#signup}
	 */
	WebAuth.prototype.signup = function(options, cb) {
	  return this.client.dbConnection.signup(options, cb);
	};
	
	/**
	 * Redirects to the hosted login page (`/authorize`) in order to start a new authN/authZ transaction.
	 * After that, you'll have to use the {@link parseHash} function at the specified `redirectUri`.
	 *
	 * @method authorize
	 * @param {Object} options
	 * @param {String} [options.domain] your Auth0 domain
	 * @param {String} [options.clientID] your Auth0 client identifier obtained when creating the client in the Auth0 Dashboard
	 * @param {String} options.redirectUri url that the Auth0 will redirect after Auth with the Authorization Response
	 * @param {String} options.responseType type of the response used by OAuth 2.0 flow. It can be any space separated list of the values `code`, `token`, `id_token`. {@link https://openid.net/specs/oauth-v2-multiple-response-types-1_0}
	 * @param {String} [options.responseMode] how the Auth response is encoded and redirected back to the client. Supported values are `query`, `fragment` and `form_post`. {@link https://openid.net/specs/oauth-v2-multiple-response-types-1_0.html#ResponseModes}
	 * @param {String} [options.state] value used to mitigate XSRF attacks. {@link https://auth0.com/docs/protocols/oauth2/oauth-state}
	 * @param {String} [options.nonce] value used to mitigate replay attacks when using Implicit Grant. {@link https://auth0.com/docs/api-auth/tutorials/nonce}
	 * @param {String} [options.scope] scopes to be requested during Auth. e.g. `openid email`
	 * @param {String} [options.audience] identifier of the resource server who will consume the access token issued after Auth
	 * @see {@link https://auth0.com/docs/api/authentication#authorize-client}
	 */
	WebAuth.prototype.authorize = function(options) {
	  var params = objectHelper
	    .merge(this.baseOptions, [
	      'clientID',
	      'responseType',
	      'responseMode',
	      'redirectUri',
	      'scope',
	      'audience',
	      '_csrf',
	      'state',
	      '_intstate',
	      'nonce'
	    ])
	    .with(options);
	
	  assert.check(
	    params,
	    { type: 'object', message: 'options parameter is not valid' },
	    {
	      responseType: { type: 'string', message: 'responseType option is required' }
	    }
	  );
	
	  params = this.transactionManager.process(params);
	
	  windowHelper.redirect(this.client.buildAuthorizeUrl(params));
	};
	
	/**
	 * Signs up a new user, automatically logs the user in after the signup and returns the user token.
	 * The login will be done using /oauth/token with password-realm grant type.
	 *
	 * @method signupAndAuthorize
	 * @param {Object} options
	 * @param {String} options.email user email address
	 * @param {String} options.password user password
	 * @param {String} options.connection name of the connection where the user will be created
	 * @param {tokenCallback} cb
	 * @see   {@link https://auth0.com/docs/api/authentication#signup}
	 * @see   {@link https://auth0.com/docs/api-auth/grant/password}
	 */
	WebAuth.prototype.signupAndAuthorize = function(options, cb) {
	  var _this = this;
	
	  return this.client.dbConnection.signup(
	    objectHelper.blacklist(options, ['popupHandler']),
	    function(err) {
	      if (err) {
	        return cb(err);
	      }
	      options.realm = options.connection;
	      if (!options.username) {
	        options.username = options.email;
	      }
	      _this.client.login(options, cb);
	    }
	  );
	};
	
	/**
	 * @callback crossOriginLoginCallback
	 * @param {Error} [err] Authentication error returned by Auth0 with the reason why the request failed
	 */
	
	/**
	 * Logs in the user with username and password using the cross origin authentication (/co/authenticate) flow. You can use either `username` or `email` to identify the user, but `username` will take precedence over `email`.
	 * This only works when 3rd party cookies are enabled in the browser. After the /co/authenticate call, you'll have to use the {@link parseHash} function at the `redirectUri` specified in the constructor.
	 *
	 * @method login
	 * @param {Object} options options used in the {@link authorize} call after the login_ticket is acquired
	 * @param {String} [options.username] Username (mutually exclusive with email)
	 * @param {String} [options.email] Email (mutually exclusive with username)
	 * @param {String} options.password Password
	 * @param {String} [options.realm] Realm used to authenticate the user, it can be a realm name or a database connection name
	 * @param {crossOriginLoginCallback} cb Callback function called only when an authentication error, like invalid username or password, occurs. For other types of errors, there will be a redirect to the `redirectUri`.
	 */
	WebAuth.prototype.login = function(options, cb) {
	  this.crossOriginAuthentication.login(options, cb);
	};
	
	/**
	 * Logs in the user by verifying the verification code (OTP) using the cross origin authentication (/co/authenticate) flow. You can use either `phoneNumber` or `email` to identify the user.
	 * This only works when 3rd party cookies are enabled in the browser. After the /co/authenticate call, you'll have to use the {@link parseHash} function at the `redirectUri` specified in the constructor.
	 *
	 * @method login
	 * @param {Object} options options used in the {@link authorize} call after the login_ticket is acquired
	 * @param {String} [options.phoneNumber] Phone Number (mutually exclusive with email)
	 * @param {String} [options.email] Email (mutually exclusive with username)
	 * @param {String} options.verificationCode Verification Code (OTP)
	 * @param {String} options.connection Passwordless connection to use. It can either be 'sms' or 'email'.
	 * @param {crossOriginLoginCallback} cb Callback function called only when an authentication error, like invalid username or password, occurs. For other types of errors, there will be a redirect to the `redirectUri`.
	 */
	WebAuth.prototype.passwordlessLogin = function(options, cb) {
	  var loginOptions = objectHelper.extend(
	    {
	      credentialType: 'http://auth0.com/oauth/grant-type/passwordless/otp',
	      realm: options.connection,
	      username: options.email || options.phoneNumber,
	      otp: options.verificationCode
	    },
	    objectHelper.blacklist(options, ['connection', 'email', 'phoneNumber', 'verificationCode'])
	  );
	  this.crossOriginAuthentication.login(loginOptions, cb);
	};
	
	/**
	 * Runs the callback code for the cross origin authentication call. This method is meant to be called by the cross origin authentication callback url.
	 *
	 * @method crossOriginAuthenticationCallback
	 */
	WebAuth.prototype.crossOriginAuthenticationCallback = function() {
	  this.crossOriginAuthentication.callback();
	};
	
	/**
	 * Redirects to the auth0 logout endpoint
	 *
	 * If you want to navigate the user to a specific URL after the logout, set that URL at the returnTo parameter. The URL should be included in any the appropriate Allowed Logout URLs list:
	 *
	 * - If the client_id parameter is included, the returnTo URL must be listed in the Allowed Logout URLs set at the client level (see Setting Allowed Logout URLs at the App Level).
	 * - If the client_id parameter is NOT included, the returnTo URL must be listed in the Allowed Logout URLs set at the account level (see Setting Allowed Logout URLs at the Account Level).
	 *
	 * @method logout
	 * @param {Object} options
	 * @param {String} [options.clientID] identifier of your client
	 * @param {String} [options.returnTo] URL to be redirected after the logout
	 * @param {Boolean} [options.federated] tells Auth0 if it should logout the user also from the IdP.
	 * @see   {@link https://auth0.com/docs/api/authentication#logout}
	 */
	WebAuth.prototype.logout = function(options) {
	  windowHelper.redirect(this.client.buildLogoutUrl(options));
	};
	
	/**
	 * Verifies the passwordless TOTP and redirects to finish the passwordless transaction
	 *
	 * @method passwordlessVerify
	 * @param {Object} options
	 * @param {String} options.type `sms` or `email`
	 * @param {String} options.phoneNumber only if type = sms
	 * @param {String} options.email only if type = email
	 * @param {String} options.connection the connection name
	 * @param {String} options.verificationCode the TOTP code
	 * @param {Function} cb
	 */
	WebAuth.prototype.passwordlessVerify = function(options, cb) {
	  var _this = this;
	  var params = objectHelper
	    .merge(this.baseOptions, [
	      'clientID',
	      'responseType',
	      'responseMode',
	      'redirectUri',
	      'scope',
	      'audience',
	      '_csrf',
	      'state',
	      '_intstate',
	      'nonce'
	    ])
	    .with(options);
	
	  assert.check(
	    params,
	    { type: 'object', message: 'options parameter is not valid' },
	    {
	      responseType: { type: 'string', message: 'responseType option is required' }
	    }
	  );
	
	  params = this.transactionManager.process(params);
	  return this.client.passwordless.verify(params, function(err) {
	    if (err) {
	      return cb(err);
	    }
	    return windowHelper.redirect(_this.client.passwordless.buildVerifyUrl(params));
	  });
	};
	
	module.exports = WebAuth;


/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	var urljoin = __webpack_require__(1);
	var WinChan = __webpack_require__(18);
	
	var urlHelper = __webpack_require__(53);
	var assert = __webpack_require__(4);
	var responseHandler = __webpack_require__(6);
	var PopupHandler = __webpack_require__(47);
	var objectHelper = __webpack_require__(2);
	var Warn = __webpack_require__(11);
	var TransactionManager = __webpack_require__(22);
	
	function Popup(webAuth, options) {
	  this.baseOptions = options;
	  this.client = webAuth.client;
	  this.webAuth = webAuth;
	
	  this.transactionManager = new TransactionManager(this.baseOptions.transaction);
	  this.warn = new Warn({
	    disableWarnings: !!options._disableDeprecationWarnings
	  });
	}
	
	/**
	 * Returns a new instance of the popup handler
	 *
	 * @method buildPopupHandler
	 * @private
	 */
	Popup.prototype.buildPopupHandler = function() {
	  var pluginHandler = this.baseOptions.plugins.get('popup.getPopupHandler');
	
	  if (pluginHandler) {
	    return pluginHandler.getPopupHandler();
	  }
	
	  return new PopupHandler();
	};
	
	/**
	 * Initializes the popup window and returns the instance to be used later in order to avoid being blocked by the browser.
	 *
	 * @method preload
	 * @param {Object} options receives the window height and width and any other window feature to be sent to window.open
	 */
	Popup.prototype.preload = function(options) {
	  options = options || {};
	
	  var popup = this.buildPopupHandler();
	
	  popup.preload(options);
	  return popup;
	};
	
	/**
	 * Internal use.
	 *
	 * @method getPopupHandler
	 * @private
	 */
	Popup.prototype.getPopupHandler = function(options, preload) {
	  if (options.popupHandler) {
	    return options.popupHandler;
	  }
	
	  if (preload) {
	    return this.preload(options);
	  }
	
	  return this.buildPopupHandler();
	};
	
	/**
	 * Handles the popup logic for the callback page.
	 *
	 * @method callback
	 * @param {Object} options
	 * @param {String} options.hash the url hash. If not provided it will extract from window.location.hash
	 * @param {String} [options.state] value originally sent in `state` parameter to {@link authorize} to mitigate XSRF
	 * @param {String} [options.nonce] value originally sent in `nonce` parameter to {@link authorize} to prevent replay attacks
	 * @param {String} [options._idTokenVerification] makes parseHash perform or skip `id_token` verification. We **strongly** recommend validating the `id_token` yourself if you disable the verification.
	 * @see   {@link parseHash}
	 */
	Popup.prototype.callback = function(options) {
	  var _this = this;
	  WinChan.onOpen(function(popupOrigin, r, cb) {
	    _this.webAuth.parseHash(options || {}, function(err, data) {
	      return cb(err || data);
	    });
	  });
	};
	
	/**
	 * Shows inside a new window the hosted login page (`/authorize`) in order to start a new authN/authZ transaction and post its result using `postMessage`.
	 *
	 * @method authorize
	 * @param {Object} options
	 * @param {String} [options.domain] your Auth0 domain
	 * @param {String} [options.clientID] your Auth0 client identifier obtained when creating the client in the Auth0 Dashboard
	 * @param {String} options.redirectUri url that the Auth0 will redirect after Auth with the Authorization Response
	 * @param {String} options.responseType type of the response used by OAuth 2.0 flow. It can be any space separated list of the values `code`, `token`, `id_token`. {@link https://openid.net/specs/oauth-v2-multiple-response-types-1_0}
	 * @param {String} [options.responseMode] how the Auth response is encoded and redirected back to the client. Supported values are `query`, `fragment` and `form_post`. {@link https://openid.net/specs/oauth-v2-multiple-response-types-1_0.html#ResponseModes}
	 * @param {String} [options.state] value used to mitigate XSRF attacks. {@link https://auth0.com/docs/protocols/oauth2/oauth-state}
	 * @param {String} [options.nonce] value used to mitigate replay attacks when using Implicit Grant. {@link https://auth0.com/docs/api-auth/tutorials/nonce}
	 * @param {String} [options.scope] scopes to be requested during Auth. e.g. `openid email`
	 * @param {String} [options.audience] identifier of the resource server who will consume the access token issued after Auth
	 * @param {Boolean} [options.owp] determines if Auth0 should render the relay page or not and the caller is responsible of handling the response.
	 * @param {authorizeCallback} cb
	 * @see {@link https://auth0.com/docs/api/authentication#authorize-client}
	 */
	Popup.prototype.authorize = function(options, cb) {
	  var popup;
	  var url;
	  var relayUrl;
	  var popOpts = {};
	
	  var pluginHandler = this.baseOptions.plugins.get('popup.authorize');
	
	  var params = objectHelper
	    .merge(this.baseOptions, [
	      'clientID',
	      'scope',
	      'domain',
	      'audience',
	      'responseType',
	      'redirectUri',
	      '_csrf',
	      'state',
	      '_intstate',
	      'nonce'
	    ])
	    .with(objectHelper.blacklist(options, ['popupHandler']));
	
	  assert.check(
	    params,
	    { type: 'object', message: 'options parameter is not valid' },
	    {
	      responseType: { type: 'string', message: 'responseType option is required' }
	    }
	  );
	
	  // the relay page should not be necesary as long it happens in the same domain
	  // (a redirectUri shoul be provided). It is necesary when using OWP
	  relayUrl = urljoin(this.baseOptions.rootUrl, 'relay.html');
	
	  // if a owp is enabled, it should use the owp flag
	  if (options.owp) {
	    // used by server to render the relay page instead of sending the chunk in the
	    // url to the callback
	    params.owp = true;
	  } else {
	    popOpts.origin = urlHelper.extractOrigin(params.redirectUri);
	    relayUrl = params.redirectUri;
	  }
	
	  if (options.popupOptions) {
	    popOpts.popupOptions = objectHelper.pick(options.popupOptions, ['width', 'height']);
	  }
	
	  if (pluginHandler) {
	    params = pluginHandler.processParams(params);
	  }
	
	  params = this.transactionManager.process(params);
	
	  delete params.domain;
	
	  url = this.client.buildAuthorizeUrl(params);
	
	  popup = this.getPopupHandler(options);
	
	  return popup.load(url, relayUrl, popOpts, responseHandler(cb));
	};
	
	/**
	 * Performs authentication with username/email and password with a database connection inside a new window
	 *
	 * This method is not compatible with API Auth so if you need to fetch API tokens with audience
	 * you should use {@link authorize} or {@link login}.
	 *
	 * @method loginWithCredentials
	 * @param {Object} options
	 * @param {String} [options.redirectUri] url that the Auth0 will redirect after Auth with the Authorization Response
	 * @param {String} [options.responseType] type of the response used. It can be any of the values `code` and `token`
	 * @param {String} [options.responseMode] how the AuthN response is encoded and redirected back to the client. Supported values are `query` and `fragment`
	 * @param {String} [options.scope] scopes to be requested during AuthN. e.g. `openid email`
	 * @param {credentialsCallback} cb
	 */
	Popup.prototype.loginWithCredentials = function(options, cb) {
	  var params;
	  var popup;
	  var url;
	  var relayUrl;
	
	  /* eslint-disable */
	  assert.check(
	    options,
	    { type: 'object', message: 'options parameter is not valid' },
	    {
	      clientID: { optional: true, type: 'string', message: 'clientID option is required' },
	      redirectUri: { optional: true, type: 'string', message: 'redirectUri option is required' },
	      responseType: { optional: true, type: 'string', message: 'responseType option is required' },
	      scope: { optional: true, type: 'string', message: 'scope option is required' },
	      audience: { optional: true, type: 'string', message: 'audience option is required' }
	    }
	  );
	  /* eslint-enable */
	
	  popup = this.getPopupHandler(options);
	
	  options = objectHelper
	    .merge(this.baseOptions, [
	      'clientID',
	      'scope',
	      'domain',
	      'audience',
	      '_csrf',
	      'state',
	      '_intstate',
	      'nonce'
	    ])
	    .with(objectHelper.blacklist(options, ['popupHandler']));
	
	  params = objectHelper.pick(options, ['clientID', 'domain']);
	  params.options = objectHelper.toSnakeCase(
	    objectHelper.pick(options, ['password', 'connection', 'state', 'scope', '_csrf', 'device'])
	  );
	  params.options.username = options.username || options.email;
	
	  url = urljoin(this.baseOptions.rootUrl, 'sso_dbconnection_popup', options.clientID);
	  relayUrl = urljoin(this.baseOptions.rootUrl, 'relay.html');
	
	  return popup.load(url, relayUrl, { params: params }, responseHandler(cb));
	};
	
	/**
	 * Verifies the passwordless TOTP and redirects to finish the passwordless transaction
	 *
	 * @method passwordlessVerify
	 * @param {Object} options
	 * @param {String} options.type `sms` or `email`
	 * @param {String} options.phoneNumber only if type = sms
	 * @param {String} options.email only if type = email
	 * @param {String} options.connection the connection name
	 * @param {String} options.verificationCode the TOTP code
	 * @param {Function} cb
	 */
	Popup.prototype.passwordlessVerify = function(options, cb) {
	  var _this = this;
	  return this.client.passwordless.verify(
	    objectHelper.blacklist(options, ['popupHandler']),
	    function(err) {
	      if (err) {
	        return cb(err);
	      }
	
	      options.username = options.phoneNumber || options.email;
	      options.password = options.verificationCode;
	
	      delete options.email;
	      delete options.phoneNumber;
	      delete options.verificationCode;
	      delete options.type;
	
	      _this.client.loginWithResourceOwner(options, cb);
	    }
	  );
	};
	
	/**
	 * Signs up a new user and automatically logs the user in after the signup.
	 *
	 * This method is not compatible with API Auth so if you need to fetch API tokens with audience
	 * you should use {@link authorize} or {@link signupAndAuthorize}.
	 *
	 * @method signupAndLogin
	 * @param {Object} options
	 * @param {String} options.email user email address
	 * @param {String} options.password user password
	 * @param {String} options.connection name of the connection where the user will be created
	 * @param {credentialsCallback} cb
	 */
	Popup.prototype.signupAndLogin = function(options, cb) {
	  var _this = this;
	
	  // Preload popup to avoid the browser to block it since the login happens later
	  var popupHandler = this.getPopupHandler(options, true);
	  options.popupHandler = popupHandler;
	
	  return this.client.dbConnection.signup(
	    objectHelper.blacklist(options, ['popupHandler']),
	    function(err) {
	      if (err) {
	        if (popupHandler._current_popup) {
	          popupHandler._current_popup.kill();
	        }
	        return cb(err);
	      }
	      _this.loginWithCredentials(options, cb);
	    }
	  );
	};
	
	module.exports = Popup;


/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	var UsernamePassword = __webpack_require__(61);
	var objectHelper = __webpack_require__(2);
	var Warn = __webpack_require__(11);
	var assert = __webpack_require__(4);
	
	function Redirect(client, options) {
	  this.baseOptions = options;
	  this.client = client;
	
	  this.warn = new Warn({
	    disableWarnings: !!options._disableDeprecationWarnings
	  });
	}
	
	/**
	 * @callback credentialsCallback
	 * @param {Error} [err] error returned by Auth0 with the reason of the Auth failure
	 * @param {Object} [result] result of the AuthN request
	 * @param {String} result.accessToken token that can be used with {@link userinfo}
	 * @param {String} [result.idToken] token that identifies the user
	 * @param {String} [result.refreshToken] token that can be used to get new access tokens from Auth0. Note that not all clients can request them or the resource server might not allow them.
	 */
	
	/**
	 * Performs authentication with username/email and password with a database connection
	 *
	 * This method is not compatible with API Auth so if you need to fetch API tokens with audience
	 * you should use {@link authorize} or {@link login}.
	 *
	 * @method loginWithCredentials
	 * @param {Object} options
	 * @param {String} [options.redirectUri] url that the Auth0 will redirect after Auth with the Authorization Response
	 * @param {String} [options.responseType] type of the response used. It can be any of the values `code` and `token`
	 * @param {String} [options.responseMode] how the AuthN response is encoded and redirected back to the client. Supported values are `query` and `fragment`
	 * @param {String} [options.scope] scopes to be requested during AuthN. e.g. `openid email`
	 * @param {credentialsCallback} cb
	 */
	Redirect.prototype.loginWithCredentials = function(options, cb) {
	  var usernamePassword;
	
	  var params = objectHelper
	    .merge(this.baseOptions, [
	      'clientID',
	      'redirectUri',
	      'tenant',
	      'responseType',
	      'responseMode',
	      'scope',
	      'audience',
	      '_csrf',
	      'state',
	      '_intstate',
	      'nonce'
	    ])
	    .with(options);
	
	  assert.check(
	    params,
	    { type: 'object', message: 'options parameter is not valid' },
	    {
	      responseType: { type: 'string', message: 'responseType option is required' }
	    }
	  );
	
	  usernamePassword = new UsernamePassword(this.baseOptions);
	  return usernamePassword.login(params, function(err, data) {
	    if (err) {
	      return cb(err);
	    }
	    return usernamePassword.callback(data);
	  });
	};
	
	/**
	 * Signs up a new user and automatically logs the user in after the signup.
	 *
	 * @method signupAndLogin
	 * @param {Object} options
	 * @param {String} options.email user email address
	 * @param {String} options.password user password
	 * @param {String} options.connection name of the connection where the user will be created
	 * @param {credentialsCallback} cb
	 */
	Redirect.prototype.signupAndLogin = function(options, cb) {
	  var _this = this;
	  return this.client.dbConnection.signup(options, function(err) {
	    if (err) {
	      return cb(err);
	    }
	    return _this.loginWithCredentials(options, cb);
	  });
	};
	
	module.exports = Redirect;


/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	var IframeHandler = __webpack_require__(43);
	
	function SilentAuthenticationHandler(options) {
	  this.authenticationUrl = options.authenticationUrl;
	  this.timeout = options.timeout || 60 * 1000;
	  this.handler = null;
	  this.postMessageDataType = options.postMessageDataType || false;
	}
	
	SilentAuthenticationHandler.create = function(options) {
	  return new SilentAuthenticationHandler(options);
	};
	
	SilentAuthenticationHandler.prototype.login = function(usePostMessage, callback) {
	  this.handler = new IframeHandler({
	    auth0: this.auth0,
	    url: this.authenticationUrl,
	    eventListenerType: usePostMessage ? 'message' : 'load',
	    callback: this.getCallbackHandler(callback, usePostMessage),
	    timeout: this.timeout,
	    eventValidator: this.getEventValidator(),
	    timeoutCallback: function() {
	      callback(null, '#error=timeout&error_description=Timeout+during+authentication+renew.');
	    },
	    usePostMessage: usePostMessage || false
	  });
	
	  this.handler.init();
	};
	
	SilentAuthenticationHandler.prototype.getEventValidator = function() {
	  var _this = this;
	  return {
	    isValid: function(eventData) {
	      switch (eventData.event.type) {
	        case 'message':
	          // Default behaviour, return all message events.
	          if (_this.postMessageDataType === false) {
	            return true;
	          }
	
	          return (
	            eventData.event.data.type && eventData.event.data.type === _this.postMessageDataType
	          );
	
	        case 'load': // Fall through to default
	        default:
	          return true;
	      }
	    }
	  };
	};
	
	SilentAuthenticationHandler.prototype.getCallbackHandler = function(callback, usePostMessage) {
	  return function(eventData) {
	    var callbackValue;
	    if (!usePostMessage) {
	      callbackValue = eventData.sourceObject.contentWindow.location.hash;
	    } else if (typeof eventData.event.data === 'object' && eventData.event.data.hash) {
	      callbackValue = eventData.event.data.hash;
	    } else {
	      callbackValue = eventData.event.data;
	    }
	    callback(null, callbackValue);
	  };
	};
	
	module.exports = SilentAuthenticationHandler;


/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	var urljoin = __webpack_require__(1);
	
	var objectHelper = __webpack_require__(2);
	var RequestBuilder = __webpack_require__(10);
	var responseHandler = __webpack_require__(6);
	var windowHelper = __webpack_require__(3);
	
	function UsernamePassword(options) {
	  this.baseOptions = options;
	  this.request = new RequestBuilder(options);
	}
	
	UsernamePassword.prototype.login = function(options, cb) {
	  var url;
	  var body;
	
	  url = urljoin(this.baseOptions.rootUrl, 'usernamepassword', 'login');
	
	  options.username = options.username || options.email; // eslint-disable-line
	
	  options = objectHelper.blacklist(options, ['email']); // eslint-disable-line
	
	  body = objectHelper
	    .merge(this.baseOptions, [
	      'clientID',
	      'redirectUri',
	      'tenant',
	      'responseType',
	      'responseMode',
	      'scope',
	      'audience'
	    ])
	    .with(options);
	
	  body = objectHelper.toSnakeCase(body, ['auth0Client']);
	
	  return this.request.post(url).send(body).end(responseHandler(cb));
	};
	
	UsernamePassword.prototype.callback = function(formHtml) {
	  var div;
	  var form;
	  var _document = windowHelper.getDocument();
	
	  div = _document.createElement('div');
	  div.innerHTML = formHtml;
	  form = _document.body.appendChild(div).children[0];
	
	  form.submit();
	};
	
	module.exports = UsernamePassword;


/***/ }
/******/ ])
});
;
;/*
 Copyright (C) Federico Zivolo 2017
 Distributed under the MIT License (license terms are at http://opensource.org/licenses/MIT).
 */(function(e,t){'object'==typeof exports&&'undefined'!=typeof module?module.exports=t():'function'==typeof define&&define.amd?define(t):e.Popper=t()})(this,function(){'use strict';function e(e){return e&&'[object Function]'==={}.toString.call(e)}function t(e,t){if(1!==e.nodeType)return[];var o=window.getComputedStyle(e,null);return t?o[t]:o}function o(e){return'HTML'===e.nodeName?e:e.parentNode||e.host}function n(e){if(!e||-1!==['HTML','BODY','#document'].indexOf(e.nodeName))return window.document.body;var i=t(e),r=i.overflow,p=i.overflowX,s=i.overflowY;return /(auto|scroll)/.test(r+s+p)?e:n(o(e))}function r(e){var o=e&&e.offsetParent,i=o&&o.nodeName;return i&&'BODY'!==i&&'HTML'!==i?-1!==['TD','TABLE'].indexOf(o.nodeName)&&'static'===t(o,'position')?r(o):o:window.document.documentElement}function p(e){var t=e.nodeName;return'BODY'!==t&&('HTML'===t||r(e.firstElementChild)===e)}function s(e){return null===e.parentNode?e:s(e.parentNode)}function d(e,t){if(!e||!e.nodeType||!t||!t.nodeType)return window.document.documentElement;var o=e.compareDocumentPosition(t)&Node.DOCUMENT_POSITION_FOLLOWING,i=o?e:t,n=o?t:e,a=document.createRange();a.setStart(i,0),a.setEnd(n,0);var l=a.commonAncestorContainer;if(e!==l&&t!==l||i.contains(n))return p(l)?l:r(l);var f=s(e);return f.host?d(f.host,t):d(e,s(t).host)}function a(e){var t=1<arguments.length&&void 0!==arguments[1]?arguments[1]:'top',o='top'===t?'scrollTop':'scrollLeft',i=e.nodeName;if('BODY'===i||'HTML'===i){var n=window.document.documentElement,r=window.document.scrollingElement||n;return r[o]}return e[o]}function l(e,t){var o=2<arguments.length&&void 0!==arguments[2]&&arguments[2],i=a(t,'top'),n=a(t,'left'),r=o?-1:1;return e.top+=i*r,e.bottom+=i*r,e.left+=n*r,e.right+=n*r,e}function f(e,t){var o='x'===t?'Left':'Top',i='Left'==o?'Right':'Bottom';return+e['border'+o+'Width'].split('px')[0]+ +e['border'+i+'Width'].split('px')[0]}function m(e,t,o,i){return X(t['offset'+e],t['scroll'+e],o['client'+e],o['offset'+e],o['scroll'+e],ne()?o['offset'+e]+i['margin'+('Height'===e?'Top':'Left')]+i['margin'+('Height'===e?'Bottom':'Right')]:0)}function c(){var e=window.document.body,t=window.document.documentElement,o=ne()&&window.getComputedStyle(t);return{height:m('Height',e,t,o),width:m('Width',e,t,o)}}function h(e){return de({},e,{right:e.left+e.width,bottom:e.top+e.height})}function g(e){var o={};if(ne())try{o=e.getBoundingClientRect();var i=a(e,'top'),n=a(e,'left');o.top+=i,o.left+=n,o.bottom+=i,o.right+=n}catch(e){}else o=e.getBoundingClientRect();var r={left:o.left,top:o.top,width:o.right-o.left,height:o.bottom-o.top},p='HTML'===e.nodeName?c():{},s=p.width||e.clientWidth||r.right-r.left,d=p.height||e.clientHeight||r.bottom-r.top,l=e.offsetWidth-s,m=e.offsetHeight-d;if(l||m){var g=t(e);l-=f(g,'x'),m-=f(g,'y'),r.width-=l,r.height-=m}return h(r)}function u(e,o){var i=ne(),r='HTML'===o.nodeName,p=g(e),s=g(o),d=n(e),a=t(o),f=+a.borderTopWidth.split('px')[0],m=+a.borderLeftWidth.split('px')[0],c=h({top:p.top-s.top-f,left:p.left-s.left-m,width:p.width,height:p.height});if(c.marginTop=0,c.marginLeft=0,!i&&r){var u=+a.marginTop.split('px')[0],b=+a.marginLeft.split('px')[0];c.top-=f-u,c.bottom-=f-u,c.left-=m-b,c.right-=m-b,c.marginTop=u,c.marginLeft=b}return(i?o.contains(d):o===d&&'BODY'!==d.nodeName)&&(c=l(c,o)),c}function b(e){var t=window.document.documentElement,o=u(e,t),i=X(t.clientWidth,window.innerWidth||0),n=X(t.clientHeight,window.innerHeight||0),r=a(t),p=a(t,'left'),s={top:r-o.top+o.marginTop,left:p-o.left+o.marginLeft,width:i,height:n};return h(s)}function y(e){var i=e.nodeName;return'BODY'===i||'HTML'===i?!1:'fixed'===t(e,'position')||y(o(e))}function w(e,t,i,r){var p={top:0,left:0},s=d(e,t);if('viewport'===r)p=b(s);else{var a;'scrollParent'===r?(a=n(o(e)),'BODY'===a.nodeName&&(a=window.document.documentElement)):'window'===r?a=window.document.documentElement:a=r;var l=u(a,s);if('HTML'===a.nodeName&&!y(s)){var f=c(),m=f.height,h=f.width;p.top+=l.top-l.marginTop,p.bottom=m+l.top,p.left+=l.left-l.marginLeft,p.right=h+l.left}else p=l}return p.left+=i,p.top+=i,p.right-=i,p.bottom-=i,p}function E(e){var t=e.width,o=e.height;return t*o}function v(e,t,o,i,n){var r=5<arguments.length&&void 0!==arguments[5]?arguments[5]:0;if(-1===e.indexOf('auto'))return e;var p=w(o,i,r,n),s={top:{width:p.width,height:t.top-p.top},right:{width:p.right-t.right,height:p.height},bottom:{width:p.width,height:p.bottom-t.bottom},left:{width:t.left-p.left,height:p.height}},d=Object.keys(s).map(function(e){return de({key:e},s[e],{area:E(s[e])})}).sort(function(e,t){return t.area-e.area}),a=d.filter(function(e){var t=e.width,i=e.height;return t>=o.clientWidth&&i>=o.clientHeight}),l=0<a.length?a[0].key:d[0].key,f=e.split('-')[1];return l+(f?'-'+f:'')}function x(e,t,o){var i=d(t,o);return u(o,i)}function O(e){var t=window.getComputedStyle(e),o=parseFloat(t.marginTop)+parseFloat(t.marginBottom),i=parseFloat(t.marginLeft)+parseFloat(t.marginRight),n={width:e.offsetWidth+i,height:e.offsetHeight+o};return n}function L(e){var t={left:'right',right:'left',bottom:'top',top:'bottom'};return e.replace(/left|right|bottom|top/g,function(e){return t[e]})}function S(e,t,o){o=o.split('-')[0];var i=O(e),n={width:i.width,height:i.height},r=-1!==['right','left'].indexOf(o),p=r?'top':'left',s=r?'left':'top',d=r?'height':'width',a=r?'width':'height';return n[p]=t[p]+t[d]/2-i[d]/2,n[s]=o===s?t[s]-i[a]:t[L(s)],n}function T(e,t){return Array.prototype.find?e.find(t):e.filter(t)[0]}function C(e,t,o){if(Array.prototype.findIndex)return e.findIndex(function(e){return e[t]===o});var i=T(e,function(e){return e[t]===o});return e.indexOf(i)}function N(t,o,i){var n=void 0===i?t:t.slice(0,C(t,'name',i));return n.forEach(function(t){t.function&&console.warn('`modifier.function` is deprecated, use `modifier.fn`!');var i=t.function||t.fn;t.enabled&&e(i)&&(o.offsets.popper=h(o.offsets.popper),o.offsets.reference=h(o.offsets.reference),o=i(o,t))}),o}function k(){if(!this.state.isDestroyed){var e={instance:this,styles:{},arrowStyles:{},attributes:{},flipped:!1,offsets:{}};e.offsets.reference=x(this.state,this.popper,this.reference),e.placement=v(this.options.placement,e.offsets.reference,this.popper,this.reference,this.options.modifiers.flip.boundariesElement,this.options.modifiers.flip.padding),e.originalPlacement=e.placement,e.offsets.popper=S(this.popper,e.offsets.reference,e.placement),e.offsets.popper.position='absolute',e=N(this.modifiers,e),this.state.isCreated?this.options.onUpdate(e):(this.state.isCreated=!0,this.options.onCreate(e))}}function W(e,t){return e.some(function(e){var o=e.name,i=e.enabled;return i&&o===t})}function B(e){for(var t=[!1,'ms','Webkit','Moz','O'],o=e.charAt(0).toUpperCase()+e.slice(1),n=0;n<t.length-1;n++){var i=t[n],r=i?''+i+o:e;if('undefined'!=typeof window.document.body.style[r])return r}return null}function P(){return this.state.isDestroyed=!0,W(this.modifiers,'applyStyle')&&(this.popper.removeAttribute('x-placement'),this.popper.style.left='',this.popper.style.position='',this.popper.style.top='',this.popper.style[B('transform')]=''),this.disableEventListeners(),this.options.removeOnDestroy&&this.popper.parentNode.removeChild(this.popper),this}function D(e,t,o,i){var r='BODY'===e.nodeName,p=r?window:e;p.addEventListener(t,o,{passive:!0}),r||D(n(p.parentNode),t,o,i),i.push(p)}function H(e,t,o,i){o.updateBound=i,window.addEventListener('resize',o.updateBound,{passive:!0});var r=n(e);return D(r,'scroll',o.updateBound,o.scrollParents),o.scrollElement=r,o.eventsEnabled=!0,o}function A(){this.state.eventsEnabled||(this.state=H(this.reference,this.options,this.state,this.scheduleUpdate))}function M(e,t){return window.removeEventListener('resize',t.updateBound),t.scrollParents.forEach(function(e){e.removeEventListener('scroll',t.updateBound)}),t.updateBound=null,t.scrollParents=[],t.scrollElement=null,t.eventsEnabled=!1,t}function I(){this.state.eventsEnabled&&(window.cancelAnimationFrame(this.scheduleUpdate),this.state=M(this.reference,this.state))}function R(e){return''!==e&&!isNaN(parseFloat(e))&&isFinite(e)}function U(e,t){Object.keys(t).forEach(function(o){var i='';-1!==['width','height','top','right','bottom','left'].indexOf(o)&&R(t[o])&&(i='px'),e.style[o]=t[o]+i})}function Y(e,t){Object.keys(t).forEach(function(o){var i=t[o];!1===i?e.removeAttribute(o):e.setAttribute(o,t[o])})}function F(e,t,o){var i=T(e,function(e){var o=e.name;return o===t}),n=!!i&&e.some(function(e){return e.name===o&&e.enabled&&e.order<i.order});if(!n){var r='`'+t+'`';console.warn('`'+o+'`'+' modifier is required by '+r+' modifier in order to work, be sure to include it before '+r+'!')}return n}function j(e){return'end'===e?'start':'start'===e?'end':e}function K(e){var t=1<arguments.length&&void 0!==arguments[1]&&arguments[1],o=le.indexOf(e),i=le.slice(o+1).concat(le.slice(0,o));return t?i.reverse():i}function q(e,t,o,i){var n=e.match(/((?:\-|\+)?\d*\.?\d*)(.*)/),r=+n[1],p=n[2];if(!r)return e;if(0===p.indexOf('%')){var s;switch(p){case'%p':s=o;break;case'%':case'%r':default:s=i;}var d=h(s);return d[t]/100*r}if('vh'===p||'vw'===p){var a;return a='vh'===p?X(document.documentElement.clientHeight,window.innerHeight||0):X(document.documentElement.clientWidth,window.innerWidth||0),a/100*r}return r}function G(e,t,o,i){var n=[0,0],r=-1!==['right','left'].indexOf(i),p=e.split(/(\+|\-)/).map(function(e){return e.trim()}),s=p.indexOf(T(p,function(e){return-1!==e.search(/,|\s/)}));p[s]&&-1===p[s].indexOf(',')&&console.warn('Offsets separated by white space(s) are deprecated, use a comma (,) instead.');var d=/\s*,\s*|\s+/,a=-1===s?[p]:[p.slice(0,s).concat([p[s].split(d)[0]]),[p[s].split(d)[1]].concat(p.slice(s+1))];return a=a.map(function(e,i){var n=(1===i?!r:r)?'height':'width',p=!1;return e.reduce(function(e,t){return''===e[e.length-1]&&-1!==['+','-'].indexOf(t)?(e[e.length-1]=t,p=!0,e):p?(e[e.length-1]+=t,p=!1,e):e.concat(t)},[]).map(function(e){return q(e,n,t,o)})}),a.forEach(function(e,t){e.forEach(function(o,i){R(o)&&(n[t]+=o*('-'===e[i-1]?-1:1))})}),n}function z(e,t){var o,i=t.offset,n=e.placement,r=e.offsets,p=r.popper,s=r.reference,d=n.split('-')[0];return o=R(+i)?[+i,0]:G(i,p,s,d),'left'===d?(p.top+=o[0],p.left-=o[1]):'right'===d?(p.top+=o[0],p.left+=o[1]):'top'===d?(p.left+=o[0],p.top-=o[1]):'bottom'===d&&(p.left+=o[0],p.top+=o[1]),e.popper=p,e}for(var V=Math.min,_=Math.floor,X=Math.max,Q=['native code','[object MutationObserverConstructor]'],J=function(e){return Q.some(function(t){return-1<(e||'').toString().indexOf(t)})},Z='undefined'!=typeof window,$=['Edge','Trident','Firefox'],ee=0,te=0;te<$.length;te+=1)if(Z&&0<=navigator.userAgent.indexOf($[te])){ee=1;break}var i,oe=Z&&J(window.MutationObserver),ie=oe?function(e){var t=!1,o=0,i=document.createElement('span'),n=new MutationObserver(function(){e(),t=!1});return n.observe(i,{attributes:!0}),function(){t||(t=!0,i.setAttribute('x-index',o),++o)}}:function(e){var t=!1;return function(){t||(t=!0,setTimeout(function(){t=!1,e()},ee))}},ne=function(){return void 0==i&&(i=-1!==navigator.appVersion.indexOf('MSIE 10')),i},re=function(e,t){if(!(e instanceof t))throw new TypeError('Cannot call a class as a function')},pe=function(){function e(e,t){for(var o,n=0;n<t.length;n++)o=t[n],o.enumerable=o.enumerable||!1,o.configurable=!0,'value'in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}return function(t,o,i){return o&&e(t.prototype,o),i&&e(t,i),t}}(),se=function(e,t,o){return t in e?Object.defineProperty(e,t,{value:o,enumerable:!0,configurable:!0,writable:!0}):e[t]=o,e},de=Object.assign||function(e){for(var t,o=1;o<arguments.length;o++)for(var i in t=arguments[o],t)Object.prototype.hasOwnProperty.call(t,i)&&(e[i]=t[i]);return e},ae=['auto-start','auto','auto-end','top-start','top','top-end','right-start','right','right-end','bottom-end','bottom','bottom-start','left-end','left','left-start'],le=ae.slice(3),fe={FLIP:'flip',CLOCKWISE:'clockwise',COUNTERCLOCKWISE:'counterclockwise'},me=function(){function t(o,i){var n=this,r=2<arguments.length&&void 0!==arguments[2]?arguments[2]:{};re(this,t),this.scheduleUpdate=function(){return requestAnimationFrame(n.update)},this.update=ie(this.update.bind(this)),this.options=de({},t.Defaults,r),this.state={isDestroyed:!1,isCreated:!1,scrollParents:[]},this.reference=o.jquery?o[0]:o,this.popper=i.jquery?i[0]:i,this.options.modifiers={},Object.keys(de({},t.Defaults.modifiers,r.modifiers)).forEach(function(e){n.options.modifiers[e]=de({},t.Defaults.modifiers[e]||{},r.modifiers?r.modifiers[e]:{})}),this.modifiers=Object.keys(this.options.modifiers).map(function(e){return de({name:e},n.options.modifiers[e])}).sort(function(e,t){return e.order-t.order}),this.modifiers.forEach(function(t){t.enabled&&e(t.onLoad)&&t.onLoad(n.reference,n.popper,n.options,t,n.state)}),this.update();var p=this.options.eventsEnabled;p&&this.enableEventListeners(),this.state.eventsEnabled=p}return pe(t,[{key:'update',value:function(){return k.call(this)}},{key:'destroy',value:function(){return P.call(this)}},{key:'enableEventListeners',value:function(){return A.call(this)}},{key:'disableEventListeners',value:function(){return I.call(this)}}]),t}();return me.Utils=('undefined'==typeof window?global:window).PopperUtils,me.placements=ae,me.Defaults={placement:'bottom',eventsEnabled:!0,removeOnDestroy:!1,onCreate:function(){},onUpdate:function(){},modifiers:{shift:{order:100,enabled:!0,fn:function(e){var t=e.placement,o=t.split('-')[0],i=t.split('-')[1];if(i){var n=e.offsets,r=n.reference,p=n.popper,s=-1!==['bottom','top'].indexOf(o),d=s?'left':'top',a=s?'width':'height',l={start:se({},d,r[d]),end:se({},d,r[d]+r[a]-p[a])};e.offsets.popper=de({},p,l[i])}return e}},offset:{order:200,enabled:!0,fn:z,offset:0},preventOverflow:{order:300,enabled:!0,fn:function(e,t){var o=t.boundariesElement||r(e.instance.popper);e.instance.reference===o&&(o=r(o));var i=w(e.instance.popper,e.instance.reference,t.padding,o);t.boundaries=i;var n=t.priority,p=e.offsets.popper,s={primary:function(e){var o=p[e];return p[e]<i[e]&&!t.escapeWithReference&&(o=X(p[e],i[e])),se({},e,o)},secondary:function(e){var o='right'===e?'left':'top',n=p[o];return p[e]>i[e]&&!t.escapeWithReference&&(n=V(p[o],i[e]-('right'===e?p.width:p.height))),se({},o,n)}};return n.forEach(function(e){var t=-1===['left','top'].indexOf(e)?'secondary':'primary';p=de({},p,s[t](e))}),e.offsets.popper=p,e},priority:['left','right','top','bottom'],padding:5,boundariesElement:'scrollParent'},keepTogether:{order:400,enabled:!0,fn:function(e){var t=e.offsets,o=t.popper,i=t.reference,n=e.placement.split('-')[0],r=_,p=-1!==['top','bottom'].indexOf(n),s=p?'right':'bottom',d=p?'left':'top',a=p?'width':'height';return o[s]<r(i[d])&&(e.offsets.popper[d]=r(i[d])-o[a]),o[d]>r(i[s])&&(e.offsets.popper[d]=r(i[s])),e}},arrow:{order:500,enabled:!0,fn:function(e,o){if(!F(e.instance.modifiers,'arrow','keepTogether'))return e;var i=o.element;if('string'==typeof i){if(i=e.instance.popper.querySelector(i),!i)return e;}else if(!e.instance.popper.contains(i))return console.warn('WARNING: `arrow.element` must be child of its popper element!'),e;var n=e.placement.split('-')[0],r=e.offsets,p=r.popper,s=r.reference,d=-1!==['left','right'].indexOf(n),a=d?'height':'width',l=d?'Top':'Left',f=l.toLowerCase(),m=d?'left':'top',c=d?'bottom':'right',g=O(i)[a];s[c]-g<p[f]&&(e.offsets.popper[f]-=p[f]-(s[c]-g)),s[f]+g>p[c]&&(e.offsets.popper[f]+=s[f]+g-p[c]);var u=s[f]+s[a]/2-g/2,b=t(e.instance.popper,'margin'+l).replace('px',''),y=u-h(e.offsets.popper)[f]-b;return y=X(V(p[a]-g,y),0),e.arrowElement=i,e.offsets.arrow={},e.offsets.arrow[f]=Math.round(y),e.offsets.arrow[m]='',e},element:'[x-arrow]'},flip:{order:600,enabled:!0,fn:function(e,t){if(W(e.instance.modifiers,'inner'))return e;if(e.flipped&&e.placement===e.originalPlacement)return e;var o=w(e.instance.popper,e.instance.reference,t.padding,t.boundariesElement),i=e.placement.split('-')[0],n=L(i),r=e.placement.split('-')[1]||'',p=[];switch(t.behavior){case fe.FLIP:p=[i,n];break;case fe.CLOCKWISE:p=K(i);break;case fe.COUNTERCLOCKWISE:p=K(i,!0);break;default:p=t.behavior;}return p.forEach(function(s,d){if(i!==s||p.length===d+1)return e;i=e.placement.split('-')[0],n=L(i);var a=e.offsets.popper,l=e.offsets.reference,f=_,m='left'===i&&f(a.right)>f(l.left)||'right'===i&&f(a.left)<f(l.right)||'top'===i&&f(a.bottom)>f(l.top)||'bottom'===i&&f(a.top)<f(l.bottom),c=f(a.left)<f(o.left),h=f(a.right)>f(o.right),g=f(a.top)<f(o.top),u=f(a.bottom)>f(o.bottom),b='left'===i&&c||'right'===i&&h||'top'===i&&g||'bottom'===i&&u,y=-1!==['top','bottom'].indexOf(i),w=!!t.flipVariations&&(y&&'start'===r&&c||y&&'end'===r&&h||!y&&'start'===r&&g||!y&&'end'===r&&u);(m||b||w)&&(e.flipped=!0,(m||b)&&(i=p[d+1]),w&&(r=j(r)),e.placement=i+(r?'-'+r:''),e.offsets.popper=de({},e.offsets.popper,S(e.instance.popper,e.offsets.reference,e.placement)),e=N(e.instance.modifiers,e,'flip'))}),e},behavior:'flip',padding:5,boundariesElement:'viewport'},inner:{order:700,enabled:!1,fn:function(e){var t=e.placement,o=t.split('-')[0],i=e.offsets,n=i.popper,r=i.reference,p=-1!==['left','right'].indexOf(o),s=-1===['top','left'].indexOf(o);return n[p?'left':'top']=r[o]-(s?n[p?'width':'height']:0),e.placement=L(t),e.offsets.popper=h(n),e}},hide:{order:800,enabled:!0,fn:function(e){if(!F(e.instance.modifiers,'hide','preventOverflow'))return e;var t=e.offsets.reference,o=T(e.instance.modifiers,function(e){return'preventOverflow'===e.name}).boundaries;if(t.bottom<o.top||t.left>o.right||t.top>o.bottom||t.right<o.left){if(!0===e.hide)return e;e.hide=!0,e.attributes['x-out-of-boundaries']=''}else{if(!1===e.hide)return e;e.hide=!1,e.attributes['x-out-of-boundaries']=!1}return e}},computeStyle:{order:850,enabled:!0,fn:function(e,t){var o=t.x,i=t.y,n=e.offsets.popper,p=T(e.instance.modifiers,function(e){return'applyStyle'===e.name}).gpuAcceleration;void 0!==p&&console.warn('WARNING: `gpuAcceleration` option moved to `computeStyle` modifier and will not be supported in future versions of Popper.js!');var s,d,a=void 0===p?t.gpuAcceleration:p,l=r(e.instance.popper),f=g(l),m={position:n.position},c={left:_(n.left),top:_(n.top),bottom:_(n.bottom),right:_(n.right)},h='bottom'===o?'top':'bottom',u='right'===i?'left':'right',b=B('transform');if(d='bottom'==h?-f.height+c.bottom:c.top,s='right'==u?-f.width+c.right:c.left,a&&b)m[b]='translate3d('+s+'px, '+d+'px, 0)',m[h]=0,m[u]=0,m.willChange='transform';else{var y='bottom'==h?-1:1,w='right'==u?-1:1;m[h]=d*y,m[u]=s*w,m.willChange=h+', '+u}var E={"x-placement":e.placement};return e.attributes=de({},E,e.attributes),e.styles=de({},m,e.styles),e.arrowStyles=de({},e.offsets.arrow,e.arrowStyles),e},gpuAcceleration:!0,x:'bottom',y:'right'},applyStyle:{order:900,enabled:!0,fn:function(e){return U(e.instance.popper,e.styles),Y(e.instance.popper,e.attributes),e.arrowElement&&Object.keys(e.arrowStyles).length&&U(e.arrowElement,e.arrowStyles),e},onLoad:function(e,t,o,i,n){var r=x(n,t,e),p=v(o.placement,r,t,e,o.modifiers.flip.boundariesElement,o.modifiers.flip.padding);return t.setAttribute('x-placement',p),U(t,{position:'absolute'}),o},gpuAcceleration:void 0}}},me});
//# sourceMappingURL=popper.min.js.map

;/*! jQuery v3.2.1 | (c) JS Foundation and other contributors | jquery.org/license */
!function(a,b){"use strict";"object"==typeof module&&"object"==typeof module.exports?module.exports=a.document?b(a,!0):function(a){if(!a.document)throw new Error("jQuery requires a window with a document");return b(a)}:b(a)}("undefined"!=typeof window?window:this,function(a,b){"use strict";var c=[],d=a.document,e=Object.getPrototypeOf,f=c.slice,g=c.concat,h=c.push,i=c.indexOf,j={},k=j.toString,l=j.hasOwnProperty,m=l.toString,n=m.call(Object),o={};function p(a,b){b=b||d;var c=b.createElement("script");c.text=a,b.head.appendChild(c).parentNode.removeChild(c)}var q="3.2.1",r=function(a,b){return new r.fn.init(a,b)},s=/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,t=/^-ms-/,u=/-([a-z])/g,v=function(a,b){return b.toUpperCase()};r.fn=r.prototype={jquery:q,constructor:r,length:0,toArray:function(){return f.call(this)},get:function(a){return null==a?f.call(this):a<0?this[a+this.length]:this[a]},pushStack:function(a){var b=r.merge(this.constructor(),a);return b.prevObject=this,b},each:function(a){return r.each(this,a)},map:function(a){return this.pushStack(r.map(this,function(b,c){return a.call(b,c,b)}))},slice:function(){return this.pushStack(f.apply(this,arguments))},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},eq:function(a){var b=this.length,c=+a+(a<0?b:0);return this.pushStack(c>=0&&c<b?[this[c]]:[])},end:function(){return this.prevObject||this.constructor()},push:h,sort:c.sort,splice:c.splice},r.extend=r.fn.extend=function(){var a,b,c,d,e,f,g=arguments[0]||{},h=1,i=arguments.length,j=!1;for("boolean"==typeof g&&(j=g,g=arguments[h]||{},h++),"object"==typeof g||r.isFunction(g)||(g={}),h===i&&(g=this,h--);h<i;h++)if(null!=(a=arguments[h]))for(b in a)c=g[b],d=a[b],g!==d&&(j&&d&&(r.isPlainObject(d)||(e=Array.isArray(d)))?(e?(e=!1,f=c&&Array.isArray(c)?c:[]):f=c&&r.isPlainObject(c)?c:{},g[b]=r.extend(j,f,d)):void 0!==d&&(g[b]=d));return g},r.extend({expando:"jQuery"+(q+Math.random()).replace(/\D/g,""),isReady:!0,error:function(a){throw new Error(a)},noop:function(){},isFunction:function(a){return"function"===r.type(a)},isWindow:function(a){return null!=a&&a===a.window},isNumeric:function(a){var b=r.type(a);return("number"===b||"string"===b)&&!isNaN(a-parseFloat(a))},isPlainObject:function(a){var b,c;return!(!a||"[object Object]"!==k.call(a))&&(!(b=e(a))||(c=l.call(b,"constructor")&&b.constructor,"function"==typeof c&&m.call(c)===n))},isEmptyObject:function(a){var b;for(b in a)return!1;return!0},type:function(a){return null==a?a+"":"object"==typeof a||"function"==typeof a?j[k.call(a)]||"object":typeof a},globalEval:function(a){p(a)},camelCase:function(a){return a.replace(t,"ms-").replace(u,v)},each:function(a,b){var c,d=0;if(w(a)){for(c=a.length;d<c;d++)if(b.call(a[d],d,a[d])===!1)break}else for(d in a)if(b.call(a[d],d,a[d])===!1)break;return a},trim:function(a){return null==a?"":(a+"").replace(s,"")},makeArray:function(a,b){var c=b||[];return null!=a&&(w(Object(a))?r.merge(c,"string"==typeof a?[a]:a):h.call(c,a)),c},inArray:function(a,b,c){return null==b?-1:i.call(b,a,c)},merge:function(a,b){for(var c=+b.length,d=0,e=a.length;d<c;d++)a[e++]=b[d];return a.length=e,a},grep:function(a,b,c){for(var d,e=[],f=0,g=a.length,h=!c;f<g;f++)d=!b(a[f],f),d!==h&&e.push(a[f]);return e},map:function(a,b,c){var d,e,f=0,h=[];if(w(a))for(d=a.length;f<d;f++)e=b(a[f],f,c),null!=e&&h.push(e);else for(f in a)e=b(a[f],f,c),null!=e&&h.push(e);return g.apply([],h)},guid:1,proxy:function(a,b){var c,d,e;if("string"==typeof b&&(c=a[b],b=a,a=c),r.isFunction(a))return d=f.call(arguments,2),e=function(){return a.apply(b||this,d.concat(f.call(arguments)))},e.guid=a.guid=a.guid||r.guid++,e},now:Date.now,support:o}),"function"==typeof Symbol&&(r.fn[Symbol.iterator]=c[Symbol.iterator]),r.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "),function(a,b){j["[object "+b+"]"]=b.toLowerCase()});function w(a){var b=!!a&&"length"in a&&a.length,c=r.type(a);return"function"!==c&&!r.isWindow(a)&&("array"===c||0===b||"number"==typeof b&&b>0&&b-1 in a)}var x=function(a){var b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u="sizzle"+1*new Date,v=a.document,w=0,x=0,y=ha(),z=ha(),A=ha(),B=function(a,b){return a===b&&(l=!0),0},C={}.hasOwnProperty,D=[],E=D.pop,F=D.push,G=D.push,H=D.slice,I=function(a,b){for(var c=0,d=a.length;c<d;c++)if(a[c]===b)return c;return-1},J="checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",K="[\\x20\\t\\r\\n\\f]",L="(?:\\\\.|[\\w-]|[^\0-\\xa0])+",M="\\["+K+"*("+L+")(?:"+K+"*([*^$|!~]?=)"+K+"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|("+L+"))|)"+K+"*\\]",N=":("+L+")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|"+M+")*)|.*)\\)|)",O=new RegExp(K+"+","g"),P=new RegExp("^"+K+"+|((?:^|[^\\\\])(?:\\\\.)*)"+K+"+$","g"),Q=new RegExp("^"+K+"*,"+K+"*"),R=new RegExp("^"+K+"*([>+~]|"+K+")"+K+"*"),S=new RegExp("="+K+"*([^\\]'\"]*?)"+K+"*\\]","g"),T=new RegExp(N),U=new RegExp("^"+L+"$"),V={ID:new RegExp("^#("+L+")"),CLASS:new RegExp("^\\.("+L+")"),TAG:new RegExp("^("+L+"|[*])"),ATTR:new RegExp("^"+M),PSEUDO:new RegExp("^"+N),CHILD:new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\("+K+"*(even|odd|(([+-]|)(\\d*)n|)"+K+"*(?:([+-]|)"+K+"*(\\d+)|))"+K+"*\\)|)","i"),bool:new RegExp("^(?:"+J+")$","i"),needsContext:new RegExp("^"+K+"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\("+K+"*((?:-\\d)?\\d*)"+K+"*\\)|)(?=[^-]|$)","i")},W=/^(?:input|select|textarea|button)$/i,X=/^h\d$/i,Y=/^[^{]+\{\s*\[native \w/,Z=/^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,$=/[+~]/,_=new RegExp("\\\\([\\da-f]{1,6}"+K+"?|("+K+")|.)","ig"),aa=function(a,b,c){var d="0x"+b-65536;return d!==d||c?b:d<0?String.fromCharCode(d+65536):String.fromCharCode(d>>10|55296,1023&d|56320)},ba=/([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,ca=function(a,b){return b?"\0"===a?"\ufffd":a.slice(0,-1)+"\\"+a.charCodeAt(a.length-1).toString(16)+" ":"\\"+a},da=function(){m()},ea=ta(function(a){return a.disabled===!0&&("form"in a||"label"in a)},{dir:"parentNode",next:"legend"});try{G.apply(D=H.call(v.childNodes),v.childNodes),D[v.childNodes.length].nodeType}catch(fa){G={apply:D.length?function(a,b){F.apply(a,H.call(b))}:function(a,b){var c=a.length,d=0;while(a[c++]=b[d++]);a.length=c-1}}}function ga(a,b,d,e){var f,h,j,k,l,o,r,s=b&&b.ownerDocument,w=b?b.nodeType:9;if(d=d||[],"string"!=typeof a||!a||1!==w&&9!==w&&11!==w)return d;if(!e&&((b?b.ownerDocument||b:v)!==n&&m(b),b=b||n,p)){if(11!==w&&(l=Z.exec(a)))if(f=l[1]){if(9===w){if(!(j=b.getElementById(f)))return d;if(j.id===f)return d.push(j),d}else if(s&&(j=s.getElementById(f))&&t(b,j)&&j.id===f)return d.push(j),d}else{if(l[2])return G.apply(d,b.getElementsByTagName(a)),d;if((f=l[3])&&c.getElementsByClassName&&b.getElementsByClassName)return G.apply(d,b.getElementsByClassName(f)),d}if(c.qsa&&!A[a+" "]&&(!q||!q.test(a))){if(1!==w)s=b,r=a;else if("object"!==b.nodeName.toLowerCase()){(k=b.getAttribute("id"))?k=k.replace(ba,ca):b.setAttribute("id",k=u),o=g(a),h=o.length;while(h--)o[h]="#"+k+" "+sa(o[h]);r=o.join(","),s=$.test(a)&&qa(b.parentNode)||b}if(r)try{return G.apply(d,s.querySelectorAll(r)),d}catch(x){}finally{k===u&&b.removeAttribute("id")}}}return i(a.replace(P,"$1"),b,d,e)}function ha(){var a=[];function b(c,e){return a.push(c+" ")>d.cacheLength&&delete b[a.shift()],b[c+" "]=e}return b}function ia(a){return a[u]=!0,a}function ja(a){var b=n.createElement("fieldset");try{return!!a(b)}catch(c){return!1}finally{b.parentNode&&b.parentNode.removeChild(b),b=null}}function ka(a,b){var c=a.split("|"),e=c.length;while(e--)d.attrHandle[c[e]]=b}function la(a,b){var c=b&&a,d=c&&1===a.nodeType&&1===b.nodeType&&a.sourceIndex-b.sourceIndex;if(d)return d;if(c)while(c=c.nextSibling)if(c===b)return-1;return a?1:-1}function ma(a){return function(b){var c=b.nodeName.toLowerCase();return"input"===c&&b.type===a}}function na(a){return function(b){var c=b.nodeName.toLowerCase();return("input"===c||"button"===c)&&b.type===a}}function oa(a){return function(b){return"form"in b?b.parentNode&&b.disabled===!1?"label"in b?"label"in b.parentNode?b.parentNode.disabled===a:b.disabled===a:b.isDisabled===a||b.isDisabled!==!a&&ea(b)===a:b.disabled===a:"label"in b&&b.disabled===a}}function pa(a){return ia(function(b){return b=+b,ia(function(c,d){var e,f=a([],c.length,b),g=f.length;while(g--)c[e=f[g]]&&(c[e]=!(d[e]=c[e]))})})}function qa(a){return a&&"undefined"!=typeof a.getElementsByTagName&&a}c=ga.support={},f=ga.isXML=function(a){var b=a&&(a.ownerDocument||a).documentElement;return!!b&&"HTML"!==b.nodeName},m=ga.setDocument=function(a){var b,e,g=a?a.ownerDocument||a:v;return g!==n&&9===g.nodeType&&g.documentElement?(n=g,o=n.documentElement,p=!f(n),v!==n&&(e=n.defaultView)&&e.top!==e&&(e.addEventListener?e.addEventListener("unload",da,!1):e.attachEvent&&e.attachEvent("onunload",da)),c.attributes=ja(function(a){return a.className="i",!a.getAttribute("className")}),c.getElementsByTagName=ja(function(a){return a.appendChild(n.createComment("")),!a.getElementsByTagName("*").length}),c.getElementsByClassName=Y.test(n.getElementsByClassName),c.getById=ja(function(a){return o.appendChild(a).id=u,!n.getElementsByName||!n.getElementsByName(u).length}),c.getById?(d.filter.ID=function(a){var b=a.replace(_,aa);return function(a){return a.getAttribute("id")===b}},d.find.ID=function(a,b){if("undefined"!=typeof b.getElementById&&p){var c=b.getElementById(a);return c?[c]:[]}}):(d.filter.ID=function(a){var b=a.replace(_,aa);return function(a){var c="undefined"!=typeof a.getAttributeNode&&a.getAttributeNode("id");return c&&c.value===b}},d.find.ID=function(a,b){if("undefined"!=typeof b.getElementById&&p){var c,d,e,f=b.getElementById(a);if(f){if(c=f.getAttributeNode("id"),c&&c.value===a)return[f];e=b.getElementsByName(a),d=0;while(f=e[d++])if(c=f.getAttributeNode("id"),c&&c.value===a)return[f]}return[]}}),d.find.TAG=c.getElementsByTagName?function(a,b){return"undefined"!=typeof b.getElementsByTagName?b.getElementsByTagName(a):c.qsa?b.querySelectorAll(a):void 0}:function(a,b){var c,d=[],e=0,f=b.getElementsByTagName(a);if("*"===a){while(c=f[e++])1===c.nodeType&&d.push(c);return d}return f},d.find.CLASS=c.getElementsByClassName&&function(a,b){if("undefined"!=typeof b.getElementsByClassName&&p)return b.getElementsByClassName(a)},r=[],q=[],(c.qsa=Y.test(n.querySelectorAll))&&(ja(function(a){o.appendChild(a).innerHTML="<a id='"+u+"'></a><select id='"+u+"-\r\\' msallowcapture=''><option selected=''></option></select>",a.querySelectorAll("[msallowcapture^='']").length&&q.push("[*^$]="+K+"*(?:''|\"\")"),a.querySelectorAll("[selected]").length||q.push("\\["+K+"*(?:value|"+J+")"),a.querySelectorAll("[id~="+u+"-]").length||q.push("~="),a.querySelectorAll(":checked").length||q.push(":checked"),a.querySelectorAll("a#"+u+"+*").length||q.push(".#.+[+~]")}),ja(function(a){a.innerHTML="<a href='' disabled='disabled'></a><select disabled='disabled'><option/></select>";var b=n.createElement("input");b.setAttribute("type","hidden"),a.appendChild(b).setAttribute("name","D"),a.querySelectorAll("[name=d]").length&&q.push("name"+K+"*[*^$|!~]?="),2!==a.querySelectorAll(":enabled").length&&q.push(":enabled",":disabled"),o.appendChild(a).disabled=!0,2!==a.querySelectorAll(":disabled").length&&q.push(":enabled",":disabled"),a.querySelectorAll("*,:x"),q.push(",.*:")})),(c.matchesSelector=Y.test(s=o.matches||o.webkitMatchesSelector||o.mozMatchesSelector||o.oMatchesSelector||o.msMatchesSelector))&&ja(function(a){c.disconnectedMatch=s.call(a,"*"),s.call(a,"[s!='']:x"),r.push("!=",N)}),q=q.length&&new RegExp(q.join("|")),r=r.length&&new RegExp(r.join("|")),b=Y.test(o.compareDocumentPosition),t=b||Y.test(o.contains)?function(a,b){var c=9===a.nodeType?a.documentElement:a,d=b&&b.parentNode;return a===d||!(!d||1!==d.nodeType||!(c.contains?c.contains(d):a.compareDocumentPosition&&16&a.compareDocumentPosition(d)))}:function(a,b){if(b)while(b=b.parentNode)if(b===a)return!0;return!1},B=b?function(a,b){if(a===b)return l=!0,0;var d=!a.compareDocumentPosition-!b.compareDocumentPosition;return d?d:(d=(a.ownerDocument||a)===(b.ownerDocument||b)?a.compareDocumentPosition(b):1,1&d||!c.sortDetached&&b.compareDocumentPosition(a)===d?a===n||a.ownerDocument===v&&t(v,a)?-1:b===n||b.ownerDocument===v&&t(v,b)?1:k?I(k,a)-I(k,b):0:4&d?-1:1)}:function(a,b){if(a===b)return l=!0,0;var c,d=0,e=a.parentNode,f=b.parentNode,g=[a],h=[b];if(!e||!f)return a===n?-1:b===n?1:e?-1:f?1:k?I(k,a)-I(k,b):0;if(e===f)return la(a,b);c=a;while(c=c.parentNode)g.unshift(c);c=b;while(c=c.parentNode)h.unshift(c);while(g[d]===h[d])d++;return d?la(g[d],h[d]):g[d]===v?-1:h[d]===v?1:0},n):n},ga.matches=function(a,b){return ga(a,null,null,b)},ga.matchesSelector=function(a,b){if((a.ownerDocument||a)!==n&&m(a),b=b.replace(S,"='$1']"),c.matchesSelector&&p&&!A[b+" "]&&(!r||!r.test(b))&&(!q||!q.test(b)))try{var d=s.call(a,b);if(d||c.disconnectedMatch||a.document&&11!==a.document.nodeType)return d}catch(e){}return ga(b,n,null,[a]).length>0},ga.contains=function(a,b){return(a.ownerDocument||a)!==n&&m(a),t(a,b)},ga.attr=function(a,b){(a.ownerDocument||a)!==n&&m(a);var e=d.attrHandle[b.toLowerCase()],f=e&&C.call(d.attrHandle,b.toLowerCase())?e(a,b,!p):void 0;return void 0!==f?f:c.attributes||!p?a.getAttribute(b):(f=a.getAttributeNode(b))&&f.specified?f.value:null},ga.escape=function(a){return(a+"").replace(ba,ca)},ga.error=function(a){throw new Error("Syntax error, unrecognized expression: "+a)},ga.uniqueSort=function(a){var b,d=[],e=0,f=0;if(l=!c.detectDuplicates,k=!c.sortStable&&a.slice(0),a.sort(B),l){while(b=a[f++])b===a[f]&&(e=d.push(f));while(e--)a.splice(d[e],1)}return k=null,a},e=ga.getText=function(a){var b,c="",d=0,f=a.nodeType;if(f){if(1===f||9===f||11===f){if("string"==typeof a.textContent)return a.textContent;for(a=a.firstChild;a;a=a.nextSibling)c+=e(a)}else if(3===f||4===f)return a.nodeValue}else while(b=a[d++])c+=e(b);return c},d=ga.selectors={cacheLength:50,createPseudo:ia,match:V,attrHandle:{},find:{},relative:{">":{dir:"parentNode",first:!0}," ":{dir:"parentNode"},"+":{dir:"previousSibling",first:!0},"~":{dir:"previousSibling"}},preFilter:{ATTR:function(a){return a[1]=a[1].replace(_,aa),a[3]=(a[3]||a[4]||a[5]||"").replace(_,aa),"~="===a[2]&&(a[3]=" "+a[3]+" "),a.slice(0,4)},CHILD:function(a){return a[1]=a[1].toLowerCase(),"nth"===a[1].slice(0,3)?(a[3]||ga.error(a[0]),a[4]=+(a[4]?a[5]+(a[6]||1):2*("even"===a[3]||"odd"===a[3])),a[5]=+(a[7]+a[8]||"odd"===a[3])):a[3]&&ga.error(a[0]),a},PSEUDO:function(a){var b,c=!a[6]&&a[2];return V.CHILD.test(a[0])?null:(a[3]?a[2]=a[4]||a[5]||"":c&&T.test(c)&&(b=g(c,!0))&&(b=c.indexOf(")",c.length-b)-c.length)&&(a[0]=a[0].slice(0,b),a[2]=c.slice(0,b)),a.slice(0,3))}},filter:{TAG:function(a){var b=a.replace(_,aa).toLowerCase();return"*"===a?function(){return!0}:function(a){return a.nodeName&&a.nodeName.toLowerCase()===b}},CLASS:function(a){var b=y[a+" "];return b||(b=new RegExp("(^|"+K+")"+a+"("+K+"|$)"))&&y(a,function(a){return b.test("string"==typeof a.className&&a.className||"undefined"!=typeof a.getAttribute&&a.getAttribute("class")||"")})},ATTR:function(a,b,c){return function(d){var e=ga.attr(d,a);return null==e?"!="===b:!b||(e+="","="===b?e===c:"!="===b?e!==c:"^="===b?c&&0===e.indexOf(c):"*="===b?c&&e.indexOf(c)>-1:"$="===b?c&&e.slice(-c.length)===c:"~="===b?(" "+e.replace(O," ")+" ").indexOf(c)>-1:"|="===b&&(e===c||e.slice(0,c.length+1)===c+"-"))}},CHILD:function(a,b,c,d,e){var f="nth"!==a.slice(0,3),g="last"!==a.slice(-4),h="of-type"===b;return 1===d&&0===e?function(a){return!!a.parentNode}:function(b,c,i){var j,k,l,m,n,o,p=f!==g?"nextSibling":"previousSibling",q=b.parentNode,r=h&&b.nodeName.toLowerCase(),s=!i&&!h,t=!1;if(q){if(f){while(p){m=b;while(m=m[p])if(h?m.nodeName.toLowerCase()===r:1===m.nodeType)return!1;o=p="only"===a&&!o&&"nextSibling"}return!0}if(o=[g?q.firstChild:q.lastChild],g&&s){m=q,l=m[u]||(m[u]={}),k=l[m.uniqueID]||(l[m.uniqueID]={}),j=k[a]||[],n=j[0]===w&&j[1],t=n&&j[2],m=n&&q.childNodes[n];while(m=++n&&m&&m[p]||(t=n=0)||o.pop())if(1===m.nodeType&&++t&&m===b){k[a]=[w,n,t];break}}else if(s&&(m=b,l=m[u]||(m[u]={}),k=l[m.uniqueID]||(l[m.uniqueID]={}),j=k[a]||[],n=j[0]===w&&j[1],t=n),t===!1)while(m=++n&&m&&m[p]||(t=n=0)||o.pop())if((h?m.nodeName.toLowerCase()===r:1===m.nodeType)&&++t&&(s&&(l=m[u]||(m[u]={}),k=l[m.uniqueID]||(l[m.uniqueID]={}),k[a]=[w,t]),m===b))break;return t-=e,t===d||t%d===0&&t/d>=0}}},PSEUDO:function(a,b){var c,e=d.pseudos[a]||d.setFilters[a.toLowerCase()]||ga.error("unsupported pseudo: "+a);return e[u]?e(b):e.length>1?(c=[a,a,"",b],d.setFilters.hasOwnProperty(a.toLowerCase())?ia(function(a,c){var d,f=e(a,b),g=f.length;while(g--)d=I(a,f[g]),a[d]=!(c[d]=f[g])}):function(a){return e(a,0,c)}):e}},pseudos:{not:ia(function(a){var b=[],c=[],d=h(a.replace(P,"$1"));return d[u]?ia(function(a,b,c,e){var f,g=d(a,null,e,[]),h=a.length;while(h--)(f=g[h])&&(a[h]=!(b[h]=f))}):function(a,e,f){return b[0]=a,d(b,null,f,c),b[0]=null,!c.pop()}}),has:ia(function(a){return function(b){return ga(a,b).length>0}}),contains:ia(function(a){return a=a.replace(_,aa),function(b){return(b.textContent||b.innerText||e(b)).indexOf(a)>-1}}),lang:ia(function(a){return U.test(a||"")||ga.error("unsupported lang: "+a),a=a.replace(_,aa).toLowerCase(),function(b){var c;do if(c=p?b.lang:b.getAttribute("xml:lang")||b.getAttribute("lang"))return c=c.toLowerCase(),c===a||0===c.indexOf(a+"-");while((b=b.parentNode)&&1===b.nodeType);return!1}}),target:function(b){var c=a.location&&a.location.hash;return c&&c.slice(1)===b.id},root:function(a){return a===o},focus:function(a){return a===n.activeElement&&(!n.hasFocus||n.hasFocus())&&!!(a.type||a.href||~a.tabIndex)},enabled:oa(!1),disabled:oa(!0),checked:function(a){var b=a.nodeName.toLowerCase();return"input"===b&&!!a.checked||"option"===b&&!!a.selected},selected:function(a){return a.parentNode&&a.parentNode.selectedIndex,a.selected===!0},empty:function(a){for(a=a.firstChild;a;a=a.nextSibling)if(a.nodeType<6)return!1;return!0},parent:function(a){return!d.pseudos.empty(a)},header:function(a){return X.test(a.nodeName)},input:function(a){return W.test(a.nodeName)},button:function(a){var b=a.nodeName.toLowerCase();return"input"===b&&"button"===a.type||"button"===b},text:function(a){var b;return"input"===a.nodeName.toLowerCase()&&"text"===a.type&&(null==(b=a.getAttribute("type"))||"text"===b.toLowerCase())},first:pa(function(){return[0]}),last:pa(function(a,b){return[b-1]}),eq:pa(function(a,b,c){return[c<0?c+b:c]}),even:pa(function(a,b){for(var c=0;c<b;c+=2)a.push(c);return a}),odd:pa(function(a,b){for(var c=1;c<b;c+=2)a.push(c);return a}),lt:pa(function(a,b,c){for(var d=c<0?c+b:c;--d>=0;)a.push(d);return a}),gt:pa(function(a,b,c){for(var d=c<0?c+b:c;++d<b;)a.push(d);return a})}},d.pseudos.nth=d.pseudos.eq;for(b in{radio:!0,checkbox:!0,file:!0,password:!0,image:!0})d.pseudos[b]=ma(b);for(b in{submit:!0,reset:!0})d.pseudos[b]=na(b);function ra(){}ra.prototype=d.filters=d.pseudos,d.setFilters=new ra,g=ga.tokenize=function(a,b){var c,e,f,g,h,i,j,k=z[a+" "];if(k)return b?0:k.slice(0);h=a,i=[],j=d.preFilter;while(h){c&&!(e=Q.exec(h))||(e&&(h=h.slice(e[0].length)||h),i.push(f=[])),c=!1,(e=R.exec(h))&&(c=e.shift(),f.push({value:c,type:e[0].replace(P," ")}),h=h.slice(c.length));for(g in d.filter)!(e=V[g].exec(h))||j[g]&&!(e=j[g](e))||(c=e.shift(),f.push({value:c,type:g,matches:e}),h=h.slice(c.length));if(!c)break}return b?h.length:h?ga.error(a):z(a,i).slice(0)};function sa(a){for(var b=0,c=a.length,d="";b<c;b++)d+=a[b].value;return d}function ta(a,b,c){var d=b.dir,e=b.next,f=e||d,g=c&&"parentNode"===f,h=x++;return b.first?function(b,c,e){while(b=b[d])if(1===b.nodeType||g)return a(b,c,e);return!1}:function(b,c,i){var j,k,l,m=[w,h];if(i){while(b=b[d])if((1===b.nodeType||g)&&a(b,c,i))return!0}else while(b=b[d])if(1===b.nodeType||g)if(l=b[u]||(b[u]={}),k=l[b.uniqueID]||(l[b.uniqueID]={}),e&&e===b.nodeName.toLowerCase())b=b[d]||b;else{if((j=k[f])&&j[0]===w&&j[1]===h)return m[2]=j[2];if(k[f]=m,m[2]=a(b,c,i))return!0}return!1}}function ua(a){return a.length>1?function(b,c,d){var e=a.length;while(e--)if(!a[e](b,c,d))return!1;return!0}:a[0]}function va(a,b,c){for(var d=0,e=b.length;d<e;d++)ga(a,b[d],c);return c}function wa(a,b,c,d,e){for(var f,g=[],h=0,i=a.length,j=null!=b;h<i;h++)(f=a[h])&&(c&&!c(f,d,e)||(g.push(f),j&&b.push(h)));return g}function xa(a,b,c,d,e,f){return d&&!d[u]&&(d=xa(d)),e&&!e[u]&&(e=xa(e,f)),ia(function(f,g,h,i){var j,k,l,m=[],n=[],o=g.length,p=f||va(b||"*",h.nodeType?[h]:h,[]),q=!a||!f&&b?p:wa(p,m,a,h,i),r=c?e||(f?a:o||d)?[]:g:q;if(c&&c(q,r,h,i),d){j=wa(r,n),d(j,[],h,i),k=j.length;while(k--)(l=j[k])&&(r[n[k]]=!(q[n[k]]=l))}if(f){if(e||a){if(e){j=[],k=r.length;while(k--)(l=r[k])&&j.push(q[k]=l);e(null,r=[],j,i)}k=r.length;while(k--)(l=r[k])&&(j=e?I(f,l):m[k])>-1&&(f[j]=!(g[j]=l))}}else r=wa(r===g?r.splice(o,r.length):r),e?e(null,g,r,i):G.apply(g,r)})}function ya(a){for(var b,c,e,f=a.length,g=d.relative[a[0].type],h=g||d.relative[" "],i=g?1:0,k=ta(function(a){return a===b},h,!0),l=ta(function(a){return I(b,a)>-1},h,!0),m=[function(a,c,d){var e=!g&&(d||c!==j)||((b=c).nodeType?k(a,c,d):l(a,c,d));return b=null,e}];i<f;i++)if(c=d.relative[a[i].type])m=[ta(ua(m),c)];else{if(c=d.filter[a[i].type].apply(null,a[i].matches),c[u]){for(e=++i;e<f;e++)if(d.relative[a[e].type])break;return xa(i>1&&ua(m),i>1&&sa(a.slice(0,i-1).concat({value:" "===a[i-2].type?"*":""})).replace(P,"$1"),c,i<e&&ya(a.slice(i,e)),e<f&&ya(a=a.slice(e)),e<f&&sa(a))}m.push(c)}return ua(m)}function za(a,b){var c=b.length>0,e=a.length>0,f=function(f,g,h,i,k){var l,o,q,r=0,s="0",t=f&&[],u=[],v=j,x=f||e&&d.find.TAG("*",k),y=w+=null==v?1:Math.random()||.1,z=x.length;for(k&&(j=g===n||g||k);s!==z&&null!=(l=x[s]);s++){if(e&&l){o=0,g||l.ownerDocument===n||(m(l),h=!p);while(q=a[o++])if(q(l,g||n,h)){i.push(l);break}k&&(w=y)}c&&((l=!q&&l)&&r--,f&&t.push(l))}if(r+=s,c&&s!==r){o=0;while(q=b[o++])q(t,u,g,h);if(f){if(r>0)while(s--)t[s]||u[s]||(u[s]=E.call(i));u=wa(u)}G.apply(i,u),k&&!f&&u.length>0&&r+b.length>1&&ga.uniqueSort(i)}return k&&(w=y,j=v),t};return c?ia(f):f}return h=ga.compile=function(a,b){var c,d=[],e=[],f=A[a+" "];if(!f){b||(b=g(a)),c=b.length;while(c--)f=ya(b[c]),f[u]?d.push(f):e.push(f);f=A(a,za(e,d)),f.selector=a}return f},i=ga.select=function(a,b,c,e){var f,i,j,k,l,m="function"==typeof a&&a,n=!e&&g(a=m.selector||a);if(c=c||[],1===n.length){if(i=n[0]=n[0].slice(0),i.length>2&&"ID"===(j=i[0]).type&&9===b.nodeType&&p&&d.relative[i[1].type]){if(b=(d.find.ID(j.matches[0].replace(_,aa),b)||[])[0],!b)return c;m&&(b=b.parentNode),a=a.slice(i.shift().value.length)}f=V.needsContext.test(a)?0:i.length;while(f--){if(j=i[f],d.relative[k=j.type])break;if((l=d.find[k])&&(e=l(j.matches[0].replace(_,aa),$.test(i[0].type)&&qa(b.parentNode)||b))){if(i.splice(f,1),a=e.length&&sa(i),!a)return G.apply(c,e),c;break}}}return(m||h(a,n))(e,b,!p,c,!b||$.test(a)&&qa(b.parentNode)||b),c},c.sortStable=u.split("").sort(B).join("")===u,c.detectDuplicates=!!l,m(),c.sortDetached=ja(function(a){return 1&a.compareDocumentPosition(n.createElement("fieldset"))}),ja(function(a){return a.innerHTML="<a href='#'></a>","#"===a.firstChild.getAttribute("href")})||ka("type|href|height|width",function(a,b,c){if(!c)return a.getAttribute(b,"type"===b.toLowerCase()?1:2)}),c.attributes&&ja(function(a){return a.innerHTML="<input/>",a.firstChild.setAttribute("value",""),""===a.firstChild.getAttribute("value")})||ka("value",function(a,b,c){if(!c&&"input"===a.nodeName.toLowerCase())return a.defaultValue}),ja(function(a){return null==a.getAttribute("disabled")})||ka(J,function(a,b,c){var d;if(!c)return a[b]===!0?b.toLowerCase():(d=a.getAttributeNode(b))&&d.specified?d.value:null}),ga}(a);r.find=x,r.expr=x.selectors,r.expr[":"]=r.expr.pseudos,r.uniqueSort=r.unique=x.uniqueSort,r.text=x.getText,r.isXMLDoc=x.isXML,r.contains=x.contains,r.escapeSelector=x.escape;var y=function(a,b,c){var d=[],e=void 0!==c;while((a=a[b])&&9!==a.nodeType)if(1===a.nodeType){if(e&&r(a).is(c))break;d.push(a)}return d},z=function(a,b){for(var c=[];a;a=a.nextSibling)1===a.nodeType&&a!==b&&c.push(a);return c},A=r.expr.match.needsContext;function B(a,b){return a.nodeName&&a.nodeName.toLowerCase()===b.toLowerCase()}var C=/^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i,D=/^.[^:#\[\.,]*$/;function E(a,b,c){return r.isFunction(b)?r.grep(a,function(a,d){return!!b.call(a,d,a)!==c}):b.nodeType?r.grep(a,function(a){return a===b!==c}):"string"!=typeof b?r.grep(a,function(a){return i.call(b,a)>-1!==c}):D.test(b)?r.filter(b,a,c):(b=r.filter(b,a),r.grep(a,function(a){return i.call(b,a)>-1!==c&&1===a.nodeType}))}r.filter=function(a,b,c){var d=b[0];return c&&(a=":not("+a+")"),1===b.length&&1===d.nodeType?r.find.matchesSelector(d,a)?[d]:[]:r.find.matches(a,r.grep(b,function(a){return 1===a.nodeType}))},r.fn.extend({find:function(a){var b,c,d=this.length,e=this;if("string"!=typeof a)return this.pushStack(r(a).filter(function(){for(b=0;b<d;b++)if(r.contains(e[b],this))return!0}));for(c=this.pushStack([]),b=0;b<d;b++)r.find(a,e[b],c);return d>1?r.uniqueSort(c):c},filter:function(a){return this.pushStack(E(this,a||[],!1))},not:function(a){return this.pushStack(E(this,a||[],!0))},is:function(a){return!!E(this,"string"==typeof a&&A.test(a)?r(a):a||[],!1).length}});var F,G=/^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/,H=r.fn.init=function(a,b,c){var e,f;if(!a)return this;if(c=c||F,"string"==typeof a){if(e="<"===a[0]&&">"===a[a.length-1]&&a.length>=3?[null,a,null]:G.exec(a),!e||!e[1]&&b)return!b||b.jquery?(b||c).find(a):this.constructor(b).find(a);if(e[1]){if(b=b instanceof r?b[0]:b,r.merge(this,r.parseHTML(e[1],b&&b.nodeType?b.ownerDocument||b:d,!0)),C.test(e[1])&&r.isPlainObject(b))for(e in b)r.isFunction(this[e])?this[e](b[e]):this.attr(e,b[e]);return this}return f=d.getElementById(e[2]),f&&(this[0]=f,this.length=1),this}return a.nodeType?(this[0]=a,this.length=1,this):r.isFunction(a)?void 0!==c.ready?c.ready(a):a(r):r.makeArray(a,this)};H.prototype=r.fn,F=r(d);var I=/^(?:parents|prev(?:Until|All))/,J={children:!0,contents:!0,next:!0,prev:!0};r.fn.extend({has:function(a){var b=r(a,this),c=b.length;return this.filter(function(){for(var a=0;a<c;a++)if(r.contains(this,b[a]))return!0})},closest:function(a,b){var c,d=0,e=this.length,f=[],g="string"!=typeof a&&r(a);if(!A.test(a))for(;d<e;d++)for(c=this[d];c&&c!==b;c=c.parentNode)if(c.nodeType<11&&(g?g.index(c)>-1:1===c.nodeType&&r.find.matchesSelector(c,a))){f.push(c);break}return this.pushStack(f.length>1?r.uniqueSort(f):f)},index:function(a){return a?"string"==typeof a?i.call(r(a),this[0]):i.call(this,a.jquery?a[0]:a):this[0]&&this[0].parentNode?this.first().prevAll().length:-1},add:function(a,b){return this.pushStack(r.uniqueSort(r.merge(this.get(),r(a,b))))},addBack:function(a){return this.add(null==a?this.prevObject:this.prevObject.filter(a))}});function K(a,b){while((a=a[b])&&1!==a.nodeType);return a}r.each({parent:function(a){var b=a.parentNode;return b&&11!==b.nodeType?b:null},parents:function(a){return y(a,"parentNode")},parentsUntil:function(a,b,c){return y(a,"parentNode",c)},next:function(a){return K(a,"nextSibling")},prev:function(a){return K(a,"previousSibling")},nextAll:function(a){return y(a,"nextSibling")},prevAll:function(a){return y(a,"previousSibling")},nextUntil:function(a,b,c){return y(a,"nextSibling",c)},prevUntil:function(a,b,c){return y(a,"previousSibling",c)},siblings:function(a){return z((a.parentNode||{}).firstChild,a)},children:function(a){return z(a.firstChild)},contents:function(a){return B(a,"iframe")?a.contentDocument:(B(a,"template")&&(a=a.content||a),r.merge([],a.childNodes))}},function(a,b){r.fn[a]=function(c,d){var e=r.map(this,b,c);return"Until"!==a.slice(-5)&&(d=c),d&&"string"==typeof d&&(e=r.filter(d,e)),this.length>1&&(J[a]||r.uniqueSort(e),I.test(a)&&e.reverse()),this.pushStack(e)}});var L=/[^\x20\t\r\n\f]+/g;function M(a){var b={};return r.each(a.match(L)||[],function(a,c){b[c]=!0}),b}r.Callbacks=function(a){a="string"==typeof a?M(a):r.extend({},a);var b,c,d,e,f=[],g=[],h=-1,i=function(){for(e=e||a.once,d=b=!0;g.length;h=-1){c=g.shift();while(++h<f.length)f[h].apply(c[0],c[1])===!1&&a.stopOnFalse&&(h=f.length,c=!1)}a.memory||(c=!1),b=!1,e&&(f=c?[]:"")},j={add:function(){return f&&(c&&!b&&(h=f.length-1,g.push(c)),function d(b){r.each(b,function(b,c){r.isFunction(c)?a.unique&&j.has(c)||f.push(c):c&&c.length&&"string"!==r.type(c)&&d(c)})}(arguments),c&&!b&&i()),this},remove:function(){return r.each(arguments,function(a,b){var c;while((c=r.inArray(b,f,c))>-1)f.splice(c,1),c<=h&&h--}),this},has:function(a){return a?r.inArray(a,f)>-1:f.length>0},empty:function(){return f&&(f=[]),this},disable:function(){return e=g=[],f=c="",this},disabled:function(){return!f},lock:function(){return e=g=[],c||b||(f=c=""),this},locked:function(){return!!e},fireWith:function(a,c){return e||(c=c||[],c=[a,c.slice?c.slice():c],g.push(c),b||i()),this},fire:function(){return j.fireWith(this,arguments),this},fired:function(){return!!d}};return j};function N(a){return a}function O(a){throw a}function P(a,b,c,d){var e;try{a&&r.isFunction(e=a.promise)?e.call(a).done(b).fail(c):a&&r.isFunction(e=a.then)?e.call(a,b,c):b.apply(void 0,[a].slice(d))}catch(a){c.apply(void 0,[a])}}r.extend({Deferred:function(b){var c=[["notify","progress",r.Callbacks("memory"),r.Callbacks("memory"),2],["resolve","done",r.Callbacks("once memory"),r.Callbacks("once memory"),0,"resolved"],["reject","fail",r.Callbacks("once memory"),r.Callbacks("once memory"),1,"rejected"]],d="pending",e={state:function(){return d},always:function(){return f.done(arguments).fail(arguments),this},"catch":function(a){return e.then(null,a)},pipe:function(){var a=arguments;return r.Deferred(function(b){r.each(c,function(c,d){var e=r.isFunction(a[d[4]])&&a[d[4]];f[d[1]](function(){var a=e&&e.apply(this,arguments);a&&r.isFunction(a.promise)?a.promise().progress(b.notify).done(b.resolve).fail(b.reject):b[d[0]+"With"](this,e?[a]:arguments)})}),a=null}).promise()},then:function(b,d,e){var f=0;function g(b,c,d,e){return function(){var h=this,i=arguments,j=function(){var a,j;if(!(b<f)){if(a=d.apply(h,i),a===c.promise())throw new TypeError("Thenable self-resolution");j=a&&("object"==typeof a||"function"==typeof a)&&a.then,r.isFunction(j)?e?j.call(a,g(f,c,N,e),g(f,c,O,e)):(f++,j.call(a,g(f,c,N,e),g(f,c,O,e),g(f,c,N,c.notifyWith))):(d!==N&&(h=void 0,i=[a]),(e||c.resolveWith)(h,i))}},k=e?j:function(){try{j()}catch(a){r.Deferred.exceptionHook&&r.Deferred.exceptionHook(a,k.stackTrace),b+1>=f&&(d!==O&&(h=void 0,i=[a]),c.rejectWith(h,i))}};b?k():(r.Deferred.getStackHook&&(k.stackTrace=r.Deferred.getStackHook()),a.setTimeout(k))}}return r.Deferred(function(a){c[0][3].add(g(0,a,r.isFunction(e)?e:N,a.notifyWith)),c[1][3].add(g(0,a,r.isFunction(b)?b:N)),c[2][3].add(g(0,a,r.isFunction(d)?d:O))}).promise()},promise:function(a){return null!=a?r.extend(a,e):e}},f={};return r.each(c,function(a,b){var g=b[2],h=b[5];e[b[1]]=g.add,h&&g.add(function(){d=h},c[3-a][2].disable,c[0][2].lock),g.add(b[3].fire),f[b[0]]=function(){return f[b[0]+"With"](this===f?void 0:this,arguments),this},f[b[0]+"With"]=g.fireWith}),e.promise(f),b&&b.call(f,f),f},when:function(a){var b=arguments.length,c=b,d=Array(c),e=f.call(arguments),g=r.Deferred(),h=function(a){return function(c){d[a]=this,e[a]=arguments.length>1?f.call(arguments):c,--b||g.resolveWith(d,e)}};if(b<=1&&(P(a,g.done(h(c)).resolve,g.reject,!b),"pending"===g.state()||r.isFunction(e[c]&&e[c].then)))return g.then();while(c--)P(e[c],h(c),g.reject);return g.promise()}});var Q=/^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;r.Deferred.exceptionHook=function(b,c){a.console&&a.console.warn&&b&&Q.test(b.name)&&a.console.warn("jQuery.Deferred exception: "+b.message,b.stack,c)},r.readyException=function(b){a.setTimeout(function(){throw b})};var R=r.Deferred();r.fn.ready=function(a){return R.then(a)["catch"](function(a){r.readyException(a)}),this},r.extend({isReady:!1,readyWait:1,ready:function(a){(a===!0?--r.readyWait:r.isReady)||(r.isReady=!0,a!==!0&&--r.readyWait>0||R.resolveWith(d,[r]))}}),r.ready.then=R.then;function S(){d.removeEventListener("DOMContentLoaded",S),
a.removeEventListener("load",S),r.ready()}"complete"===d.readyState||"loading"!==d.readyState&&!d.documentElement.doScroll?a.setTimeout(r.ready):(d.addEventListener("DOMContentLoaded",S),a.addEventListener("load",S));var T=function(a,b,c,d,e,f,g){var h=0,i=a.length,j=null==c;if("object"===r.type(c)){e=!0;for(h in c)T(a,b,h,c[h],!0,f,g)}else if(void 0!==d&&(e=!0,r.isFunction(d)||(g=!0),j&&(g?(b.call(a,d),b=null):(j=b,b=function(a,b,c){return j.call(r(a),c)})),b))for(;h<i;h++)b(a[h],c,g?d:d.call(a[h],h,b(a[h],c)));return e?a:j?b.call(a):i?b(a[0],c):f},U=function(a){return 1===a.nodeType||9===a.nodeType||!+a.nodeType};function V(){this.expando=r.expando+V.uid++}V.uid=1,V.prototype={cache:function(a){var b=a[this.expando];return b||(b={},U(a)&&(a.nodeType?a[this.expando]=b:Object.defineProperty(a,this.expando,{value:b,configurable:!0}))),b},set:function(a,b,c){var d,e=this.cache(a);if("string"==typeof b)e[r.camelCase(b)]=c;else for(d in b)e[r.camelCase(d)]=b[d];return e},get:function(a,b){return void 0===b?this.cache(a):a[this.expando]&&a[this.expando][r.camelCase(b)]},access:function(a,b,c){return void 0===b||b&&"string"==typeof b&&void 0===c?this.get(a,b):(this.set(a,b,c),void 0!==c?c:b)},remove:function(a,b){var c,d=a[this.expando];if(void 0!==d){if(void 0!==b){Array.isArray(b)?b=b.map(r.camelCase):(b=r.camelCase(b),b=b in d?[b]:b.match(L)||[]),c=b.length;while(c--)delete d[b[c]]}(void 0===b||r.isEmptyObject(d))&&(a.nodeType?a[this.expando]=void 0:delete a[this.expando])}},hasData:function(a){var b=a[this.expando];return void 0!==b&&!r.isEmptyObject(b)}};var W=new V,X=new V,Y=/^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,Z=/[A-Z]/g;function $(a){return"true"===a||"false"!==a&&("null"===a?null:a===+a+""?+a:Y.test(a)?JSON.parse(a):a)}function _(a,b,c){var d;if(void 0===c&&1===a.nodeType)if(d="data-"+b.replace(Z,"-$&").toLowerCase(),c=a.getAttribute(d),"string"==typeof c){try{c=$(c)}catch(e){}X.set(a,b,c)}else c=void 0;return c}r.extend({hasData:function(a){return X.hasData(a)||W.hasData(a)},data:function(a,b,c){return X.access(a,b,c)},removeData:function(a,b){X.remove(a,b)},_data:function(a,b,c){return W.access(a,b,c)},_removeData:function(a,b){W.remove(a,b)}}),r.fn.extend({data:function(a,b){var c,d,e,f=this[0],g=f&&f.attributes;if(void 0===a){if(this.length&&(e=X.get(f),1===f.nodeType&&!W.get(f,"hasDataAttrs"))){c=g.length;while(c--)g[c]&&(d=g[c].name,0===d.indexOf("data-")&&(d=r.camelCase(d.slice(5)),_(f,d,e[d])));W.set(f,"hasDataAttrs",!0)}return e}return"object"==typeof a?this.each(function(){X.set(this,a)}):T(this,function(b){var c;if(f&&void 0===b){if(c=X.get(f,a),void 0!==c)return c;if(c=_(f,a),void 0!==c)return c}else this.each(function(){X.set(this,a,b)})},null,b,arguments.length>1,null,!0)},removeData:function(a){return this.each(function(){X.remove(this,a)})}}),r.extend({queue:function(a,b,c){var d;if(a)return b=(b||"fx")+"queue",d=W.get(a,b),c&&(!d||Array.isArray(c)?d=W.access(a,b,r.makeArray(c)):d.push(c)),d||[]},dequeue:function(a,b){b=b||"fx";var c=r.queue(a,b),d=c.length,e=c.shift(),f=r._queueHooks(a,b),g=function(){r.dequeue(a,b)};"inprogress"===e&&(e=c.shift(),d--),e&&("fx"===b&&c.unshift("inprogress"),delete f.stop,e.call(a,g,f)),!d&&f&&f.empty.fire()},_queueHooks:function(a,b){var c=b+"queueHooks";return W.get(a,c)||W.access(a,c,{empty:r.Callbacks("once memory").add(function(){W.remove(a,[b+"queue",c])})})}}),r.fn.extend({queue:function(a,b){var c=2;return"string"!=typeof a&&(b=a,a="fx",c--),arguments.length<c?r.queue(this[0],a):void 0===b?this:this.each(function(){var c=r.queue(this,a,b);r._queueHooks(this,a),"fx"===a&&"inprogress"!==c[0]&&r.dequeue(this,a)})},dequeue:function(a){return this.each(function(){r.dequeue(this,a)})},clearQueue:function(a){return this.queue(a||"fx",[])},promise:function(a,b){var c,d=1,e=r.Deferred(),f=this,g=this.length,h=function(){--d||e.resolveWith(f,[f])};"string"!=typeof a&&(b=a,a=void 0),a=a||"fx";while(g--)c=W.get(f[g],a+"queueHooks"),c&&c.empty&&(d++,c.empty.add(h));return h(),e.promise(b)}});var aa=/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,ba=new RegExp("^(?:([+-])=|)("+aa+")([a-z%]*)$","i"),ca=["Top","Right","Bottom","Left"],da=function(a,b){return a=b||a,"none"===a.style.display||""===a.style.display&&r.contains(a.ownerDocument,a)&&"none"===r.css(a,"display")},ea=function(a,b,c,d){var e,f,g={};for(f in b)g[f]=a.style[f],a.style[f]=b[f];e=c.apply(a,d||[]);for(f in b)a.style[f]=g[f];return e};function fa(a,b,c,d){var e,f=1,g=20,h=d?function(){return d.cur()}:function(){return r.css(a,b,"")},i=h(),j=c&&c[3]||(r.cssNumber[b]?"":"px"),k=(r.cssNumber[b]||"px"!==j&&+i)&&ba.exec(r.css(a,b));if(k&&k[3]!==j){j=j||k[3],c=c||[],k=+i||1;do f=f||".5",k/=f,r.style(a,b,k+j);while(f!==(f=h()/i)&&1!==f&&--g)}return c&&(k=+k||+i||0,e=c[1]?k+(c[1]+1)*c[2]:+c[2],d&&(d.unit=j,d.start=k,d.end=e)),e}var ga={};function ha(a){var b,c=a.ownerDocument,d=a.nodeName,e=ga[d];return e?e:(b=c.body.appendChild(c.createElement(d)),e=r.css(b,"display"),b.parentNode.removeChild(b),"none"===e&&(e="block"),ga[d]=e,e)}function ia(a,b){for(var c,d,e=[],f=0,g=a.length;f<g;f++)d=a[f],d.style&&(c=d.style.display,b?("none"===c&&(e[f]=W.get(d,"display")||null,e[f]||(d.style.display="")),""===d.style.display&&da(d)&&(e[f]=ha(d))):"none"!==c&&(e[f]="none",W.set(d,"display",c)));for(f=0;f<g;f++)null!=e[f]&&(a[f].style.display=e[f]);return a}r.fn.extend({show:function(){return ia(this,!0)},hide:function(){return ia(this)},toggle:function(a){return"boolean"==typeof a?a?this.show():this.hide():this.each(function(){da(this)?r(this).show():r(this).hide()})}});var ja=/^(?:checkbox|radio)$/i,ka=/<([a-z][^\/\0>\x20\t\r\n\f]+)/i,la=/^$|\/(?:java|ecma)script/i,ma={option:[1,"<select multiple='multiple'>","</select>"],thead:[1,"<table>","</table>"],col:[2,"<table><colgroup>","</colgroup></table>"],tr:[2,"<table><tbody>","</tbody></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],_default:[0,"",""]};ma.optgroup=ma.option,ma.tbody=ma.tfoot=ma.colgroup=ma.caption=ma.thead,ma.th=ma.td;function na(a,b){var c;return c="undefined"!=typeof a.getElementsByTagName?a.getElementsByTagName(b||"*"):"undefined"!=typeof a.querySelectorAll?a.querySelectorAll(b||"*"):[],void 0===b||b&&B(a,b)?r.merge([a],c):c}function oa(a,b){for(var c=0,d=a.length;c<d;c++)W.set(a[c],"globalEval",!b||W.get(b[c],"globalEval"))}var pa=/<|&#?\w+;/;function qa(a,b,c,d,e){for(var f,g,h,i,j,k,l=b.createDocumentFragment(),m=[],n=0,o=a.length;n<o;n++)if(f=a[n],f||0===f)if("object"===r.type(f))r.merge(m,f.nodeType?[f]:f);else if(pa.test(f)){g=g||l.appendChild(b.createElement("div")),h=(ka.exec(f)||["",""])[1].toLowerCase(),i=ma[h]||ma._default,g.innerHTML=i[1]+r.htmlPrefilter(f)+i[2],k=i[0];while(k--)g=g.lastChild;r.merge(m,g.childNodes),g=l.firstChild,g.textContent=""}else m.push(b.createTextNode(f));l.textContent="",n=0;while(f=m[n++])if(d&&r.inArray(f,d)>-1)e&&e.push(f);else if(j=r.contains(f.ownerDocument,f),g=na(l.appendChild(f),"script"),j&&oa(g),c){k=0;while(f=g[k++])la.test(f.type||"")&&c.push(f)}return l}!function(){var a=d.createDocumentFragment(),b=a.appendChild(d.createElement("div")),c=d.createElement("input");c.setAttribute("type","radio"),c.setAttribute("checked","checked"),c.setAttribute("name","t"),b.appendChild(c),o.checkClone=b.cloneNode(!0).cloneNode(!0).lastChild.checked,b.innerHTML="<textarea>x</textarea>",o.noCloneChecked=!!b.cloneNode(!0).lastChild.defaultValue}();var ra=d.documentElement,sa=/^key/,ta=/^(?:mouse|pointer|contextmenu|drag|drop)|click/,ua=/^([^.]*)(?:\.(.+)|)/;function va(){return!0}function wa(){return!1}function xa(){try{return d.activeElement}catch(a){}}function ya(a,b,c,d,e,f){var g,h;if("object"==typeof b){"string"!=typeof c&&(d=d||c,c=void 0);for(h in b)ya(a,h,c,d,b[h],f);return a}if(null==d&&null==e?(e=c,d=c=void 0):null==e&&("string"==typeof c?(e=d,d=void 0):(e=d,d=c,c=void 0)),e===!1)e=wa;else if(!e)return a;return 1===f&&(g=e,e=function(a){return r().off(a),g.apply(this,arguments)},e.guid=g.guid||(g.guid=r.guid++)),a.each(function(){r.event.add(this,b,e,d,c)})}r.event={global:{},add:function(a,b,c,d,e){var f,g,h,i,j,k,l,m,n,o,p,q=W.get(a);if(q){c.handler&&(f=c,c=f.handler,e=f.selector),e&&r.find.matchesSelector(ra,e),c.guid||(c.guid=r.guid++),(i=q.events)||(i=q.events={}),(g=q.handle)||(g=q.handle=function(b){return"undefined"!=typeof r&&r.event.triggered!==b.type?r.event.dispatch.apply(a,arguments):void 0}),b=(b||"").match(L)||[""],j=b.length;while(j--)h=ua.exec(b[j])||[],n=p=h[1],o=(h[2]||"").split(".").sort(),n&&(l=r.event.special[n]||{},n=(e?l.delegateType:l.bindType)||n,l=r.event.special[n]||{},k=r.extend({type:n,origType:p,data:d,handler:c,guid:c.guid,selector:e,needsContext:e&&r.expr.match.needsContext.test(e),namespace:o.join(".")},f),(m=i[n])||(m=i[n]=[],m.delegateCount=0,l.setup&&l.setup.call(a,d,o,g)!==!1||a.addEventListener&&a.addEventListener(n,g)),l.add&&(l.add.call(a,k),k.handler.guid||(k.handler.guid=c.guid)),e?m.splice(m.delegateCount++,0,k):m.push(k),r.event.global[n]=!0)}},remove:function(a,b,c,d,e){var f,g,h,i,j,k,l,m,n,o,p,q=W.hasData(a)&&W.get(a);if(q&&(i=q.events)){b=(b||"").match(L)||[""],j=b.length;while(j--)if(h=ua.exec(b[j])||[],n=p=h[1],o=(h[2]||"").split(".").sort(),n){l=r.event.special[n]||{},n=(d?l.delegateType:l.bindType)||n,m=i[n]||[],h=h[2]&&new RegExp("(^|\\.)"+o.join("\\.(?:.*\\.|)")+"(\\.|$)"),g=f=m.length;while(f--)k=m[f],!e&&p!==k.origType||c&&c.guid!==k.guid||h&&!h.test(k.namespace)||d&&d!==k.selector&&("**"!==d||!k.selector)||(m.splice(f,1),k.selector&&m.delegateCount--,l.remove&&l.remove.call(a,k));g&&!m.length&&(l.teardown&&l.teardown.call(a,o,q.handle)!==!1||r.removeEvent(a,n,q.handle),delete i[n])}else for(n in i)r.event.remove(a,n+b[j],c,d,!0);r.isEmptyObject(i)&&W.remove(a,"handle events")}},dispatch:function(a){var b=r.event.fix(a),c,d,e,f,g,h,i=new Array(arguments.length),j=(W.get(this,"events")||{})[b.type]||[],k=r.event.special[b.type]||{};for(i[0]=b,c=1;c<arguments.length;c++)i[c]=arguments[c];if(b.delegateTarget=this,!k.preDispatch||k.preDispatch.call(this,b)!==!1){h=r.event.handlers.call(this,b,j),c=0;while((f=h[c++])&&!b.isPropagationStopped()){b.currentTarget=f.elem,d=0;while((g=f.handlers[d++])&&!b.isImmediatePropagationStopped())b.rnamespace&&!b.rnamespace.test(g.namespace)||(b.handleObj=g,b.data=g.data,e=((r.event.special[g.origType]||{}).handle||g.handler).apply(f.elem,i),void 0!==e&&(b.result=e)===!1&&(b.preventDefault(),b.stopPropagation()))}return k.postDispatch&&k.postDispatch.call(this,b),b.result}},handlers:function(a,b){var c,d,e,f,g,h=[],i=b.delegateCount,j=a.target;if(i&&j.nodeType&&!("click"===a.type&&a.button>=1))for(;j!==this;j=j.parentNode||this)if(1===j.nodeType&&("click"!==a.type||j.disabled!==!0)){for(f=[],g={},c=0;c<i;c++)d=b[c],e=d.selector+" ",void 0===g[e]&&(g[e]=d.needsContext?r(e,this).index(j)>-1:r.find(e,this,null,[j]).length),g[e]&&f.push(d);f.length&&h.push({elem:j,handlers:f})}return j=this,i<b.length&&h.push({elem:j,handlers:b.slice(i)}),h},addProp:function(a,b){Object.defineProperty(r.Event.prototype,a,{enumerable:!0,configurable:!0,get:r.isFunction(b)?function(){if(this.originalEvent)return b(this.originalEvent)}:function(){if(this.originalEvent)return this.originalEvent[a]},set:function(b){Object.defineProperty(this,a,{enumerable:!0,configurable:!0,writable:!0,value:b})}})},fix:function(a){return a[r.expando]?a:new r.Event(a)},special:{load:{noBubble:!0},focus:{trigger:function(){if(this!==xa()&&this.focus)return this.focus(),!1},delegateType:"focusin"},blur:{trigger:function(){if(this===xa()&&this.blur)return this.blur(),!1},delegateType:"focusout"},click:{trigger:function(){if("checkbox"===this.type&&this.click&&B(this,"input"))return this.click(),!1},_default:function(a){return B(a.target,"a")}},beforeunload:{postDispatch:function(a){void 0!==a.result&&a.originalEvent&&(a.originalEvent.returnValue=a.result)}}}},r.removeEvent=function(a,b,c){a.removeEventListener&&a.removeEventListener(b,c)},r.Event=function(a,b){return this instanceof r.Event?(a&&a.type?(this.originalEvent=a,this.type=a.type,this.isDefaultPrevented=a.defaultPrevented||void 0===a.defaultPrevented&&a.returnValue===!1?va:wa,this.target=a.target&&3===a.target.nodeType?a.target.parentNode:a.target,this.currentTarget=a.currentTarget,this.relatedTarget=a.relatedTarget):this.type=a,b&&r.extend(this,b),this.timeStamp=a&&a.timeStamp||r.now(),void(this[r.expando]=!0)):new r.Event(a,b)},r.Event.prototype={constructor:r.Event,isDefaultPrevented:wa,isPropagationStopped:wa,isImmediatePropagationStopped:wa,isSimulated:!1,preventDefault:function(){var a=this.originalEvent;this.isDefaultPrevented=va,a&&!this.isSimulated&&a.preventDefault()},stopPropagation:function(){var a=this.originalEvent;this.isPropagationStopped=va,a&&!this.isSimulated&&a.stopPropagation()},stopImmediatePropagation:function(){var a=this.originalEvent;this.isImmediatePropagationStopped=va,a&&!this.isSimulated&&a.stopImmediatePropagation(),this.stopPropagation()}},r.each({altKey:!0,bubbles:!0,cancelable:!0,changedTouches:!0,ctrlKey:!0,detail:!0,eventPhase:!0,metaKey:!0,pageX:!0,pageY:!0,shiftKey:!0,view:!0,"char":!0,charCode:!0,key:!0,keyCode:!0,button:!0,buttons:!0,clientX:!0,clientY:!0,offsetX:!0,offsetY:!0,pointerId:!0,pointerType:!0,screenX:!0,screenY:!0,targetTouches:!0,toElement:!0,touches:!0,which:function(a){var b=a.button;return null==a.which&&sa.test(a.type)?null!=a.charCode?a.charCode:a.keyCode:!a.which&&void 0!==b&&ta.test(a.type)?1&b?1:2&b?3:4&b?2:0:a.which}},r.event.addProp),r.each({mouseenter:"mouseover",mouseleave:"mouseout",pointerenter:"pointerover",pointerleave:"pointerout"},function(a,b){r.event.special[a]={delegateType:b,bindType:b,handle:function(a){var c,d=this,e=a.relatedTarget,f=a.handleObj;return e&&(e===d||r.contains(d,e))||(a.type=f.origType,c=f.handler.apply(this,arguments),a.type=b),c}}}),r.fn.extend({on:function(a,b,c,d){return ya(this,a,b,c,d)},one:function(a,b,c,d){return ya(this,a,b,c,d,1)},off:function(a,b,c){var d,e;if(a&&a.preventDefault&&a.handleObj)return d=a.handleObj,r(a.delegateTarget).off(d.namespace?d.origType+"."+d.namespace:d.origType,d.selector,d.handler),this;if("object"==typeof a){for(e in a)this.off(e,b,a[e]);return this}return b!==!1&&"function"!=typeof b||(c=b,b=void 0),c===!1&&(c=wa),this.each(function(){r.event.remove(this,a,c,b)})}});var za=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([a-z][^\/\0>\x20\t\r\n\f]*)[^>]*)\/>/gi,Aa=/<script|<style|<link/i,Ba=/checked\s*(?:[^=]|=\s*.checked.)/i,Ca=/^true\/(.*)/,Da=/^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;function Ea(a,b){return B(a,"table")&&B(11!==b.nodeType?b:b.firstChild,"tr")?r(">tbody",a)[0]||a:a}function Fa(a){return a.type=(null!==a.getAttribute("type"))+"/"+a.type,a}function Ga(a){var b=Ca.exec(a.type);return b?a.type=b[1]:a.removeAttribute("type"),a}function Ha(a,b){var c,d,e,f,g,h,i,j;if(1===b.nodeType){if(W.hasData(a)&&(f=W.access(a),g=W.set(b,f),j=f.events)){delete g.handle,g.events={};for(e in j)for(c=0,d=j[e].length;c<d;c++)r.event.add(b,e,j[e][c])}X.hasData(a)&&(h=X.access(a),i=r.extend({},h),X.set(b,i))}}function Ia(a,b){var c=b.nodeName.toLowerCase();"input"===c&&ja.test(a.type)?b.checked=a.checked:"input"!==c&&"textarea"!==c||(b.defaultValue=a.defaultValue)}function Ja(a,b,c,d){b=g.apply([],b);var e,f,h,i,j,k,l=0,m=a.length,n=m-1,q=b[0],s=r.isFunction(q);if(s||m>1&&"string"==typeof q&&!o.checkClone&&Ba.test(q))return a.each(function(e){var f=a.eq(e);s&&(b[0]=q.call(this,e,f.html())),Ja(f,b,c,d)});if(m&&(e=qa(b,a[0].ownerDocument,!1,a,d),f=e.firstChild,1===e.childNodes.length&&(e=f),f||d)){for(h=r.map(na(e,"script"),Fa),i=h.length;l<m;l++)j=e,l!==n&&(j=r.clone(j,!0,!0),i&&r.merge(h,na(j,"script"))),c.call(a[l],j,l);if(i)for(k=h[h.length-1].ownerDocument,r.map(h,Ga),l=0;l<i;l++)j=h[l],la.test(j.type||"")&&!W.access(j,"globalEval")&&r.contains(k,j)&&(j.src?r._evalUrl&&r._evalUrl(j.src):p(j.textContent.replace(Da,""),k))}return a}function Ka(a,b,c){for(var d,e=b?r.filter(b,a):a,f=0;null!=(d=e[f]);f++)c||1!==d.nodeType||r.cleanData(na(d)),d.parentNode&&(c&&r.contains(d.ownerDocument,d)&&oa(na(d,"script")),d.parentNode.removeChild(d));return a}r.extend({htmlPrefilter:function(a){return a.replace(za,"<$1></$2>")},clone:function(a,b,c){var d,e,f,g,h=a.cloneNode(!0),i=r.contains(a.ownerDocument,a);if(!(o.noCloneChecked||1!==a.nodeType&&11!==a.nodeType||r.isXMLDoc(a)))for(g=na(h),f=na(a),d=0,e=f.length;d<e;d++)Ia(f[d],g[d]);if(b)if(c)for(f=f||na(a),g=g||na(h),d=0,e=f.length;d<e;d++)Ha(f[d],g[d]);else Ha(a,h);return g=na(h,"script"),g.length>0&&oa(g,!i&&na(a,"script")),h},cleanData:function(a){for(var b,c,d,e=r.event.special,f=0;void 0!==(c=a[f]);f++)if(U(c)){if(b=c[W.expando]){if(b.events)for(d in b.events)e[d]?r.event.remove(c,d):r.removeEvent(c,d,b.handle);c[W.expando]=void 0}c[X.expando]&&(c[X.expando]=void 0)}}}),r.fn.extend({detach:function(a){return Ka(this,a,!0)},remove:function(a){return Ka(this,a)},text:function(a){return T(this,function(a){return void 0===a?r.text(this):this.empty().each(function(){1!==this.nodeType&&11!==this.nodeType&&9!==this.nodeType||(this.textContent=a)})},null,a,arguments.length)},append:function(){return Ja(this,arguments,function(a){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var b=Ea(this,a);b.appendChild(a)}})},prepend:function(){return Ja(this,arguments,function(a){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var b=Ea(this,a);b.insertBefore(a,b.firstChild)}})},before:function(){return Ja(this,arguments,function(a){this.parentNode&&this.parentNode.insertBefore(a,this)})},after:function(){return Ja(this,arguments,function(a){this.parentNode&&this.parentNode.insertBefore(a,this.nextSibling)})},empty:function(){for(var a,b=0;null!=(a=this[b]);b++)1===a.nodeType&&(r.cleanData(na(a,!1)),a.textContent="");return this},clone:function(a,b){return a=null!=a&&a,b=null==b?a:b,this.map(function(){return r.clone(this,a,b)})},html:function(a){return T(this,function(a){var b=this[0]||{},c=0,d=this.length;if(void 0===a&&1===b.nodeType)return b.innerHTML;if("string"==typeof a&&!Aa.test(a)&&!ma[(ka.exec(a)||["",""])[1].toLowerCase()]){a=r.htmlPrefilter(a);try{for(;c<d;c++)b=this[c]||{},1===b.nodeType&&(r.cleanData(na(b,!1)),b.innerHTML=a);b=0}catch(e){}}b&&this.empty().append(a)},null,a,arguments.length)},replaceWith:function(){var a=[];return Ja(this,arguments,function(b){var c=this.parentNode;r.inArray(this,a)<0&&(r.cleanData(na(this)),c&&c.replaceChild(b,this))},a)}}),r.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(a,b){r.fn[a]=function(a){for(var c,d=[],e=r(a),f=e.length-1,g=0;g<=f;g++)c=g===f?this:this.clone(!0),r(e[g])[b](c),h.apply(d,c.get());return this.pushStack(d)}});var La=/^margin/,Ma=new RegExp("^("+aa+")(?!px)[a-z%]+$","i"),Na=function(b){var c=b.ownerDocument.defaultView;return c&&c.opener||(c=a),c.getComputedStyle(b)};!function(){function b(){if(i){i.style.cssText="box-sizing:border-box;position:relative;display:block;margin:auto;border:1px;padding:1px;top:1%;width:50%",i.innerHTML="",ra.appendChild(h);var b=a.getComputedStyle(i);c="1%"!==b.top,g="2px"===b.marginLeft,e="4px"===b.width,i.style.marginRight="50%",f="4px"===b.marginRight,ra.removeChild(h),i=null}}var c,e,f,g,h=d.createElement("div"),i=d.createElement("div");i.style&&(i.style.backgroundClip="content-box",i.cloneNode(!0).style.backgroundClip="",o.clearCloneStyle="content-box"===i.style.backgroundClip,h.style.cssText="border:0;width:8px;height:0;top:0;left:-9999px;padding:0;margin-top:1px;position:absolute",h.appendChild(i),r.extend(o,{pixelPosition:function(){return b(),c},boxSizingReliable:function(){return b(),e},pixelMarginRight:function(){return b(),f},reliableMarginLeft:function(){return b(),g}}))}();function Oa(a,b,c){var d,e,f,g,h=a.style;return c=c||Na(a),c&&(g=c.getPropertyValue(b)||c[b],""!==g||r.contains(a.ownerDocument,a)||(g=r.style(a,b)),!o.pixelMarginRight()&&Ma.test(g)&&La.test(b)&&(d=h.width,e=h.minWidth,f=h.maxWidth,h.minWidth=h.maxWidth=h.width=g,g=c.width,h.width=d,h.minWidth=e,h.maxWidth=f)),void 0!==g?g+"":g}function Pa(a,b){return{get:function(){return a()?void delete this.get:(this.get=b).apply(this,arguments)}}}var Qa=/^(none|table(?!-c[ea]).+)/,Ra=/^--/,Sa={position:"absolute",visibility:"hidden",display:"block"},Ta={letterSpacing:"0",fontWeight:"400"},Ua=["Webkit","Moz","ms"],Va=d.createElement("div").style;function Wa(a){if(a in Va)return a;var b=a[0].toUpperCase()+a.slice(1),c=Ua.length;while(c--)if(a=Ua[c]+b,a in Va)return a}function Xa(a){var b=r.cssProps[a];return b||(b=r.cssProps[a]=Wa(a)||a),b}function Ya(a,b,c){var d=ba.exec(b);return d?Math.max(0,d[2]-(c||0))+(d[3]||"px"):b}function Za(a,b,c,d,e){var f,g=0;for(f=c===(d?"border":"content")?4:"width"===b?1:0;f<4;f+=2)"margin"===c&&(g+=r.css(a,c+ca[f],!0,e)),d?("content"===c&&(g-=r.css(a,"padding"+ca[f],!0,e)),"margin"!==c&&(g-=r.css(a,"border"+ca[f]+"Width",!0,e))):(g+=r.css(a,"padding"+ca[f],!0,e),"padding"!==c&&(g+=r.css(a,"border"+ca[f]+"Width",!0,e)));return g}function $a(a,b,c){var d,e=Na(a),f=Oa(a,b,e),g="border-box"===r.css(a,"boxSizing",!1,e);return Ma.test(f)?f:(d=g&&(o.boxSizingReliable()||f===a.style[b]),"auto"===f&&(f=a["offset"+b[0].toUpperCase()+b.slice(1)]),f=parseFloat(f)||0,f+Za(a,b,c||(g?"border":"content"),d,e)+"px")}r.extend({cssHooks:{opacity:{get:function(a,b){if(b){var c=Oa(a,"opacity");return""===c?"1":c}}}},cssNumber:{animationIterationCount:!0,columnCount:!0,fillOpacity:!0,flexGrow:!0,flexShrink:!0,fontWeight:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0},cssProps:{"float":"cssFloat"},style:function(a,b,c,d){if(a&&3!==a.nodeType&&8!==a.nodeType&&a.style){var e,f,g,h=r.camelCase(b),i=Ra.test(b),j=a.style;return i||(b=Xa(h)),g=r.cssHooks[b]||r.cssHooks[h],void 0===c?g&&"get"in g&&void 0!==(e=g.get(a,!1,d))?e:j[b]:(f=typeof c,"string"===f&&(e=ba.exec(c))&&e[1]&&(c=fa(a,b,e),f="number"),null!=c&&c===c&&("number"===f&&(c+=e&&e[3]||(r.cssNumber[h]?"":"px")),o.clearCloneStyle||""!==c||0!==b.indexOf("background")||(j[b]="inherit"),g&&"set"in g&&void 0===(c=g.set(a,c,d))||(i?j.setProperty(b,c):j[b]=c)),void 0)}},css:function(a,b,c,d){var e,f,g,h=r.camelCase(b),i=Ra.test(b);return i||(b=Xa(h)),g=r.cssHooks[b]||r.cssHooks[h],g&&"get"in g&&(e=g.get(a,!0,c)),void 0===e&&(e=Oa(a,b,d)),"normal"===e&&b in Ta&&(e=Ta[b]),""===c||c?(f=parseFloat(e),c===!0||isFinite(f)?f||0:e):e}}),r.each(["height","width"],function(a,b){r.cssHooks[b]={get:function(a,c,d){if(c)return!Qa.test(r.css(a,"display"))||a.getClientRects().length&&a.getBoundingClientRect().width?$a(a,b,d):ea(a,Sa,function(){return $a(a,b,d)})},set:function(a,c,d){var e,f=d&&Na(a),g=d&&Za(a,b,d,"border-box"===r.css(a,"boxSizing",!1,f),f);return g&&(e=ba.exec(c))&&"px"!==(e[3]||"px")&&(a.style[b]=c,c=r.css(a,b)),Ya(a,c,g)}}}),r.cssHooks.marginLeft=Pa(o.reliableMarginLeft,function(a,b){if(b)return(parseFloat(Oa(a,"marginLeft"))||a.getBoundingClientRect().left-ea(a,{marginLeft:0},function(){return a.getBoundingClientRect().left}))+"px"}),r.each({margin:"",padding:"",border:"Width"},function(a,b){r.cssHooks[a+b]={expand:function(c){for(var d=0,e={},f="string"==typeof c?c.split(" "):[c];d<4;d++)e[a+ca[d]+b]=f[d]||f[d-2]||f[0];return e}},La.test(a)||(r.cssHooks[a+b].set=Ya)}),r.fn.extend({css:function(a,b){return T(this,function(a,b,c){var d,e,f={},g=0;if(Array.isArray(b)){for(d=Na(a),e=b.length;g<e;g++)f[b[g]]=r.css(a,b[g],!1,d);return f}return void 0!==c?r.style(a,b,c):r.css(a,b)},a,b,arguments.length>1)}});function _a(a,b,c,d,e){return new _a.prototype.init(a,b,c,d,e)}r.Tween=_a,_a.prototype={constructor:_a,init:function(a,b,c,d,e,f){this.elem=a,this.prop=c,this.easing=e||r.easing._default,this.options=b,this.start=this.now=this.cur(),this.end=d,this.unit=f||(r.cssNumber[c]?"":"px")},cur:function(){var a=_a.propHooks[this.prop];return a&&a.get?a.get(this):_a.propHooks._default.get(this)},run:function(a){var b,c=_a.propHooks[this.prop];return this.options.duration?this.pos=b=r.easing[this.easing](a,this.options.duration*a,0,1,this.options.duration):this.pos=b=a,this.now=(this.end-this.start)*b+this.start,this.options.step&&this.options.step.call(this.elem,this.now,this),c&&c.set?c.set(this):_a.propHooks._default.set(this),this}},_a.prototype.init.prototype=_a.prototype,_a.propHooks={_default:{get:function(a){var b;return 1!==a.elem.nodeType||null!=a.elem[a.prop]&&null==a.elem.style[a.prop]?a.elem[a.prop]:(b=r.css(a.elem,a.prop,""),b&&"auto"!==b?b:0)},set:function(a){r.fx.step[a.prop]?r.fx.step[a.prop](a):1!==a.elem.nodeType||null==a.elem.style[r.cssProps[a.prop]]&&!r.cssHooks[a.prop]?a.elem[a.prop]=a.now:r.style(a.elem,a.prop,a.now+a.unit)}}},_a.propHooks.scrollTop=_a.propHooks.scrollLeft={set:function(a){a.elem.nodeType&&a.elem.parentNode&&(a.elem[a.prop]=a.now)}},r.easing={linear:function(a){return a},swing:function(a){return.5-Math.cos(a*Math.PI)/2},_default:"swing"},r.fx=_a.prototype.init,r.fx.step={};var ab,bb,cb=/^(?:toggle|show|hide)$/,db=/queueHooks$/;function eb(){bb&&(d.hidden===!1&&a.requestAnimationFrame?a.requestAnimationFrame(eb):a.setTimeout(eb,r.fx.interval),r.fx.tick())}function fb(){return a.setTimeout(function(){ab=void 0}),ab=r.now()}function gb(a,b){var c,d=0,e={height:a};for(b=b?1:0;d<4;d+=2-b)c=ca[d],e["margin"+c]=e["padding"+c]=a;return b&&(e.opacity=e.width=a),e}function hb(a,b,c){for(var d,e=(kb.tweeners[b]||[]).concat(kb.tweeners["*"]),f=0,g=e.length;f<g;f++)if(d=e[f].call(c,b,a))return d}function ib(a,b,c){var d,e,f,g,h,i,j,k,l="width"in b||"height"in b,m=this,n={},o=a.style,p=a.nodeType&&da(a),q=W.get(a,"fxshow");c.queue||(g=r._queueHooks(a,"fx"),null==g.unqueued&&(g.unqueued=0,h=g.empty.fire,g.empty.fire=function(){g.unqueued||h()}),g.unqueued++,m.always(function(){m.always(function(){g.unqueued--,r.queue(a,"fx").length||g.empty.fire()})}));for(d in b)if(e=b[d],cb.test(e)){if(delete b[d],f=f||"toggle"===e,e===(p?"hide":"show")){if("show"!==e||!q||void 0===q[d])continue;p=!0}n[d]=q&&q[d]||r.style(a,d)}if(i=!r.isEmptyObject(b),i||!r.isEmptyObject(n)){l&&1===a.nodeType&&(c.overflow=[o.overflow,o.overflowX,o.overflowY],j=q&&q.display,null==j&&(j=W.get(a,"display")),k=r.css(a,"display"),"none"===k&&(j?k=j:(ia([a],!0),j=a.style.display||j,k=r.css(a,"display"),ia([a]))),("inline"===k||"inline-block"===k&&null!=j)&&"none"===r.css(a,"float")&&(i||(m.done(function(){o.display=j}),null==j&&(k=o.display,j="none"===k?"":k)),o.display="inline-block")),c.overflow&&(o.overflow="hidden",m.always(function(){o.overflow=c.overflow[0],o.overflowX=c.overflow[1],o.overflowY=c.overflow[2]})),i=!1;for(d in n)i||(q?"hidden"in q&&(p=q.hidden):q=W.access(a,"fxshow",{display:j}),f&&(q.hidden=!p),p&&ia([a],!0),m.done(function(){p||ia([a]),W.remove(a,"fxshow");for(d in n)r.style(a,d,n[d])})),i=hb(p?q[d]:0,d,m),d in q||(q[d]=i.start,p&&(i.end=i.start,i.start=0))}}function jb(a,b){var c,d,e,f,g;for(c in a)if(d=r.camelCase(c),e=b[d],f=a[c],Array.isArray(f)&&(e=f[1],f=a[c]=f[0]),c!==d&&(a[d]=f,delete a[c]),g=r.cssHooks[d],g&&"expand"in g){f=g.expand(f),delete a[d];for(c in f)c in a||(a[c]=f[c],b[c]=e)}else b[d]=e}function kb(a,b,c){var d,e,f=0,g=kb.prefilters.length,h=r.Deferred().always(function(){delete i.elem}),i=function(){if(e)return!1;for(var b=ab||fb(),c=Math.max(0,j.startTime+j.duration-b),d=c/j.duration||0,f=1-d,g=0,i=j.tweens.length;g<i;g++)j.tweens[g].run(f);return h.notifyWith(a,[j,f,c]),f<1&&i?c:(i||h.notifyWith(a,[j,1,0]),h.resolveWith(a,[j]),!1)},j=h.promise({elem:a,props:r.extend({},b),opts:r.extend(!0,{specialEasing:{},easing:r.easing._default},c),originalProperties:b,originalOptions:c,startTime:ab||fb(),duration:c.duration,tweens:[],createTween:function(b,c){var d=r.Tween(a,j.opts,b,c,j.opts.specialEasing[b]||j.opts.easing);return j.tweens.push(d),d},stop:function(b){var c=0,d=b?j.tweens.length:0;if(e)return this;for(e=!0;c<d;c++)j.tweens[c].run(1);return b?(h.notifyWith(a,[j,1,0]),h.resolveWith(a,[j,b])):h.rejectWith(a,[j,b]),this}}),k=j.props;for(jb(k,j.opts.specialEasing);f<g;f++)if(d=kb.prefilters[f].call(j,a,k,j.opts))return r.isFunction(d.stop)&&(r._queueHooks(j.elem,j.opts.queue).stop=r.proxy(d.stop,d)),d;return r.map(k,hb,j),r.isFunction(j.opts.start)&&j.opts.start.call(a,j),j.progress(j.opts.progress).done(j.opts.done,j.opts.complete).fail(j.opts.fail).always(j.opts.always),r.fx.timer(r.extend(i,{elem:a,anim:j,queue:j.opts.queue})),j}r.Animation=r.extend(kb,{tweeners:{"*":[function(a,b){var c=this.createTween(a,b);return fa(c.elem,a,ba.exec(b),c),c}]},tweener:function(a,b){r.isFunction(a)?(b=a,a=["*"]):a=a.match(L);for(var c,d=0,e=a.length;d<e;d++)c=a[d],kb.tweeners[c]=kb.tweeners[c]||[],kb.tweeners[c].unshift(b)},prefilters:[ib],prefilter:function(a,b){b?kb.prefilters.unshift(a):kb.prefilters.push(a)}}),r.speed=function(a,b,c){var d=a&&"object"==typeof a?r.extend({},a):{complete:c||!c&&b||r.isFunction(a)&&a,duration:a,easing:c&&b||b&&!r.isFunction(b)&&b};return r.fx.off?d.duration=0:"number"!=typeof d.duration&&(d.duration in r.fx.speeds?d.duration=r.fx.speeds[d.duration]:d.duration=r.fx.speeds._default),null!=d.queue&&d.queue!==!0||(d.queue="fx"),d.old=d.complete,d.complete=function(){r.isFunction(d.old)&&d.old.call(this),d.queue&&r.dequeue(this,d.queue)},d},r.fn.extend({fadeTo:function(a,b,c,d){return this.filter(da).css("opacity",0).show().end().animate({opacity:b},a,c,d)},animate:function(a,b,c,d){var e=r.isEmptyObject(a),f=r.speed(b,c,d),g=function(){var b=kb(this,r.extend({},a),f);(e||W.get(this,"finish"))&&b.stop(!0)};return g.finish=g,e||f.queue===!1?this.each(g):this.queue(f.queue,g)},stop:function(a,b,c){var d=function(a){var b=a.stop;delete a.stop,b(c)};return"string"!=typeof a&&(c=b,b=a,a=void 0),b&&a!==!1&&this.queue(a||"fx",[]),this.each(function(){var b=!0,e=null!=a&&a+"queueHooks",f=r.timers,g=W.get(this);if(e)g[e]&&g[e].stop&&d(g[e]);else for(e in g)g[e]&&g[e].stop&&db.test(e)&&d(g[e]);for(e=f.length;e--;)f[e].elem!==this||null!=a&&f[e].queue!==a||(f[e].anim.stop(c),b=!1,f.splice(e,1));!b&&c||r.dequeue(this,a)})},finish:function(a){return a!==!1&&(a=a||"fx"),this.each(function(){var b,c=W.get(this),d=c[a+"queue"],e=c[a+"queueHooks"],f=r.timers,g=d?d.length:0;for(c.finish=!0,r.queue(this,a,[]),e&&e.stop&&e.stop.call(this,!0),b=f.length;b--;)f[b].elem===this&&f[b].queue===a&&(f[b].anim.stop(!0),f.splice(b,1));for(b=0;b<g;b++)d[b]&&d[b].finish&&d[b].finish.call(this);delete c.finish})}}),r.each(["toggle","show","hide"],function(a,b){var c=r.fn[b];r.fn[b]=function(a,d,e){return null==a||"boolean"==typeof a?c.apply(this,arguments):this.animate(gb(b,!0),a,d,e)}}),r.each({slideDown:gb("show"),slideUp:gb("hide"),slideToggle:gb("toggle"),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(a,b){r.fn[a]=function(a,c,d){return this.animate(b,a,c,d)}}),r.timers=[],r.fx.tick=function(){var a,b=0,c=r.timers;for(ab=r.now();b<c.length;b++)a=c[b],a()||c[b]!==a||c.splice(b--,1);c.length||r.fx.stop(),ab=void 0},r.fx.timer=function(a){r.timers.push(a),r.fx.start()},r.fx.interval=13,r.fx.start=function(){bb||(bb=!0,eb())},r.fx.stop=function(){bb=null},r.fx.speeds={slow:600,fast:200,_default:400},r.fn.delay=function(b,c){return b=r.fx?r.fx.speeds[b]||b:b,c=c||"fx",this.queue(c,function(c,d){var e=a.setTimeout(c,b);d.stop=function(){a.clearTimeout(e)}})},function(){var a=d.createElement("input"),b=d.createElement("select"),c=b.appendChild(d.createElement("option"));a.type="checkbox",o.checkOn=""!==a.value,o.optSelected=c.selected,a=d.createElement("input"),a.value="t",a.type="radio",o.radioValue="t"===a.value}();var lb,mb=r.expr.attrHandle;r.fn.extend({attr:function(a,b){return T(this,r.attr,a,b,arguments.length>1)},removeAttr:function(a){return this.each(function(){r.removeAttr(this,a)})}}),r.extend({attr:function(a,b,c){var d,e,f=a.nodeType;if(3!==f&&8!==f&&2!==f)return"undefined"==typeof a.getAttribute?r.prop(a,b,c):(1===f&&r.isXMLDoc(a)||(e=r.attrHooks[b.toLowerCase()]||(r.expr.match.bool.test(b)?lb:void 0)),void 0!==c?null===c?void r.removeAttr(a,b):e&&"set"in e&&void 0!==(d=e.set(a,c,b))?d:(a.setAttribute(b,c+""),c):e&&"get"in e&&null!==(d=e.get(a,b))?d:(d=r.find.attr(a,b),
null==d?void 0:d))},attrHooks:{type:{set:function(a,b){if(!o.radioValue&&"radio"===b&&B(a,"input")){var c=a.value;return a.setAttribute("type",b),c&&(a.value=c),b}}}},removeAttr:function(a,b){var c,d=0,e=b&&b.match(L);if(e&&1===a.nodeType)while(c=e[d++])a.removeAttribute(c)}}),lb={set:function(a,b,c){return b===!1?r.removeAttr(a,c):a.setAttribute(c,c),c}},r.each(r.expr.match.bool.source.match(/\w+/g),function(a,b){var c=mb[b]||r.find.attr;mb[b]=function(a,b,d){var e,f,g=b.toLowerCase();return d||(f=mb[g],mb[g]=e,e=null!=c(a,b,d)?g:null,mb[g]=f),e}});var nb=/^(?:input|select|textarea|button)$/i,ob=/^(?:a|area)$/i;r.fn.extend({prop:function(a,b){return T(this,r.prop,a,b,arguments.length>1)},removeProp:function(a){return this.each(function(){delete this[r.propFix[a]||a]})}}),r.extend({prop:function(a,b,c){var d,e,f=a.nodeType;if(3!==f&&8!==f&&2!==f)return 1===f&&r.isXMLDoc(a)||(b=r.propFix[b]||b,e=r.propHooks[b]),void 0!==c?e&&"set"in e&&void 0!==(d=e.set(a,c,b))?d:a[b]=c:e&&"get"in e&&null!==(d=e.get(a,b))?d:a[b]},propHooks:{tabIndex:{get:function(a){var b=r.find.attr(a,"tabindex");return b?parseInt(b,10):nb.test(a.nodeName)||ob.test(a.nodeName)&&a.href?0:-1}}},propFix:{"for":"htmlFor","class":"className"}}),o.optSelected||(r.propHooks.selected={get:function(a){var b=a.parentNode;return b&&b.parentNode&&b.parentNode.selectedIndex,null},set:function(a){var b=a.parentNode;b&&(b.selectedIndex,b.parentNode&&b.parentNode.selectedIndex)}}),r.each(["tabIndex","readOnly","maxLength","cellSpacing","cellPadding","rowSpan","colSpan","useMap","frameBorder","contentEditable"],function(){r.propFix[this.toLowerCase()]=this});function pb(a){var b=a.match(L)||[];return b.join(" ")}function qb(a){return a.getAttribute&&a.getAttribute("class")||""}r.fn.extend({addClass:function(a){var b,c,d,e,f,g,h,i=0;if(r.isFunction(a))return this.each(function(b){r(this).addClass(a.call(this,b,qb(this)))});if("string"==typeof a&&a){b=a.match(L)||[];while(c=this[i++])if(e=qb(c),d=1===c.nodeType&&" "+pb(e)+" "){g=0;while(f=b[g++])d.indexOf(" "+f+" ")<0&&(d+=f+" ");h=pb(d),e!==h&&c.setAttribute("class",h)}}return this},removeClass:function(a){var b,c,d,e,f,g,h,i=0;if(r.isFunction(a))return this.each(function(b){r(this).removeClass(a.call(this,b,qb(this)))});if(!arguments.length)return this.attr("class","");if("string"==typeof a&&a){b=a.match(L)||[];while(c=this[i++])if(e=qb(c),d=1===c.nodeType&&" "+pb(e)+" "){g=0;while(f=b[g++])while(d.indexOf(" "+f+" ")>-1)d=d.replace(" "+f+" "," ");h=pb(d),e!==h&&c.setAttribute("class",h)}}return this},toggleClass:function(a,b){var c=typeof a;return"boolean"==typeof b&&"string"===c?b?this.addClass(a):this.removeClass(a):r.isFunction(a)?this.each(function(c){r(this).toggleClass(a.call(this,c,qb(this),b),b)}):this.each(function(){var b,d,e,f;if("string"===c){d=0,e=r(this),f=a.match(L)||[];while(b=f[d++])e.hasClass(b)?e.removeClass(b):e.addClass(b)}else void 0!==a&&"boolean"!==c||(b=qb(this),b&&W.set(this,"__className__",b),this.setAttribute&&this.setAttribute("class",b||a===!1?"":W.get(this,"__className__")||""))})},hasClass:function(a){var b,c,d=0;b=" "+a+" ";while(c=this[d++])if(1===c.nodeType&&(" "+pb(qb(c))+" ").indexOf(b)>-1)return!0;return!1}});var rb=/\r/g;r.fn.extend({val:function(a){var b,c,d,e=this[0];{if(arguments.length)return d=r.isFunction(a),this.each(function(c){var e;1===this.nodeType&&(e=d?a.call(this,c,r(this).val()):a,null==e?e="":"number"==typeof e?e+="":Array.isArray(e)&&(e=r.map(e,function(a){return null==a?"":a+""})),b=r.valHooks[this.type]||r.valHooks[this.nodeName.toLowerCase()],b&&"set"in b&&void 0!==b.set(this,e,"value")||(this.value=e))});if(e)return b=r.valHooks[e.type]||r.valHooks[e.nodeName.toLowerCase()],b&&"get"in b&&void 0!==(c=b.get(e,"value"))?c:(c=e.value,"string"==typeof c?c.replace(rb,""):null==c?"":c)}}}),r.extend({valHooks:{option:{get:function(a){var b=r.find.attr(a,"value");return null!=b?b:pb(r.text(a))}},select:{get:function(a){var b,c,d,e=a.options,f=a.selectedIndex,g="select-one"===a.type,h=g?null:[],i=g?f+1:e.length;for(d=f<0?i:g?f:0;d<i;d++)if(c=e[d],(c.selected||d===f)&&!c.disabled&&(!c.parentNode.disabled||!B(c.parentNode,"optgroup"))){if(b=r(c).val(),g)return b;h.push(b)}return h},set:function(a,b){var c,d,e=a.options,f=r.makeArray(b),g=e.length;while(g--)d=e[g],(d.selected=r.inArray(r.valHooks.option.get(d),f)>-1)&&(c=!0);return c||(a.selectedIndex=-1),f}}}}),r.each(["radio","checkbox"],function(){r.valHooks[this]={set:function(a,b){if(Array.isArray(b))return a.checked=r.inArray(r(a).val(),b)>-1}},o.checkOn||(r.valHooks[this].get=function(a){return null===a.getAttribute("value")?"on":a.value})});var sb=/^(?:focusinfocus|focusoutblur)$/;r.extend(r.event,{trigger:function(b,c,e,f){var g,h,i,j,k,m,n,o=[e||d],p=l.call(b,"type")?b.type:b,q=l.call(b,"namespace")?b.namespace.split("."):[];if(h=i=e=e||d,3!==e.nodeType&&8!==e.nodeType&&!sb.test(p+r.event.triggered)&&(p.indexOf(".")>-1&&(q=p.split("."),p=q.shift(),q.sort()),k=p.indexOf(":")<0&&"on"+p,b=b[r.expando]?b:new r.Event(p,"object"==typeof b&&b),b.isTrigger=f?2:3,b.namespace=q.join("."),b.rnamespace=b.namespace?new RegExp("(^|\\.)"+q.join("\\.(?:.*\\.|)")+"(\\.|$)"):null,b.result=void 0,b.target||(b.target=e),c=null==c?[b]:r.makeArray(c,[b]),n=r.event.special[p]||{},f||!n.trigger||n.trigger.apply(e,c)!==!1)){if(!f&&!n.noBubble&&!r.isWindow(e)){for(j=n.delegateType||p,sb.test(j+p)||(h=h.parentNode);h;h=h.parentNode)o.push(h),i=h;i===(e.ownerDocument||d)&&o.push(i.defaultView||i.parentWindow||a)}g=0;while((h=o[g++])&&!b.isPropagationStopped())b.type=g>1?j:n.bindType||p,m=(W.get(h,"events")||{})[b.type]&&W.get(h,"handle"),m&&m.apply(h,c),m=k&&h[k],m&&m.apply&&U(h)&&(b.result=m.apply(h,c),b.result===!1&&b.preventDefault());return b.type=p,f||b.isDefaultPrevented()||n._default&&n._default.apply(o.pop(),c)!==!1||!U(e)||k&&r.isFunction(e[p])&&!r.isWindow(e)&&(i=e[k],i&&(e[k]=null),r.event.triggered=p,e[p](),r.event.triggered=void 0,i&&(e[k]=i)),b.result}},simulate:function(a,b,c){var d=r.extend(new r.Event,c,{type:a,isSimulated:!0});r.event.trigger(d,null,b)}}),r.fn.extend({trigger:function(a,b){return this.each(function(){r.event.trigger(a,b,this)})},triggerHandler:function(a,b){var c=this[0];if(c)return r.event.trigger(a,b,c,!0)}}),r.each("blur focus focusin focusout resize scroll click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup contextmenu".split(" "),function(a,b){r.fn[b]=function(a,c){return arguments.length>0?this.on(b,null,a,c):this.trigger(b)}}),r.fn.extend({hover:function(a,b){return this.mouseenter(a).mouseleave(b||a)}}),o.focusin="onfocusin"in a,o.focusin||r.each({focus:"focusin",blur:"focusout"},function(a,b){var c=function(a){r.event.simulate(b,a.target,r.event.fix(a))};r.event.special[b]={setup:function(){var d=this.ownerDocument||this,e=W.access(d,b);e||d.addEventListener(a,c,!0),W.access(d,b,(e||0)+1)},teardown:function(){var d=this.ownerDocument||this,e=W.access(d,b)-1;e?W.access(d,b,e):(d.removeEventListener(a,c,!0),W.remove(d,b))}}});var tb=a.location,ub=r.now(),vb=/\?/;r.parseXML=function(b){var c;if(!b||"string"!=typeof b)return null;try{c=(new a.DOMParser).parseFromString(b,"text/xml")}catch(d){c=void 0}return c&&!c.getElementsByTagName("parsererror").length||r.error("Invalid XML: "+b),c};var wb=/\[\]$/,xb=/\r?\n/g,yb=/^(?:submit|button|image|reset|file)$/i,zb=/^(?:input|select|textarea|keygen)/i;function Ab(a,b,c,d){var e;if(Array.isArray(b))r.each(b,function(b,e){c||wb.test(a)?d(a,e):Ab(a+"["+("object"==typeof e&&null!=e?b:"")+"]",e,c,d)});else if(c||"object"!==r.type(b))d(a,b);else for(e in b)Ab(a+"["+e+"]",b[e],c,d)}r.param=function(a,b){var c,d=[],e=function(a,b){var c=r.isFunction(b)?b():b;d[d.length]=encodeURIComponent(a)+"="+encodeURIComponent(null==c?"":c)};if(Array.isArray(a)||a.jquery&&!r.isPlainObject(a))r.each(a,function(){e(this.name,this.value)});else for(c in a)Ab(c,a[c],b,e);return d.join("&")},r.fn.extend({serialize:function(){return r.param(this.serializeArray())},serializeArray:function(){return this.map(function(){var a=r.prop(this,"elements");return a?r.makeArray(a):this}).filter(function(){var a=this.type;return this.name&&!r(this).is(":disabled")&&zb.test(this.nodeName)&&!yb.test(a)&&(this.checked||!ja.test(a))}).map(function(a,b){var c=r(this).val();return null==c?null:Array.isArray(c)?r.map(c,function(a){return{name:b.name,value:a.replace(xb,"\r\n")}}):{name:b.name,value:c.replace(xb,"\r\n")}}).get()}});var Bb=/%20/g,Cb=/#.*$/,Db=/([?&])_=[^&]*/,Eb=/^(.*?):[ \t]*([^\r\n]*)$/gm,Fb=/^(?:about|app|app-storage|.+-extension|file|res|widget):$/,Gb=/^(?:GET|HEAD)$/,Hb=/^\/\//,Ib={},Jb={},Kb="*/".concat("*"),Lb=d.createElement("a");Lb.href=tb.href;function Mb(a){return function(b,c){"string"!=typeof b&&(c=b,b="*");var d,e=0,f=b.toLowerCase().match(L)||[];if(r.isFunction(c))while(d=f[e++])"+"===d[0]?(d=d.slice(1)||"*",(a[d]=a[d]||[]).unshift(c)):(a[d]=a[d]||[]).push(c)}}function Nb(a,b,c,d){var e={},f=a===Jb;function g(h){var i;return e[h]=!0,r.each(a[h]||[],function(a,h){var j=h(b,c,d);return"string"!=typeof j||f||e[j]?f?!(i=j):void 0:(b.dataTypes.unshift(j),g(j),!1)}),i}return g(b.dataTypes[0])||!e["*"]&&g("*")}function Ob(a,b){var c,d,e=r.ajaxSettings.flatOptions||{};for(c in b)void 0!==b[c]&&((e[c]?a:d||(d={}))[c]=b[c]);return d&&r.extend(!0,a,d),a}function Pb(a,b,c){var d,e,f,g,h=a.contents,i=a.dataTypes;while("*"===i[0])i.shift(),void 0===d&&(d=a.mimeType||b.getResponseHeader("Content-Type"));if(d)for(e in h)if(h[e]&&h[e].test(d)){i.unshift(e);break}if(i[0]in c)f=i[0];else{for(e in c){if(!i[0]||a.converters[e+" "+i[0]]){f=e;break}g||(g=e)}f=f||g}if(f)return f!==i[0]&&i.unshift(f),c[f]}function Qb(a,b,c,d){var e,f,g,h,i,j={},k=a.dataTypes.slice();if(k[1])for(g in a.converters)j[g.toLowerCase()]=a.converters[g];f=k.shift();while(f)if(a.responseFields[f]&&(c[a.responseFields[f]]=b),!i&&d&&a.dataFilter&&(b=a.dataFilter(b,a.dataType)),i=f,f=k.shift())if("*"===f)f=i;else if("*"!==i&&i!==f){if(g=j[i+" "+f]||j["* "+f],!g)for(e in j)if(h=e.split(" "),h[1]===f&&(g=j[i+" "+h[0]]||j["* "+h[0]])){g===!0?g=j[e]:j[e]!==!0&&(f=h[0],k.unshift(h[1]));break}if(g!==!0)if(g&&a["throws"])b=g(b);else try{b=g(b)}catch(l){return{state:"parsererror",error:g?l:"No conversion from "+i+" to "+f}}}return{state:"success",data:b}}r.extend({active:0,lastModified:{},etag:{},ajaxSettings:{url:tb.href,type:"GET",isLocal:Fb.test(tb.protocol),global:!0,processData:!0,async:!0,contentType:"application/x-www-form-urlencoded; charset=UTF-8",accepts:{"*":Kb,text:"text/plain",html:"text/html",xml:"application/xml, text/xml",json:"application/json, text/javascript"},contents:{xml:/\bxml\b/,html:/\bhtml/,json:/\bjson\b/},responseFields:{xml:"responseXML",text:"responseText",json:"responseJSON"},converters:{"* text":String,"text html":!0,"text json":JSON.parse,"text xml":r.parseXML},flatOptions:{url:!0,context:!0}},ajaxSetup:function(a,b){return b?Ob(Ob(a,r.ajaxSettings),b):Ob(r.ajaxSettings,a)},ajaxPrefilter:Mb(Ib),ajaxTransport:Mb(Jb),ajax:function(b,c){"object"==typeof b&&(c=b,b=void 0),c=c||{};var e,f,g,h,i,j,k,l,m,n,o=r.ajaxSetup({},c),p=o.context||o,q=o.context&&(p.nodeType||p.jquery)?r(p):r.event,s=r.Deferred(),t=r.Callbacks("once memory"),u=o.statusCode||{},v={},w={},x="canceled",y={readyState:0,getResponseHeader:function(a){var b;if(k){if(!h){h={};while(b=Eb.exec(g))h[b[1].toLowerCase()]=b[2]}b=h[a.toLowerCase()]}return null==b?null:b},getAllResponseHeaders:function(){return k?g:null},setRequestHeader:function(a,b){return null==k&&(a=w[a.toLowerCase()]=w[a.toLowerCase()]||a,v[a]=b),this},overrideMimeType:function(a){return null==k&&(o.mimeType=a),this},statusCode:function(a){var b;if(a)if(k)y.always(a[y.status]);else for(b in a)u[b]=[u[b],a[b]];return this},abort:function(a){var b=a||x;return e&&e.abort(b),A(0,b),this}};if(s.promise(y),o.url=((b||o.url||tb.href)+"").replace(Hb,tb.protocol+"//"),o.type=c.method||c.type||o.method||o.type,o.dataTypes=(o.dataType||"*").toLowerCase().match(L)||[""],null==o.crossDomain){j=d.createElement("a");try{j.href=o.url,j.href=j.href,o.crossDomain=Lb.protocol+"//"+Lb.host!=j.protocol+"//"+j.host}catch(z){o.crossDomain=!0}}if(o.data&&o.processData&&"string"!=typeof o.data&&(o.data=r.param(o.data,o.traditional)),Nb(Ib,o,c,y),k)return y;l=r.event&&o.global,l&&0===r.active++&&r.event.trigger("ajaxStart"),o.type=o.type.toUpperCase(),o.hasContent=!Gb.test(o.type),f=o.url.replace(Cb,""),o.hasContent?o.data&&o.processData&&0===(o.contentType||"").indexOf("application/x-www-form-urlencoded")&&(o.data=o.data.replace(Bb,"+")):(n=o.url.slice(f.length),o.data&&(f+=(vb.test(f)?"&":"?")+o.data,delete o.data),o.cache===!1&&(f=f.replace(Db,"$1"),n=(vb.test(f)?"&":"?")+"_="+ub++ +n),o.url=f+n),o.ifModified&&(r.lastModified[f]&&y.setRequestHeader("If-Modified-Since",r.lastModified[f]),r.etag[f]&&y.setRequestHeader("If-None-Match",r.etag[f])),(o.data&&o.hasContent&&o.contentType!==!1||c.contentType)&&y.setRequestHeader("Content-Type",o.contentType),y.setRequestHeader("Accept",o.dataTypes[0]&&o.accepts[o.dataTypes[0]]?o.accepts[o.dataTypes[0]]+("*"!==o.dataTypes[0]?", "+Kb+"; q=0.01":""):o.accepts["*"]);for(m in o.headers)y.setRequestHeader(m,o.headers[m]);if(o.beforeSend&&(o.beforeSend.call(p,y,o)===!1||k))return y.abort();if(x="abort",t.add(o.complete),y.done(o.success),y.fail(o.error),e=Nb(Jb,o,c,y)){if(y.readyState=1,l&&q.trigger("ajaxSend",[y,o]),k)return y;o.async&&o.timeout>0&&(i=a.setTimeout(function(){y.abort("timeout")},o.timeout));try{k=!1,e.send(v,A)}catch(z){if(k)throw z;A(-1,z)}}else A(-1,"No Transport");function A(b,c,d,h){var j,m,n,v,w,x=c;k||(k=!0,i&&a.clearTimeout(i),e=void 0,g=h||"",y.readyState=b>0?4:0,j=b>=200&&b<300||304===b,d&&(v=Pb(o,y,d)),v=Qb(o,v,y,j),j?(o.ifModified&&(w=y.getResponseHeader("Last-Modified"),w&&(r.lastModified[f]=w),w=y.getResponseHeader("etag"),w&&(r.etag[f]=w)),204===b||"HEAD"===o.type?x="nocontent":304===b?x="notmodified":(x=v.state,m=v.data,n=v.error,j=!n)):(n=x,!b&&x||(x="error",b<0&&(b=0))),y.status=b,y.statusText=(c||x)+"",j?s.resolveWith(p,[m,x,y]):s.rejectWith(p,[y,x,n]),y.statusCode(u),u=void 0,l&&q.trigger(j?"ajaxSuccess":"ajaxError",[y,o,j?m:n]),t.fireWith(p,[y,x]),l&&(q.trigger("ajaxComplete",[y,o]),--r.active||r.event.trigger("ajaxStop")))}return y},getJSON:function(a,b,c){return r.get(a,b,c,"json")},getScript:function(a,b){return r.get(a,void 0,b,"script")}}),r.each(["get","post"],function(a,b){r[b]=function(a,c,d,e){return r.isFunction(c)&&(e=e||d,d=c,c=void 0),r.ajax(r.extend({url:a,type:b,dataType:e,data:c,success:d},r.isPlainObject(a)&&a))}}),r._evalUrl=function(a){return r.ajax({url:a,type:"GET",dataType:"script",cache:!0,async:!1,global:!1,"throws":!0})},r.fn.extend({wrapAll:function(a){var b;return this[0]&&(r.isFunction(a)&&(a=a.call(this[0])),b=r(a,this[0].ownerDocument).eq(0).clone(!0),this[0].parentNode&&b.insertBefore(this[0]),b.map(function(){var a=this;while(a.firstElementChild)a=a.firstElementChild;return a}).append(this)),this},wrapInner:function(a){return r.isFunction(a)?this.each(function(b){r(this).wrapInner(a.call(this,b))}):this.each(function(){var b=r(this),c=b.contents();c.length?c.wrapAll(a):b.append(a)})},wrap:function(a){var b=r.isFunction(a);return this.each(function(c){r(this).wrapAll(b?a.call(this,c):a)})},unwrap:function(a){return this.parent(a).not("body").each(function(){r(this).replaceWith(this.childNodes)}),this}}),r.expr.pseudos.hidden=function(a){return!r.expr.pseudos.visible(a)},r.expr.pseudos.visible=function(a){return!!(a.offsetWidth||a.offsetHeight||a.getClientRects().length)},r.ajaxSettings.xhr=function(){try{return new a.XMLHttpRequest}catch(b){}};var Rb={0:200,1223:204},Sb=r.ajaxSettings.xhr();o.cors=!!Sb&&"withCredentials"in Sb,o.ajax=Sb=!!Sb,r.ajaxTransport(function(b){var c,d;if(o.cors||Sb&&!b.crossDomain)return{send:function(e,f){var g,h=b.xhr();if(h.open(b.type,b.url,b.async,b.username,b.password),b.xhrFields)for(g in b.xhrFields)h[g]=b.xhrFields[g];b.mimeType&&h.overrideMimeType&&h.overrideMimeType(b.mimeType),b.crossDomain||e["X-Requested-With"]||(e["X-Requested-With"]="XMLHttpRequest");for(g in e)h.setRequestHeader(g,e[g]);c=function(a){return function(){c&&(c=d=h.onload=h.onerror=h.onabort=h.onreadystatechange=null,"abort"===a?h.abort():"error"===a?"number"!=typeof h.status?f(0,"error"):f(h.status,h.statusText):f(Rb[h.status]||h.status,h.statusText,"text"!==(h.responseType||"text")||"string"!=typeof h.responseText?{binary:h.response}:{text:h.responseText},h.getAllResponseHeaders()))}},h.onload=c(),d=h.onerror=c("error"),void 0!==h.onabort?h.onabort=d:h.onreadystatechange=function(){4===h.readyState&&a.setTimeout(function(){c&&d()})},c=c("abort");try{h.send(b.hasContent&&b.data||null)}catch(i){if(c)throw i}},abort:function(){c&&c()}}}),r.ajaxPrefilter(function(a){a.crossDomain&&(a.contents.script=!1)}),r.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/\b(?:java|ecma)script\b/},converters:{"text script":function(a){return r.globalEval(a),a}}}),r.ajaxPrefilter("script",function(a){void 0===a.cache&&(a.cache=!1),a.crossDomain&&(a.type="GET")}),r.ajaxTransport("script",function(a){if(a.crossDomain){var b,c;return{send:function(e,f){b=r("<script>").prop({charset:a.scriptCharset,src:a.url}).on("load error",c=function(a){b.remove(),c=null,a&&f("error"===a.type?404:200,a.type)}),d.head.appendChild(b[0])},abort:function(){c&&c()}}}});var Tb=[],Ub=/(=)\?(?=&|$)|\?\?/;r.ajaxSetup({jsonp:"callback",jsonpCallback:function(){var a=Tb.pop()||r.expando+"_"+ub++;return this[a]=!0,a}}),r.ajaxPrefilter("json jsonp",function(b,c,d){var e,f,g,h=b.jsonp!==!1&&(Ub.test(b.url)?"url":"string"==typeof b.data&&0===(b.contentType||"").indexOf("application/x-www-form-urlencoded")&&Ub.test(b.data)&&"data");if(h||"jsonp"===b.dataTypes[0])return e=b.jsonpCallback=r.isFunction(b.jsonpCallback)?b.jsonpCallback():b.jsonpCallback,h?b[h]=b[h].replace(Ub,"$1"+e):b.jsonp!==!1&&(b.url+=(vb.test(b.url)?"&":"?")+b.jsonp+"="+e),b.converters["script json"]=function(){return g||r.error(e+" was not called"),g[0]},b.dataTypes[0]="json",f=a[e],a[e]=function(){g=arguments},d.always(function(){void 0===f?r(a).removeProp(e):a[e]=f,b[e]&&(b.jsonpCallback=c.jsonpCallback,Tb.push(e)),g&&r.isFunction(f)&&f(g[0]),g=f=void 0}),"script"}),o.createHTMLDocument=function(){var a=d.implementation.createHTMLDocument("").body;return a.innerHTML="<form></form><form></form>",2===a.childNodes.length}(),r.parseHTML=function(a,b,c){if("string"!=typeof a)return[];"boolean"==typeof b&&(c=b,b=!1);var e,f,g;return b||(o.createHTMLDocument?(b=d.implementation.createHTMLDocument(""),e=b.createElement("base"),e.href=d.location.href,b.head.appendChild(e)):b=d),f=C.exec(a),g=!c&&[],f?[b.createElement(f[1])]:(f=qa([a],b,g),g&&g.length&&r(g).remove(),r.merge([],f.childNodes))},r.fn.load=function(a,b,c){var d,e,f,g=this,h=a.indexOf(" ");return h>-1&&(d=pb(a.slice(h)),a=a.slice(0,h)),r.isFunction(b)?(c=b,b=void 0):b&&"object"==typeof b&&(e="POST"),g.length>0&&r.ajax({url:a,type:e||"GET",dataType:"html",data:b}).done(function(a){f=arguments,g.html(d?r("<div>").append(r.parseHTML(a)).find(d):a)}).always(c&&function(a,b){g.each(function(){c.apply(this,f||[a.responseText,b,a])})}),this},r.each(["ajaxStart","ajaxStop","ajaxComplete","ajaxError","ajaxSuccess","ajaxSend"],function(a,b){r.fn[b]=function(a){return this.on(b,a)}}),r.expr.pseudos.animated=function(a){return r.grep(r.timers,function(b){return a===b.elem}).length},r.offset={setOffset:function(a,b,c){var d,e,f,g,h,i,j,k=r.css(a,"position"),l=r(a),m={};"static"===k&&(a.style.position="relative"),h=l.offset(),f=r.css(a,"top"),i=r.css(a,"left"),j=("absolute"===k||"fixed"===k)&&(f+i).indexOf("auto")>-1,j?(d=l.position(),g=d.top,e=d.left):(g=parseFloat(f)||0,e=parseFloat(i)||0),r.isFunction(b)&&(b=b.call(a,c,r.extend({},h))),null!=b.top&&(m.top=b.top-h.top+g),null!=b.left&&(m.left=b.left-h.left+e),"using"in b?b.using.call(a,m):l.css(m)}},r.fn.extend({offset:function(a){if(arguments.length)return void 0===a?this:this.each(function(b){r.offset.setOffset(this,a,b)});var b,c,d,e,f=this[0];if(f)return f.getClientRects().length?(d=f.getBoundingClientRect(),b=f.ownerDocument,c=b.documentElement,e=b.defaultView,{top:d.top+e.pageYOffset-c.clientTop,left:d.left+e.pageXOffset-c.clientLeft}):{top:0,left:0}},position:function(){if(this[0]){var a,b,c=this[0],d={top:0,left:0};return"fixed"===r.css(c,"position")?b=c.getBoundingClientRect():(a=this.offsetParent(),b=this.offset(),B(a[0],"html")||(d=a.offset()),d={top:d.top+r.css(a[0],"borderTopWidth",!0),left:d.left+r.css(a[0],"borderLeftWidth",!0)}),{top:b.top-d.top-r.css(c,"marginTop",!0),left:b.left-d.left-r.css(c,"marginLeft",!0)}}},offsetParent:function(){return this.map(function(){var a=this.offsetParent;while(a&&"static"===r.css(a,"position"))a=a.offsetParent;return a||ra})}}),r.each({scrollLeft:"pageXOffset",scrollTop:"pageYOffset"},function(a,b){var c="pageYOffset"===b;r.fn[a]=function(d){return T(this,function(a,d,e){var f;return r.isWindow(a)?f=a:9===a.nodeType&&(f=a.defaultView),void 0===e?f?f[b]:a[d]:void(f?f.scrollTo(c?f.pageXOffset:e,c?e:f.pageYOffset):a[d]=e)},a,d,arguments.length)}}),r.each(["top","left"],function(a,b){r.cssHooks[b]=Pa(o.pixelPosition,function(a,c){if(c)return c=Oa(a,b),Ma.test(c)?r(a).position()[b]+"px":c})}),r.each({Height:"height",Width:"width"},function(a,b){r.each({padding:"inner"+a,content:b,"":"outer"+a},function(c,d){r.fn[d]=function(e,f){var g=arguments.length&&(c||"boolean"!=typeof e),h=c||(e===!0||f===!0?"margin":"border");return T(this,function(b,c,e){var f;return r.isWindow(b)?0===d.indexOf("outer")?b["inner"+a]:b.document.documentElement["client"+a]:9===b.nodeType?(f=b.documentElement,Math.max(b.body["scroll"+a],f["scroll"+a],b.body["offset"+a],f["offset"+a],f["client"+a])):void 0===e?r.css(b,c,h):r.style(b,c,e,h)},b,g?e:void 0,g)}})}),r.fn.extend({bind:function(a,b,c){return this.on(a,null,b,c)},unbind:function(a,b){return this.off(a,null,b)},delegate:function(a,b,c,d){return this.on(b,a,c,d)},undelegate:function(a,b,c){return 1===arguments.length?this.off(a,"**"):this.off(b,a||"**",c)}}),r.holdReady=function(a){a?r.readyWait++:r.ready(!0)},r.isArray=Array.isArray,r.parseJSON=JSON.parse,r.nodeName=B,"function"==typeof define&&define.amd&&define("jquery",[],function(){return r});var Vb=a.jQuery,Wb=a.$;return r.noConflict=function(b){return a.$===r&&(a.$=Wb),b&&a.jQuery===r&&(a.jQuery=Vb),r},b||(a.jQuery=a.$=r),r});

;/*!
 * Bootstrap v4.0.0-beta (https://getbootstrap.com)
 * Copyright 2011-2017 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 */
if("undefined"==typeof jQuery)throw new Error("Bootstrap's JavaScript requires jQuery. jQuery must be included before Bootstrap's JavaScript.");!function(t){var e=jQuery.fn.jquery.split(" ")[0].split(".");if(e[0]<2&&e[1]<9||1==e[0]&&9==e[1]&&e[2]<1||e[0]>=4)throw new Error("Bootstrap's JavaScript requires at least jQuery v1.9.1 but less than v4.0.0")}(),function(){function t(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!=typeof e&&"function"!=typeof e?t:e}function e(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}function n(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}var i="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},o=function(){function t(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}return function(e,n,i){return n&&t(e.prototype,n),i&&t(e,i),e}}(),r=function(t){function e(t){return{}.toString.call(t).match(/\s([a-zA-Z]+)/)[1].toLowerCase()}function n(t){return(t[0]||t).nodeType}function i(){return{bindType:s.end,delegateType:s.end,handle:function(e){if(t(e.target).is(this))return e.handleObj.handler.apply(this,arguments)}}}function o(){if(window.QUnit)return!1;var t=document.createElement("bootstrap");for(var e in a)if(void 0!==t.style[e])return{end:a[e]};return!1}function r(e){var n=this,i=!1;return t(this).one(l.TRANSITION_END,function(){i=!0}),setTimeout(function(){i||l.triggerTransitionEnd(n)},e),this}var s=!1,a={WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"oTransitionEnd otransitionend",transition:"transitionend"},l={TRANSITION_END:"bsTransitionEnd",getUID:function(t){do{t+=~~(1e6*Math.random())}while(document.getElementById(t));return t},getSelectorFromElement:function(e){var n=e.getAttribute("data-target");n&&"#"!==n||(n=e.getAttribute("href")||"");try{return t(n).length>0?n:null}catch(t){return null}},reflow:function(t){return t.offsetHeight},triggerTransitionEnd:function(e){t(e).trigger(s.end)},supportsTransitionEnd:function(){return Boolean(s)},typeCheckConfig:function(t,i,o){for(var r in o)if(o.hasOwnProperty(r)){var s=o[r],a=i[r],l=a&&n(a)?"element":e(a);if(!new RegExp(s).test(l))throw new Error(t.toUpperCase()+': Option "'+r+'" provided type "'+l+'" but expected type "'+s+'".')}}};return s=o(),t.fn.emulateTransitionEnd=r,l.supportsTransitionEnd()&&(t.event.special[l.TRANSITION_END]=i()),l}(jQuery),s=(function(t){var e="alert",i=t.fn[e],s={DISMISS:'[data-dismiss="alert"]'},a={CLOSE:"close.bs.alert",CLOSED:"closed.bs.alert",CLICK_DATA_API:"click.bs.alert.data-api"},l={ALERT:"alert",FADE:"fade",SHOW:"show"},h=function(){function e(t){n(this,e),this._element=t}return e.prototype.close=function(t){t=t||this._element;var e=this._getRootElement(t);this._triggerCloseEvent(e).isDefaultPrevented()||this._removeElement(e)},e.prototype.dispose=function(){t.removeData(this._element,"bs.alert"),this._element=null},e.prototype._getRootElement=function(e){var n=r.getSelectorFromElement(e),i=!1;return n&&(i=t(n)[0]),i||(i=t(e).closest("."+l.ALERT)[0]),i},e.prototype._triggerCloseEvent=function(e){var n=t.Event(a.CLOSE);return t(e).trigger(n),n},e.prototype._removeElement=function(e){var n=this;t(e).removeClass(l.SHOW),r.supportsTransitionEnd()&&t(e).hasClass(l.FADE)?t(e).one(r.TRANSITION_END,function(t){return n._destroyElement(e,t)}).emulateTransitionEnd(150):this._destroyElement(e)},e.prototype._destroyElement=function(e){t(e).detach().trigger(a.CLOSED).remove()},e._jQueryInterface=function(n){return this.each(function(){var i=t(this),o=i.data("bs.alert");o||(o=new e(this),i.data("bs.alert",o)),"close"===n&&o[n](this)})},e._handleDismiss=function(t){return function(e){e&&e.preventDefault(),t.close(this)}},o(e,null,[{key:"VERSION",get:function(){return"4.0.0-beta"}}]),e}();t(document).on(a.CLICK_DATA_API,s.DISMISS,h._handleDismiss(new h)),t.fn[e]=h._jQueryInterface,t.fn[e].Constructor=h,t.fn[e].noConflict=function(){return t.fn[e]=i,h._jQueryInterface}}(jQuery),function(t){var e="button",i=t.fn[e],r={ACTIVE:"active",BUTTON:"btn",FOCUS:"focus"},s={DATA_TOGGLE_CARROT:'[data-toggle^="button"]',DATA_TOGGLE:'[data-toggle="buttons"]',INPUT:"input",ACTIVE:".active",BUTTON:".btn"},a={CLICK_DATA_API:"click.bs.button.data-api",FOCUS_BLUR_DATA_API:"focus.bs.button.data-api blur.bs.button.data-api"},l=function(){function e(t){n(this,e),this._element=t}return e.prototype.toggle=function(){var e=!0,n=!0,i=t(this._element).closest(s.DATA_TOGGLE)[0];if(i){var o=t(this._element).find(s.INPUT)[0];if(o){if("radio"===o.type)if(o.checked&&t(this._element).hasClass(r.ACTIVE))e=!1;else{var a=t(i).find(s.ACTIVE)[0];a&&t(a).removeClass(r.ACTIVE)}if(e){if(o.hasAttribute("disabled")||i.hasAttribute("disabled")||o.classList.contains("disabled")||i.classList.contains("disabled"))return;o.checked=!t(this._element).hasClass(r.ACTIVE),t(o).trigger("change")}o.focus(),n=!1}}n&&this._element.setAttribute("aria-pressed",!t(this._element).hasClass(r.ACTIVE)),e&&t(this._element).toggleClass(r.ACTIVE)},e.prototype.dispose=function(){t.removeData(this._element,"bs.button"),this._element=null},e._jQueryInterface=function(n){return this.each(function(){var i=t(this).data("bs.button");i||(i=new e(this),t(this).data("bs.button",i)),"toggle"===n&&i[n]()})},o(e,null,[{key:"VERSION",get:function(){return"4.0.0-beta"}}]),e}();t(document).on(a.CLICK_DATA_API,s.DATA_TOGGLE_CARROT,function(e){e.preventDefault();var n=e.target;t(n).hasClass(r.BUTTON)||(n=t(n).closest(s.BUTTON)),l._jQueryInterface.call(t(n),"toggle")}).on(a.FOCUS_BLUR_DATA_API,s.DATA_TOGGLE_CARROT,function(e){var n=t(e.target).closest(s.BUTTON)[0];t(n).toggleClass(r.FOCUS,/^focus(in)?$/.test(e.type))}),t.fn[e]=l._jQueryInterface,t.fn[e].Constructor=l,t.fn[e].noConflict=function(){return t.fn[e]=i,l._jQueryInterface}}(jQuery),function(t){var e="carousel",s="bs.carousel",a="."+s,l=t.fn[e],h={interval:5e3,keyboard:!0,slide:!1,pause:"hover",wrap:!0},c={interval:"(number|boolean)",keyboard:"boolean",slide:"(boolean|string)",pause:"(string|boolean)",wrap:"boolean"},u={NEXT:"next",PREV:"prev",LEFT:"left",RIGHT:"right"},d={SLIDE:"slide"+a,SLID:"slid"+a,KEYDOWN:"keydown"+a,MOUSEENTER:"mouseenter"+a,MOUSELEAVE:"mouseleave"+a,TOUCHEND:"touchend"+a,LOAD_DATA_API:"load.bs.carousel.data-api",CLICK_DATA_API:"click.bs.carousel.data-api"},f={CAROUSEL:"carousel",ACTIVE:"active",SLIDE:"slide",RIGHT:"carousel-item-right",LEFT:"carousel-item-left",NEXT:"carousel-item-next",PREV:"carousel-item-prev",ITEM:"carousel-item"},p={ACTIVE:".active",ACTIVE_ITEM:".active.carousel-item",ITEM:".carousel-item",NEXT_PREV:".carousel-item-next, .carousel-item-prev",INDICATORS:".carousel-indicators",DATA_SLIDE:"[data-slide], [data-slide-to]",DATA_RIDE:'[data-ride="carousel"]'},_=function(){function l(e,i){n(this,l),this._items=null,this._interval=null,this._activeElement=null,this._isPaused=!1,this._isSliding=!1,this.touchTimeout=null,this._config=this._getConfig(i),this._element=t(e)[0],this._indicatorsElement=t(this._element).find(p.INDICATORS)[0],this._addEventListeners()}return l.prototype.next=function(){this._isSliding||this._slide(u.NEXT)},l.prototype.nextWhenVisible=function(){document.hidden||this.next()},l.prototype.prev=function(){this._isSliding||this._slide(u.PREV)},l.prototype.pause=function(e){e||(this._isPaused=!0),t(this._element).find(p.NEXT_PREV)[0]&&r.supportsTransitionEnd()&&(r.triggerTransitionEnd(this._element),this.cycle(!0)),clearInterval(this._interval),this._interval=null},l.prototype.cycle=function(t){t||(this._isPaused=!1),this._interval&&(clearInterval(this._interval),this._interval=null),this._config.interval&&!this._isPaused&&(this._interval=setInterval((document.visibilityState?this.nextWhenVisible:this.next).bind(this),this._config.interval))},l.prototype.to=function(e){var n=this;this._activeElement=t(this._element).find(p.ACTIVE_ITEM)[0];var i=this._getItemIndex(this._activeElement);if(!(e>this._items.length-1||e<0))if(this._isSliding)t(this._element).one(d.SLID,function(){return n.to(e)});else{if(i===e)return this.pause(),void this.cycle();var o=e>i?u.NEXT:u.PREV;this._slide(o,this._items[e])}},l.prototype.dispose=function(){t(this._element).off(a),t.removeData(this._element,s),this._items=null,this._config=null,this._element=null,this._interval=null,this._isPaused=null,this._isSliding=null,this._activeElement=null,this._indicatorsElement=null},l.prototype._getConfig=function(n){return n=t.extend({},h,n),r.typeCheckConfig(e,n,c),n},l.prototype._addEventListeners=function(){var e=this;this._config.keyboard&&t(this._element).on(d.KEYDOWN,function(t){return e._keydown(t)}),"hover"===this._config.pause&&(t(this._element).on(d.MOUSEENTER,function(t){return e.pause(t)}).on(d.MOUSELEAVE,function(t){return e.cycle(t)}),"ontouchstart"in document.documentElement&&t(this._element).on(d.TOUCHEND,function(){e.pause(),e.touchTimeout&&clearTimeout(e.touchTimeout),e.touchTimeout=setTimeout(function(t){return e.cycle(t)},500+e._config.interval)}))},l.prototype._keydown=function(t){if(!/input|textarea/i.test(t.target.tagName))switch(t.which){case 37:t.preventDefault(),this.prev();break;case 39:t.preventDefault(),this.next();break;default:return}},l.prototype._getItemIndex=function(e){return this._items=t.makeArray(t(e).parent().find(p.ITEM)),this._items.indexOf(e)},l.prototype._getItemByDirection=function(t,e){var n=t===u.NEXT,i=t===u.PREV,o=this._getItemIndex(e),r=this._items.length-1;if((i&&0===o||n&&o===r)&&!this._config.wrap)return e;var s=(o+(t===u.PREV?-1:1))%this._items.length;return-1===s?this._items[this._items.length-1]:this._items[s]},l.prototype._triggerSlideEvent=function(e,n){var i=this._getItemIndex(e),o=this._getItemIndex(t(this._element).find(p.ACTIVE_ITEM)[0]),r=t.Event(d.SLIDE,{relatedTarget:e,direction:n,from:o,to:i});return t(this._element).trigger(r),r},l.prototype._setActiveIndicatorElement=function(e){if(this._indicatorsElement){t(this._indicatorsElement).find(p.ACTIVE).removeClass(f.ACTIVE);var n=this._indicatorsElement.children[this._getItemIndex(e)];n&&t(n).addClass(f.ACTIVE)}},l.prototype._slide=function(e,n){var i=this,o=t(this._element).find(p.ACTIVE_ITEM)[0],s=this._getItemIndex(o),a=n||o&&this._getItemByDirection(e,o),l=this._getItemIndex(a),h=Boolean(this._interval),c=void 0,_=void 0,g=void 0;if(e===u.NEXT?(c=f.LEFT,_=f.NEXT,g=u.LEFT):(c=f.RIGHT,_=f.PREV,g=u.RIGHT),a&&t(a).hasClass(f.ACTIVE))this._isSliding=!1;else if(!this._triggerSlideEvent(a,g).isDefaultPrevented()&&o&&a){this._isSliding=!0,h&&this.pause(),this._setActiveIndicatorElement(a);var m=t.Event(d.SLID,{relatedTarget:a,direction:g,from:s,to:l});r.supportsTransitionEnd()&&t(this._element).hasClass(f.SLIDE)?(t(a).addClass(_),r.reflow(a),t(o).addClass(c),t(a).addClass(c),t(o).one(r.TRANSITION_END,function(){t(a).removeClass(c+" "+_).addClass(f.ACTIVE),t(o).removeClass(f.ACTIVE+" "+_+" "+c),i._isSliding=!1,setTimeout(function(){return t(i._element).trigger(m)},0)}).emulateTransitionEnd(600)):(t(o).removeClass(f.ACTIVE),t(a).addClass(f.ACTIVE),this._isSliding=!1,t(this._element).trigger(m)),h&&this.cycle()}},l._jQueryInterface=function(e){return this.each(function(){var n=t(this).data(s),o=t.extend({},h,t(this).data());"object"===(void 0===e?"undefined":i(e))&&t.extend(o,e);var r="string"==typeof e?e:o.slide;if(n||(n=new l(this,o),t(this).data(s,n)),"number"==typeof e)n.to(e);else if("string"==typeof r){if(void 0===n[r])throw new Error('No method named "'+r+'"');n[r]()}else o.interval&&(n.pause(),n.cycle())})},l._dataApiClickHandler=function(e){var n=r.getSelectorFromElement(this);if(n){var i=t(n)[0];if(i&&t(i).hasClass(f.CAROUSEL)){var o=t.extend({},t(i).data(),t(this).data()),a=this.getAttribute("data-slide-to");a&&(o.interval=!1),l._jQueryInterface.call(t(i),o),a&&t(i).data(s).to(a),e.preventDefault()}}},o(l,null,[{key:"VERSION",get:function(){return"4.0.0-beta"}},{key:"Default",get:function(){return h}}]),l}();t(document).on(d.CLICK_DATA_API,p.DATA_SLIDE,_._dataApiClickHandler),t(window).on(d.LOAD_DATA_API,function(){t(p.DATA_RIDE).each(function(){var e=t(this);_._jQueryInterface.call(e,e.data())})}),t.fn[e]=_._jQueryInterface,t.fn[e].Constructor=_,t.fn[e].noConflict=function(){return t.fn[e]=l,_._jQueryInterface}}(jQuery),function(t){var e="collapse",s="bs.collapse",a=t.fn[e],l={toggle:!0,parent:""},h={toggle:"boolean",parent:"string"},c={SHOW:"show.bs.collapse",SHOWN:"shown.bs.collapse",HIDE:"hide.bs.collapse",HIDDEN:"hidden.bs.collapse",CLICK_DATA_API:"click.bs.collapse.data-api"},u={SHOW:"show",COLLAPSE:"collapse",COLLAPSING:"collapsing",COLLAPSED:"collapsed"},d={WIDTH:"width",HEIGHT:"height"},f={ACTIVES:".show, .collapsing",DATA_TOGGLE:'[data-toggle="collapse"]'},p=function(){function a(e,i){n(this,a),this._isTransitioning=!1,this._element=e,this._config=this._getConfig(i),this._triggerArray=t.makeArray(t('[data-toggle="collapse"][href="#'+e.id+'"],[data-toggle="collapse"][data-target="#'+e.id+'"]'));for(var o=t(f.DATA_TOGGLE),s=0;s<o.length;s++){var l=o[s],h=r.getSelectorFromElement(l);null!==h&&t(h).filter(e).length>0&&this._triggerArray.push(l)}this._parent=this._config.parent?this._getParent():null,this._config.parent||this._addAriaAndCollapsedClass(this._element,this._triggerArray),this._config.toggle&&this.toggle()}return a.prototype.toggle=function(){t(this._element).hasClass(u.SHOW)?this.hide():this.show()},a.prototype.show=function(){var e=this;if(!this._isTransitioning&&!t(this._element).hasClass(u.SHOW)){var n=void 0,i=void 0;if(this._parent&&((n=t.makeArray(t(this._parent).children().children(f.ACTIVES))).length||(n=null)),!(n&&(i=t(n).data(s))&&i._isTransitioning)){var o=t.Event(c.SHOW);if(t(this._element).trigger(o),!o.isDefaultPrevented()){n&&(a._jQueryInterface.call(t(n),"hide"),i||t(n).data(s,null));var l=this._getDimension();t(this._element).removeClass(u.COLLAPSE).addClass(u.COLLAPSING),this._element.style[l]=0,this._triggerArray.length&&t(this._triggerArray).removeClass(u.COLLAPSED).attr("aria-expanded",!0),this.setTransitioning(!0);var h=function(){t(e._element).removeClass(u.COLLAPSING).addClass(u.COLLAPSE).addClass(u.SHOW),e._element.style[l]="",e.setTransitioning(!1),t(e._element).trigger(c.SHOWN)};if(r.supportsTransitionEnd()){var d="scroll"+(l[0].toUpperCase()+l.slice(1));t(this._element).one(r.TRANSITION_END,h).emulateTransitionEnd(600),this._element.style[l]=this._element[d]+"px"}else h()}}}},a.prototype.hide=function(){var e=this;if(!this._isTransitioning&&t(this._element).hasClass(u.SHOW)){var n=t.Event(c.HIDE);if(t(this._element).trigger(n),!n.isDefaultPrevented()){var i=this._getDimension();if(this._element.style[i]=this._element.getBoundingClientRect()[i]+"px",r.reflow(this._element),t(this._element).addClass(u.COLLAPSING).removeClass(u.COLLAPSE).removeClass(u.SHOW),this._triggerArray.length)for(var o=0;o<this._triggerArray.length;o++){var s=this._triggerArray[o],a=r.getSelectorFromElement(s);null!==a&&(t(a).hasClass(u.SHOW)||t(s).addClass(u.COLLAPSED).attr("aria-expanded",!1))}this.setTransitioning(!0);var l=function(){e.setTransitioning(!1),t(e._element).removeClass(u.COLLAPSING).addClass(u.COLLAPSE).trigger(c.HIDDEN)};this._element.style[i]="",r.supportsTransitionEnd()?t(this._element).one(r.TRANSITION_END,l).emulateTransitionEnd(600):l()}}},a.prototype.setTransitioning=function(t){this._isTransitioning=t},a.prototype.dispose=function(){t.removeData(this._element,s),this._config=null,this._parent=null,this._element=null,this._triggerArray=null,this._isTransitioning=null},a.prototype._getConfig=function(n){return n=t.extend({},l,n),n.toggle=Boolean(n.toggle),r.typeCheckConfig(e,n,h),n},a.prototype._getDimension=function(){return t(this._element).hasClass(d.WIDTH)?d.WIDTH:d.HEIGHT},a.prototype._getParent=function(){var e=this,n=t(this._config.parent)[0],i='[data-toggle="collapse"][data-parent="'+this._config.parent+'"]';return t(n).find(i).each(function(t,n){e._addAriaAndCollapsedClass(a._getTargetFromElement(n),[n])}),n},a.prototype._addAriaAndCollapsedClass=function(e,n){if(e){var i=t(e).hasClass(u.SHOW);n.length&&t(n).toggleClass(u.COLLAPSED,!i).attr("aria-expanded",i)}},a._getTargetFromElement=function(e){var n=r.getSelectorFromElement(e);return n?t(n)[0]:null},a._jQueryInterface=function(e){return this.each(function(){var n=t(this),o=n.data(s),r=t.extend({},l,n.data(),"object"===(void 0===e?"undefined":i(e))&&e);if(!o&&r.toggle&&/show|hide/.test(e)&&(r.toggle=!1),o||(o=new a(this,r),n.data(s,o)),"string"==typeof e){if(void 0===o[e])throw new Error('No method named "'+e+'"');o[e]()}})},o(a,null,[{key:"VERSION",get:function(){return"4.0.0-beta"}},{key:"Default",get:function(){return l}}]),a}();t(document).on(c.CLICK_DATA_API,f.DATA_TOGGLE,function(e){/input|textarea/i.test(e.target.tagName)||e.preventDefault();var n=t(this),i=r.getSelectorFromElement(this);t(i).each(function(){var e=t(this),i=e.data(s)?"toggle":n.data();p._jQueryInterface.call(e,i)})}),t.fn[e]=p._jQueryInterface,t.fn[e].Constructor=p,t.fn[e].noConflict=function(){return t.fn[e]=a,p._jQueryInterface}}(jQuery),function(t){if("undefined"==typeof Popper)throw new Error("Bootstrap dropdown require Popper.js (https://popper.js.org)");var e="dropdown",s="bs.dropdown",a="."+s,l=t.fn[e],h=new RegExp("38|40|27"),c={HIDE:"hide"+a,HIDDEN:"hidden"+a,SHOW:"show"+a,SHOWN:"shown"+a,CLICK:"click"+a,CLICK_DATA_API:"click.bs.dropdown.data-api",KEYDOWN_DATA_API:"keydown.bs.dropdown.data-api",KEYUP_DATA_API:"keyup.bs.dropdown.data-api"},u={DISABLED:"disabled",SHOW:"show",DROPUP:"dropup",MENURIGHT:"dropdown-menu-right",MENULEFT:"dropdown-menu-left"},d={DATA_TOGGLE:'[data-toggle="dropdown"]',FORM_CHILD:".dropdown form",MENU:".dropdown-menu",NAVBAR_NAV:".navbar-nav",VISIBLE_ITEMS:".dropdown-menu .dropdown-item:not(.disabled)"},f={TOP:"top-start",TOPEND:"top-end",BOTTOM:"bottom-start",BOTTOMEND:"bottom-end"},p={placement:f.BOTTOM,offset:0,flip:!0},_={placement:"string",offset:"(number|string)",flip:"boolean"},g=function(){function l(t,e){n(this,l),this._element=t,this._popper=null,this._config=this._getConfig(e),this._menu=this._getMenuElement(),this._inNavbar=this._detectNavbar(),this._addEventListeners()}return l.prototype.toggle=function(){if(!this._element.disabled&&!t(this._element).hasClass(u.DISABLED)){var e=l._getParentFromElement(this._element),n=t(this._menu).hasClass(u.SHOW);if(l._clearMenus(),!n){var i={relatedTarget:this._element},o=t.Event(c.SHOW,i);if(t(e).trigger(o),!o.isDefaultPrevented()){var r=this._element;t(e).hasClass(u.DROPUP)&&(t(this._menu).hasClass(u.MENULEFT)||t(this._menu).hasClass(u.MENURIGHT))&&(r=e),this._popper=new Popper(r,this._menu,this._getPopperConfig()),"ontouchstart"in document.documentElement&&!t(e).closest(d.NAVBAR_NAV).length&&t("body").children().on("mouseover",null,t.noop),this._element.focus(),this._element.setAttribute("aria-expanded",!0),t(this._menu).toggleClass(u.SHOW),t(e).toggleClass(u.SHOW).trigger(t.Event(c.SHOWN,i))}}}},l.prototype.dispose=function(){t.removeData(this._element,s),t(this._element).off(a),this._element=null,this._menu=null,null!==this._popper&&this._popper.destroy(),this._popper=null},l.prototype.update=function(){this._inNavbar=this._detectNavbar(),null!==this._popper&&this._popper.scheduleUpdate()},l.prototype._addEventListeners=function(){var e=this;t(this._element).on(c.CLICK,function(t){t.preventDefault(),t.stopPropagation(),e.toggle()})},l.prototype._getConfig=function(n){var i=t(this._element).data();return void 0!==i.placement&&(i.placement=f[i.placement.toUpperCase()]),n=t.extend({},this.constructor.Default,t(this._element).data(),n),r.typeCheckConfig(e,n,this.constructor.DefaultType),n},l.prototype._getMenuElement=function(){if(!this._menu){var e=l._getParentFromElement(this._element);this._menu=t(e).find(d.MENU)[0]}return this._menu},l.prototype._getPlacement=function(){var e=t(this._element).parent(),n=this._config.placement;return e.hasClass(u.DROPUP)||this._config.placement===f.TOP?(n=f.TOP,t(this._menu).hasClass(u.MENURIGHT)&&(n=f.TOPEND)):t(this._menu).hasClass(u.MENURIGHT)&&(n=f.BOTTOMEND),n},l.prototype._detectNavbar=function(){return t(this._element).closest(".navbar").length>0},l.prototype._getPopperConfig=function(){var t={placement:this._getPlacement(),modifiers:{offset:{offset:this._config.offset},flip:{enabled:this._config.flip}}};return this._inNavbar&&(t.modifiers.applyStyle={enabled:!this._inNavbar}),t},l._jQueryInterface=function(e){return this.each(function(){var n=t(this).data(s),o="object"===(void 0===e?"undefined":i(e))?e:null;if(n||(n=new l(this,o),t(this).data(s,n)),"string"==typeof e){if(void 0===n[e])throw new Error('No method named "'+e+'"');n[e]()}})},l._clearMenus=function(e){if(!e||3!==e.which&&("keyup"!==e.type||9===e.which))for(var n=t.makeArray(t(d.DATA_TOGGLE)),i=0;i<n.length;i++){var o=l._getParentFromElement(n[i]),r=t(n[i]).data(s),a={relatedTarget:n[i]};if(r){var h=r._menu;if(t(o).hasClass(u.SHOW)&&!(e&&("click"===e.type&&/input|textarea/i.test(e.target.tagName)||"keyup"===e.type&&9===e.which)&&t.contains(o,e.target))){var f=t.Event(c.HIDE,a);t(o).trigger(f),f.isDefaultPrevented()||("ontouchstart"in document.documentElement&&t("body").children().off("mouseover",null,t.noop),n[i].setAttribute("aria-expanded","false"),t(h).removeClass(u.SHOW),t(o).removeClass(u.SHOW).trigger(t.Event(c.HIDDEN,a)))}}}},l._getParentFromElement=function(e){var n=void 0,i=r.getSelectorFromElement(e);return i&&(n=t(i)[0]),n||e.parentNode},l._dataApiKeydownHandler=function(e){if(!(!h.test(e.which)||/button/i.test(e.target.tagName)&&32===e.which||/input|textarea/i.test(e.target.tagName)||(e.preventDefault(),e.stopPropagation(),this.disabled||t(this).hasClass(u.DISABLED)))){var n=l._getParentFromElement(this),i=t(n).hasClass(u.SHOW);if((i||27===e.which&&32===e.which)&&(!i||27!==e.which&&32!==e.which)){var o=t(n).find(d.VISIBLE_ITEMS).get();if(o.length){var r=o.indexOf(e.target);38===e.which&&r>0&&r--,40===e.which&&r<o.length-1&&r++,r<0&&(r=0),o[r].focus()}}else{if(27===e.which){var s=t(n).find(d.DATA_TOGGLE)[0];t(s).trigger("focus")}t(this).trigger("click")}}},o(l,null,[{key:"VERSION",get:function(){return"4.0.0-beta"}},{key:"Default",get:function(){return p}},{key:"DefaultType",get:function(){return _}}]),l}();t(document).on(c.KEYDOWN_DATA_API,d.DATA_TOGGLE,g._dataApiKeydownHandler).on(c.KEYDOWN_DATA_API,d.MENU,g._dataApiKeydownHandler).on(c.CLICK_DATA_API+" "+c.KEYUP_DATA_API,g._clearMenus).on(c.CLICK_DATA_API,d.DATA_TOGGLE,function(e){e.preventDefault(),e.stopPropagation(),g._jQueryInterface.call(t(this),"toggle")}).on(c.CLICK_DATA_API,d.FORM_CHILD,function(t){t.stopPropagation()}),t.fn[e]=g._jQueryInterface,t.fn[e].Constructor=g,t.fn[e].noConflict=function(){return t.fn[e]=l,g._jQueryInterface}}(jQuery),function(t){var e="modal",s=".bs.modal",a=t.fn[e],l={backdrop:!0,keyboard:!0,focus:!0,show:!0},h={backdrop:"(boolean|string)",keyboard:"boolean",focus:"boolean",show:"boolean"},c={HIDE:"hide.bs.modal",HIDDEN:"hidden.bs.modal",SHOW:"show.bs.modal",SHOWN:"shown.bs.modal",FOCUSIN:"focusin.bs.modal",RESIZE:"resize.bs.modal",CLICK_DISMISS:"click.dismiss.bs.modal",KEYDOWN_DISMISS:"keydown.dismiss.bs.modal",MOUSEUP_DISMISS:"mouseup.dismiss.bs.modal",MOUSEDOWN_DISMISS:"mousedown.dismiss.bs.modal",CLICK_DATA_API:"click.bs.modal.data-api"},u={SCROLLBAR_MEASURER:"modal-scrollbar-measure",BACKDROP:"modal-backdrop",OPEN:"modal-open",FADE:"fade",SHOW:"show"},d={DIALOG:".modal-dialog",DATA_TOGGLE:'[data-toggle="modal"]',DATA_DISMISS:'[data-dismiss="modal"]',FIXED_CONTENT:".fixed-top, .fixed-bottom, .is-fixed, .sticky-top",NAVBAR_TOGGLER:".navbar-toggler"},f=function(){function a(e,i){n(this,a),this._config=this._getConfig(i),this._element=e,this._dialog=t(e).find(d.DIALOG)[0],this._backdrop=null,this._isShown=!1,this._isBodyOverflowing=!1,this._ignoreBackdropClick=!1,this._originalBodyPadding=0,this._scrollbarWidth=0}return a.prototype.toggle=function(t){return this._isShown?this.hide():this.show(t)},a.prototype.show=function(e){var n=this;if(!this._isTransitioning){r.supportsTransitionEnd()&&t(this._element).hasClass(u.FADE)&&(this._isTransitioning=!0);var i=t.Event(c.SHOW,{relatedTarget:e});t(this._element).trigger(i),this._isShown||i.isDefaultPrevented()||(this._isShown=!0,this._checkScrollbar(),this._setScrollbar(),t(document.body).addClass(u.OPEN),this._setEscapeEvent(),this._setResizeEvent(),t(this._element).on(c.CLICK_DISMISS,d.DATA_DISMISS,function(t){return n.hide(t)}),t(this._dialog).on(c.MOUSEDOWN_DISMISS,function(){t(n._element).one(c.MOUSEUP_DISMISS,function(e){t(e.target).is(n._element)&&(n._ignoreBackdropClick=!0)})}),this._showBackdrop(function(){return n._showElement(e)}))}},a.prototype.hide=function(e){var n=this;if(e&&e.preventDefault(),!this._isTransitioning&&this._isShown){var i=r.supportsTransitionEnd()&&t(this._element).hasClass(u.FADE);i&&(this._isTransitioning=!0);var o=t.Event(c.HIDE);t(this._element).trigger(o),this._isShown&&!o.isDefaultPrevented()&&(this._isShown=!1,this._setEscapeEvent(),this._setResizeEvent(),t(document).off(c.FOCUSIN),t(this._element).removeClass(u.SHOW),t(this._element).off(c.CLICK_DISMISS),t(this._dialog).off(c.MOUSEDOWN_DISMISS),i?t(this._element).one(r.TRANSITION_END,function(t){return n._hideModal(t)}).emulateTransitionEnd(300):this._hideModal())}},a.prototype.dispose=function(){t.removeData(this._element,"bs.modal"),t(window,document,this._element,this._backdrop).off(s),this._config=null,this._element=null,this._dialog=null,this._backdrop=null,this._isShown=null,this._isBodyOverflowing=null,this._ignoreBackdropClick=null,this._scrollbarWidth=null},a.prototype.handleUpdate=function(){this._adjustDialog()},a.prototype._getConfig=function(n){return n=t.extend({},l,n),r.typeCheckConfig(e,n,h),n},a.prototype._showElement=function(e){var n=this,i=r.supportsTransitionEnd()&&t(this._element).hasClass(u.FADE);this._element.parentNode&&this._element.parentNode.nodeType===Node.ELEMENT_NODE||document.body.appendChild(this._element),this._element.style.display="block",this._element.removeAttribute("aria-hidden"),this._element.scrollTop=0,i&&r.reflow(this._element),t(this._element).addClass(u.SHOW),this._config.focus&&this._enforceFocus();var o=t.Event(c.SHOWN,{relatedTarget:e}),s=function(){n._config.focus&&n._element.focus(),n._isTransitioning=!1,t(n._element).trigger(o)};i?t(this._dialog).one(r.TRANSITION_END,s).emulateTransitionEnd(300):s()},a.prototype._enforceFocus=function(){var e=this;t(document).off(c.FOCUSIN).on(c.FOCUSIN,function(n){document===n.target||e._element===n.target||t(e._element).has(n.target).length||e._element.focus()})},a.prototype._setEscapeEvent=function(){var e=this;this._isShown&&this._config.keyboard?t(this._element).on(c.KEYDOWN_DISMISS,function(t){27===t.which&&(t.preventDefault(),e.hide())}):this._isShown||t(this._element).off(c.KEYDOWN_DISMISS)},a.prototype._setResizeEvent=function(){var e=this;this._isShown?t(window).on(c.RESIZE,function(t){return e.handleUpdate(t)}):t(window).off(c.RESIZE)},a.prototype._hideModal=function(){var e=this;this._element.style.display="none",this._element.setAttribute("aria-hidden",!0),this._isTransitioning=!1,this._showBackdrop(function(){t(document.body).removeClass(u.OPEN),e._resetAdjustments(),e._resetScrollbar(),t(e._element).trigger(c.HIDDEN)})},a.prototype._removeBackdrop=function(){this._backdrop&&(t(this._backdrop).remove(),this._backdrop=null)},a.prototype._showBackdrop=function(e){var n=this,i=t(this._element).hasClass(u.FADE)?u.FADE:"";if(this._isShown&&this._config.backdrop){var o=r.supportsTransitionEnd()&&i;if(this._backdrop=document.createElement("div"),this._backdrop.className=u.BACKDROP,i&&t(this._backdrop).addClass(i),t(this._backdrop).appendTo(document.body),t(this._element).on(c.CLICK_DISMISS,function(t){n._ignoreBackdropClick?n._ignoreBackdropClick=!1:t.target===t.currentTarget&&("static"===n._config.backdrop?n._element.focus():n.hide())}),o&&r.reflow(this._backdrop),t(this._backdrop).addClass(u.SHOW),!e)return;if(!o)return void e();t(this._backdrop).one(r.TRANSITION_END,e).emulateTransitionEnd(150)}else if(!this._isShown&&this._backdrop){t(this._backdrop).removeClass(u.SHOW);var s=function(){n._removeBackdrop(),e&&e()};r.supportsTransitionEnd()&&t(this._element).hasClass(u.FADE)?t(this._backdrop).one(r.TRANSITION_END,s).emulateTransitionEnd(150):s()}else e&&e()},a.prototype._adjustDialog=function(){var t=this._element.scrollHeight>document.documentElement.clientHeight;!this._isBodyOverflowing&&t&&(this._element.style.paddingLeft=this._scrollbarWidth+"px"),this._isBodyOverflowing&&!t&&(this._element.style.paddingRight=this._scrollbarWidth+"px")},a.prototype._resetAdjustments=function(){this._element.style.paddingLeft="",this._element.style.paddingRight=""},a.prototype._checkScrollbar=function(){this._isBodyOverflowing=document.body.clientWidth<window.innerWidth,this._scrollbarWidth=this._getScrollbarWidth()},a.prototype._setScrollbar=function(){var e=this;if(this._isBodyOverflowing){t(d.FIXED_CONTENT).each(function(n,i){var o=t(i)[0].style.paddingRight,r=t(i).css("padding-right");t(i).data("padding-right",o).css("padding-right",parseFloat(r)+e._scrollbarWidth+"px")}),t(d.NAVBAR_TOGGLER).each(function(n,i){var o=t(i)[0].style.marginRight,r=t(i).css("margin-right");t(i).data("margin-right",o).css("margin-right",parseFloat(r)+e._scrollbarWidth+"px")});var n=document.body.style.paddingRight,i=t("body").css("padding-right");t("body").data("padding-right",n).css("padding-right",parseFloat(i)+this._scrollbarWidth+"px")}},a.prototype._resetScrollbar=function(){t(d.FIXED_CONTENT).each(function(e,n){var i=t(n).data("padding-right");void 0!==i&&t(n).css("padding-right",i).removeData("padding-right")}),t(d.NAVBAR_TOGGLER).each(function(e,n){var i=t(n).data("margin-right");void 0!==i&&t(n).css("margin-right",i).removeData("margin-right")});var e=t("body").data("padding-right");void 0!==e&&t("body").css("padding-right",e).removeData("padding-right")},a.prototype._getScrollbarWidth=function(){var t=document.createElement("div");t.className=u.SCROLLBAR_MEASURER,document.body.appendChild(t);var e=t.getBoundingClientRect().width-t.clientWidth;return document.body.removeChild(t),e},a._jQueryInterface=function(e,n){return this.each(function(){var o=t(this).data("bs.modal"),r=t.extend({},a.Default,t(this).data(),"object"===(void 0===e?"undefined":i(e))&&e);if(o||(o=new a(this,r),t(this).data("bs.modal",o)),"string"==typeof e){if(void 0===o[e])throw new Error('No method named "'+e+'"');o[e](n)}else r.show&&o.show(n)})},o(a,null,[{key:"VERSION",get:function(){return"4.0.0-beta"}},{key:"Default",get:function(){return l}}]),a}();t(document).on(c.CLICK_DATA_API,d.DATA_TOGGLE,function(e){var n=this,i=void 0,o=r.getSelectorFromElement(this);o&&(i=t(o)[0]);var s=t(i).data("bs.modal")?"toggle":t.extend({},t(i).data(),t(this).data());"A"!==this.tagName&&"AREA"!==this.tagName||e.preventDefault();var a=t(i).one(c.SHOW,function(e){e.isDefaultPrevented()||a.one(c.HIDDEN,function(){t(n).is(":visible")&&n.focus()})});f._jQueryInterface.call(t(i),s,this)}),t.fn[e]=f._jQueryInterface,t.fn[e].Constructor=f,t.fn[e].noConflict=function(){return t.fn[e]=a,f._jQueryInterface}}(jQuery),function(t){var e="scrollspy",s=t.fn[e],a={offset:10,method:"auto",target:""},l={offset:"number",method:"string",target:"(string|element)"},h={ACTIVATE:"activate.bs.scrollspy",SCROLL:"scroll.bs.scrollspy",LOAD_DATA_API:"load.bs.scrollspy.data-api"},c={DROPDOWN_ITEM:"dropdown-item",DROPDOWN_MENU:"dropdown-menu",ACTIVE:"active"},u={DATA_SPY:'[data-spy="scroll"]',ACTIVE:".active",NAV_LIST_GROUP:".nav, .list-group",NAV_LINKS:".nav-link",LIST_ITEMS:".list-group-item",DROPDOWN:".dropdown",DROPDOWN_ITEMS:".dropdown-item",DROPDOWN_TOGGLE:".dropdown-toggle"},d={OFFSET:"offset",POSITION:"position"},f=function(){function s(e,i){var o=this;n(this,s),this._element=e,this._scrollElement="BODY"===e.tagName?window:e,this._config=this._getConfig(i),this._selector=this._config.target+" "+u.NAV_LINKS+","+this._config.target+" "+u.LIST_ITEMS+","+this._config.target+" "+u.DROPDOWN_ITEMS,this._offsets=[],this._targets=[],this._activeTarget=null,this._scrollHeight=0,t(this._scrollElement).on(h.SCROLL,function(t){return o._process(t)}),this.refresh(),this._process()}return s.prototype.refresh=function(){var e=this,n=this._scrollElement!==this._scrollElement.window?d.POSITION:d.OFFSET,i="auto"===this._config.method?n:this._config.method,o=i===d.POSITION?this._getScrollTop():0;this._offsets=[],this._targets=[],this._scrollHeight=this._getScrollHeight(),t.makeArray(t(this._selector)).map(function(e){var n=void 0,s=r.getSelectorFromElement(e);if(s&&(n=t(s)[0]),n){var a=n.getBoundingClientRect();if(a.width||a.height)return[t(n)[i]().top+o,s]}return null}).filter(function(t){return t}).sort(function(t,e){return t[0]-e[0]}).forEach(function(t){e._offsets.push(t[0]),e._targets.push(t[1])})},s.prototype.dispose=function(){t.removeData(this._element,"bs.scrollspy"),t(this._scrollElement).off(".bs.scrollspy"),this._element=null,this._scrollElement=null,this._config=null,this._selector=null,this._offsets=null,this._targets=null,this._activeTarget=null,this._scrollHeight=null},s.prototype._getConfig=function(n){if("string"!=typeof(n=t.extend({},a,n)).target){var i=t(n.target).attr("id");i||(i=r.getUID(e),t(n.target).attr("id",i)),n.target="#"+i}return r.typeCheckConfig(e,n,l),n},s.prototype._getScrollTop=function(){return this._scrollElement===window?this._scrollElement.pageYOffset:this._scrollElement.scrollTop},s.prototype._getScrollHeight=function(){return this._scrollElement.scrollHeight||Math.max(document.body.scrollHeight,document.documentElement.scrollHeight)},s.prototype._getOffsetHeight=function(){return this._scrollElement===window?window.innerHeight:this._scrollElement.getBoundingClientRect().height},s.prototype._process=function(){var t=this._getScrollTop()+this._config.offset,e=this._getScrollHeight(),n=this._config.offset+e-this._getOffsetHeight();if(this._scrollHeight!==e&&this.refresh(),t>=n){var i=this._targets[this._targets.length-1];this._activeTarget!==i&&this._activate(i)}else{if(this._activeTarget&&t<this._offsets[0]&&this._offsets[0]>0)return this._activeTarget=null,void this._clear();for(var o=this._offsets.length;o--;)this._activeTarget!==this._targets[o]&&t>=this._offsets[o]&&(void 0===this._offsets[o+1]||t<this._offsets[o+1])&&this._activate(this._targets[o])}},s.prototype._activate=function(e){this._activeTarget=e,this._clear();var n=this._selector.split(",");n=n.map(function(t){return t+'[data-target="'+e+'"],'+t+'[href="'+e+'"]'});var i=t(n.join(","));i.hasClass(c.DROPDOWN_ITEM)?(i.closest(u.DROPDOWN).find(u.DROPDOWN_TOGGLE).addClass(c.ACTIVE),i.addClass(c.ACTIVE)):(i.addClass(c.ACTIVE),i.parents(u.NAV_LIST_GROUP).prev(u.NAV_LINKS+", "+u.LIST_ITEMS).addClass(c.ACTIVE)),t(this._scrollElement).trigger(h.ACTIVATE,{relatedTarget:e})},s.prototype._clear=function(){t(this._selector).filter(u.ACTIVE).removeClass(c.ACTIVE)},s._jQueryInterface=function(e){return this.each(function(){var n=t(this).data("bs.scrollspy"),o="object"===(void 0===e?"undefined":i(e))&&e;if(n||(n=new s(this,o),t(this).data("bs.scrollspy",n)),"string"==typeof e){if(void 0===n[e])throw new Error('No method named "'+e+'"');n[e]()}})},o(s,null,[{key:"VERSION",get:function(){return"4.0.0-beta"}},{key:"Default",get:function(){return a}}]),s}();t(window).on(h.LOAD_DATA_API,function(){for(var e=t.makeArray(t(u.DATA_SPY)),n=e.length;n--;){var i=t(e[n]);f._jQueryInterface.call(i,i.data())}}),t.fn[e]=f._jQueryInterface,t.fn[e].Constructor=f,t.fn[e].noConflict=function(){return t.fn[e]=s,f._jQueryInterface}}(jQuery),function(t){var e=t.fn.tab,i={HIDE:"hide.bs.tab",HIDDEN:"hidden.bs.tab",SHOW:"show.bs.tab",SHOWN:"shown.bs.tab",CLICK_DATA_API:"click.bs.tab.data-api"},s={DROPDOWN_MENU:"dropdown-menu",ACTIVE:"active",DISABLED:"disabled",FADE:"fade",SHOW:"show"},a={DROPDOWN:".dropdown",NAV_LIST_GROUP:".nav, .list-group",ACTIVE:".active",DATA_TOGGLE:'[data-toggle="tab"], [data-toggle="pill"], [data-toggle="list"]',DROPDOWN_TOGGLE:".dropdown-toggle",DROPDOWN_ACTIVE_CHILD:"> .dropdown-menu .active"},l=function(){function e(t){n(this,e),this._element=t}return e.prototype.show=function(){var e=this;if(!(this._element.parentNode&&this._element.parentNode.nodeType===Node.ELEMENT_NODE&&t(this._element).hasClass(s.ACTIVE)||t(this._element).hasClass(s.DISABLED))){var n=void 0,o=void 0,l=t(this._element).closest(a.NAV_LIST_GROUP)[0],h=r.getSelectorFromElement(this._element);l&&(o=t.makeArray(t(l).find(a.ACTIVE)),o=o[o.length-1]);var c=t.Event(i.HIDE,{relatedTarget:this._element}),u=t.Event(i.SHOW,{relatedTarget:o});if(o&&t(o).trigger(c),t(this._element).trigger(u),!u.isDefaultPrevented()&&!c.isDefaultPrevented()){h&&(n=t(h)[0]),this._activate(this._element,l);var d=function(){var n=t.Event(i.HIDDEN,{relatedTarget:e._element}),r=t.Event(i.SHOWN,{relatedTarget:o});t(o).trigger(n),t(e._element).trigger(r)};n?this._activate(n,n.parentNode,d):d()}}},e.prototype.dispose=function(){t.removeData(this._element,"bs.tab"),this._element=null},e.prototype._activate=function(e,n,i){var o=this,l=t(n).find(a.ACTIVE)[0],h=i&&r.supportsTransitionEnd()&&l&&t(l).hasClass(s.FADE),c=function(){return o._transitionComplete(e,l,h,i)};l&&h?t(l).one(r.TRANSITION_END,c).emulateTransitionEnd(150):c(),l&&t(l).removeClass(s.SHOW)},e.prototype._transitionComplete=function(e,n,i,o){if(n){t(n).removeClass(s.ACTIVE);var l=t(n.parentNode).find(a.DROPDOWN_ACTIVE_CHILD)[0];l&&t(l).removeClass(s.ACTIVE),n.setAttribute("aria-expanded",!1)}if(t(e).addClass(s.ACTIVE),e.setAttribute("aria-expanded",!0),i?(r.reflow(e),t(e).addClass(s.SHOW)):t(e).removeClass(s.FADE),e.parentNode&&t(e.parentNode).hasClass(s.DROPDOWN_MENU)){var h=t(e).closest(a.DROPDOWN)[0];h&&t(h).find(a.DROPDOWN_TOGGLE).addClass(s.ACTIVE),e.setAttribute("aria-expanded",!0)}o&&o()},e._jQueryInterface=function(n){return this.each(function(){var i=t(this),o=i.data("bs.tab");if(o||(o=new e(this),i.data("bs.tab",o)),"string"==typeof n){if(void 0===o[n])throw new Error('No method named "'+n+'"');o[n]()}})},o(e,null,[{key:"VERSION",get:function(){return"4.0.0-beta"}}]),e}();t(document).on(i.CLICK_DATA_API,a.DATA_TOGGLE,function(e){e.preventDefault(),l._jQueryInterface.call(t(this),"show")}),t.fn.tab=l._jQueryInterface,t.fn.tab.Constructor=l,t.fn.tab.noConflict=function(){return t.fn.tab=e,l._jQueryInterface}}(jQuery),function(t){if("undefined"==typeof Popper)throw new Error("Bootstrap tooltips require Popper.js (https://popper.js.org)");var e="tooltip",s=".bs.tooltip",a=t.fn[e],l=new RegExp("(^|\\s)bs-tooltip\\S+","g"),h={animation:"boolean",template:"string",title:"(string|element|function)",trigger:"string",delay:"(number|object)",html:"boolean",selector:"(string|boolean)",placement:"(string|function)",offset:"(number|string)",container:"(string|element|boolean)",fallbackPlacement:"(string|array)"},c={AUTO:"auto",TOP:"top",RIGHT:"right",BOTTOM:"bottom",LEFT:"left"},u={animation:!0,template:'<div class="tooltip" role="tooltip"><div class="arrow"></div><div class="tooltip-inner"></div></div>',trigger:"hover focus",title:"",delay:0,html:!1,selector:!1,placement:"top",offset:0,container:!1,fallbackPlacement:"flip"},d={SHOW:"show",OUT:"out"},f={HIDE:"hide"+s,HIDDEN:"hidden"+s,SHOW:"show"+s,SHOWN:"shown"+s,INSERTED:"inserted"+s,CLICK:"click"+s,FOCUSIN:"focusin"+s,FOCUSOUT:"focusout"+s,MOUSEENTER:"mouseenter"+s,MOUSELEAVE:"mouseleave"+s},p={FADE:"fade",SHOW:"show"},_={TOOLTIP:".tooltip",TOOLTIP_INNER:".tooltip-inner",ARROW:".arrow"},g={HOVER:"hover",FOCUS:"focus",CLICK:"click",MANUAL:"manual"},m=function(){function a(t,e){n(this,a),this._isEnabled=!0,this._timeout=0,this._hoverState="",this._activeTrigger={},this._popper=null,this.element=t,this.config=this._getConfig(e),this.tip=null,this._setListeners()}return a.prototype.enable=function(){this._isEnabled=!0},a.prototype.disable=function(){this._isEnabled=!1},a.prototype.toggleEnabled=function(){this._isEnabled=!this._isEnabled},a.prototype.toggle=function(e){if(e){var n=this.constructor.DATA_KEY,i=t(e.currentTarget).data(n);i||(i=new this.constructor(e.currentTarget,this._getDelegateConfig()),t(e.currentTarget).data(n,i)),i._activeTrigger.click=!i._activeTrigger.click,i._isWithActiveTrigger()?i._enter(null,i):i._leave(null,i)}else{if(t(this.getTipElement()).hasClass(p.SHOW))return void this._leave(null,this);this._enter(null,this)}},a.prototype.dispose=function(){clearTimeout(this._timeout),t.removeData(this.element,this.constructor.DATA_KEY),t(this.element).off(this.constructor.EVENT_KEY),t(this.element).closest(".modal").off("hide.bs.modal"),this.tip&&t(this.tip).remove(),this._isEnabled=null,this._timeout=null,this._hoverState=null,this._activeTrigger=null,null!==this._popper&&this._popper.destroy(),this._popper=null,this.element=null,this.config=null,this.tip=null},a.prototype.show=function(){var e=this;if("none"===t(this.element).css("display"))throw new Error("Please use show on visible elements");var n=t.Event(this.constructor.Event.SHOW);if(this.isWithContent()&&this._isEnabled){t(this.element).trigger(n);var i=t.contains(this.element.ownerDocument.documentElement,this.element);if(n.isDefaultPrevented()||!i)return;var o=this.getTipElement(),s=r.getUID(this.constructor.NAME);o.setAttribute("id",s),this.element.setAttribute("aria-describedby",s),this.setContent(),this.config.animation&&t(o).addClass(p.FADE);var l="function"==typeof this.config.placement?this.config.placement.call(this,o,this.element):this.config.placement,h=this._getAttachment(l);this.addAttachmentClass(h);var c=!1===this.config.container?document.body:t(this.config.container);t(o).data(this.constructor.DATA_KEY,this),t.contains(this.element.ownerDocument.documentElement,this.tip)||t(o).appendTo(c),t(this.element).trigger(this.constructor.Event.INSERTED),this._popper=new Popper(this.element,o,{placement:h,modifiers:{offset:{offset:this.config.offset},flip:{behavior:this.config.fallbackPlacement},arrow:{element:_.ARROW}},onCreate:function(t){t.originalPlacement!==t.placement&&e._handlePopperPlacementChange(t)},onUpdate:function(t){e._handlePopperPlacementChange(t)}}),t(o).addClass(p.SHOW),"ontouchstart"in document.documentElement&&t("body").children().on("mouseover",null,t.noop);var u=function(){e.config.animation&&e._fixTransition();var n=e._hoverState;e._hoverState=null,t(e.element).trigger(e.constructor.Event.SHOWN),n===d.OUT&&e._leave(null,e)};r.supportsTransitionEnd()&&t(this.tip).hasClass(p.FADE)?t(this.tip).one(r.TRANSITION_END,u).emulateTransitionEnd(a._TRANSITION_DURATION):u()}},a.prototype.hide=function(e){var n=this,i=this.getTipElement(),o=t.Event(this.constructor.Event.HIDE),s=function(){n._hoverState!==d.SHOW&&i.parentNode&&i.parentNode.removeChild(i),n._cleanTipClass(),n.element.removeAttribute("aria-describedby"),t(n.element).trigger(n.constructor.Event.HIDDEN),null!==n._popper&&n._popper.destroy(),e&&e()};t(this.element).trigger(o),o.isDefaultPrevented()||(t(i).removeClass(p.SHOW),"ontouchstart"in document.documentElement&&t("body").children().off("mouseover",null,t.noop),this._activeTrigger[g.CLICK]=!1,this._activeTrigger[g.FOCUS]=!1,this._activeTrigger[g.HOVER]=!1,r.supportsTransitionEnd()&&t(this.tip).hasClass(p.FADE)?t(i).one(r.TRANSITION_END,s).emulateTransitionEnd(150):s(),this._hoverState="")},a.prototype.update=function(){null!==this._popper&&this._popper.scheduleUpdate()},a.prototype.isWithContent=function(){return Boolean(this.getTitle())},a.prototype.addAttachmentClass=function(e){t(this.getTipElement()).addClass("bs-tooltip-"+e)},a.prototype.getTipElement=function(){return this.tip=this.tip||t(this.config.template)[0]},a.prototype.setContent=function(){var e=t(this.getTipElement());this.setElementContent(e.find(_.TOOLTIP_INNER),this.getTitle()),e.removeClass(p.FADE+" "+p.SHOW)},a.prototype.setElementContent=function(e,n){var o=this.config.html;"object"===(void 0===n?"undefined":i(n))&&(n.nodeType||n.jquery)?o?t(n).parent().is(e)||e.empty().append(n):e.text(t(n).text()):e[o?"html":"text"](n)},a.prototype.getTitle=function(){var t=this.element.getAttribute("data-original-title");return t||(t="function"==typeof this.config.title?this.config.title.call(this.element):this.config.title),t},a.prototype._getAttachment=function(t){return c[t.toUpperCase()]},a.prototype._setListeners=function(){var e=this;this.config.trigger.split(" ").forEach(function(n){if("click"===n)t(e.element).on(e.constructor.Event.CLICK,e.config.selector,function(t){return e.toggle(t)});else if(n!==g.MANUAL){var i=n===g.HOVER?e.constructor.Event.MOUSEENTER:e.constructor.Event.FOCUSIN,o=n===g.HOVER?e.constructor.Event.MOUSELEAVE:e.constructor.Event.FOCUSOUT;t(e.element).on(i,e.config.selector,function(t){return e._enter(t)}).on(o,e.config.selector,function(t){return e._leave(t)})}t(e.element).closest(".modal").on("hide.bs.modal",function(){return e.hide()})}),this.config.selector?this.config=t.extend({},this.config,{trigger:"manual",selector:""}):this._fixTitle()},a.prototype._fixTitle=function(){var t=i(this.element.getAttribute("data-original-title"));(this.element.getAttribute("title")||"string"!==t)&&(this.element.setAttribute("data-original-title",this.element.getAttribute("title")||""),this.element.setAttribute("title",""))},a.prototype._enter=function(e,n){var i=this.constructor.DATA_KEY;(n=n||t(e.currentTarget).data(i))||(n=new this.constructor(e.currentTarget,this._getDelegateConfig()),t(e.currentTarget).data(i,n)),e&&(n._activeTrigger["focusin"===e.type?g.FOCUS:g.HOVER]=!0),t(n.getTipElement()).hasClass(p.SHOW)||n._hoverState===d.SHOW?n._hoverState=d.SHOW:(clearTimeout(n._timeout),n._hoverState=d.SHOW,n.config.delay&&n.config.delay.show?n._timeout=setTimeout(function(){n._hoverState===d.SHOW&&n.show()},n.config.delay.show):n.show())},a.prototype._leave=function(e,n){var i=this.constructor.DATA_KEY;(n=n||t(e.currentTarget).data(i))||(n=new this.constructor(e.currentTarget,this._getDelegateConfig()),t(e.currentTarget).data(i,n)),e&&(n._activeTrigger["focusout"===e.type?g.FOCUS:g.HOVER]=!1),n._isWithActiveTrigger()||(clearTimeout(n._timeout),n._hoverState=d.OUT,n.config.delay&&n.config.delay.hide?n._timeout=setTimeout(function(){n._hoverState===d.OUT&&n.hide()},n.config.delay.hide):n.hide())},a.prototype._isWithActiveTrigger=function(){for(var t in this._activeTrigger)if(this._activeTrigger[t])return!0;return!1},a.prototype._getConfig=function(n){return(n=t.extend({},this.constructor.Default,t(this.element).data(),n)).delay&&"number"==typeof n.delay&&(n.delay={show:n.delay,hide:n.delay}),n.title&&"number"==typeof n.title&&(n.title=n.title.toString()),n.content&&"number"==typeof n.content&&(n.content=n.content.toString()),r.typeCheckConfig(e,n,this.constructor.DefaultType),n},a.prototype._getDelegateConfig=function(){var t={};if(this.config)for(var e in this.config)this.constructor.Default[e]!==this.config[e]&&(t[e]=this.config[e]);return t},a.prototype._cleanTipClass=function(){var e=t(this.getTipElement()),n=e.attr("class").match(l);null!==n&&n.length>0&&e.removeClass(n.join(""))},a.prototype._handlePopperPlacementChange=function(t){this._cleanTipClass(),this.addAttachmentClass(this._getAttachment(t.placement))},a.prototype._fixTransition=function(){var e=this.getTipElement(),n=this.config.animation;null===e.getAttribute("x-placement")&&(t(e).removeClass(p.FADE),this.config.animation=!1,this.hide(),this.show(),this.config.animation=n)},a._jQueryInterface=function(e){return this.each(function(){var n=t(this).data("bs.tooltip"),o="object"===(void 0===e?"undefined":i(e))&&e;if((n||!/dispose|hide/.test(e))&&(n||(n=new a(this,o),t(this).data("bs.tooltip",n)),"string"==typeof e)){if(void 0===n[e])throw new Error('No method named "'+e+'"');n[e]()}})},o(a,null,[{key:"VERSION",get:function(){return"4.0.0-beta"}},{key:"Default",get:function(){return u}},{key:"NAME",get:function(){return e}},{key:"DATA_KEY",get:function(){return"bs.tooltip"}},{key:"Event",get:function(){return f}},{key:"EVENT_KEY",get:function(){return s}},{key:"DefaultType",get:function(){return h}}]),a}();return t.fn[e]=m._jQueryInterface,t.fn[e].Constructor=m,t.fn[e].noConflict=function(){return t.fn[e]=a,m._jQueryInterface},m}(jQuery));!function(r){var a="popover",l=".bs.popover",h=r.fn[a],c=new RegExp("(^|\\s)bs-popover\\S+","g"),u=r.extend({},s.Default,{placement:"right",trigger:"click",content:"",template:'<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-header"></h3><div class="popover-body"></div></div>'}),d=r.extend({},s.DefaultType,{content:"(string|element|function)"}),f={FADE:"fade",SHOW:"show"},p={TITLE:".popover-header",CONTENT:".popover-body"},_={HIDE:"hide"+l,HIDDEN:"hidden"+l,SHOW:"show"+l,SHOWN:"shown"+l,INSERTED:"inserted"+l,CLICK:"click"+l,FOCUSIN:"focusin"+l,FOCUSOUT:"focusout"+l,MOUSEENTER:"mouseenter"+l,MOUSELEAVE:"mouseleave"+l},g=function(s){function h(){return n(this,h),t(this,s.apply(this,arguments))}return e(h,s),h.prototype.isWithContent=function(){return this.getTitle()||this._getContent()},h.prototype.addAttachmentClass=function(t){r(this.getTipElement()).addClass("bs-popover-"+t)},h.prototype.getTipElement=function(){return this.tip=this.tip||r(this.config.template)[0]},h.prototype.setContent=function(){var t=r(this.getTipElement());this.setElementContent(t.find(p.TITLE),this.getTitle()),this.setElementContent(t.find(p.CONTENT),this._getContent()),t.removeClass(f.FADE+" "+f.SHOW)},h.prototype._getContent=function(){return this.element.getAttribute("data-content")||("function"==typeof this.config.content?this.config.content.call(this.element):this.config.content)},h.prototype._cleanTipClass=function(){var t=r(this.getTipElement()),e=t.attr("class").match(c);null!==e&&e.length>0&&t.removeClass(e.join(""))},h._jQueryInterface=function(t){return this.each(function(){var e=r(this).data("bs.popover"),n="object"===(void 0===t?"undefined":i(t))?t:null;if((e||!/destroy|hide/.test(t))&&(e||(e=new h(this,n),r(this).data("bs.popover",e)),"string"==typeof t)){if(void 0===e[t])throw new Error('No method named "'+t+'"');e[t]()}})},o(h,null,[{key:"VERSION",get:function(){return"4.0.0-beta"}},{key:"Default",get:function(){return u}},{key:"NAME",get:function(){return a}},{key:"DATA_KEY",get:function(){return"bs.popover"}},{key:"Event",get:function(){return _}},{key:"EVENT_KEY",get:function(){return l}},{key:"DefaultType",get:function(){return d}}]),h}(s);r.fn[a]=g._jQueryInterface,r.fn[a].Constructor=g,r.fn[a].noConflict=function(){return r.fn[a]=h,g._jQueryInterface}}(jQuery)}();
;
//# sourceMappingURL=scripts.bundle.js.map