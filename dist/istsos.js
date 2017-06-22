var istsos =
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
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
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
/******/ 	return __webpack_require__(__webpack_require__.s = 18);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
   value: true
});
/**
 * url, method, headers, data
 */
var HttpAPI = exports.HttpAPI = {
   _request: function _request(config) {
      return new Promise(function (resolve, reject) {
         var xhr = new XMLHttpRequest();

         xhr.open(config.method || "GET", config.url);

         if (config.headers) {
            Object.keys(config.headers).forEach(function (key) {
               xhr.setRequestHeader(key, config.headers[key]);
            });
         }
         xhr.onload = function () {
            if (xhr.status >= 200 && xhr.status < 300) {
               resolve(JSON.parse(xhr.response));
            } else {
               reject(xhr.statusText);
            }
         };
         xhr.onerror = function () {
            return reject(xhr.statusText);
         };
         xhr.send(config.data);
      });
   },
   get: function get(url, opt_config) {
      var config = {};
      config.method = "GET";
      config.url = url;
      for (var c in opt_config) {
         config[c] = opt_config[c];
      }
      return HttpAPI._request(config);
   },
   put: function put(url, opt_config) {
      var config = {};
      config.method = "PUT";
      config.url = url;
      for (var c in opt_config) {
         config[c] = opt_config[c];
      }

      return HttpAPI._request(config);
   },
   post: function post(url, opt_config) {
      var config = {};
      config.method = "POST";
      config.url = url;
      for (var c in opt_config) {
         config[c] = opt_config[c];
      }

      return HttpAPI._request(config);
   },
   delete: function _delete(url, opt_config) {
      var config = {};
      config.method = "DELETE";
      config.url = url;
      for (var c in opt_config) {
         config[c] = opt_config[c];
      }

      return HttpAPI._request(config);
   }
};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.EventEmitter = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _EventTypes = __webpack_require__(5);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @class istsos.EventEmitter
 */
var EventEmitter = exports.EventEmitter = function () {
	/**
   * constructor - Instantiates istsos.EventEmitter
   *
   * @constructor
   */
	function EventEmitter() {
		_classCallCheck(this, EventEmitter);

		this.events = {};
	}

	/**
  * @param  {String}
  * @param  {Function}
  * @return {istsos.EventEmitter}
  */


	_createClass(EventEmitter, [{
		key: "on",
		value: function on(event, callback) {
			if (!_EventTypes.EventTypes.hasOwnProperty(event)) {
				throw "EVENT TYPE NOT RECOGNIZED!!!";
			}

			(this.events[event] = this.events[event] || []).push(callback);

			return this;
		}
	}, {
		key: "once",
		value: function once(event, callback) {
			function on() {
				this.off(event, on);
				callback.apply(this, arguments);
			}

			on.callback = callback;

			this.on(event, on);

			return this;
		}
	}, {
		key: "off",
		value: function off(event, callback) {
			if (this.events[event]) {
				this._removeHandler(event, callback);
			}

			return this;
		}
	}, {
		key: "fire",
		value: function fire(event, data) {
			this.events[event] = this.events[event] || [];
			for (var i = 0; i < this.events[event].length; i++) {
				this.events[event][i].apply(this, [data]);
			}
		}
	}, {
		key: "_removeHandler",
		value: function _removeHandler(event, callback) {
			this.events[event] = this.events[event] || [];
			for (var i = 0; i < this.events[event].length; i++) {
				if (this.events[event][i] === callback) {
					this.events[event].splice(i, 1);
					break;
				}
			}
		}
	}, {
		key: "unlistenAll",
		value: function unlistenAll() {
			for (e in this.events.length) {
				delete this.events[e];
			}
		}
	}]);

	return EventEmitter;
}();

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
   value: true
});
/**
 * Constraint inputs map for observed property
 * @type {Object}
 */
var ConstraintInputs = {
   "between": "interval",
   "lessThan": "max",
   "greaterThan": "min",
   "valueList": "valueList"
};

var aggregateFunctions = ["SUM", "MAX", "MIN", "AVG"];

/**
 * Constraint input validation
 * @param  {String} constraintType  Type of constraint
 * @param  {int} constraintValue    Constraint value
 * @return {boolean}    Returns validation confirmation - true or false
 */
var validateConstraintInput = function validateConstraintInput(constraintType, constraintValue) {
   switch (constraintType) {
      case 'between':
         if (constraintValue.constructor !== Array) {
            return false;
         } else {
            return true;
         }
      case 'lessThan':
         if (constraintValue !== parseInt(constraintValue, 10)) {
            return false;
         } else {
            return true;
         }
      case 'greaterThan':
         if (constraintValue !== parseInt(constraintValue, 10)) {
            return false;
         } else {
            return true;
         }
      case 'valueList':
         if (constraintValue.constructor !== Array) {
            return false;
         } else {
            return true;
         }
      default:
         throw 'Constraint type must be "between", "lessThan", "greaterThan" or "valueList"';
         return false;
   }
};

/**
 * Prepare input data for getObservation request based on type and config
 * @param  {String} type       One of the observation getter types
 * @param  {Object} options    Required params for get observation request
 * @param  {Object} opt_config Config object for data aggregation or quality index constraint
 * @return {[type]}            [description]
 */
var prepareForGetObservations = function prepareForGetObservations(options, opt_config) {
   var config = {};
   if (type === 'aggregation') {
      config["aggregationURL"] = prepareDataAggregation(opt_config);
   }
   config['offering'] = options.offering.getOfferingJSON()['name'];
   config['procedureNames'] = prepareProcedureNames(options.procedures);
   config['observedPropertyUrns'] = prepareObservedPropertyUrns(options.observedProperties);
   config['begin'] = options.beginTime instanceof istsos.Date ? options.beginTime.getDateString() : options.beginTime;
   config['end'] = options.endTime instanceof istsos.Date ? options.endTime.getDateString() : options.endTime;
   return config;
};

var prepareDataAggregation = function prepareDataAggregation(aggregationConfig) {
   var url = '';
   if (aggregationConfig.aggFunc && aggregationConfig.aggInterval) {
      url += '?';

      if (aggregateFunctions.indexOf(aggregationConfig.aggFunc) > 0) {
         url += "aggregatefunction=" + aggregationConfig.aggFunc + "&aggregateinterval=" + aggregationConfig.aggInterval;
      } else {
         throw "AGGREGATE FUNCTION NOT RECOGNIZED! SHOULD BE 'MAX', 'MIN', 'SUM' OR 'AVG'!";
      }

      if (aggregationConfig.aggNoData && aggregationConfig.aggNoDataQI) {
         url += "&aggregatenodata=" + aggregationConfig.aggNoData.toString() + "&aggregatenodataqi=" + aggregationConfig.aggNoDataQI.toString();
      }
   }
   return url;
};

var prepareProcedureNames = function prepareProcedureNames(procedures) {
   var names = [];
   procedures.forEach(function (p) {
      if (p.systemType === 'virtual') {
         names.push(p.getVirtualProcedureJSON()['system']);
      } else if (p.systemType === 'insitu-fixed-point' || p.systemType === 'insitu-mobile-point') {
         names.push(p.getProcedureJSON()['system']);
      } else {
         throw p + ": WRONG PROCEDURE SYSTEM TYPE!!!";
      }
   });
   return names.toString();
};

var prepareObservedPropertyUrns = function prepareObservedPropertyUrns(observedProperties) {
   var urns = [];
   observedProperties.forEach(function (op) {
      urns.push(op.getObservedPropertiesJSON()['definition']);
   });
   return urns.toString;
};

var transformGetObservationsResponse = function transformGetObservationsResponse(type, response, constraintFilter) {
   switch (type) {
      case "simple":
         var values = response.data[0].result.DataArray.values;

         var transformed = [];
         for (var i = 0; i < values.length; i++) {
            transformed.push({
               "date": values[i][0],
               "measurement": values[i][1]
            });
         }
         return transformed;
         break;
      case "constraint":
         var values = response.data[0].result.DataArray.values;

         var transformed = [];
         for (var _i = 0; _i < values.length; _i++) {
            transformed.push(filterByConstraint(values[_i], constraintFilter.type, constraintFilter.quiality));
         }
         response.data[0].result.DataArray.values = transformed;
         return response;
         break;
      default:
         throw "OBSERVATION METHOD TYPE NOT RECOGNIZED!";
         break;
   }
};

var filterByConstraint = function filterByConstraint(measurement, type, value) {

   switch (type) {
      case "lessThan":
         if (measurement[2] < value) {
            return measurement;
         }
         break;
      case "lessThanAndEqual":
         if (measurement[2] <= value) {
            return measurement;
         }
         break;
      case "equal":
         if (measurement[2] === value) {
            return measurement;
         }
         break;
      case "greaterThanAndEqual":
         if (measurement[2] >= value) {
            return measurement;
         }
         break;
      case "greaterThan":
         if (measurement[2] > value) {
            return measurement;
         }
         break;
      case "between":
         if (measurement[2] >= value[0] && measurement[2] <= value[1]) {
            return measurement;
         }
         break;
      default:
         throw "WRONG CONSTRAINT TYPE FOR CHECKING QUALITY INDEX!!! SHOULD BE 'lessThan', 'lessThanAndEqual', 'equal', 'greaterThanAndEqual', 'greaterThan' or 'between'";
   }
};

exports.validateConstraintInput = validateConstraintInput;
exports.ConstraintInputs = ConstraintInputs;
exports.prepareForGetObservations = prepareForGetObservations;
exports.transformGetObservationsResponse = transformGetObservationsResponse;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
   value: true
});
exports.Configuration = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _HttpAPI = __webpack_require__(0);

var _EventEmitter2 = __webpack_require__(1);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @class istsos.Configuration
 */
var Configuration = exports.Configuration = function (_EventEmitter) {
   _inherits(Configuration, _EventEmitter);

   function Configuration(options) {
      _classCallCheck(this, Configuration);

      var _this = _possibleConstructorReturn(this, (Configuration.__proto__ || Object.getPrototypeOf(Configuration)).call(this));

      _this.serviceName = options.serviceName ? options.serviceName : "default";
      _this.server = options.server;
      return _this;
   }

   _createClass(Configuration, [{
      key: 'fireEvent',
      value: function fireEvent(eventType, response) {
         _get(Configuration.prototype.__proto__ || Object.getPrototypeOf(Configuration.prototype), 'fire', this).call(this, eventType, response);
      }
   }, {
      key: 'on',
      value: function on(event, callback) {
         _get(Configuration.prototype.__proto__ || Object.getPrototypeOf(Configuration.prototype), 'on', this).call(this, event, callback);
      }
   }, {
      key: 'once',
      value: function once(event, callback) {
         _get(Configuration.prototype.__proto__ || Object.getPrototypeOf(Configuration.prototype), 'once', this).call(this, event, callback);
      }
   }, {
      key: 'off',
      value: function off(event, callback) {
         _get(Configuration.prototype.__proto__ || Object.getPrototypeOf(Configuration.prototype), 'off', this).call(this, event, callback);
      }
   }, {
      key: 'unlistenAll',
      value: function unlistenAll() {
         _get(Configuration.prototype.__proto__ || Object.getPrototypeOf(Configuration.prototype), 'unlistenAll', this).call(this, event, callback);
      }
   }, {
      key: 'getConf',
      value: function getConf() {
         var _this2 = this;

         var url = this.server.getUrl() + 'wa/istsos/services/' + this.serviceName + '/configsections';

         var config = {};
         if (this.server.getLoginConfig()) {
            config['headers'] = this.server.getLoginConfig();
         }

         return _HttpAPI.HttpAPI.get(url, config).then(function (result) {
            if (result.success) {
               _this2.fireEvent('CONFIGSECTIONS', result);
               return result;
            } else {
               throw result.message;
            }
         }, function (error_message) {
            throw error_message;
         });
      }
   }, {
      key: 'getProvider',
      value: function getProvider() {
         var _this3 = this;

         var url = this.server.getUrl() + 'wa/istsos/services/' + this.serviceName + '/configsections/provider';

         var config = {};
         if (this.server.getLoginConfig()) {
            config['headers'] = this.server.getLoginConfig();
         }

         return _HttpAPI.HttpAPI.get(url, config).then(function (result) {
            if (result.success) {
               _this3.fireEvent('PROVIDER', result);
               return result;
            } else {
               throw result.message;
            }
         }, function (error_message) {
            throw error_message;
         });
      }
   }, {
      key: 'updateProvider',
      value: function updateProvider() {
         var _this4 = this;

         var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

         // var data = {
         //    "providername": options.providerName || "",
         //    "providersite": options.providerSite || "",
         //    "contactname": options.contactName || "",
         //    "contactposition": options.contactPosition || "",
         //    "contactvoice": options.contactVoice || "",
         //    "contactfax": options.contactFax || "",
         //    "contactemail": options.contactEmail || "",
         //    "contactdeliverypoint": options.contactDeliveryPoint || "",
         //    "contactpostalcode": options.contactPostalCode || "",
         //    "contactcity": options.contactCity || "",
         //    "contactadminarea": options.contactAdminArea || "",
         //    "contactcountry": options.contactCountry || ""
         // };
         var url = this.server.getUrl() + 'wa/istsos/services/' + this.serviceName + '/configsections/provider';

         var config = {};
         if (this.server.getLoginConfig()) {
            config['headers'] = this.server.getLoginConfig();
         }
         config['data'] = JSON.stringify(options);

         return _HttpAPI.HttpAPI.put(url, config).then(function (result) {
            if (result.success) {
               _this4.fireEvent('UPDATE_PROVIDER', result);
               return result;
            } else {
               throw result.message;
            }
         }, function (error_message) {
            throw error_message;
         });
      }
   }, {
      key: 'getIdentification',
      value: function getIdentification() {
         var _this5 = this;

         var url = this.server.getUrl() + 'wa/istsos/services/' + this.serviceName + '/configsections/identification';

         var config = {};
         if (this.server.getLoginConfig()) {
            config['headers'] = this.server.getLoginConfig();
         }

         return _HttpAPI.HttpAPI.get(url, config).then(function (result) {
            if (result.success) {
               _this5.fireEvent('IDENTIFICATION', result);
               return result;
            } else {
               throw result.message;
            }
         }, function (error_message) {
            throw error_message;
         });
      }
   }, {
      key: 'updateIdentification',
      value: function updateIdentification() {
         var _this6 = this;

         var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

         // var data = {
         //    "title": title || "",
         //    "abstract": abstract || "",
         //    "urnversion": urnVersion || "",
         //    "authority": authority || "",
         //    "fees": fees || "",
         //    "keywords": keywords || "",
         //    "accessconstrains": accessConstrains || ""
         // };
         var url = this.server.getUrl() + 'wa/istsos/services/' + this.serviceName + '/configsections/identification';

         var config = {};
         if (this.server.getLoginConfig()) {
            config['headers'] = this.server.getLoginConfig();
         }
         config['data'] = JSON.stringify(options);

         return _HttpAPI.HttpAPI.put(url, config).then(function (result) {
            if (result.success) {
               _this6.fireEvent('UPDATE_IDENTIFICATION', result);
               return result;
            } else {
               throw result.message;
            }
         }, function (error_message) {
            throw error_message;
         });
      }
   }, {
      key: 'getMqtt',
      value: function getMqtt() {
         var _this7 = this;

         var url = this.server.getUrl() + 'wa/istsos/services/' + this.serviceName + '/configsections/mqtt';

         var config = {};
         if (this.server.getLoginConfig()) {
            config['headers'] = this.server.getLoginConfig();
         }

         return _HttpAPI.HttpAPI.get(url, config).then(function (result) {
            if (result.success) {
               _this7.fireEvent('MQTT', result);
               return result;
            } else {
               throw result.message;
            }
         }, function (error_message) {
            throw error_message;
         });
      }
   }, {
      key: 'updateMqtt',
      value: function updateMqtt() {
         var _this8 = this;

         var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

         // var data = {
         //    "broker_password": brokerPassword || "",
         //    "broker_user": brokerUser || "",
         //    "broker_topic": brokerTopic || "",
         //    "broker_url": brokerUrl || "",
         //    "broker_port": brokerPort || ""
         // };
         var url = this.server.getUrl() + 'wa/istsos/services/' + this.serviceName + '/configsections/mqtt';

         var config = {};
         if (this.server.getLoginConfig()) {
            config['headers'] = this.server.getLoginConfig();
         }
         config['data'] = JSON.stringify(options);

         return _HttpAPI.HttpAPI.put(url, config).then(function (result) {
            if (result.success) {
               _this8.fireEvent('UPDATE_MQTT', result);
               return result;
            } else {
               throw result.message;
            }
         }, function (error_message) {
            throw error_message;
         });
      }
   }, {
      key: 'getCrs',
      value: function getCrs() {
         var _this9 = this;

         var url = this.server.getUrl() + 'wa/istsos/services/' + this.serviceName + '/configsections/geo';

         var config = {};
         if (this.server.getLoginConfig()) {
            config['headers'] = this.server.getLoginConfig();
         }

         return _HttpAPI.HttpAPI.get(url, config).then(function (result) {
            if (result.success) {
               _this9.fireEvent('CRS', result);
               return result;
            } else {
               throw result.message;
            }
         }, function (error_message) {
            throw error_message;
         });
      }
   }, {
      key: 'updateCrs',
      value: function updateCrs() {
         var _this10 = this;

         var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

         // var data = {
         //    "zaxisname": z_axis_name || "",
         //    "xaxisname": x_axis_name || "",
         //    "yaxisname": y_axis_name || "",
         //    "allowedepsg": allowedEpsg.toString() || "",
         //    "istsosepsg": istsosEpsg.toString() || ""
         // };
         var url = this.server.getUrl() + 'wa/istsos/services/' + this.serviceName + '/configsections/geo';

         var config = {};
         if (this.server.getLoginConfig()) {
            config['headers'] = this.server.getLoginConfig();
         }
         config['data'] = JSON.stringify(options);

         return _HttpAPI.HttpAPI.put(url, config).then(function (result) {
            if (result.success) {
               _this10.fireEvent('UPDATE_CRS', result);
               return result;
            } else {
               throw result.message;
            }
         }, function (error_message) {
            throw error_message;
         });
      }
   }, {
      key: 'getObservationConf',
      value: function getObservationConf() {
         var _this11 = this;

         var url = this.server.getUrl() + 'wa/istsos/services/' + this.serviceName + '/configsections/getobservation';

         var config = {};
         if (this.server.getLoginConfig()) {
            config['headers'] = this.server.getLoginConfig();
         }

         return _HttpAPI.HttpAPI.get(url, config).then(function (result) {
            if (result.success) {
               _this11.fireEvent('OBSERVATION_CONF', result);
               return result;
            } else {
               throw result.message;
            }
         }, function (error_message) {
            throw error_message;
         });
      }
   }, {
      key: 'updateObservationConf',
      value: function updateObservationConf() {
         var _this12 = this;

         var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

         // var data = {
         //    "correct_qi": correctQi || "",
         //    "stat_qi": statQi || "",
         //    "defaultqi": defaultQi || "",
         //    "aggregatenodataqi": aggregateNoDataQi || "",
         //    "maxgoperiod": maxGoPeriod || "",
         //    "transactional_log": transactionalLog || "",
         //    "aggregatenodata": aggregateNoData || ""
         // };
         var url = this.server.getUrl() + 'wa/istsos/services/' + this.serviceName + '/configsections/getobservation';

         var config = {};
         if (this.server.getLoginConfig()) {
            config['headers'] = this.server.getLoginConfig();
         }
         config['data'] = JSON.stringify(options);

         return _HttpAPI.HttpAPI.put(url, config).then(function (result) {
            if (result.success) {
               _this12.fireEvent('UPDATE_OBSERVATION_CONF', result);
               return result;
            } else {
               throw result.message;
            }
         }, function (error_message) {
            throw error_message;
         });
      }
   }, {
      key: 'getProxy',
      value: function getProxy() {
         var _this13 = this;

         var url = this.server.getUrl() + 'wa/istsos/services/' + this.serviceName + '/configsections/serviceurl';

         var config = {};
         if (this.server.getLoginConfig()) {
            config['headers'] = this.server.getLoginConfig();
         }

         return _HttpAPI.HttpAPI.get(url, config).then(function (result) {
            if (result.success) {
               _this13.fireEvent('PROXY', result);
               return result;
            } else {
               throw result.message;
            }
         }, function (error_message) {
            throw error_message;
         });
      }
   }, {
      key: 'updateProxy',
      value: function updateProxy() {
         var _this14 = this;

         var newUrl = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";

         var data = {
            "url": newUrl || ""
         };
         var url = this.server.getUrl() + 'wa/istsos/services/' + this.serviceName + '/configsections/serviceurl';

         var config = {};
         if (this.server.getLoginConfig()) {
            config['headers'] = this.server.getLoginConfig();
         }
         config['data'] = JSON.stringify(data);

         return _HttpAPI.HttpAPI.put(url, config).then(function (result) {
            if (result.success) {
               _this14.fireEvent('UPDATE_PROXY', result);
               return result;
            } else {
               throw result.message;
            }
         }, function (error_message) {
            throw error_message;
         });
      }
   }, {
      key: 'getEpsgCodes',
      value: function getEpsgCodes() {
         var _this15 = this;

         var url = this.server.getUrl() + 'wa/istsos/services/' + this.serviceName + '/epsgs';

         var config = {};
         if (this.server.getLoginConfig()) {
            config['headers'] = this.server.getLoginConfig();
         }

         return _HttpAPI.HttpAPI.get(url, config).then(function (result) {
            if (result.success) {
               _this15.fireEvent('EPSG_CODES', result);
               return result;
            } else {
               throw result.message;
            }
         }, function (error_message) {
            throw error_message;
         });
      }
   }]);

   return Configuration;
}(_EventEmitter2.EventEmitter);

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
   value: true
});
exports.ProcedureBase = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _EventEmitter2 = __webpack_require__(1);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/** istsos.ProcedureBase class - ABSTRACT */
/**
 * @param {String} name
 * @param {String} description
 * @param {String} keywords
 * @param {String} foi_name
 * @param {int} epsg
 * @param {int} x
 * @param {int} y
 * @param {int} z
 * @param {Array<istsos.Output>} outputs
 * @constructor
 */
var ProcedureBase = exports.ProcedureBase = function (_EventEmitter) {
   _inherits(ProcedureBase, _EventEmitter);

   function ProcedureBase(options) {
      _classCallCheck(this, ProcedureBase);

      var _this = _possibleConstructorReturn(this, (ProcedureBase.__proto__ || Object.getPrototypeOf(ProcedureBase)).call(this));

      _this.name = options.name;
      _this.description = options.description || "";
      _this.keywords = options.keywords || "";
      _this.foi_name = options.foi_name;
      _this.epsg = options.epsg;
      _this.coordinates = [options.x, options.y, options.z];
      _this.outputs = options.outputs || [];
      return _this;
   }

   _createClass(ProcedureBase, [{
      key: "fireEvent",
      value: function fireEvent(eventType, response) {
         _get(ProcedureBase.prototype.__proto__ || Object.getPrototypeOf(ProcedureBase.prototype), "fire", this).call(this, eventType, response);
      }
   }, {
      key: "on",
      value: function on(event, callback) {
         _get(ProcedureBase.prototype.__proto__ || Object.getPrototypeOf(ProcedureBase.prototype), "on", this).call(this, event, callback);
      }
   }, {
      key: "once",
      value: function once(event, callback) {
         _get(ProcedureBase.prototype.__proto__ || Object.getPrototypeOf(ProcedureBase.prototype), "once", this).call(this, event, callback);
      }
   }, {
      key: "off",
      value: function off(event, callback) {
         _get(ProcedureBase.prototype.__proto__ || Object.getPrototypeOf(ProcedureBase.prototype), "off", this).call(this, event, callback);
      }
   }, {
      key: "unlistenAll",
      value: function unlistenAll() {
         _get(ProcedureBase.prototype.__proto__ || Object.getPrototypeOf(ProcedureBase.prototype), "unlistenAll", this).call(this, event, callback);
      }

      /**
       * @returns {Array<istsos.Output>}
       */

   }, {
      key: "getOutputsProperty",
      value: function getOutputsProperty() {
         return this.outputs;
      }

      /**
       * @returns {JSON}
       */

   }, {
      key: "getProcedureBaseJSON",
      value: function getProcedureBaseJSON() {
         var procedureBaseJSON = {
            "system_id": this.name,
            "system": this.name,
            "description": this.description,
            "keywords": this.keywords,
            "location": {
               "type": "Feature",
               "geometry": {
                  "type": "Point",
                  "coordinates": this.coordinates.toString().split(",")
               },
               "crs": {
                  "type": "name",
                  "properties": {
                     "name": this.epsg.toString()
                  }
               },
               "properties": {
                  "name": this.foi_name
               }
            },
            "outputs": [{
               "name": "Time",
               "definition": "urn:ogc:def:parameter:x-istsos:1.0:time:iso8601",
               "uom": "iso8601",
               "description": "",
               "constraint": {}
            }],
            "inputs": [],
            "history": [],
            "contacts": [],
            "documentation": [],
            "capabilities": []
         };
         this.outputs.forEach(function (out) {
            procedureBaseJSON["outputs"].push(out.getOutputJSON());
         });
         return procedureBaseJSON;
      }

      /**
       * @param {String} individualName
       * @param {String} voice
       * @param {String} fax
       * @param {String} email
       * @param {String} web
       * @param {String} deliveryPoint
       * @param {String} city
       * @param {String} administrativeArea
       * @param {String} postalCode
       * @param {String} country
       * @returns {JSON}
       */

   }, {
      key: "createContactForm",
      value: function createContactForm(options) {
         return {
            "individualName": options.individualName || "",
            "voice": options.voice || "",
            "fax": options.fax || "",
            "email": options.email || "",
            "web": options.web || "",
            "deliveryPoint": options.deliveryPoint || "",
            "city": options.city || "",
            "administrativeArea": options.administrativeArea || "",
            "postalCode": options.postalCode || "",
            "country": options.country || ""
         };
      }

      /**
       * @returns {Array<String>}
       */

   }, {
      key: "getCapabilitiesUom",
      value: function getCapabilitiesUom() {
         return ["µs", "ms", "s", "min", "h", "d"];
      }

      /**
       * @returns {Array<JSON>}
       */

   }, {
      key: "getCapabilitiesJson",
      value: function getCapabilitiesJson() {
         return [{
            "name": "Memory Capacity",
            "definition": "urn:x-ogc:def:classifier:x-istsos:1.0:memoryCapacity",
            "uom": "Byte",
            "combo": "Memory Capacity (Byte)"
         }, {
            "name": "Battery Current",
            "definition": "urn:x-ogc:def:phenomenon:x-istsos:1.0:batteryCurrent",
            "uom": "A.h",
            "combo": "Battery Current (A.h)"
         }];
      }

      /**
       * @returns {Array<JSON>}
       */

   }, {
      key: "getIdentificationNames",
      value: function getIdentificationNames() {
         return [{
            "name": "Short Name",
            "definition": "urn:x-ogc:def:identifier:x-istsos:1.0:shortName"
         }, {
            "name": "Long Name",
            "definition": "urn:x-ogc:def:identifier:x-istsos:1.0:longName"
         }, {
            "name": "Manufacturer Name",
            "definition": "urn:x-ogc:def:identifier:x-istsos:1.0:manufacturerName"
         }, {
            "name": "Model Number",
            "definition": "urn:x-ogc:def:identifier:x-istsos:1.0:modelNumber"
         }, {
            "name": "Serial Number",
            "definition": "urn:x-ogc:def:identifier:x-istsos:1.0:serialNumber"
         }, {
            "name": "Device ID",
            "definition": "urn:x-ogc:def:identifier:x-istsos:1.0:deviceID"
         }];
      }
   }]);

   return ProcedureBase;
}(_EventEmitter2.EventEmitter);

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
   value: true
});

/**
 * Event types recognized by IstSOS core JavaScript library
 * @type {Object}
 */
var EventTypes = exports.EventTypes = {
   LOGIN: 'loginReceived',
   ABOUT: 'aboutReceived',
   STATUS: 'statusReceived',
   CONFIGSECTIONS: 'configSectionsReceived',
   PROVIDER: 'providerReceived',
   UPDATE_PROVIDER: 'PUT ProviderReceived',
   IDENTIFICATION: 'identificationReceived',
   UPDATE_IDENTIFICATION: 'PUT identificationReceived',
   MQTT: 'mqttReceived',
   UPDATE_MQTT: 'PUT mqttReceived',
   CRS: 'crsReceived',
   UPDATE_CRS: 'PUT crsReceived',
   OBSERVATION_CONF: 'observationConfigurationReceived',
   UPDATE_OBSERVATION_CONF: 'PUT observationConfigurationReceived',
   PROXY: 'proxyReceived',
   UPDATE_PROXY: 'PUT proxyReceived',
   SERVICE: 'serviceReceived',
   SERVICES: 'servicesListReceived',
   NEW_SERVICE: 'POST serviceReceived',
   DELETE_SERVICE: 'DELETE serviceReceived',
   DATABASE: 'databaseReceived',
   UPDATE_DATABASE: 'PUT databaseReceived',
   VALIDATE_DB: 'POST validateDbReceived',
   EPSG_CODES: 'epsgsReceived',
   SYSTEM_TYPES: 'systemTypesReceived',
   NEW_OFFERING: 'POST offeringReceived',
   OFFERING_NAMES: 'offeringNamesReceived',
   OFFERING_LIST: 'offeringListReceived',
   DELETE_OFFERING: 'DELETE offeringReceived',
   UPDATE_OFFERING: 'PUT offeringReceived',
   MEMBERLIST: 'memberlistReceived',
   NONMEMBERLIST: 'nonmemberlistReceived',
   OBSERVED_PROPERTIES: 'observedPropertiesReceived',
   OBSERVED_PROPERTY: 'observedPropertyReceived',
   NEW_OBSERVED_PROPERTY: 'POST observedPropertyReceived',
   UPDATE_OBSERVED_PROPERTY: 'PUT observedPropertyReceived',
   DELETE_OBSERVED_PROPERTY: 'DELETE observedPropertyReceived',
   DATAQUALITIES: 'dataQualitiesReceived',
   DATAQUALITY: 'dataQualityReceived',
   NEW_DATAQUALITY: 'POST dataQualityReceived',
   UPDATE_DATAQUALITY: 'PUT dataQualityReceived',
   DELETE_DATAQUALITY: 'DELETE dataQualityReceived',
   UOM: 'unitOfMeasureReceived',
   UOMS: 'unitsOfMeasureReceived',
   NEW_UOM: 'POST unitOfMeasureReceived',
   UPDATE_UOM: 'PUT unitOfMeasureReceived',
   DELETE_UOM: 'DELETE unitOfMeasureReceived',
   GET_CODE: 'codeReceived',
   NEW_CODE: 'POST codeReceived',
   UPDATE_CODE: 'PUT codeReceived',
   DELETE_CODE: 'DELETE codeReceived',
   RATING_CURVE: 'ratingCurveReceived',
   NEW_RATING_CURVE: 'POST ratingCurveReceived',
   DELETE_RATING_CURVE: 'DELETE ratingCurveReceived',
   NEW_PROCEDURE: 'POST procedureReceived',
   UPDATE_PROCEDURE: 'PUT procedureReceived',
   DELETE_PROCEDURE: 'DELETE procedureReceived',
   ADD_TO_OFFERING: 'POST addToOfferingReceived',
   REMOVE_FROM_OFFERING: 'DELETE removeFromOfferingReceived',
   VIRTUAL_PROCEDURES: 'virtualProceduresReceived',
   VIRTUAL_PROCEDURE: 'virtualProcedureReceived',
   NEW_VIRTUAL_PROCEDURE: 'POST virtualProcedureReceived',
   UPDATE_V_PROCEDURE: 'PUT virtualProcedureReceived',
   DELETE_V_PROCEDURE: 'DELETE virtualProcedureReceived',
   PROCEDURES: 'proceduresReceived',
   PROCEDURE: 'procedureReceived',
   GEOJSON: 'geojsonReceived',
   GETOBSERVATIONS: 'getobservationsReceived',
   GETOBSERVATIONS_AGG: 'getobservationsAggregationReceived',
   GETOBSERVATIONS_BY_PROPERTY: 'getobservationsDataReceived',
   GETOBSERVATIONS_BY_QUALITY: 'getObservationsByQualityIndexReceived'
};

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
   value: true
});
exports.Offering = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _HttpAPI = __webpack_require__(0);

var _EventEmitter2 = __webpack_require__(1);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/** istsos.Offering class */
/**
 * @param {String} offeringName
 * @param {String} offeringDescription
 * @param {boolean} active
 * @param {istsos.Date} expirationDate
 * @param {istsos.Service} service
 * @constructor
 */

var Offering = exports.Offering = function (_EventEmitter) {
   _inherits(Offering, _EventEmitter);

   function Offering(options) {
      _classCallCheck(this, Offering);

      var _this = _possibleConstructorReturn(this, (Offering.__proto__ || Object.getPrototypeOf(Offering)).call(this));

      _this.offeringName = options.offeringName;
      _this.offeringDescription = options.offeringDescription || "";
      _this.active = options.active || false;
      _this.expirationDate = options.expirationDate && options.expirationDate.constructor === istsos.Date ? options.expirationDate.getDateString() : "";
      _this.service = options.service;
      _this.memberProcedures = [];
      service.addOffering(_this);
      return _this;
   }

   /**
    * @param {String} url
    * @param {istsos.events.EventType} eventType
    * @param {String} method
    * @param {JSON} opt_data
    */

   _createClass(Offering, [{
      key: 'fireEvent',
      value: function fireEvent(eventType, response) {
         _get(Offering.prototype.__proto__ || Object.getPrototypeOf(Offering.prototype), 'fire', this).call(this, eventType, response);
      }
   }, {
      key: 'on',
      value: function on(event, callback) {
         _get(Offering.prototype.__proto__ || Object.getPrototypeOf(Offering.prototype), 'on', this).call(this, event, callback);
      }
   }, {
      key: 'once',
      value: function once(event, callback) {
         _get(Offering.prototype.__proto__ || Object.getPrototypeOf(Offering.prototype), 'once', this).call(this, event, callback);
      }
   }, {
      key: 'off',
      value: function off(event, callback) {
         _get(Offering.prototype.__proto__ || Object.getPrototypeOf(Offering.prototype), 'off', this).call(this, event, callback);
      }
   }, {
      key: 'unlistenAll',
      value: function unlistenAll() {
         _get(Offering.prototype.__proto__ || Object.getPrototypeOf(Offering.prototype), 'unlistenAll', this).call(this, event, callback);
      }

      /**
       * @param {istsos.Procedure|istsos.VirtualProcedure} procedure
       */

   }, {
      key: 'addProcedure',
      value: function addProcedure(procedure) {
         this.memberProcedures.push(procedure);
      }

      /**
       * @fires istsos.Offering#istsos.events.EventType: UPDATE_OFFFERING
       * @param {String} newName
       * @param {String} newDescription
       * @param {boolean} newActive
       * @param {istsos.Date} newExpirationDate
       */

   }, {
      key: 'updateOffering',
      value: function updateOffering(options) {
         var _this2 = this;

         var oldOfferingName = this.offeringName;
         this.offeringName = options.newName || this.offeringName;
         this.offeringDescription = options.newDescription || this.offeringDescription;
         this.active = options.newActive || this.active;
         this.expirationDate = options.newExpirationDate || this.expirationDate;

         var url = this.service.server.getUrl() + 'wa/istsos/services/' + this.service.getServiceJSON()["service"] + '/offerings/' + oldOfferingName;

         var config = {};
         if (this.service.server.getLoginConfig()) {
            config['headers'] = this.service.server.getLoginConfig();
         }
         config['data'] = JSON.stringify(this.getUomJSON());

         return _HttpAPI.HttpAPI.put(url, config).then(function (result) {
            if (result.success) {
               _this2.fireEvent('UPDATE_OFFERING', result);
               return result;
            } else {
               throw result.message;
            }
         }, function (error_message) {
            throw error_message;
         });
      }

      /**
       * @fires istsos.Offering#istsos.events.EventType: DELETE_OFFERING
       */

   }, {
      key: 'deleteOffering',
      value: function deleteOffering() {
         var _this3 = this;

         for (var i = 0; i < this.service.getOfferingsProperty().length; i++) {
            if (this.offeringName === this.service.getOfferingsProperty()[i]["name"]) {
               this.service.getOfferingsProperty().splice(i, 1);
            }
         }
         var url = this.service.server.getUrl() + 'wa/istsos/services/' + this.service.getServiceJSON()["service"] + '/offerings/' + this.getOfferingJSON()["name"];

         var data = {
            "name": this.getOfferingJSON()["name"],
            "description": this.getOfferingJSON()["description"]
         };

         var config = {};
         if (this.service.server.getLoginConfig()) {
            config['headers'] = this.service.server.getLoginConfig();
         }
         config['data'] = JSON.stringify(data);

         return _HttpAPI.HttpAPI.delete(url, config).then(function (result) {
            if (result.success) {
               _this3.fireEvent('DELETE_OFFERING', result);
               return result;
            } else {
               throw result.message;
            }
         }, function (error_message) {
            throw error_message;
         });
      }

      /**
       * @returns {Array<istsos.Procedure|istsos.VirtualProcedure>}
       */

   }, {
      key: 'getMemberProceduresProperty',
      value: function getMemberProceduresProperty() {
         return this.memberProcedures;
      }

      /**
       * @fires istsos.Offering#istsos.events.EventType: MEMBERLIST
       */

   }, {
      key: 'getMemberProcedures',
      value: function getMemberProcedures() {
         var _this4 = this;

         var url = this.service.server.getUrl() + 'wa/istsos/services/' + this.service.getServiceJSON()["service"] + '/offerings/' + this.getOfferingJSON()["name"] + '/procedures/operations/memberslist';

         var config = {};
         if (this.service.server.getLoginConfig()) {
            config['headers'] = this.service.server.getLoginConfig();
         }

         return _HttpAPI.HttpAPI.get(url, config).then(function (result) {
            if (result.success) {
               _this4.fireEvent('MEMBERLIST', result);
               return result;
            } else {
               throw result.message;
            }
         }, function (error_message) {
            throw error_message;
         });
      }

      /**
       * @fires istsos.Offering#istsos.events.EventType: NONMEMBERLIST
       */

   }, {
      key: 'getNonMemberProcedures',
      value: function getNonMemberProcedures() {
         var _this5 = this;

         var url = this.service.server.getUrl() + 'wa/istsos/services/' + this.service.getServiceJSON()["service"] + '/offerings/' + this.getOfferingJSON()["name"] + '/procedures/operations/nonmemberslist';

         var config = {};
         if (this.service.server.getLoginConfig()) {
            config['headers'] = this.service.server.getLoginConfig();
         }

         return _HttpAPI.HttpAPI.get(url, config).then(function (result) {
            if (result.success) {
               _this5.fireEvent('NONMEMBERLIST', result);
               return result;
            } else {
               throw result.message;
            }
         }, function (error_message) {
            throw error_message;
         });
      }

      /**
       * @returns {JSON}
       */

   }, {
      key: 'getOfferingJSON',
      value: function getOfferingJSON() {
         var offeringJSON = {
            "name": this.offeringName,
            "description": this.offeringDescription,
            "expiration": this.expirationDate
         };
         if (this.active === true) {
            offeringJSON["active"] = "on";
         }
         return offeringJSON;
      }
   }]);

   return Offering;
}(_EventEmitter2.EventEmitter);

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
   value: true
});
exports.DataQuality = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _HttpAPI = __webpack_require__(0);

var _EventEmitter2 = __webpack_require__(1);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/** istsos.DataQuality class */
/**
 * @param {istsos.Service} service
 * @param {int} codeDQ
 * @param {String} nameDQ
 * @param {String} descrDQ
 * @constructor
 */
var DataQuality = exports.DataQuality = function (_EventEmitter) {
   _inherits(DataQuality, _EventEmitter);

   function DataQuality(options) {
      _classCallCheck(this, DataQuality);

      var _this = _possibleConstructorReturn(this, (DataQuality.__proto__ || Object.getPrototypeOf(DataQuality)).call(this));

      _this.code = options.codeDQ;
      _this.name = options.nameDQ;
      _this.description = options.descrDQ || "";
      _this.service = options.service;
      service.addDataQuality(_this);
      return _this;
   }

   _createClass(DataQuality, [{
      key: 'fireEvent',
      value: function fireEvent(eventType, response) {
         _get(DataQuality.prototype.__proto__ || Object.getPrototypeOf(DataQuality.prototype), 'fire', this).call(this, eventType, response);
      }
   }, {
      key: 'on',
      value: function on(event, callback) {
         _get(DataQuality.prototype.__proto__ || Object.getPrototypeOf(DataQuality.prototype), 'on', this).call(this, event, callback);
      }
   }, {
      key: 'once',
      value: function once(event, callback) {
         _get(DataQuality.prototype.__proto__ || Object.getPrototypeOf(DataQuality.prototype), 'once', this).call(this, event, callback);
      }
   }, {
      key: 'off',
      value: function off(event, callback) {
         _get(DataQuality.prototype.__proto__ || Object.getPrototypeOf(DataQuality.prototype), 'off', this).call(this, event, callback);
      }
   }, {
      key: 'unlistenAll',
      value: function unlistenAll() {
         _get(DataQuality.prototype.__proto__ || Object.getPrototypeOf(DataQuality.prototype), 'unlistenAll', this).call(this, event, callback);
      }

      /**
       * @returns {JSON}
       */

   }, {
      key: 'getDataQualityJSON',
      value: function getDataQualityJSON() {
         var dqJSON = {
            "code": this.code.toString(),
            "name": this.name,
            "description": this.description
         };
         return dqJSON;
      }

      /**
       * @fires istsos.DataQuality#istsos.events.EventType: UPDATE_DATAQUALITY
       * @param {int} newCodeDQ
       * @param {String} newNameDQ
       * @param {String} newDescrDQ
       */

   }, {
      key: 'updateDataQuality',
      value: function updateDataQuality(options) {
         var _this2 = this;

         var oldName = this.code;
         this.code = options.newCodeDQ || this.code;
         this.name = options.newNameDQ || this.name;
         this.description = options.newDescrDQ || this.description;

         var url = this.service.server.getUrl() + 'wa/istsos/services/' + this.service.getServiceJSON()["service"] + '/dataqualities/' + oldName;

         var config = {};
         if (this.service.server.getLoginConfig()) {
            config['headers'] = this.service.server.getLoginConfig();
         }
         config['data'] = JSON.stringify(this.getDataQualityJSON());

         return _HttpAPI.HttpAPI.put(url, config).then(function (result) {
            if (result.success) {
               _this2.fireEvent('UPDATE_DATAQUALITY', result);
               return result;
            } else {
               throw result.message;
            }
         }, function (error_message) {
            throw error_message;
         });
      }

      /**
       * @fires istsos.DataQuality#istsos.events.EventType: DELETE_DATAQUALITY
       */

   }, {
      key: 'deleteDataQuality',
      value: function deleteDataQuality() {
         var _this3 = this;

         var dataQualities = this.service.getDataQualitiesProperty();
         for (var i = 0; i < dataQualities.length; i++) {
            if (this.code === dataQualities[i]["code"]) {
               dataQualities.splice(i, 1);
            }
         }

         var url = this.service.server.getUrl() + 'wa/istsos/services/' + this.service.getServiceJSON()["service"] + '/dataqualities/' + this.getDataQualityJSON()["code"];

         var config = {};
         if (this.service.server.getLoginConfig()) {
            config['headers'] = this.service.server.getLoginConfig();
         }
         config['data'] = JSON.stringify(this.getDataQualityJSON());

         return _HttpAPI.HttpAPI.delete(url, config).then(function (result) {
            if (result.success) {
               _this3.fireEvent('DELETE_DATAQUALITY', result);
               return result;
            } else {
               throw result.message;
            }
         }, function (error_message) {
            throw error_message;
         });
      }
   }]);

   return DataQuality;
}(_EventEmitter2.EventEmitter);

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
   value: true
});
exports.Database = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _HttpAPI = __webpack_require__(0);

var _EventEmitter2 = __webpack_require__(1);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @class istsos.Database
 */
var Database = exports.Database = function (_EventEmitter) {
   _inherits(Database, _EventEmitter);

   function Database(options) {
      _classCallCheck(this, Database);

      var _this = _possibleConstructorReturn(this, (Database.__proto__ || Object.getPrototypeOf(Database)).call(this));

      _this.dbname = options.dbname;
      _this.host = options.host;
      _this.user = options.user;
      _this.password = options.password;
      _this.port = options.port;
      return _this;
   }

   _createClass(Database, [{
      key: 'fireEvent',
      value: function fireEvent(eventType, response) {
         _get(Database.prototype.__proto__ || Object.getPrototypeOf(Database.prototype), 'fire', this).call(this, eventType, response);
      }
   }, {
      key: 'on',
      value: function on(event, callback) {
         _get(Database.prototype.__proto__ || Object.getPrototypeOf(Database.prototype), 'on', this).call(this, event, callback);
      }
   }, {
      key: 'once',
      value: function once(event, callback) {
         _get(Database.prototype.__proto__ || Object.getPrototypeOf(Database.prototype), 'once', this).call(this, event, callback);
      }
   }, {
      key: 'off',
      value: function off(event, callback) {
         _get(Database.prototype.__proto__ || Object.getPrototypeOf(Database.prototype), 'off', this).call(this, event, callback);
      }
   }, {
      key: 'unlistenAll',
      value: function unlistenAll() {
         _get(Database.prototype.__proto__ || Object.getPrototypeOf(Database.prototype), 'unlistenAll', this).call(this, event, callback);
      }
   }, {
      key: 'getDb',
      value: function getDb() {
         var _this2 = this;

         var serviceName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'default';
         var server = arguments[1];

         var url = server.getUrl() + 'wa/istsos/services/' + serviceName + '/configsections/connection';

         var config = {};
         if (server.getLoginConfig()) {
            config['headers'] = server.getLoginConfig();
         }

         return _HttpAPI.HttpAPI.get(url, config).then(function (result) {
            if (result.success) {
               _this2.fireEvent('DATABASE', result);
               return result;
            } else {
               throw result.message;
            }
         }, function (error_message) {
            throw error_message;
         });
      }
   }, {
      key: 'setDb',
      value: function setDb(server, service, options) {
         var _this3 = this;

         this.dbname = options.dbname || this.dbname;
         this.host = options.host || this.host;
         this.password = options.password || this.password;
         this.port = options.port || this.port;
         var serviceName = service ? service.getServiceJSON()["service"] : "default";

         var url = server.getUrl() + 'wa/istsos/services/' + serviceName + '/configsections/connection';

         var config = {};
         if (server.getLoginConfig()) {
            config['headers'] = server.getLoginConfig();
         }
         config['data'] = JSON.stringify(this.getDbJSON());

         return _HttpAPI.HttpAPI.put(url, config).then(function (result) {
            if (result.success) {
               _this3.fireEvent('UPDATE_DATABASE', result);
               return result;
            } else {
               throw result.message;
            }
         }, function (error_message) {
            throw error_message;
         });
      }
   }, {
      key: 'validateDb',
      value: function validateDb(server) {
         var _this4 = this;

         var url = server.getUrl() + 'wa/istsos/operations/validatedb';

         var config = {};
         if (server.getLoginConfig()) {
            config['headers'] = server.getLoginConfig();
         }
         config['data'] = JSON.stringify(this.getDbJSON());

         return _HttpAPI.HttpAPI.post(url, config).then(function (result) {
            if (result.success) {
               _this4.fireEvent('VALIDATE_DB', result);
               return result;
            } else {
               throw result.message;
            }
         }, function (error_message) {
            throw error_message;
         });
      }
   }, {
      key: 'getDbJSON',
      value: function getDbJSON() {
         return {
            "dbname": this.dbname,
            "host": this.host,
            "user": this.user,
            "password": this.password,
            "port": this.port.toString()
         };
      }
   }]);

   return Database;
}(_EventEmitter2.EventEmitter);

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @class istsos.Date
 */
var Date = exports.Date = function () {

  /**
   * constructor - Instantiates istsos.Date
   *
   * @param {Object} options Set of key-value pairs
   * @constructor
   */
  function Date(options) {
    _classCallCheck(this, Date);

    this.year = options.year.toString();
    this.month = options.month > 9 ? options.month.toString() : "0" + options.month.toString();
    this.day = options.day > 9 ? options.day.toString() : "0" + options.day.toString();
    this.hours = options.hours > 9 ? options.hours.toString() : "0" + options.hours.toString();
    this.minutes = options.minutes > 9 ? options.minutes.toString() : "0" + options.minutes.toString();
    this.seconds = options.seconds > 9 ? options.seconds.toString() : "0" + options.seconds.toString();
    this.gmt = options.gmt > 9 ? options.gmt.toString() : "0" + options.gmt.toString();
    this.description = options.opt_description || "Class for converting date&time to proper istSOS format";
  }

  /**
   * getDateString - Get date in ISO 8601 format
   *
   * @return {String}  ISO 8601 date
   */


  _createClass(Date, [{
    key: "getDateString",
    value: function getDateString() {
      return this.year + "-" + this.month + "-" + this.day + "T" + this.hours + ":" + this.minutes + ":" + this.seconds + "+" + this.gmt + ":00";
    }

    /**
     * getDescription - Get description
     *
     * @return {String}  Description   
     */

  }, {
    key: "getDescription",
    value: function getDescription() {
      return this.description;
    }
  }]);

  return Date;
}();

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.ObservedProperty = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _HttpAPI = __webpack_require__(0);

var _EventEmitter2 = __webpack_require__(1);

var _IstsosHelper = __webpack_require__(2);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/** istsos.ObservedProperty class */
/**
 * @param {istsos.Service} service
 * @param {String} observedName
 * @param {String} definitionUrn
 * @param {String} observedDescr
 * @param {String} opt_constraintType (allowed_values:"between", "lessThan", "greaterThan", "valueList")
 * @param {Array|int} opt_value (Array or integer, depending on constraint type)
 * @constructor
 */

var ObservedProperty = exports.ObservedProperty = function (_EventEmitter) {
	_inherits(ObservedProperty, _EventEmitter);

	function ObservedProperty(options) {
		_classCallCheck(this, ObservedProperty);

		var _this = _possibleConstructorReturn(this, (ObservedProperty.__proto__ || Object.getPrototypeOf(ObservedProperty)).call(this));

		_this.observedName = options.observedName;
		_this.definitionUrn = options.definitionUrn;
		_this.observedDescr = options.observedDescr || "";
		_this.constraint = null;
		var check = (0, _IstsosHelper.validateConstraintInput)(options.constraintType, options.value);
		if (check === true) {
			_this.constraint = {};
			_this.constraint["role"] = "urn:x-ogc:def:classifiers:x-istsos:1.0:qualityIndexCheck:level0";
			_this.constraint[_IstsosHelper.ConstraintInputs[options.constraintType]] = options.value.constructor === Array ? options.value.toString().split(",") : options.value.toString();
		} else {
			console.log('Input constraintType and constraintValue for property <' + _this.observedName.toUpperCase() + '> are INCORRECT or INTENTIONALLY NULL!!! ');
		}
		_this.service = options.service;
		_this.proceduresIncluded = [];
		_this.updateProceduresIncluded();
		service.addObservedProperty(_this);
		return _this;
	}

	_createClass(ObservedProperty, [{
		key: 'fireEvent',
		value: function fireEvent(eventType, response) {
			_get(ObservedProperty.prototype.__proto__ || Object.getPrototypeOf(ObservedProperty.prototype), 'fire', this).call(this, eventType, response);
		}
	}, {
		key: 'on',
		value: function on(event, callback) {
			_get(ObservedProperty.prototype.__proto__ || Object.getPrototypeOf(ObservedProperty.prototype), 'on', this).call(this, event, callback);
		}
	}, {
		key: 'once',
		value: function once(event, callback) {
			_get(ObservedProperty.prototype.__proto__ || Object.getPrototypeOf(ObservedProperty.prototype), 'once', this).call(this, event, callback);
		}
	}, {
		key: 'off',
		value: function off(event, callback) {
			_get(ObservedProperty.prototype.__proto__ || Object.getPrototypeOf(ObservedProperty.prototype), 'off', this).call(this, event, callback);
		}
	}, {
		key: 'unlistenAll',
		value: function unlistenAll() {
			_get(ObservedProperty.prototype.__proto__ || Object.getPrototypeOf(ObservedProperty.prototype), 'unlistenAll', this).call(this, event, callback);
		}
	}, {
		key: 'updateProceduresIncluded',
		value: function updateProceduresIncluded() {
			var procedures = this.service.getProceduresProperty();
			var v_procedures = this.service.getVirtualProceduresProperty();
			var all = procedures.concat(v_procedures);
			var name = this.observedName;
			if (all.length !== 0) {
				for (var i = 0; i < all.length; i++) {
					for (var j = 0; j < all[i].getOutputsProperty().length; j++) {
						if (name = all[i].getOutputsProperty()[j]["name"]) {
							this.getProceduresIncluded().push(all[i]);
						}
					}
				}
			}
		}

		/**
   * @returns {Array<istsos.Procedure|istsos.VirtualProcedure>}
   */

	}, {
		key: 'getProceduresIncluded',
		value: function getProceduresIncluded() {
			return this.proceduresIncluded;
		}

		/**
   * @returns {JSON}
   */

	}, {
		key: 'getObservedPropertyJSON',
		value: function getObservedPropertyJSON() {
			var observedJSON = {
				"name": this.observedName,
				"definition": this.definitionUrn,
				"description": this.observedDescr,
				"constraint": this.constraint
			};
			return observedJSON;
		}

		/**
   * @fires istsos.ObservedProperty#istsos.events.EventType: UPDATE_OBSERVED_PROPERTY
   * @param {String} newPropertyName
   * @param {String} newDefinitionUrn
   * @param {String} newPropertyDescr
   * @param {String} opt_constraintType
   * @param {Array<int>|int} opt_value
   */

	}, {
		key: 'updateObservedProperty',
		value: function updateObservedProperty(options) {
			var _this2 = this;

			var oldDefinitionUrn = this.definitionUrn;
			this.observedName = options.newPropertyName || this.observedName;
			this.definitionUrn = options.newDefinitionUrn || this.definitionUrn;
			this.observedDescr = options.newPropertyName || this.observedDescr;
			if ((0, _IstsosHelper.validateConstraintInput)(options.constraintType, options.value) === true) {
				this.constraint = {};
				this.constraint["role"] = "urn:x-ogc:def:classifiers:x-istsos:1.0:qualityIndexCheck:level0";
				this.constraint[_IstsosHelper.ConstraintInputs[options.constraintType]] = options.value.constructor === Array ? options.value.toString().split(",") : options.value.toString();
			} else {
				console.log('Input constraintType and constraintValue for property <' + this.observedName.toUpperCase() + '> are INCORRECT or INTENTIONALLY NULL!!! ');
			}
			var url = this.service.server.getUrl() + 'wa/istsos/services/' + this.service.getServiceJSON()["service"] + '/observedproperties/' + oldDefinitionUrn;

			var config = {};
			if (this.service.server.getLoginConfig()) {
				config['headers'] = this.service.server.getLoginConfig();
			}
			config['data'] = JSON.stringify(this.getObservedPropertyJSON());

			return _HttpAPI.HttpAPI.put(url, config).then(function (result) {
				if (result.success) {
					_this2.fireEvent('UPDATE_OBSERVED_PROPERTY', result);
					return result;
				} else {
					throw result.message;
				}
			}, function (error_message) {
				throw error_message;
			});
		}

		/**
   * @fires istsos.ObservedProperty#istsos.events.EventType: DELETE_OBSERVED_PROPERTY
   */

	}, {
		key: 'deleteObservedProperty',
		value: function deleteObservedProperty() {
			var _this3 = this;

			var procedures = this.service.getProceduresProperty();
			var v_procedures = this.service.getVirtualProceduresProperty();
			var properties_service = this.service.getObservedPropertiesProperty();
			var all = procedures.concat(v_procedures);
			var outputs = [];
			all.forEach(function (p) {
				outputs.concat(p.getOutputsProperty());
			});
			var name = this.observedName;
			var connected = false;
			for (var i = 0; i < outputs.length; i++) {
				if (name === outputs[i].getOutputJSON()["name"]) {
					alert("CONNECTED TO PROCEDURE");
					connected = true;
					break;
				}
			}
			if (connected === false) {
				for (var j = 0; j < properties_service.length; j++) {
					if (this === properties_service[j]) {
						properties_service.splice(j, 1);
					}
				}
			}
			var url = this.service.server.getUrl() + 'wa/istsos/services/' + this.service.getServiceJSON()["service"] + '/observedproperties/' + this.getObservedPropertyJSON()["definition"];

			var config = {};
			if (this.service.server.getLoginConfig()) {
				config['headers'] = this.service.server.getLoginConfig();
			}
			config['data'] = JSON.stringify(this.getObservedPropertyJSON());

			return _HttpAPI.HttpAPI.delete(url, config).then(function (result) {
				if (result.success) {
					_this3.fireEvent('DELETE_OBSERVED_PROPERTY', result);
					return result;
				} else {
					throw result.message;
				}
			}, function (error_message) {
				throw error_message;
			});
		}
	}]);

	return ObservedProperty;
}(_EventEmitter2.EventEmitter);

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
   value: true
});
exports.Output = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _IstsosHelper = __webpack_require__(2);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/** istsos.Output clas */
/**
 * @param {istsos.ObservedProperty} property
 * @param {istsos.UnitOfMeasure} uom
 * @param {String} description
 * @param {String} opt_constraintType
 * @param {Array|int} opt_constraintValue
 * @constructor
 */
var Output = exports.Output = function () {
   function Output(options) {
      _classCallCheck(this, Output);

      this.observedProperty = options.property;
      this.uom = options.uom;
      this.description = options.description || "";
      this.constraint = {};
      var check = (0, _IstsosHelper.validateConstraintInput)(options.opt_constraintType, options.opt_constraintValue);
      if (check === true) {
         this.constraint["role"] = "urn:ogc:def:classifiers:x-istsos:1.0:qualityIndex:check:reasonable";
         this.constraint[istsos.observedProperty.ConstraintInputs[opt_constraintType]] = opt_constraintValue.constructor === Array ? opt_constraintValue.toString().split(",") : opt_constraintValue.toString();
      } else {
         console.log("Input constraintType and constraintValue are incorrect or intentionally null/undefined!!! ");
      }
   }
   /**
    * @returns {JSON}
    */


   _createClass(Output, [{
      key: "getOutputJSON",
      value: function getOutputJSON() {
         var outputJSON = {
            "name": this.observedProperty.getObservedPropertyJSON()["name"],
            "definition": this.observedProperty.getObservedPropertyJSON()["definition"],
            "uom": this.uom.getUomJSON()["name"],
            "description": this.description || "",
            "constraint": this.constraint
         };
         return outputJSON;
      }
   }]);

   return Output;
}();

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
   value: true
});
exports.Procedure = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _ProcedureBase2 = __webpack_require__(4);

var _HttpAPI = __webpack_require__(0);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/** istsos.Procedure class */
/**
 * @param {istsos.Service} service
 * @param {String} name
 * @param {String} description
 * @param {String} keywords
 * @param {String} foi_name
 * @param {int} epsg
 * @param {int} x
 * @param {int} y
 * @param {int} z
 * @param {Array<istsos.Output>} outputs
 * @param {String} systemType (insitu-fixed-point || insitu-mobile-point)
 * @param {String} sensorType
 * @constructor
 */

var Procedure = exports.Procedure = function (_ProcedureBase) {
   _inherits(Procedure, _ProcedureBase);

   function Procedure(options) {
      _classCallCheck(this, Procedure);

      var _this = _possibleConstructorReturn(this, (Procedure.__proto__ || Object.getPrototypeOf(Procedure)).call(this, {
         name: options.name,
         description: options.description,
         keywords: options.keywords,
         foi_name: options.foi_name,
         epsg: options.epsg,
         x: options.x,
         y: options.y,
         z: options.z,
         outputs: options.outputs
      }));

      _this.systemType = options.systemType === "insitu-fixed-point" || options.systemType === "insitu-mobile-point" ? options.systemType : null;
      _this.sensorType = options.sensorType || "";
      _this.service = options.service;
      _this.service.addProcedure(_this);
      _this.service.getOfferingsProperty()[0].getMemberProceduresProperty().push(_this);
      return _this;
   }

   _createClass(Procedure, [{
      key: 'fireEvent',
      value: function fireEvent(eventType, response) {
         _get(Procedure.prototype.__proto__ || Object.getPrototypeOf(Procedure.prototype), 'fire', this).call(this, eventType, response);
      }
   }, {
      key: 'on',
      value: function on(event, callback) {
         _get(Procedure.prototype.__proto__ || Object.getPrototypeOf(Procedure.prototype), 'on', this).call(this, event, callback);
      }
   }, {
      key: 'once',
      value: function once(event, callback) {
         _get(Procedure.prototype.__proto__ || Object.getPrototypeOf(Procedure.prototype), 'once', this).call(this, event, callback);
      }
   }, {
      key: 'off',
      value: function off(event, callback) {
         _get(Procedure.prototype.__proto__ || Object.getPrototypeOf(Procedure.prototype), 'off', this).call(this, event, callback);
      }
   }, {
      key: 'unlistenAll',
      value: function unlistenAll() {
         _get(Procedure.prototype.__proto__ || Object.getPrototypeOf(Procedure.prototype), 'unlistenAll', this).call(this, event, callback);
      }

      /**
       * @returns {JSON}
       */

   }, {
      key: 'getProcedureJSON',
      value: function getProcedureJSON() {
         var procedureJSON = _get(Procedure.prototype.__proto__ || Object.getPrototypeOf(Procedure.prototype), 'getProcedureBaseJSON', this).call(this);
         procedureJSON["classification"] = [{
            "name": "System Type",
            "definition": "urn:ogc:def:classifier:x-istsos:1.0:systemType",
            "value": this.systemType === "insitu-mobile-point" || this.systemType === "insitu-fixed-point" ? this.systemType : null
         }, {
            "name": "Sensor Type",
            "definition": "urn:ogc:def:classifier:x-istsos:1.0:sensorType",
            "value": this.sensorType
         }];
         return procedureJSON;
      }

      /**
       * @fires istsos.Procedure#istsos.events.EventType: UPDATE_PROCEDURE
       * @param {String} name
       * @param {String} description
       * @param {String} keywords
       * @param {String} foi_name
       * @param {int} epsg
       * @param {int} x
       * @param {int} y
       * @param {int} z
       * @param {Array<istsos.Output>} outputs
       * @param {String} systemType (insitu-fixed-point || insitu-mobile-point)
       * @param {String} sensorType
       */

   }, {
      key: 'updateProcedure',
      value: function updateProcedure(options) {
         var _this2 = this;

         var oldName = this.name;
         this.name = options.name || this.name;
         this.description = options.description || this.description;
         this.keywords = options.keywords || this.keywords;
         this.foi_name = options.foi_name || this.foi_name;
         this.epsg = option.sepsg || this.epsg;
         this.coordinates = [options.x, options.y, options.z] || this.coordinates;
         var outputs_array = this.outputs;
         if (options.outputs || options.outputs.length !== 0) {
            outputs_array.splice(1, outputs_array.length - 1);
            options.outputs.forEach(function (out) {
               outputs_array.push(out);
            });
         }
         this.systemType = options.systemType === "insitu-fixed-point" || options.systemType === "insitu-mobile-point" ? options.systemType : null;
         this.sensorType = options.sensorType || "";

         var url = this.service.server.getUrl() + 'wa/istsos/services/' + this.service.getServiceJSON()["service"] + '/procedures/' + oldName;

         var config = {};
         if (this.service.server.getLoginConfig()) {
            config['headers'] = this.service.server.getLoginConfig();
         }
         config['data'] = JSON.stringify(this.getProcedureJSON());

         return _HttpAPI.HttpAPI.put(url, config).then(function (result) {
            if (result.success) {
               _this2.fireEvent('UPDATE_PROCEDURE', result);
               return result;
            } else {
               throw result.message;
            }
         }, function (error_message) {
            throw error_message;
         });
      }

      /**
       * @fires istsos.Procedure#istsos.events.EventType: DELETE_PROCEDURE
       */

   }, {
      key: 'deleteProcedure',
      value: function deleteProcedure() {
         var _this3 = this;

         var procedures = this.service.getProceduresProperty();
         var obj = this.getProcedureJSON();
         procedures.forEach(function (p) {
            if (p.getProcedureJSON()["system"] === obj["system"]) {
               procedures.splice(procedures.indexOf(p), 1);
            }
         });

         var url = this.service.server.getUrl() + 'wa/istsos/services/' + this.service.getServiceJSON()["service"] + '/procedures/' + this.name;

         var config = {};
         if (this.service.server.getLoginConfig()) {
            config['headers'] = this.service.server.getLoginConfig();
         }

         return _HttpAPI.HttpAPI.delete(url, config).then(function (result) {
            if (result.success) {
               _this3.fireEvent('DELETE_PROCEDURE', result);
               return result;
            } else {
               throw result.message;
            }
         }, function (error_message) {
            throw error_message;
         });
      }

      /**
       * @fires istsos.Procedure#istsos.events.EventType: ADD_TO_OFFERING
       * @param {istsos.Offering} offering
       */

   }, {
      key: 'addMembershipToOffering',
      value: function addMembershipToOffering(offering) {
         var _this4 = this;

         offering.getMemberProceduresProperty().push(this);
         var url = this.service.server.getUrl() + 'wa/istsos/services/' + this.service.getServiceJSON()["service"] + '/offerings/' + offering.getOfferingJSON()["name"] + '/procedures';

         var data = [{
            "offering": offering.getOfferingJSON()["name"],
            "procedure": this.getProcedureJSON()["system"]
         }];

         var config = {};
         if (this.service.server.getLoginConfig()) {
            config['headers'] = this.service.server.getLoginConfig();
         }
         config['data'] = JSON.stringify(data);

         return _HttpAPI.HttpAPI.post(url, config).then(function (result) {
            if (result.success) {
               _this4.fireEvent('ADD_TO_OFFERING', result);
               return result;
            } else {
               throw result.message;
            }
         }, function (error_message) {
            throw error_message;
         });
      }

      /**
       * @fires istsos.Procedure#istsos.events.EventType: REMOVE_FROM_OFFERING
       * @param {istsos.Offering} offering
       */

   }, {
      key: 'removeMembershipFromOffering',
      value: function removeMembershipFromOffering(offering) {
         var _this5 = this;

         var procedures = offering.getMemberProceduresProperty();
         var pname = this.name;
         procedures.forEach(function (p) {
            if (p.name === pname) {
               procedures.splice(procedures.indexOf(p), 1);
            }
         });

         var url = this.service.server.getUrl() + 'wa/istsos/services/' + this.service.getServiceJSON()["service"] + '/offerings/' + offering.getOfferingJSON()["name"] + '/procedures/' + this.getProcedureJSON()["system"];

         var data = [{
            "offering": offering.getOfferingJSON()["name"],
            "procedure": this.getProcedureJSON()["system"]
         }];

         var config = {};
         if (this.service.server.getLoginConfig()) {
            config['headers'] = this.service.server.getLoginConfig();
         }
         config['data'] = JSON.stringify(data);

         return _HttpAPI.HttpAPI.delete(url, config).then(function (result) {
            if (result.success) {
               _this5.fireEvent('REMOVE_FROM_OFFERING', result);
               return result;
            } else {
               throw result.message;
            }
         }, function (error_message) {
            throw error_message;
         });
      }

      /**
       * @returns {Array<istsos.Output>}
       */

   }, {
      key: 'getOutputsProperty',
      value: function getOutputsProperty() {
         return _get(Procedure.prototype.__proto__ || Object.getPrototypeOf(Procedure.prototype), 'getOutputsProperty', this).call(this);
      }
   }]);

   return Procedure;
}(_ProcedureBase2.ProcedureBase);

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
   value: true
});
exports.Server = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _Configuration = __webpack_require__(3);

var _HttpAPI = __webpack_require__(0);

var _EventEmitter2 = __webpack_require__(1);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/** istsos.Server class */
/**
 * @param {String} serverName
 * @param {String} url
 * @param {istsos.Database} defaultDb
 * @param {istsos.Configuration} opt_config
 * @constructor
 */
var Server = exports.Server = function (_EventEmitter) {
   _inherits(Server, _EventEmitter);

   function Server(options) {
      _classCallCheck(this, Server);

      var _this = _possibleConstructorReturn(this, (Server.__proto__ || Object.getPrototypeOf(Server)).call(this));

      _this.name = options.name;
      _this.url = options.url.charAt(options.url.length - 1) === "/" ? options.url : options.url + "/";
      _this.defaultDb = options.defaultDb;
      _this.config = options.opt_config || new _Configuration.Configuration({
         serviceName: null,
         server: _this
      });
      _this.loginConfig = null;
      _this.services = [];
      return _this;
   }

   _createClass(Server, [{
      key: 'fireEvent',
      value: function fireEvent(eventType, response) {
         _get(Server.prototype.__proto__ || Object.getPrototypeOf(Server.prototype), 'fire', this).call(this, eventType, response);
      }
   }, {
      key: 'on',
      value: function on(event, callback) {
         _get(Server.prototype.__proto__ || Object.getPrototypeOf(Server.prototype), 'on', this).call(this, event, callback);
      }
   }, {
      key: 'once',
      value: function once(event, callback) {
         _get(Server.prototype.__proto__ || Object.getPrototypeOf(Server.prototype), 'once', this).call(this, event, callback);
      }
   }, {
      key: 'off',
      value: function off(event, callback) {
         _get(Server.prototype.__proto__ || Object.getPrototypeOf(Server.prototype), 'off', this).call(this, event, callback);
      }
   }, {
      key: 'unlistenAll',
      value: function unlistenAll() {
         _get(Server.prototype.__proto__ || Object.getPrototypeOf(Server.prototype), 'unlistenAll', this).call(this, event, callback);
      }
   }, {
      key: 'setLoginConfig',
      value: function setLoginConfig(username, password) {
         var loginStr = username + ':' + password;
         this.loginConfig = {
            Authorization: 'Basic ' + btoa(loginStr)
         };
      }
   }, {
      key: 'removeLoginConfig',
      value: function removeLoginConfig() {
         this.loginConfig = null;
      }
   }, {
      key: 'getLoginConfig',
      value: function getLoginConfig() {
         return this.loginConfig;
      }

      /**
       * @fires istsos.Server#istsos.events.EventType: SERVICE
       * @param {istsos.Service} service
       */

   }, {
      key: 'getService',
      value: function getService(service) {
         var _this2 = this;

         var url = this.url + 'wa/istsos/services/' + service.name;

         var config = {};
         if (this.getLoginConfig()) {
            config['headers'] = this.getLoginConfig();
         }

         return _HttpAPI.HttpAPI.get(url, config).then(function (result) {
            if (result.success) {
               _this2.fireEvent('SERVICE', result);
               return result;
            } else {
               throw result.message;
            }
         }, function (error_message) {
            throw error_message;
         });
      }

      /**
       * @param {istsos.Service} service
       */

   }, {
      key: 'addService',
      value: function addService(service) {
         this.services.push(service);
      }

      /**
       * @fires istsos.Service#istsos.events.EventType: NEW_SERVICE
       * @param {istsos.Service} service
       */

   }, {
      key: 'registerService',
      value: function registerService(service) {
         var _this3 = this;

         var url = this.getUrl() + 'wa/istsos/services';

         var config = {};
         if (this.getLoginConfig()) {
            config['headers'] = this.getLoginConfig();
         }
         config['data'] = JSON.stringify(service.getServiceJSON());

         return _HttpAPI.HttpAPI.post(url, config).then(function (result) {
            if (result.success) {
               _this3.fireEvent('NEW_SERVICE', result);
               return result;
            } else {
               throw result.message;
            }
         }, function (error_message) {
            throw error_message;
         });
      }

      /**
       * @fires istsos.Service#istsos.events.EventType: DELETE_SERVICE
       * @param {istsos.Service} service
       */

   }, {
      key: 'deleteService',
      value: function deleteService(service) {
         var _this4 = this;

         for (var i = 0; i < this.services.length; i++) {
            if (this.services[i].getServiceJSON()["service"] === service.getServiceJSON()["service"]) {
               this.services.splice(i, 1);
            }
         }
         var url = this.url + 'wa/istsos/services/' + service.name;

         var config = {};
         if (this.getLoginConfig()) {
            config['headers'] = this.getLoginConfig();
         }
         config['data'] = JSON.stringify({ 'name': service.name });

         return _HttpAPI.HttpAPI.delete(url, config).then(function (result) {
            if (result.success) {
               _this4.fireEvent('DELETE_SERVICE', result);
               return result;
            } else {
               throw result.message;
            }
         }, function (error_message) {
            throw error_message;
         });
      }

      /**
       * @fires istsos.Service#istsos.events.EventType: STATUS
       */

   }, {
      key: 'getStatus',
      value: function getStatus() {
         var _this5 = this;

         var url = this.url + 'wa/istsos/operations/status';
         this.executeRequest(url, 'STATUS', "GET");

         var config = {};
         if (this.getLoginConfig()) {
            config['headers'] = this.getLoginConfig();
         }

         return _HttpAPI.HttpAPI.delete(url, config).then(function (result) {
            if (result.success) {
               _this5.fireEvent('STATUS', result);
               return result;
            } else {
               throw result.message;
            }
         }, function (error_message) {
            throw error_message;
         });
      }

      /**
       * @fires istsos.Service#istsos.events.EventType: ABOUT
       */

   }, {
      key: 'getAboutInfo',
      value: function getAboutInfo() {
         var _this6 = this;

         var url = this.url + 'wa/istsos/operations/about';

         var config = {};
         if (this.getLoginConfig()) {
            config['headers'] = this.getLoginConfig();
         }

         return _HttpAPI.HttpAPI.delete(url, config).then(function (result) {
            if (result.success) {
               _this6.fireEvent('ABOUT', result);
               return result;
            } else {
               throw result.message;
            }
         }, function (error_message) {
            throw error_message;
         });
      }

      /**
       * @fires istsos.Configuration#istsos.events.EventType: CONFIGURATION
       */

   }, {
      key: 'getConfig',
      value: function getConfig() {
         return this.config.getConf();
      }

      /**
       * @returns {istsos.Configuration}
       */

   }, {
      key: 'getConfigProperty',
      value: function getConfigProperty() {
         return this.config;
      }

      /**
       * @returns {Array<istsos.Service>}
       */

   }, {
      key: 'getServicesProperty',
      value: function getServicesProperty() {
         return this.services;
      }

      /**
       * @fires istsos.Service#istsos.events.EventType: SERVICES
       */

   }, {
      key: 'getServices',
      value: function getServices() {
         var _this7 = this;

         var url = this.url + 'wa/istsos/services';
         this.executeRequest(url, 'SERVICES', "GET");

         var config = {};
         if (this.getLoginConfig()) {
            config['headers'] = this.getLoginConfig();
         }

         return _HttpAPI.HttpAPI.delete(url, config).then(function (result) {
            if (result.success) {
               _this7.fireEvent('SERVICES', result);
               return result;
            } else {
               throw result.message;
            }
         }, function (error_message) {
            throw error_message;
         });
      }

      /**
       * @fires istsos.Database#istsos.events.EventType: DATABASE
       */

   }, {
      key: 'getDefaultDb',
      value: function getDefaultDb() {
         return this.defaultDb.getDb("default", this);
      }

      /**
       * @returns {istsos.Database}
       */

   }, {
      key: 'getDefaultDbProperty',
      value: function getDefaultDbProperty() {
         return this.defaultDb;
      }

      /**
       * @returns {String}
       */

   }, {
      key: 'getUrl',
      value: function getUrl() {
         return this.url;
      }
   }]);

   return Server;
}(_EventEmitter2.EventEmitter);

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
   value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @class istsos.ServerContainer
 */
var ServerContainer = exports.ServerContainer = function () {

   /**
    * constructor - Instantiates istsos.ServerContainer
    *
    * @constructor
    */
   function ServerContainer() {
      _classCallCheck(this, ServerContainer);

      this.servers = [];
   }

   /**
    * getServer - Get the istsos.Server instance from the list by providing the name of the server
    *
    * @param  {string} name     Name of the server
    * @return {istsos.Server}   istsos.Server instance
    */


   _createClass(ServerContainer, [{
      key: "getServer",
      value: function getServer(name) {
         if (!name || typeof name != "string") {
            throw "Parameter must be a string representing the name of the server!";
         }

         var _iteratorNormalCompletion = true;
         var _didIteratorError = false;
         var _iteratorError = undefined;

         try {
            for (var _iterator = this.servers[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
               var s = _step.value;

               if (s.name === name) {
                  return s;
               }
            }
         } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
         } finally {
            try {
               if (!_iteratorNormalCompletion && _iterator.return) {
                  _iterator.return();
               }
            } finally {
               if (_didIteratorError) {
                  throw _iteratorError;
               }
            }
         }
      }

      /**
       * getServers - Get the list of created servers
       *
       * @return {Array<istsos.Server>}  List of istsos.Server instances
       */

   }, {
      key: "getServers",
      value: function getServers() {
         return this.servers;
      }

      /**
       * addServer - Add istsos.Server instance to the servers list
       *
       * @param  {istsos.Server} server istsos.Server instance
       */

   }, {
      key: "addServer",
      value: function addServer(server) {
         if (!server || (typeof server === "undefined" ? "undefined" : _typeof(server)) != "object") {
            throw "Parameter must be an instance of istsos.Server class!";
         }
         this.servers.push(server);
      }

      /**
       * removeServer - Remove istsos.Server instance from the list by providing name of the server or istsos.Server instance
       *
       * @param  {istsos.Server|string} server istsos.Server instance or name of the server
       */

   }, {
      key: "removeServer",
      value: function removeServer(server) {
         if (typeof server == "string") {
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
               for (var _iterator2 = this.servers[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                  var s = _step2.value;

                  if (s.name === server) {
                     this.servers.splice(this.servers.indexOf(s), 1);
                     break;
                  }
               }
            } catch (err) {
               _didIteratorError2 = true;
               _iteratorError2 = err;
            } finally {
               try {
                  if (!_iteratorNormalCompletion2 && _iterator2.return) {
                     _iterator2.return();
                  }
               } finally {
                  if (_didIteratorError2) {
                     throw _iteratorError2;
                  }
               }
            }
         } else if ((typeof server === "undefined" ? "undefined" : _typeof(server)) == "object") {
            this.servers.splice(this.servers.indexOf(server), 1);
         } else {
            throw "Parameter must be a string representing the name of the server or an instance of istsos.Server class!";
         }
      }
   }]);

   return ServerContainer;
}();

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
   value: true
});
exports.Service = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _EventEmitter2 = __webpack_require__(1);

var _HttpAPI = __webpack_require__(0);

var _Configuration = __webpack_require__(3);

var _Offering = __webpack_require__(6);

var _IstsosHelper = __webpack_require__(2);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/** istsos.Service class */
/**
 * @param {istsos.Server} server
 * @param {String} name
 * @param {istsos.Database} opt_db
 * @param {istsos.Configuration} opt_config
 * @param {int} opt_epsg
 * @constructor
 */
var Service = exports.Service = function (_EventEmitter) {
   _inherits(Service, _EventEmitter);

   function Service(options) {
      _classCallCheck(this, Service);

      var _this = _possibleConstructorReturn(this, (Service.__proto__ || Object.getPrototypeOf(Service)).call(this));

      _this.name = options.name;
      _this.db = options.opt_db || server.getDefaultDbProperty();
      _this.epsg = options.opt_epsg || null;
      _this.config = options.opt_config || new istsos.Configuration({
         serviceName: options.name,
         server: options.server
      });
      _this.server = options.server;
      _this.offerings = [];
      _this.procedures = [];
      _this.virtualProcedures = [];
      _this.observedProperties = [];
      _this.uoms = [];
      _this.dataQualities = [];
      server.addService(_this);

      var offering_config = {
         offeringName: "temporary",
         offeringDescription: "temporary offering to hold self-registered procedures/sensors waiting for service adimistration acceptance",
         active: true,
         expirationDate: "",
         service: _this
      };

      var temporary_offering = new istsos.Offering(offering_config);
      return _this;
   }

   /**
    * @param {String} url
    * @param {istsos.events.EventType} eventType
    * @param {String} method
    * @param {JSON} opt_data
    */

   _createClass(Service, [{
      key: 'fireEvent',
      value: function fireEvent(eventType, response) {
         _get(Service.prototype.__proto__ || Object.getPrototypeOf(Service.prototype), 'fire', this).call(this, eventType, response);
      }
   }, {
      key: 'on',
      value: function on(event, callback) {
         _get(Service.prototype.__proto__ || Object.getPrototypeOf(Service.prototype), 'on', this).call(this, event, callback);
      }
   }, {
      key: 'once',
      value: function once(event, callback) {
         _get(Service.prototype.__proto__ || Object.getPrototypeOf(Service.prototype), 'once', this).call(this, event, callback);
      }
   }, {
      key: 'off',
      value: function off(event, callback) {
         _get(Service.prototype.__proto__ || Object.getPrototypeOf(Service.prototype), 'off', this).call(this, event, callback);
      }
   }, {
      key: 'unlistenAll',
      value: function unlistenAll() {
         _get(Service.prototype.__proto__ || Object.getPrototypeOf(Service.prototype), 'unlistenAll', this).call(this, event, callback);
      }

      /**
       * @returns {JSON}
       */

   }, {
      key: 'getServiceJSON',
      value: function getServiceJSON() {
         var serviceJSON = {
            "service": this.name
         };
         if (this.epsg) {
            serviceJSON["epsg"] = this.epsg.toString();
         }
         if (this.db !== this.server.getDefaultDbProperty()) {
            serviceJSON["dbname"] = this.db["dbname"];
            serviceJSON["host"] = this.db["host"];
            serviceJSON["user"] = this.db["user"];
            serviceJSON["password"] = this.db["password"];
            serviceJSON["port"] = this.db["port"].toString();
         }
         return serviceJSON;
      }

      /**
       * @returns {Array<istsos.Offering>}
       */

   }, {
      key: 'getOfferingsProperty',
      value: function getOfferingsProperty() {
         return this.offerings;
      }

      /**
       * @returns {Array<istsos.Procedure>}
       */

   }, {
      key: 'getProceduresProperty',
      value: function getProceduresProperty() {
         return this.procedures;
      }

      /**
       * @returns {Array<istsos.VirtualProcedure>}
       */

   }, {
      key: 'getVirtualProceduresProperty',
      value: function getVirtualProceduresProperty() {
         return this.virtualProcedures;
      }

      /**
       * @returns {Array<istsos.ObservedProperty>}
       */

   }, {
      key: 'getObservedPropertiesProperty',
      value: function getObservedPropertiesProperty() {
         return this.observedProperties;
      }

      /**
       * @returns {Array<istsos.UnitOfMeasure>}
       */

   }, {
      key: 'getUomsProperty',
      value: function getUomsProperty() {
         return this.uoms;
      }

      /**
       * @returns {Array<istsos.DataQuality>}
       */

   }, {
      key: 'getDataQualitiesProperty',
      value: function getDataQualitiesProperty() {
         return this.dataQualities;
      }

      /**
       * @param {istsos.Offering} offering
       */

   }, {
      key: 'addOffering',
      value: function addOffering(offering) {
         this.getOfferingsProperty().push(offering);
      }

      /**
       * @fires istsos.Service#istsos.events.EventType: NEW_OFFERING
       * @param {istsos.Offering} offering
       */

   }, {
      key: 'registerOffering',
      value: function registerOffering(offering) {
         var _this2 = this;

         var url = this.server.getUrl() + 'wa/istsos/services/' + this.getServiceJSON()["service"] + '/offerings';

         var config = {};
         if (this.server.getLoginConfig()) {
            config['headers'] = this.server.getLoginConfig();
         }
         config['data'] = JSON.stringify(offering.getOfferingJSON());

         return _HttpAPI.HttpAPI.post(url, config).then(function (result) {
            if (result.success) {
               _this2.fireEvent('NEW_OFFERING', result);
               return result;
            } else {
               throw result.message;
            }
         }, function (error_message) {
            throw error_message;
         });
      }

      /**
       * @fires istsos.Service#istsos.events.EventType: OFFERING_NAMES
       */

   }, {
      key: 'getOfferingNames',
      value: function getOfferingNames() {
         var _this3 = this;

         var url = this.server.getUrl() + 'wa/istsos/services/' + this.getServiceJSON()["service"] + '/offerings/operations/getlist';

         var config = {};
         if (this.server.getLoginConfig()) {
            config['headers'] = this.server.getLoginConfig();
         }

         return _HttpAPI.HttpAPI.get(url, config).then(function (result) {
            if (result.success) {
               _this3.fireEvent('OFFERING_NAMES', result);
               return result;
            } else {
               throw result.message;
            }
         }, function (error_message) {
            throw error_message;
         });
      }

      /**
       * @fires istsos.Service#istsos.events.EventType: OFFERING_LIST
       */

   }, {
      key: 'getOfferings',
      value: function getOfferings() {
         var _this4 = this;

         var url = this.server.getUrl() + 'wa/istsos/services/' + this.getServiceJSON()["service"] + '/offerings';

         var config = {};
         if (this.server.getLoginConfig()) {
            config['headers'] = this.server.getLoginConfig();
         }

         return _HttpAPI.HttpAPI.get(url, config).then(function (result) {
            if (result.success) {
               _this4.fireEvent('OFFERING_LIST', result);
               return result;
            } else {
               throw result.message;
            }
         }, function (error_message) {
            throw error_message;
         });
      }

      /**
       * @param {istsos.Procedure} procedure
       */

   }, {
      key: 'addProcedure',
      value: function addProcedure(procedure) {
         this.getProceduresProperty().push(procedure);
      }

      /**
       * @fires istsos.Service#istsos.events.EventType: NEW_PROCEDURE
       * @param {istsos.Procedure} procedure
       */

   }, {
      key: 'registerProcedure',
      value: function registerProcedure(procedure) {
         var _this5 = this;

         var url = this.server.getUrl() + 'wa/istsos/services/' + this.getServiceJSON()["service"] + '/procedures';

         var config = {};
         if (this.server.getLoginConfig()) {
            config['headers'] = this.server.getLoginConfig();
         }
         config['data'] = JSON.stringify(procedure.getProcedureJSON());

         return _HttpAPI.HttpAPI.post(url, config).then(function (result) {
            if (result.success) {
               _this5.fireEvent('NEW_PROCEDURE', result);
               return result;
            } else {
               throw result.message;
            }
         }, function (error_message) {
            throw error_message;
         });
      }

      /**
       * @fires istsos.Service#istsos.events.EventType: PROCEDURE
       * @param {istsos.Procedure} procedure
       */

   }, {
      key: 'getProcedure',
      value: function getProcedure(procedure) {
         var _this6 = this;

         var url = this.server.getUrl() + 'wa/istsos/services/' + this.getServiceJSON()["service"] + '/procedures/' + procedure.getProcedureJSON()["system"];

         var config = {};
         if (this.server.getLoginConfig()) {
            config['headers'] = this.server.getLoginConfig();
         }

         return _HttpAPI.HttpAPI.get(url, config).then(function (result) {
            if (result.success) {
               _this6.fireEvent('PROCEDURE', result);
               return result;
            } else {
               throw result.message;
            }
         }, function (error_message) {
            throw error_message;
         });
      }

      /**
       * @fires istsos.Service#istsos.events.EventType: PROCEDURES
       */

   }, {
      key: 'getProcedures',
      value: function getProcedures() {
         var _this7 = this;

         var url = this.server.getUrl() + 'wa/istsos/services/' + this.getServiceJSON()["service"] + '/procedures/operations/getlist';

         var config = {};
         if (this.server.getLoginConfig()) {
            config['headers'] = this.server.getLoginConfig();
         }

         return _HttpAPI.HttpAPI.get(url, config).then(function (result) {
            if (result.success) {
               _this7.fireEvent('PROCEDURES', result);
               return result;
            } else {
               throw result.message;
            }
         }, function (error_message) {
            throw error_message;
         });
      }

      /**
       * @param {istsos.VirtualProcedure} v_procedure
       */

   }, {
      key: 'addVirtualProcedure',
      value: function addVirtualProcedure(v_procedure) {
         this.getVirtualProceduresProperty().push(v_procedure);
      }

      /**
       * @fires istsos.Service#istsos.events.EventType: NEW_VIRTUAL_PROCEDURE
       * @param {istsos.VirtualProcedure} v_procedure
       */

   }, {
      key: 'registerVirtualProcedure',
      value: function registerVirtualProcedure(v_procedure) {
         var _this8 = this;

         var url = this.server.getUrl() + 'wa/istsos/services/' + this.getServiceJSON()["service"] + '/procedures';

         var config = {};
         if (this.server.getLoginConfig()) {
            config['headers'] = this.server.getLoginConfig();
         }
         config['data'] = JSON.stringify(v_procedure.getVirtualProcedureJSON());

         return _HttpAPI.HttpAPI.post(url, config).then(function (result) {
            if (result.success) {
               _this8.fireEvent('NEW_VIRTUAL_PROCEDURE', result);
               return result;
            } else {
               throw result.message;
            }
         }, function (error_message) {
            throw error_message;
         });
      }

      /**
       * @fires istsos.Service#istsos.events.EventType: VIRTUAL_PROCEDURE
       * @param {istsos.VirtualProcedure} v_procedure
       */

   }, {
      key: 'getVirtualProcedure',
      value: function getVirtualProcedure(v_procedure) {
         var _this9 = this;

         var url = this.server.getUrl() + 'wa/istsos/services/' + this.getServiceJSON()["service"] + '/virtualprocedures';

         var config = {};
         if (this.server.getLoginConfig()) {
            config['headers'] = this.server.getLoginConfig();
         }

         return _HttpAPI.HttpAPI.get(url, config).then(function (result) {
            if (result.success) {
               _this9.fireEvent('VIRTUAL_PROCEURE', result);
               return result;
            } else {
               throw result.message;
            }
         }, function (error_message) {
            throw error_message;
         });
      }

      /**
       * @fires istsos.Service#istsos.events.EventType: VIRTUAL_PROCEDURES
       */

   }, {
      key: 'getVirtualProcedures',
      value: function getVirtualProcedures() {
         var _this10 = this;

         var url = this.server.getUrl() + 'wa/istsos/services/' + this.getServiceJSON()["service"] + '/virtualprocedures/operations/getlist';

         var config = {};
         if (this.server.getLoginConfig()) {
            config['headers'] = this.server.getLoginConfig();
         }

         return _HttpAPI.HttpAPI.get(url, config).then(function (result) {
            if (result.success) {
               _this10.fireEvent('VIRTUAL_PROCEDURES', result);
               return result;
            } else {
               throw result.message;
            }
         }, function (error_message) {
            throw error_message;
         });
      }

      /**
       * @param {istsos.ObservedProperty} property
       */

   }, {
      key: 'addObservedProperty',
      value: function addObservedProperty(property) {
         this.getObservedPropertiesProperty().push(property);
      }

      /**
       * @fires istsos.Service#istsos.events.EventType: NEW_OBSERVED_PROPERTY
       * @param {istsos.ObservedProperty} property
       */

   }, {
      key: 'registerObservedProperty',
      value: function registerObservedProperty(property) {
         var _this11 = this;

         var url = this.server.getUrl() + 'wa/istsos/services/' + this.getServiceJSON()["service"] + '/observedproperties';
         this.executeRequest(url, istsos.events.EventType.NEW_OBSERVED_PROPERTY, "POST", JSON.stringify(property.getObservedPropertyJSON()));

         var config = {};
         if (this.server.getLoginConfig()) {
            config['headers'] = this.server.getLoginConfig();
         }
         config['data'] = JSON.stringify(property.getObservedPropertyJSON());

         return _HttpAPI.HttpAPI.post(url, config).then(function (result) {
            if (result.success) {
               _this11.fireEvent('NEW_OBSERVED_PROPERTY', result);
               return result;
            } else {
               throw result.message;
            }
         }, function (error_message) {
            throw error_message;
         });
      }

      /**
       * @fires istsos.Service#istsos.events.EventType: OBSERVED_PROPERTIES
       */

   }, {
      key: 'getObservedProperties',
      value: function getObservedProperties() {
         var _this12 = this;

         var url = this.server.getUrl() + 'wa/istsos/services/' + this.getServiceJSON()["service"] + '/observedproperties';

         var config = {};
         if (this.server.getLoginConfig()) {
            config['headers'] = this.server.getLoginConfig();
         }

         return _HttpAPI.HttpAPI.get(url, config).then(function (result) {
            if (result.success) {
               _this12.fireEvent('OBSERVED_PROPERTIES', result);
               return result;
            } else {
               throw result.message;
            }
         }, function (error_message) {
            throw error_message;
         });
      }

      /**
       * @fires istsos.Service#istsos.events.EventType: OBSERVED_PROPERTY
       * @param {istsos.ObservedProperty} property
       */

   }, {
      key: 'getObservedProperty',
      value: function getObservedProperty(property) {
         var _this13 = this;

         var url = this.server.getUrl() + 'wa/istsos/services/' + this.getServiceJSON()["service"] + '/observedproperties/' + property.getObservedPropertyJSON()["definition"];

         var config = {};
         if (this.server.getLoginConfig()) {
            config['headers'] = this.server.getLoginConfig();
         }

         return _HttpAPI.HttpAPI.get(url, config).then(function (result) {
            if (result.success) {
               _this13.fireEvent('OBSERVED_PROPERTY', result);
               return result;
            } else {
               throw result.message;
            }
         }, function (error_message) {
            throw error_message;
         });
      }

      /**
       * @param {istsos.UnitOfMeasure} uom
       */

   }, {
      key: 'addUom',
      value: function addUom(uom) {
         this.getUomsProperty().push(uom);
      }

      /**
       * @fires istsos.Service#istsos.events.EventType: NEW_UOM
       * @param {istsos.UnitOfMeasure} uom
       */

   }, {
      key: 'registerUom',
      value: function registerUom(uom) {
         var _this14 = this;

         var url = this.server.getUrl() + 'wa/istsos/services/' + this.getServiceJSON()["service"] + '/uoms';

         var config = {};
         if (this.server.getLoginConfig()) {
            config['headers'] = this.server.getLoginConfig();
         }
         config['data'] = JSON.stringify(property.getUomJSON());

         return _HttpAPI.HttpAPI.post(url, config).then(function (result) {
            if (result.success) {
               _this14.fireEvent('NEW_UOM', result);
               return result;
            } else {
               throw result.message;
            }
         }, function (error_message) {
            throw error_message;
         });
      }

      /**
       * @fires istsos.Service#istsos.events.EventType: UOMS
       */

   }, {
      key: 'getUoms',
      value: function getUoms() {
         var _this15 = this;

         var url = this.server.getUrl() + 'wa/istsos/services/' + this.getServiceJSON()["service"] + '/uoms';

         var config = {};
         if (this.server.getLoginConfig()) {
            config['headers'] = this.server.getLoginConfig();
         }

         return _HttpAPI.HttpAPI.get(url, config).then(function (result) {
            if (result.success) {
               _this15.fireEvent('UOMS', result);
               return result;
            } else {
               throw result.message;
            }
         }, function (error_message) {
            throw error_message;
         });
      }

      /**
       * @fires istsos.Service#istsos.events.EventType: UOM
       * @param {istsos.UnitOfMeasure} uom
       */

   }, {
      key: 'getUom',
      value: function getUom(uom) {
         var _this16 = this;

         var url = this.server.getUrl() + 'wa/istsos/services/' + this.getServiceJSON()["service"] + '/uoms/' + uom.getUomJSON()["name"];

         var config = {};
         if (this.server.getLoginConfig()) {
            config['headers'] = this.server.getLoginConfig();
         }

         return _HttpAPI.HttpAPI.get(url, config).then(function (result) {
            if (result.success) {
               _this16.fireEvent('UOM', result);
               return result;
            } else {
               throw result.message;
            }
         }, function (error_message) {
            throw error_message;
         });
      }

      /**
       * @param {istsos.DataQuality} dataQuality
       */

   }, {
      key: 'addDataQuality',
      value: function addDataQuality(dataQuality) {
         this.getDataQualitiesProperty().push(dataQuality);
      }

      /**
       * @fires istsos.Service#istsos.events.EventType: NEW_DATAQUALITY
       * @param {istsos.DataQuality} dataQuality
       */

   }, {
      key: 'registerDataQuality',
      value: function registerDataQuality(dataQuality) {
         var _this17 = this;

         var url = this.server.getUrl() + 'wa/istsos/services/' + this.getServiceJSON()["service"] + '/dataqualities';
         this.executeRequest(url, istsos.events.EventType.NEW_DATAQUALITY, "POST", JSON.stringify(dataQuality.getDataQualityJSON()));

         var config = {};
         if (this.server.getLoginConfig()) {
            config['headers'] = this.server.getLoginConfig();
         }
         config['data'] = JSON.stringify(property.getDataQualityJSON());

         return _HttpAPI.HttpAPI.post(url, config).then(function (result) {
            if (result.success) {
               _this17.fireEvent('NEW_DATAQUALITY', result);
               return result;
            } else {
               throw result.message;
            }
         }, function (error_message) {
            throw error_message;
         });
      }

      /**
       * @fires istsos.Service#istsos.events.EventType: DATAQUALITIES
       */

   }, {
      key: 'getDataQualities',
      value: function getDataQualities() {
         var _this18 = this;

         var url = this.server.getUrl() + 'wa/istsos/services/' + this.getServiceJSON()["service"] + '/dataqualities';

         var config = {};
         if (this.server.getLoginConfig()) {
            config['headers'] = this.server.getLoginConfig();
         }

         return _HttpAPI.HttpAPI.get(url, config).then(function (result) {
            if (result.success) {
               _this18.fireEvent('DATAQUALITIES', result);
               return result;
            } else {
               throw result.message;
            }
         }, function (error_message) {
            throw error_message;
         });
      }

      /**
       * @fires istsos.Service#istsos.events.EventType: DATA_QUALITY
       * @param {istsos.DataQuality} dataQuality
       */

   }, {
      key: 'getDataQuality',
      value: function getDataQuality(dataQuality) {
         var _this19 = this;

         var url = this.server.getUrl() + 'wa/istsos/services/' + this.getServiceJSON()["service"] + '/dataqualities/' + dataQuality.getDataQualityJSON()["code"];

         var config = {};
         if (this.server.getLoginConfig()) {
            config['headers'] = this.server.getLoginConfig();
         }

         return _HttpAPI.HttpAPI.get(url, config).then(function (result) {
            if (result.success) {
               _this19.fireEvent('DATAQUALITY', result);
               return result;
            } else {
               throw result.message;
            }
         }, function (error_message) {
            throw error_message;
         });
      }

      /**
       * @fires istsos.Service#istsos.events.EventType: SYSTEM_TYPES
       */

   }, {
      key: 'getSystemTypes',
      value: function getSystemTypes() {
         var _this20 = this;

         var url = this.server.getUrl() + 'wa/istsos/services/' + this.getServiceJSON()["service"] + '/systemtypes';

         var config = {};
         if (this.server.getLoginConfig()) {
            config['headers'] = this.server.getLoginConfig();
         }

         return _HttpAPI.HttpAPI.get(url, config).then(function (result) {
            if (result.success) {
               _this20.fireEvent('SYSTEM_TYPES', result);
               return result;
            } else {
               throw result.message;
            }
         }, function (error_message) {
            throw error_message;
         });
      }

      /**
       * @returns {istsos.Database}
       */

   }, {
      key: 'getDatabaseProperty',
      value: function getDatabaseProperty() {
         return this.db;
      }

      /**
       * @fires istsos.Database#istsos.events.EventType: DATABASE
       */

   }, {
      key: 'getDatabase',
      value: function getDatabase() {
         return this.db.getDb(this.getServiceJSON()["service"], this.server);
      }

      /**
       * @fires istsos.Service#istsos.events.EventType: GETOBSERVATIONS
       * @param {istsos.Offering} offering
       * @param {Array<istsos.Procedure|istsos.VirtualProcedure>} procedures
       * @param {Array<istsos.ObservedProperty>} observed_properties
       * @param {istsos.Date} begin_time
       * @param {istsos.Date} end_time
       * @param {JSON} opt_aggregationConf
       */
      /*
      << HOW TO CREATE AGGREGATION CONF JSON >>
      {
         "function": "SUM", "MAX", "MIN" OR "AVG",
         "interval": example - "P1DT" is (1 day), "PT24H" is (24 hours),
         "noData": optional
         "noDataQi": optional
      }
      */

   }, {
      key: 'getObservations',
      value: function getObservations(options) {
         var _this21 = this;

         var urlConfig = (0, _IstsosHelper.prepareForGetObservations)(options);
         var url = this.server.getUrl() + 'wa/istsos/services/' + this.name + '/operations/getobservation/offerings/' + urlConfig.offering + '/procedures/' + urlConfig.procedureNames + '/observedproperties/' + urlConfig.observedPropertyUrns + '/eventtime/' + begin + '/' + end;

         var config = {};
         if (this.server.getLoginConfig()) {
            config['headers'] = this.server.getLoginConfig();
         }

         return _HttpAPI.HttpAPI.get(url, config).then(function (result) {
            if (result.success) {
               _this21.fireEvent('GETOBSERVATIONS', result);
               return result;
            } else {
               throw result.message;
            }
         }, function (error_message) {
            throw error_message;
         });
      }

      /**
       * @fires istsos.Service#istsos.events.EventType: GETOBSERVATIONS_AGG
       * @param {istsos.Offering} offering
       * @param {Array<istsos.Procedure|istsos.VirtualProcedure>} procedures
       * @param {Array<istsos.ObservedProperty>} observed_properties
       * @param {istsos.Date} begin_time
       * @param {istsos.Date} end_time
       * @param {String} aggFunc allowed - "SUM", "MAX", "MIN" OR "AVG"
       * @param {String} aggInterval example - "P1DT" is 1 day or "PT24H" is 24H...
       * @param {int} aggNoData
       * @param {int} aggNoDataQI
       */

   }, {
      key: 'getObservationsWithAggregation',
      value: function getObservationsWithAggregation(options, aggregationConfig) {
         var _this22 = this;

         var urlConfig = (0, _IstsosHelper.prepareForGetObservations)(options, aggregationConfig);
         var url = this.server.getUrl() + 'wa/istsos/services/' + this.name + '/operations/getobservation/offerings/' + urlConfig.offering + '/procedures/' + urlConfig.procedureNames + '/observedproperties/' + urlConfig.observedPropertyUrns + '/eventtime/' + begin + '/' + end + '/' + urlConfig.aggregationUrl;

         var config = {};
         if (this.server.getLoginConfig()) {
            config['headers'] = this.server.getLoginConfig();
         }

         return _HttpAPI.HttpAPI.get(url, config).then(function (result) {
            if (result.success) {
               _this22.fireEvent('GETOBSERVATIONS_AGG', result);
               return result;
            } else {
               throw result.message;
            }
         }, function (error_message) {
            throw error_message;
         });
      }

      /**
       * @fires istsos.Service#istsos.events.EventType: GETOBSERVATIONS_BY_PROPERTY
       * @param {istsos.Offering} offering
       * @param {istsos.Procedure|istsos.VirtualProcedure} procedure
       * @param {istsos.ObservedProperty} observed_property
       * @param {istsos.Date} begin_time
       * @param {istsos.Date} end_time
       */

   }, {
      key: 'getObservationsSimplified',
      value: function getObservationsSimplified(options) {
         var _this23 = this;

         var urlConfig = (0, _IstsosHelper.prepareForGetObservations)(options);
         var url = this.server.getUrl() + 'wa/istsos/services/' + this.name + '/operations/getobservation/offerings/' + urlConfig.offering + '/procedures/' + urlConfig.procedureNames + '/observedproperties/' + urlConfig.observedPropertyUrns + '/eventtime/' + begin + '/' + end;

         var config = {};
         if (this.server.getLoginConfig()) {
            config['headers'] = this.server.getLoginConfig();
         }

         return _HttpAPI.HttpAPI.get(url, config).then(function (result) {
            if (result.success) {
               var transformed = (0, _IstsosHelper.transformGetObservationResponse)('simple', result);
               _this23.fireEvent('GETOBSERVATIONS_BY_PROPERTY', transformed);
               return result;
            } else {
               throw result.message;
            }
         }, function (error_message) {
            throw error_message;
         });
      }

      //lessThan, lessThanAndEqual, equal, greaterThanAndEqual, greatherThan, between

   }, {
      key: 'getObservationsByQualityIndexConstraint',
      value: function getObservationsByQualityIndexConstraint(options, constraintConfig) {
         var _this24 = this;

         var urlConfig = (0, _IstsosHelper.prepareForGetObservations)(options);
         var url = this.server.getUrl() + 'wa/istsos/services/' + this.name + '/operations/getobservation/offerings/' + urlConfig.offering + '/procedures/' + urlConfig.procedureNames + '/observedproperties/' + urlConfig.observedPropertyUrns + '/eventtime/' + begin + '/' + end;

         var config = {};
         if (this.server.getLoginConfig()) {
            config['headers'] = this.server.getLoginConfig();
         }

         return _HttpAPI.HttpAPI.get(url, config).then(function (result) {
            if (result.success) {
               var transformed = (0, _IstsosHelper.transformGetObservationResponse)('constraint', result, constraintConfig);
               _this24.fireEvent('GETOBSERVATIONS_BY_QUALITY', transformed);
               return result;
            } else {
               throw result.message;
            }
         }, function (error_message) {
            throw error_message;
         });
      }

      /**
       * @fires istsos.Service#istsos.events.EventType: GEOJSON
       * @param {int} opt_epsg
       * @param {istsos.Offering} opt_offering
       * @param {istsos.Procedure|istsos.VirtualProcedure} opt_procedure
       */

   }, {
      key: 'getFeatureCollection',
      value: function getFeatureCollection(opt_options) {
         var _this25 = this;

         var url = this.server.getUrl() + 'wa/istsos/services/' + this.nane + '/procedures/operations/geojson';
         if (opt_options.opt_epsg) {
            url += "?epsg=" + opt_options.opt_epsg.toString();
            if (opt_options.opt_offering || opt_options.opt_procedure) {
               if (opt_options.opt_offering) {
                  url += "&offering=" + opt_options.opt_offering.getOfferingJSON()["name"];
               }
               if (opt_options.opt_procedure && opt_options.opt_procedure instanceof istsos.Procedure) {
                  url += "&procedure=" + opt_options.opt_procedure.getProcedureJSON()["system"];
               } else if (opt_options.opt_procedure && opt_options.opt_procedure instanceof istsos.VirtualProcedure) {
                  url += "&procedure=" + opt_options.opt_procedure.getVirtualProcedureJSON()["system"];
               }
            }
         }

         var config = {};
         if (this.server.getLoginConfig()) {
            config['headers'] = this.server.getLoginConfig();
         }

         return _HttpAPI.HttpAPI.get(url, config).then(function (result) {
            if (result.success) {
               _this25.fireEvent('GEOJSON', result);
               return result;
            } else {
               throw result.message;
            }
         }, function (error_message) {
            throw error_message;
         });
      }
   }]);

   return Service;
}(_EventEmitter2.EventEmitter);

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
   value: true
});
exports.UnitOfMeasure = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _HttpAPI = __webpack_require__(0);

var _EventEmitter2 = __webpack_require__(1);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/** istsos.UnitOfMeasure  class */
/**
 * @param {istsos.Service} service
 * @param {String} name
 * @param {String} description
 * @constructor
 */
var UnitOfMeasure = exports.UnitOfMeasure = function (_EventEmitter) {
   _inherits(UnitOfMeasure, _EventEmitter);

   function UnitOfMeasure(options) {
      _classCallCheck(this, UnitOfMeasure);

      var _this = _possibleConstructorReturn(this, (UnitOfMeasure.__proto__ || Object.getPrototypeOf(UnitOfMeasure)).call(this));

      _this.name = options.name;
      _this.description = options.description || "";
      _this.proceduresIncluded = [];
      _this.service = options.service;
      service.addUom(_this);
      _this.updateProceduresIncluded();
      return _this;
   }

   _createClass(UnitOfMeasure, [{
      key: 'fireEvent',
      value: function fireEvent(eventType, response) {
         _get(UnitOfMeasure.prototype.__proto__ || Object.getPrototypeOf(UnitOfMeasure.prototype), 'fire', this).call(this, eventType, response);
      }
   }, {
      key: 'on',
      value: function on(event, callback) {
         _get(UnitOfMeasure.prototype.__proto__ || Object.getPrototypeOf(UnitOfMeasure.prototype), 'on', this).call(this, event, callback);
      }
   }, {
      key: 'once',
      value: function once(event, callback) {
         _get(UnitOfMeasure.prototype.__proto__ || Object.getPrototypeOf(UnitOfMeasure.prototype), 'once', this).call(this, event, callback);
      }
   }, {
      key: 'off',
      value: function off(event, callback) {
         _get(UnitOfMeasure.prototype.__proto__ || Object.getPrototypeOf(UnitOfMeasure.prototype), 'off', this).call(this, event, callback);
      }
   }, {
      key: 'unlistenAll',
      value: function unlistenAll() {
         _get(UnitOfMeasure.prototype.__proto__ || Object.getPrototypeOf(UnitOfMeasure.prototype), 'unlistenAll', this).call(this, event, callback);
      }
   }, {
      key: 'updateProceduresIncluded',
      value: function updateProceduresIncluded() {
         var procedures = this.service.getProceduresProperty();
         var v_procedures = this.service.getVirtualProceduresProperty();
         var all = procedures.concat(v_procedures);
         var code = this.name;
         if (all.length !== 0) {
            for (var i = 0; i < all.length; i++) {
               for (var j = 0; j < all[i].getOutputsProperty().length; j++) {
                  if (code === all[i].getOutputsProperty()[j]["uom"]) {
                     this.proceduresIncluded.push(all[i]);
                  }
               }
            }
         }
      }

      /**
       * @returns {JSON}
       */

   }, {
      key: 'getUomJSON',
      value: function getUomJSON() {
         var uomJSON = {
            "name": this.name,
            "description": this.description
         };
         return uomJSON;
      }

      /**
       * @fires istsos.UnitOfMeasure#istsos.events.EventType: UPDATE_UOM
       * @param {String} newName
       * @param {String} newDescr
       */

   }, {
      key: 'updateUom',
      value: function updateUom(options) {
         var _this2 = this;

         var oldName = this.name;
         this.name = options.newName || this.name;
         this.description = options.newDescr || this.description;

         var url = this.service.server.getUrl() + 'wa/istsos/services/' + this.service.getServiceJSON()["service"] + '/uoms/' + oldName;

         var config = {};
         if (this.service.server.getLoginConfig()) {
            config['headers'] = this.service.server.getLoginConfig();
         }
         config['data'] = JSON.stringify(this.getUomJSON());

         return _HttpAPI.HttpAPI.put(url, config).then(function (result) {
            if (result.success) {
               _this2.fireEvent('UPDATE_UOM', result);
               return result;
            } else {
               throw result.message;
            }
         }, function (error_message) {
            throw error_message;
         });
      }

      /**
       * @fires istsos.UnitOfMeasure#istsos.events.EventType: DELETE_UOM
       */

   }, {
      key: 'deleteUom',
      value: function deleteUom() {
         var _this3 = this;

         var procedures = this.service.getProceduresProperty();
         var v_procedures = this.service.getVirtualProceduresProperty();
         var uoms_service = this.service.getUomsProperty();
         var all = procedures.concat(v_procedures);
         var outputs = [];
         all.forEach(function (p) {
            outputs.concat(p.getOutputsProperty());
         });
         var code = this.name;
         var connected = false;
         for (var i = 0; i < outputs.length; i++) {
            if (code === outputs[i].getOutputJSON()["uom"]) {
               alert("CONNECTED TO PROCEDURE");
               connected = true;
               break;
            }
         }
         if (connected === false) {
            for (var j = 0; j < uoms_service.length; j++) {
               if (this === uoms_service[j]) {
                  uoms_service.splice(j, 1);
               }
            }
         }

         var url = this.service.server.getUrl() + 'wa/istsos/services/' + this.service.getServiceJSON()["service"] + '/uoms/' + this.getUomJSON()["name"];

         var config = {};
         if (this.service.server.getLoginConfig()) {
            config['headers'] = this.service.server.getLoginConfig();
         }
         config['data'] = JSON.stringify(this.getUomJSON());

         return _HttpAPI.HttpAPI.delete(url, config).then(function (result) {
            if (result.success) {
               _this3.fireEvent('DELETE_UOM', result);
               return result;
            } else {
               throw result.message;
            }
         }, function (error_message) {
            throw error_message;
         });
      }
   }]);

   return UnitOfMeasure;
}(_EventEmitter2.EventEmitter);

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
   value: true
});
exports.VirtualProcedure = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _ProcedureBase2 = __webpack_require__(4);

var _HttpAPI = __webpack_require__(0);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/** istsos.VirtualProcedure class */
/**
 * @param {istsos.Service} service
 * @param {String} name
 * @param {String} description
 * @param {String} keywords
 * @param {String} foi_name
 * @param {int} epsg
 * @param {int} x
 * @param {int} y
 * @param {int} z
 * @param {Array<istsos.Output>} outputs
 * @param {String} systemType (virtual)
 * @param {String} sensorType
 * @param {String} code
 * @param {JSON} ratingCurve
 * @constructor
 */
var VirtualProcedure = exports.VirtualProcedure = function (_ProcedureBase) {
   _inherits(VirtualProcedure, _ProcedureBase);

   function VirtualProcedure(options) {
      _classCallCheck(this, VirtualProcedure);

      var _this = _possibleConstructorReturn(this, (VirtualProcedure.__proto__ || Object.getPrototypeOf(VirtualProcedure)).call(this, {
         name: options.name,
         description: options.description,
         keywords: options.keywords,
         foi_name: options.foi_name,
         epsg: options.epsg,
         x: options.x,
         y: options.y,
         z: options.z,
         outputs: options.outputs
      }));

      _this.systemType = options.systemType === "virtual" ? options.systemType : null;
      _this.sensorType = options.sensorType || "";
      _this.service = options.service;
      _this.code = {
         "code": code
      } || {};
      _this.ratingCurve = ratingCurve || {};
      service.addVirtualProcedure(_this);
      service.getOfferingsProperty()[0].getMemberProceduresProperty().push(_this);
      return _this;
   }

   _createClass(VirtualProcedure, [{
      key: 'fireEvent',
      value: function fireEvent(eventType, response) {
         _get(VirtualProcedure.prototype.__proto__ || Object.getPrototypeOf(VirtualProcedure.prototype), 'fire', this).call(this, eventType, response);
      }
   }, {
      key: 'on',
      value: function on(event, callback) {
         _get(VirtualProcedure.prototype.__proto__ || Object.getPrototypeOf(VirtualProcedure.prototype), 'on', this).call(this, event, callback);
      }
   }, {
      key: 'once',
      value: function once(event, callback) {
         _get(VirtualProcedure.prototype.__proto__ || Object.getPrototypeOf(VirtualProcedure.prototype), 'once', this).call(this, event, callback);
      }
   }, {
      key: 'off',
      value: function off(event, callback) {
         _get(VirtualProcedure.prototype.__proto__ || Object.getPrototypeOf(VirtualProcedure.prototype), 'off', this).call(this, event, callback);
      }
   }, {
      key: 'unlistenAll',
      value: function unlistenAll() {
         _get(VirtualProcedure.prototype.__proto__ || Object.getPrototypeOf(VirtualProcedure.prototype), 'unlistenAll', this).call(this, event, callback);
      }

      /**
       * @returns {JSON}
       */

   }, {
      key: 'getVirtualProcedureJSON',
      value: function getVirtualProcedureJSON() {
         var vProcedureJSON = _get(VirtualProcedure.prototype.__proto__ || Object.getPrototypeOf(VirtualProcedure.prototype), 'getProcedureBaseJSON', this).call(this);
         vProcedureJSON["classification"] = [{
            "name": "System Type",
            "definition": "urn:ogc:def:classifier:x-istsos:1.0:systemType",
            "value": this.systemType === "virtual" ? this.systemType : null
         }, {
            "name": "Sensor Type",
            "definition": "urn:ogc:def:classifier:x-istsos:1.0:sensorType",
            "value": this.sensorType
         }];
         return vProcedureJSON;
      }

      /**
       * @fires istsos.VirtualProcedure#istsos.events.EventType: GET_CODE
       */

   }, {
      key: 'getCode',
      value: function getCode() {
         var _this2 = this;

         var url = this.service.server.getUrl() + 'wa/istsos/services/' + this.service.getServiceJSON()["service"] + '/virtualprocedures/' + this.getVirtualProcedureJSON()["system"] + '/code';

         var config = {};
         if (this.service.server.getLoginConfig()) {
            config['headers'] = this.service.server.getLoginConfig();
         }

         return _HttpAPI.HttpAPI.get(url, config).then(function (result) {
            if (result.success) {
               _this2.fireEvent('GET_CODE', result);
               return result;
            } else {
               throw result.message;
            }
         }, function (error_message) {
            throw error_message;
         });
      }

      /**
       * @fires istsos.VirtualProcedure#istsos.events.EventType: NEW_CODE
       */

   }, {
      key: 'registerCode',
      value: function registerCode() {
         var _this3 = this;

         var url = this.service.server.getUrl() + 'wa/istsos/services/' + this.service.getServiceJSON()["service"] + '/virtualprocedures/' + this.getVirtualProcedureJSON()["system"] + '/code';
         this.executeRequest(url, istsos.events.EventType.NEW_CODE, "POST", JSON.stringify(this.getCodeProperty()));

         var config = {};
         if (this.service.server.getLoginConfig()) {
            config['headers'] = this.service.server.getLoginConfig();
         }
         config['data'] = JSON.stringify(this.getCodeProperty());

         return _HttpAPI.HttpAPI.post(url, config).then(function (result) {
            if (result.success) {
               _this3.fireEvent('NEW_CODE', result);
               return result;
            } else {
               throw result.message;
            }
         }, function (error_message) {
            throw error_message;
         });
      }

      /**
       * @fires istsos.VirtualProcedure#istsos.events.EventType: UPDATE_CODE
       * @param {String} newCode
       */

   }, {
      key: 'updateCode',
      value: function updateCode(newCode) {
         var _this4 = this;

         this.code = {
            "code": newCode
         } || this.code;
         var url = this.service.server.getUrl() + 'wa/istsos/services/' + this.service.getServiceJSON()["service"] + '/virtualprocedures/' + this.getVirtualProcedureJSON()["system"] + '/code';

         var config = {};
         if (this.service.server.getLoginConfig()) {
            config['headers'] = this.service.server.getLoginConfig();
         }
         config['data'] = JSON.stringify(this.getCodeProperty());

         return _HttpAPI.HttpAPI.put(url, config).then(function (result) {
            if (result.success) {
               _this4.fireEvent('UPDATE_CODE', result);
               return result;
            } else {
               throw result.message;
            }
         }, function (error_message) {
            throw error_message;
         });
      }

      /**
       * @fires istsos.VirtualProcedure#istsos.events.EventType: DELETE_CODE
       */

   }, {
      key: 'deleteCode',
      value: function deleteCode() {
         var _this5 = this;

         this.code = "";
         var url = this.service.server.getUrl() + 'wa/istsos/services/' + this.service.getServiceJSON()["service"] + '/virtualprocedures/' + this.getVirtualProcedureJSON()["system"] + '/code';

         var config = {};
         if (this.service.server.getLoginConfig()) {
            config['headers'] = this.service.server.getLoginConfig();
         }

         return _HttpAPI.HttpAPI.delete(url, config).then(function (result) {
            if (result.success) {
               _this5.fireEvent('DELETE_CODE', result);
               return result;
            } else {
               throw result.message;
            }
         }, function (error_message) {
            throw error_message;
         });
      }

      /**
       * @returns {JSON}
       */

   }, {
      key: 'getCodeProperty',
      value: function getCodeProperty() {
         return this.code;
      }

      /**
       * @fires istsos.VirtualProcedure#istsos.events.EventType: RATING_CURVE
       */

   }, {
      key: 'getRatingCurve',
      value: function getRatingCurve() {
         var _this6 = this;

         var url = this.service.server.getUrl() + 'wa/istsos/services/' + this.service.getServiceJSON()["service"] + '/virtualprocedures/' + this.getVirtualProcedureJSON()["system"] + '/ratingcurve';

         var config = {};
         if (this.service.server.getLoginConfig()) {
            config['headers'] = this.service.server.getLoginConfig();
         }

         return _HttpAPI.HttpAPI.get(url, config).then(function (result) {
            if (result.success) {
               _this6.fireEvent('RATING_CURVE', result);
               return result;
            } else {
               throw result.message;
            }
         }, function (error_message) {
            throw error_message;
         });
      }

      /**
       * @fires istsos.VirtualProcedure#istsos.events.EventType: NEW_RATING_CURVE
       */

   }, {
      key: 'registerRatingCurve',
      value: function registerRatingCurve() {
         var _this7 = this;

         var url = this.service.server.getUrl() + 'wa/istsos/services/' + this.service.getServiceJSON()["service"] + '/virtualprocedures/' + this.getVirtualProcedureJSON()["system"] + '/ratingcurve';

         var config = {};
         if (this.service.server.getLoginConfig()) {
            config['headers'] = this.service.server.getLoginConfig();
         }
         config['data'] = JSON.stringify(this.getRatingCurveProperty());

         return _HttpAPI.HttpAPI.post(url, config).then(function (result) {
            if (result.success) {
               _this7.fireEvent('NEW_RATING_CURVE', result);
               return result;
            } else {
               throw result.message;
            }
         }, function (error_message) {
            throw error_message;
         });
      }

      /**
       * @fires istsos.VirtualProcedure#istsos.events.EventType: DELETE_RATING_CURVE
       */

   }, {
      key: 'deleteRatingCurve',
      value: function deleteRatingCurve() {
         var _this8 = this;

         this.ratingCurve = {};
         var url = this.service.server.getUrl() + 'wa/istsos/services/' + this.service.getServiceJSON()["service"] + '/virtualprocedures/' + this.getVirtualProcedureJSON()["system"] + '/ratingcurve';

         var config = {};
         if (this.service.server.getLoginConfig()) {
            config['headers'] = this.service.server.getLoginConfig();
         }

         return _HttpAPI.HttpAPI.delete(url, config).then(function (result) {
            if (result.success) {
               _this8.fireEvent('DELETE_RATING_CURVE', result);
               return result;
            } else {
               throw result.message;
            }
         }, function (error_message) {
            throw error_message;
         });
      }

      /**
       * @returns {JSON}
       */

   }, {
      key: 'getRatingCurveProperty',
      value: function getRatingCurveProperty() {
         return this.ratingCurve;
      }

      /**
       * @fires istsos.VirtualProcedure#istsos.events.EventType: UPDATE_V_PROCEDURE
       * @param {String} name
       * @param {String} description
       * @param {String} keywords
       * @param {String} foi_name
       * @param {int} epsg
       * @param {int} x
       * @param {int} y
       * @param {int} z
       * @param {Array<istsos.Output>} outputs
       * @param {String} systemType (virtual)
       * @param {String} sensorType
       */

   }, {
      key: 'updateVirtualProcedure',
      value: function updateVirtualProcedure(options) {
         var _this9 = this;

         var oldName = this.name;
         this.name = options.name || this.name;
         this.description = options.description || this.description;
         this.keywords = options.keywords || this.keywords;
         this.foi_name = options.foi_name || this.foi_name;
         this.epsg = option.sepsg || this.epsg;
         this.coordinates = [options.x, options.y, options.z] || this.coordinates;
         var outputs_array = this.outputs;
         if (options.outputs || options.outputs.length !== 0) {
            outputs_array.splice(1, outputs_array.length - 1);
            options.outputs.forEach(function (out) {
               outputs_array.push(out);
            });
         }
         this.systemType = options.systemType === "virtual" ? options.systemType : null;
         this.sensorType = options.sensorType || "";

         var url = this.service.server.getUrl() + 'wa/istsos/services/' + this.service.getServiceJSON()["service"] + '/virtualprocedures/' + oldName;

         var config = {};
         if (this.service.server.getLoginConfig()) {
            config['headers'] = this.service.server.getLoginConfig();
         }
         config['data'] = JSON.stringify(this.getVirtualProcedureJSON());

         return _HttpAPI.HttpAPI.put(url, config).then(function (result) {
            if (result.success) {
               _this9.fireEvent('UPDATE_V_PROCEDURE', result);
               return result;
            } else {
               throw result.message;
            }
         }, function (error_message) {
            throw error_message;
         });
      }
   }, {
      key: 'deleteVirtualProcedure',
      value: function deleteVirtualProcedure() {
         var _this10 = this;

         var v_procedures = this.service.getVirtualProceduresProperty();
         var obj = this.getVirtualProcedureJSON();
         v_procedures.forEach(function (p) {
            if (p.getVirtualProcedureJSON()["system"] === obj["system"]) {
               v_procedures.splice(v_procedures.indexOf(p), 1);
            }
         });

         var url = this.service.server.getUrl() + 'wa/istsos/services/' + this.service.getServiceJSON()["service"] + '/virtualprocedures/' + this.name;

         var config = {};
         if (this.service.server.getLoginConfig()) {
            config['headers'] = this.service.server.getLoginConfig();
         }

         return _HttpAPI.HttpAPI.delete(url, config).then(function (result) {
            if (result.success) {
               _this10.fireEvent('DELETE_V_PROCEDURE', result);
               return result;
            } else {
               throw result.message;
            }
         }, function (error_message) {
            throw error_message;
         });
      }

      /**
       * @fires istsos.VirtualProcedure#istsos.events.EventType: ADD_TO_OFFERING
       * @param {istsos.Offering} offering
       */

   }, {
      key: 'addMembershipToOffering',
      value: function addMembershipToOffering(offering) {
         var _this11 = this;

         offering.getMemberProceduresProperty().push(this);
         var url = this.service.server.getUrl() + 'wa/istsos/services/' + this.service.getServiceJSON()["service"] + '/offerings/' + offering.getOfferingJSON()["name"] + '/procedures';

         var data = [{
            "offering": offering.getOfferingJSON()["name"],
            "procedure": this.getVirtualProcedureJSON()["system"]
         }];

         var config = {};
         if (this.service.server.getLoginConfig()) {
            config['headers'] = this.service.server.getLoginConfig();
         }
         config['data'] = JSON.stringify(data);

         return _HttpAPI.HttpAPI.post(url, config).then(function (result) {
            if (result.success) {
               _this11.fireEvent('ADD_TO_OFFERING', result);
               return result;
            } else {
               throw result.message;
            }
         }, function (error_message) {
            throw error_message;
         });
      }

      /**
       * @fires istsos.VirtualProcedure#istsos.events.EventType: REMOVE_FROM_OFFERING
       * @param offering
       */

   }, {
      key: 'removeMembershipFromOffering',
      value: function removeMembershipFromOffering(offering) {
         var _this12 = this;

         var procedures = offering.getMemberProceduresProperty();
         var vp_name = this.name;
         procedures.forEach(function (p) {
            if (p.name === vp_name) {
               procedures.splice(procedures.indexOf(p), 1);
            }
         });
         var url = this.service.server.getUrl() + 'wa/istsos/services/' + this.service.getServiceJSON()["service"] + '/offerings/' + offering.getOfferingJSON()["name"] + '/procedures/' + this.getVirtualProcedureJSON()["system"];

         var data = [{
            "offering": offering.getOfferingJSON()["name"],
            "procedure": this.getVirtualProcedureJSON()["system"]
         }];

         var config = {};
         if (this.service.server.getLoginConfig()) {
            config['headers'] = this.service.server.getLoginConfig();
         }
         config['data'] = JSON.stringify(data);

         return _HttpAPI.HttpAPI.delete(url, config).then(function (result) {
            if (result.success) {
               _this12.fireEvent('REMOVE_FROM_OFFERING', result);
               return result;
            } else {
               throw result.message;
            }
         }, function (error_message) {
            throw error_message;
         });
      }

      /**
       * @returns {Array<istsos.Output>}
       */

   }, {
      key: 'getOutputsProperty',
      value: function getOutputsProperty() {
         return _get(VirtualProcedure.prototype.__proto__ || Object.getPrototypeOf(VirtualProcedure.prototype), 'getOutputsProperty', this).call(this);
      }
   }]);

   return VirtualProcedure;
}(_ProcedureBase2.ProcedureBase);

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _ServerContainer = __webpack_require__(14);

var _Date = __webpack_require__(9);

var _Database = __webpack_require__(8);

var _Configuration = __webpack_require__(3);

var _Server = __webpack_require__(13);

var _HttpAPI = __webpack_require__(0);

var _EventTypes = __webpack_require__(5);

var _EventEmitter = __webpack_require__(1);

var _DataQuality = __webpack_require__(7);

var _UnitOfMeasure = __webpack_require__(16);

var _Service = __webpack_require__(15);

var _ObservedProperty = __webpack_require__(10);

var _Output = __webpack_require__(11);

var _ProcedureBase = __webpack_require__(4);

var _Procedure = __webpack_require__(12);

var _VirtualProcedure = __webpack_require__(17);

var _Offering = __webpack_require__(6);

var _IstsosHelper = __webpack_require__(2);

module.exports = {
	ServerContainer: _ServerContainer.ServerContainer,
	Date: _Date.Date,
	Database: _Database.Database,
	Server: _Server.Server,
	EventEmitter: _EventEmitter.EventEmitter,
	EventTypes: _EventTypes.EventTypes,
	Configuration: _Configuration.Configuration,
	HttpAPI: _HttpAPI.HttpAPI,
	DataQuality: _DataQuality.DataQuality,
	UnitOfMeasure: _UnitOfMeasure.UnitOfMeasure,
	IstsosHelper: {
		validateConstraintInput: _IstsosHelper.validateConstraintInput,
		ConstraintInputs: _IstsosHelper.ConstraintInputs,
		prepareForGetObservations: _IstsosHelper.prepareForGetObservations,
		transformGetObservationsResponse: _IstsosHelper.transformGetObservationsResponse
	},
	Service: _Service.Service,
	ObservedProperty: _ObservedProperty.ObservedProperty,
	Output: _Output.Output,
	ProcedureBase: _ProcedureBase.ProcedureBase,
	Procedure: _Procedure.Procedure,
	VirtualProcedure: _VirtualProcedure.VirtualProcedure,
	Offering: _Offering.Offering
};

/***/ })
/******/ ]);