import {HttpAPI } from 'HttpAPI'; 
import {EventEmitter } from 'EventEmitter';
/**
 * istsos.DataQuality 
 * 
 * @class
 * @extends istsos.EventEmitter
 */
export var DataQuality = class DataQuality extends EventEmitter {
   /**
    * constructor - instantiates istsos.DataQuality
    * 
    * @param  {Object} options Set of key-value pairs
    * @constructor
    */
   constructor(options) {
      super();
      this.code = options.codeDQ;
      this.name = options.nameDQ;
      this.description = options.descrDQ || "";
      this.service = options.service;
      options.service.addDataQuality(this);
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
    * @return {Object}
    */
   getDataQualityJSON() {
      var dqJSON = {
         "code": this.code.toString(),
         "name": this.name,
         "description": this.description
      };
      return dqJSON;
   }

   /**
    * Update data quality on the server
    *
    * @param {object} options Set of key-value pairs
    * @return {Promise} 
    * @fires  istsos.DataQuality#UPDATE_DATAQUALITY            
    */
   updateDataQuality(options) {
      const oldName = this.code;
      this.code = options.newCodeDQ || this.code;
      this.name = options.newNameDQ || this.name;
      this.description = options.newDescrDQ || this.description;

      var url = `${this.service.server.getUrl()}wa/istsos/services/${this.service.getServiceJSON()["service"]}/dataqualities/${oldName}`;
      
      let config = {};
      if(this.service.server.getLoginConfig()) {
         config['headers'] = this.service.server.getLoginConfig();
      }
      config['data'] = JSON.stringify(this.getDataQualityJSON());

      return HttpAPI.put(url, config)
         .then((result) => {
            if (result.success) {
               this.fireEvent('UPDATE_DATAQUALITY', result);
               return result;
            } else {
               throw result.message
            }
         }, (error_message) => {
            throw error_message;
         });
   }

   /**
    * Delete data quality on the server
    *
    * @param {object} options Set of key-value pairs
    * @return {Promise} 
    * @fires  istsos.DataQuality#DELETE_DATAQUALITY            
    */
   deleteDataQuality() {
      var dataQualities = this.service.getDataQualitiesProperty();
      for (var i = 0; i < dataQualities.length; i++) {
         if (this.code === dataQualities[i]["code"]) {
            dataQualities.splice(i, 1);
         }
      }

      var url = `${this.service.server.getUrl()}wa/istsos/services/${this.service.getServiceJSON()["service"]}/dataqualities/${this.getDataQualityJSON()["code"]}`;
     
      let config = {};
      if(this.service.server.getLoginConfig()) {
         config['headers'] = this.service.server.getLoginConfig();
      }
      config['data'] = JSON.stringify(this.getDataQualityJSON());

      return HttpAPI.delete(url, config)
         .then((result) => {
            if (result.success) {
               this.fireEvent('DELETE_DATAQUALITY', result);
               return result;
            } else {
               throw result.message
            }
         }, (error_message) => {
            throw error_message;
         });
   }

}