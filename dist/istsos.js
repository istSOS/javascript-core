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
/******/ 	return __webpack_require__(__webpack_require__.s = 8);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.EventEmitter = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _EventTypes = __webpack_require__(3);

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
/* 1 */
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
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
   value: true
});
exports.Configuration = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _HttpAPI = __webpack_require__(1);

var _EventEmitter2 = __webpack_require__(0);

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
      _this.serverUrl = options.server.getUrl();
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

         var url = this.serverUrl + 'wa/istsos/services/' + this.serviceName + '/configsections';
         return _HttpAPI.HttpAPI.get(url).then(function (result) {
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

         var url = this.serverUrl + 'wa/istsos/services/' + this.serviceName + '/configsections/provider';
         return _HttpAPI.HttpAPI.get(url).then(function (result) {
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
         var url = this.serverUrl + 'wa/istsos/services/' + this.serviceName + '/configsections/provider';
         return _HttpAPI.HttpAPI.put(url, {
            data: JSON.stringify(options)
         }).then(function (result) {
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

         var url = this.serverUrl + 'wa/istsos/services/' + this.serviceName + '/configsections/identification';

         return _HttpAPI.HttpAPI.put(url).then(function (result) {
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
         var url = this.serverUrl + 'wa/istsos/services/' + this.serviceName + '/configsections/identification';

         return _HttpAPI.HttpAPI.put(url, {
            data: JSON.stringify(options)
         }).then(function (result) {
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

         var url = this.serverUrl + 'wa/istsos/services/' + this.serviceName + '/configsections/mqtt';

         return _HttpAPI.HttpAPI.get(url).then(function (result) {
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
         var url = this.serverUrl + 'wa/istsos/services/' + this.serviceName + '/configsections/mqtt';

         return _HttpAPI.HttpAPI.put(url, {
            data: JSON.stringify(options)
         }).then(function (result) {
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

         var url = this.serverUrl + 'wa/istsos/services/' + this.serviceName + '/configsections/geo';

         return _HttpAPI.HttpAPI.get(url).then(function (result) {
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
         var url = this.serverUrl + 'wa/istsos/services/' + this.serviceName + '/configsections/geo';

         return _HttpAPI.HttpAPI.put(url, {
            data: JSON.stringify(options)
         }).then(function (result) {
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

         var url = this.serverUrl + 'wa/istsos/services/' + this.serviceName + '/configsections/getobservation';

         return _HttpAPI.HttpAPI.get(url).then(function (result) {
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
         var url = this.serverUrl + 'wa/istsos/services/' + this.serviceName + '/configsections/getobservation';

         return _HttpAPI.HttpAPI.put(url, {
            data: JSON.stringify(options)
         }).then(function (result) {
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

         var url = this.serverUrl + 'wa/istsos/services/' + this.serviceName + '/configsections/serviceurl';

         return _HttpAPI.HttpAPI.get(url).then(function (result) {
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
         var url = this.serverUrl + 'wa/istsos/services/' + this.serviceName + '/configsections/serviceurl';
         return _HttpAPI.HttpAPI.put(url, {
            data: JSON.stringify(data)
         }).then(function (result) {
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

         var url = this.serverUrl + 'wa/istsos/services/' + this.serviceName + '/epsgs';

         return _HttpAPI.HttpAPI.get(url).then(function (result) {
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
/* 3 */
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
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
   value: true
});
exports.Database = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _HttpAPI = __webpack_require__(1);

var _EventEmitter2 = __webpack_require__(0);

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

         return _HttpAPI.HttpAPI.get(url).then(function (result) {
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
      value: function setDb(options) {
         var _this3 = this;

         this.dbname = options.dbname || this.dbname;
         this.host = options.host || this.host;
         this.password = options.password || this.password;
         this.port = options.port || this.port;
         var serviceName = options.opt_service ? options.opt_service.getServiceJSON()["service"] : "default";
         var url = server.getUrl() + 'wa/istsos/services/' + serviceName + '/configsections/connection';

         return _HttpAPI.HttpAPI.put(url, {
            data: JSON.stringify(this.getDbJSON())
         }).then(function (result) {
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

         return _HttpAPI.HttpAPI.post(url, {
            data: JSON.stringify(this.getDbJSON())
         }).then(function (result) {
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
/* 5 */
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
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Server = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _Configuration = __webpack_require__(2);

var _HttpAPI = __webpack_require__(1);

var _EventEmitter2 = __webpack_require__(0);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/** istsos.Server class */
/**
 * @param {String} serverName
 * @param {String} url
 * @param {istsos.Database} defaultDb
 * @param {istsos.Configuration} opt_config
 * @param {JSON} opt_loginConfig
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
		_this.loginConfig = options.opt_loginConfig || {};
		_this.services = [];
		// this.login();
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
		key: 'executeRequest',
		value: function executeRequest(url, eventType, method, opt_data) {
			goog.net.XhrIo.send(url, function (e) {
				istsos.fire(eventType, e.target);
			}, method, opt_data);
		}
	}, {
		key: 'login',
		value: function login() {
			var authStr = this.loginConfig.user + ':' + this.loginConfig.password + '@';
			var url = this.url.match(/http:/gi) ? [this.url.slice(0, 7), authStr, this.url.slice(7), "wa/istsos/operations/status"].join("") : 'http://' + authStr + this.url + 'wa/istsos/operations/status';
			this.executeRequest(url, 'LOGIN', "GET");
		}

		/**
   * @fires istsos.Server#istsos.events.EventType: SERVICE
   * @param {istsos.Service} service
   */

	}, {
		key: 'getService',
		value: function getService(service) {
			var url = this.url + 'wa/istsos/services/' + service.name;
			this.executeRequest(url, 'SERVICE', "GET");
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
			var url = this.getUrl() + 'wa/istsos/services';
			this.executeRequest(url, 'NEW_SERVICE', "POST", JSON.stringify(service.getServiceJSON()));
		}

		/**
   * @fires istsos.Service#istsos.events.EventType: DELETE_SERVICE
   * @param {istsos.Service} service
   */

	}, {
		key: 'deleteService',
		value: function deleteService(service) {
			for (var i = 0; i < this.services.length; i++) {
				if (this.services[i].getServiceJSON()["service"] === service.getServiceJSON()["service"]) {
					this.services.splice(i, 1);
				}
			}
			var url = this.url + 'wa/istsos/services/' + service.name;
			this.executeRequest(url, 'DELETE_SERVICE', "DELETE", JSON.stringify({
				"name": service.name
			}));
		}

		/**
   * @fires istsos.Service#istsos.events.EventType: STATUS
   */

	}, {
		key: 'getStatus',
		value: function getStatus() {
			var url = this.url + 'wa/istsos/operations/status';
			this.executeRequest(url, 'STATUS', "GET");
		}

		/**
   * @fires istsos.Service#istsos.events.EventType: ABOUT
   */

	}, {
		key: 'getAboutInfo',
		value: function getAboutInfo() {
			var url = this.url + 'wa/istsos/operations/about';
			this.executeRequest(url, 'ABOUT', "GET");
		}

		/**
   * @fires istsos.Configuration#istsos.events.EventType: CONFIGURATION
   */

	}, {
		key: 'getConfig',
		value: function getConfig() {
			this.config.getConf();
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
			var url = this.url + 'wa/istsos/services';
			this.executeRequest(url, 'SERVICES', "GET");
		}

		/**
   * @fires istsos.Database#istsos.events.EventType: DATABASE
   */

	}, {
		key: 'getDefaultDb',
		value: function getDefaultDb() {
			this.defaultDb.getDb("default", this);
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
/* 7 */
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
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _ServerContainer = __webpack_require__(7);

var _Date = __webpack_require__(5);

var _Database = __webpack_require__(4);

var _Configuration = __webpack_require__(2);

var _Server = __webpack_require__(6);

var _HttpAPI = __webpack_require__(1);

var _EventTypes = __webpack_require__(3);

var _EventEmitter = __webpack_require__(0);

// import './Database.js';
// import './Configuration.js';
// import './Server.js';
// import 'ObservedProperty';
// import 'ProcedureBase';
// import 'Service';
// import './EventTypes.js';
// import './EventEmitter.js';
// import 'Offering';
// import 'Procedure';
// import 'VirtualProcedure';
// import 'UnitOfMeasure';
// import 'DataQuality';
// import 'Output';
// import './HttpAPI.js';

module.exports = {
	ServerContainer: _ServerContainer.ServerContainer,
	Date: _Date.Date,
	Database: _Database.Database,
	Server: _Server.Server,
	EventEmitter: _EventEmitter.EventEmitter,
	EventTypes: _EventTypes.EventTypes,
	Configuration: _Configuration.Configuration,
	HttpAPI: _HttpAPI.HttpAPI
};

/***/ })
/******/ ]);