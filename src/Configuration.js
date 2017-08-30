import {HttpAPI } from 'HttpAPI'; 
import {EventEmitter } from 'EventEmitter';

/**
 * istsos.Configuration
 * 
 * @class
 * @extends istsos.EventEmitter
 */
export var Configuration = class Configuration extends EventEmitter {
   /**
    * constructor - instantiates istsos.Configuration
    * 
    * @param  {Object} options Set of key-value pairs
    * @constructor
    */
   constructor(options) {
      super();
      this.serviceName = (options.serviceName) ? options.serviceName : "default";
      this.server = options.server;
   }

   /**
    * Fire event with data - event must match one of the supported event types from istsos.EventTypes
    * 
    * @param  {String} eventType Type of event from istsos.EventTypes
    * @param  {Object|*} response  Data to be passed to a handler
    */
   fireEvent(eventType, response) {
      super.fire(eventType, response)
   }

   /**
    * Add event listener
    * 
    * @param  {String}   event    Event must match one of the supported event types from istsos.EventTypes
    * @param  {Function} callback Handler function
    */
   on(event, callback) {
      super.on(event, callback);
   }

   /**
    * Add event listener, that will listen only once.
    * 
    * @param  {String}   event    Event must match one of the supported event types from istsos.EventTypes
    * @param  {Function} callback Handler function
    */
   once(event, callback) {
      super.once(event, callback);
   }

   /**
    * Remove event listener
    * 
    * @param  {String}   event    Event must match one of the supported event types from istsos.EventTypes
    * @param  {Function} callback Handler function
    */
   off(event, callback) {
      super.off(event, callback);
   }

   /**
    * Remove all event listeners
    */
   unlistenAll() {
      super.unlistenAll();
   }

   /**
    * Get configuration information from the server
    * 
    * @return {Promise} 
    * @fires  istsos.Configuration#CONFIGSECTIONS            
    */
   getConf() {
      var url = `${this.server.getUrl()}wa/istsos/services/${this.serviceName}/configsections`;
      
      let config = {}
      if(this.server.getLoginConfig()) {
         config['headers'] = this.server.getLoginConfig();
      }

      return HttpAPI.get(url, config)
         .then((result) => {
            if (result.success) {
               this.fireEvent('CONFIGSECTIONS', result);
               return result;
            } else {
               throw result.message
            }
         }, (error_message) => {
            throw error_message;
         });
   }

   /**
    * Get provider information from the server
    * 
    * @return {Promise} 
    * @fires  istsos.Configuration#PROVIDER            
    */
   getProvider() {
      var url = `${this.server.getUrl()}wa/istsos/services/${this.serviceName}/configsections/provider`;
       
      let config = {}
      if(this.server.getLoginConfig()) {
         config['headers'] = this.server.getLoginConfig();
      }

      return HttpAPI.get(url, config)
         .then((result) => {
            if (result.success) {
               this.fireEvent('PROVIDER', result);
               return result;
            } else {
               throw result.message
            }

         }, (error_message) => {
            throw error_message;
         });
   }

   /**
    * Update provider information on the server
    *
    * @param {object} options Set of key-value pairs
    * @return {Promise} 
    * @fires  istsos.Configuration#UPDATE_PROVIDER            
    */
   updateProvider(options = {}) {
      var url = `${this.server.getUrl()}wa/istsos/services/${this.serviceName}/configsections/provider`;
      
      let config = {}
      if(this.server.getLoginConfig()) {
         config['headers'] = this.server.getLoginConfig();
      }
      config['data'] = JSON.stringify(options);

      return HttpAPI.put(url, config)
         .then((result) => {
            if (result.success) {
               this.fireEvent('UPDATE_PROVIDER', result);
               return result;
            } else {
               throw result.message
            }

         }, (error_message) => {
            throw error_message;
         });
   }

   /**
    * Get identification information from the server
    * 
    * @return {Promise} 
    * @fires  istsos.Configuration#IDENTIFICATION            
    */
   getIdentification() {
      var url = `${this.server.getUrl()}wa/istsos/services/${this.serviceName}/configsections/identification`;

      let config = {}
      if(this.server.getLoginConfig()) {
         config['headers'] = this.server.getLoginConfig();
      }

      return HttpAPI.get(url, config)
         .then((result) => {
            if (result.success) {
               this.fireEvent('IDENTIFICATION', result);
               return result;
            } else {
               throw result.message
            }

         }, (error_message) => {
            throw error_message;
         });
   }

   /**
    * Update identification information on the server
    *
    * @param {object} options Set of key-value pairs
    * @return {Promise} 
    * @fires  istsos.Configuration#UPDATE_IDENTIFICATION            
    */
   updateIdentification(options = {}) {
      var url = `${this.server.getUrl()}wa/istsos/services/${this.serviceName}/configsections/identification`;

      let config = {}
      if(this.server.getLoginConfig()) {
         config['headers'] = this.server.getLoginConfig();
      }
      config['data'] = JSON.stringify(options);

      return HttpAPI.put(url, config)
         .then((result) => {
            if (result.success) {
               this.fireEvent('UPDATE_IDENTIFICATION', result);
               return result;
            } else {
               throw result.message
            }

         }, (error_message) => {
            throw error_message;
         });
   }

   /**
    * Get MQTT information from the server
    * 
    * @return {Promise} 
    * @fires  istsos.Configuration#MQTT            
    */
   getMqtt() {
      var url = `${this.server.getUrl()}wa/istsos/services/${this.serviceName}/configsections/mqtt`;
       
      let config = {}
      if(this.server.getLoginConfig()) {
         config['headers'] = this.server.getLoginConfig();
      }

      return HttpAPI.get(url, config)
         .then((result) => {
            if (result.success) {
               this.fireEvent('MQTT', result);
               return result;
            } else {
               throw result.message
            }

         }, (error_message) => {
            throw error_message;
         });
   }

   /**
    * Update MQTT information on the server
    *
    * @param {object} options Set of key-value pairs
    * @return {Promise} 
    * @fires  istsos.Configuration#UPDATE_MQTT            
    */
   updateMqtt(options = {}) {
      var url = `${this.server.getUrl()}wa/istsos/services/${this.serviceName}/configsections/mqtt`;
     
      let config = {}
      if(this.server.getLoginConfig()) {
         config['headers'] = this.server.getLoginConfig();
      }
      config['data'] = JSON.stringify(options);

      return HttpAPI.put(url, config)
         .then((result) => {
            if (result.success) {
               this.fireEvent('UPDATE_MQTT', result);
               return result;
            } else {
               throw result.message
            }

         }, (error_message) => {
            throw error_message;
         });
   }

   /**
    * Get coordinate reference system information from the server
    * 
    * @return {Promise} 
    * @fires  istsos.Configuration#CRS            
    */
   getCrs() {
      var url = `${this.server.getUrl()}wa/istsos/services/${this.serviceName}/configsections/geo`;
 
      let config = {}
      if(this.server.getLoginConfig()) {
         config['headers'] = this.server.getLoginConfig();
      }

      return HttpAPI.get(url, config)
         .then((result) => {
            if (result.success) {
               this.fireEvent('CRS', result);
               return result;
            } else {
               throw result.message
            }

         }, (error_message) => {
            throw error_message;
         });
   }

   /**
    * Update CRS information on the server
    *
    * @param {object} options Set of key-value pairs
    * @return {Promise} 
    * @fires  istsos.Configuration#UPDATE_CRS            
    */
   updateCrs(options = {}) {
      var url = `${this.server.getUrl()}wa/istsos/services/${this.serviceName}/configsections/geo`;
      
      let config = {}
      if(this.server.getLoginConfig()) {
         config['headers'] = this.server.getLoginConfig();
      }
      config['data'] = JSON.stringify(options);

      return HttpAPI.put(url, config)
         .then((result) => {
            if (result.success) {
               this.fireEvent('UPDATE_CRS', result);
               return result;
            } else {
               throw result.message
            }

         }, (error_message) => {
            throw error_message;
         });
   }

   /**
    * Get observation configuration information from the server
    * 
    * @return {Promise} 
    * @fires  istsos.Configuration#OBSERVATION_CONF            
    */
   getObservationConf() {
      var url = `${this.server.getUrl()}wa/istsos/services/${this.serviceName}/configsections/getobservation`;

      let config = {}
      if(this.server.getLoginConfig()) {
         config['headers'] = this.server.getLoginConfig();
      }

      return HttpAPI.get(url, config)
         .then((result) => {
            if (result.success) {
               this.fireEvent('OBSERVATION_CONF', result);
               return result;
            } else {
               throw result.message
            }

         }, (error_message) => {
            throw error_message;
         });
   }

   /**
    * Update observation configuration information on the server
    *
    * @param {object} options Set of key-value pairs
    * @return {Promise} 
    * @fires  istsos.Configuration#UPDATE_OBSERVATION_CONF            
    */
   updateObservationConf(options = {}) {
      var url = `${this.server.getUrl()}wa/istsos/services/${this.serviceName}/configsections/getobservation`;
      
      let config = {}
      if(this.server.getLoginConfig()) {
         config['headers'] = this.server.getLoginConfig();
      }
      config['data'] = JSON.stringify(options);

      return HttpAPI.put(url, config)
         .then((result) => {
            if (result.success) {
               this.fireEvent('UPDATE_OBSERVATION_CONF', result);
               return result;
            } else {
               throw result.message
            }

         }, (error_message) => {
            throw error_message;
         });
   }

   /**
    * Get proxy information from the server
    * 
    * @return {Promise} 
    * @fires  istsos.Configuration#PROXY            
    */
   getProxy() {
      var url = `${this.server.getUrl()}wa/istsos/services/${this.serviceName}/configsections/serviceurl`;

      let config = {}
      if(this.server.getLoginConfig()) {
         config['headers'] = this.server.getLoginConfig();
      }

      return HttpAPI.get(url, config)
         .then((result) => {
            if (result.success) {
               this.fireEvent('PROXY', result);
               return result;
            } else {
               throw result.message
            }

         }, (error_message) => {
            throw error_message;
         });
   }

   /**
    * Update proxy information on the server
    *
    * @param {string} newUrl New proxy URL
    * @return {Promise} 
    * @fires  istsos.Configuration#UPDATE_PROXY            
    */
   updateProxy(newUrl = "") {
      var data = {
         "url": newUrl || ""
      }
      var url = `${this.server.getUrl()}wa/istsos/services/${this.serviceName}/configsections/serviceurl`;
      
      let config = {}
      if(this.server.getLoginConfig()) {
         config['headers'] = this.server.getLoginConfig();
      }
      config['data'] = JSON.stringify(data);

      return HttpAPI.put(url, config)
         .then((result) => {
            if (result.success) {
               this.fireEvent('UPDATE_PROXY', result);
               return result;
            } else {
               throw result.message
            }

         }, (error_message) => {
            throw error_message;
         });
   }

   /**
    * Get EPSG codes from the server
    * 
    * @return {Promise} 
    * @fires  istsos.Configuration#EPSG_CODES            
    */
   getEpsgCodes() {
      var url = `${this.server.getUrl()}wa/istsos/services/${this.serviceName}/epsgs`;
       
      let config = {}
      if(this.server.getLoginConfig()) {
         config['headers'] = this.server.getLoginConfig();
      }

      return HttpAPI.get(url, config)
         .then((result) => {
            if (result.success) {
               this.fireEvent('EPSG_CODES', result);
               return result;
            } else {
               throw result.message
            }

         }, (error_message) => {
            throw error_message;
         });
   }
}