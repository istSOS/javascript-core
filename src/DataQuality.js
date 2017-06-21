import {HttpAPI } from 'HttpAPI'; 
import {EventEmitter } from 'EventEmitter';

/** istsos.DataQuality class */
/**
 * @param {istsos.Service} service
 * @param {int} codeDQ
 * @param {String} nameDQ
 * @param {String} descrDQ
 * @constructor
 */
export var DataQuality = class DataQuality extends EventEmitter {
   constructor(options) {
      super();
      this.code = options.codeDQ;
      this.name = options.nameDQ;
      this.description = options.descrDQ || "";
      this.service = options.service;
      service.addDataQuality(this);
   }

   fireEvent(eventType, response) {
      super.fire(eventType, response)
   }

   on(event, callback) {
      super.on(event, callback);
   }

   once(event, callback) {
      super.once(event, callback);
   }

   off(event, callback) {
      super.off(event, callback);
   }

   unlistenAll() {
      super.unlistenAll(event, callback);
   }

   /**
    * @returns {JSON}
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
    * @fires istsos.DataQuality#istsos.events.EventType: UPDATE_DATAQUALITY
    * @param {int} newCodeDQ
    * @param {String} newNameDQ
    * @param {String} newDescrDQ
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
    * @fires istsos.DataQuality#istsos.events.EventType: DELETE_DATAQUALITY
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