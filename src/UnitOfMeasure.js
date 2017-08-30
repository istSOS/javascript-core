import {HttpAPI } from 'HttpAPI'; 
import {EventEmitter } from 'EventEmitter';
/**
 * istsos.UnitOfMeasure 
 * 
 * @class
 * @extends istsos.EventEmitter
 */
export var UnitOfMeasure = class UnitOfMeasure extends EventEmitter {
   /**
    * constructor - instantiates istsos.UnitOfMeasure
    * 
    * @param  {Object} options Set of key-value pairs
    * @constructor
    */
   constructor(options) {
   	super();
      this.name = options.name;
      this.description = options.description || "";
      this.proceduresIncluded = [];
      this.service = options.service;
      options.service.addUom(this);
      this.updateProceduresIncluded();
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
    * Update procedures and virtual procedures included
    */
   updateProceduresIncluded() {
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
    * @return {Object}
    */
   getUomJSON() {
      var uomJSON = {
         "name": this.name,
         "description": this.description
      };
      return uomJSON;
   }

   /**
    * Update unit of measure on the server
    *
    * @param {object} options Set of key-value pairs
    * @return {Promise} 
    * @fires  istsos.UnitOfMeasure#UPDATE_UOM            
    */
   updateUom(options) {
      const oldName = this.name;
      this.name = options.newName || this.name;
      this.description = options.newDescr || this.description;

      var url = `${this.service.server.getUrl()}wa/istsos/services/${this.service.getServiceJSON()["service"]}/uoms/${oldName}`;
   	
      let config = {};
      if(this.service.server.getLoginConfig()) {
         config['headers'] = this.service.server.getLoginConfig();
      }
      config['data'] = JSON.stringify(this.getUomJSON());

      return HttpAPI.put(url, config)
         .then((result) => {
            if (result.success) {
               this.fireEvent('UPDATE_UOM', result);
               return result;
            } else {
               throw result.message
            }
         }, (error_message) => {
            throw error_message;
         });
   }

   /**
    * Delete unit of measure on the server
    *
    * @param {object} options Set of key-value pairs
    * @return {Promise} 
    * @fires  istsos.UnitOfMeasure#DELETE_UOM            
    */
   deleteUom() {
      var procedures = this.service.getProceduresProperty();
      var v_procedures = this.service.getVirtualProceduresProperty();
      var uoms_service = this.service.getUomsProperty();
      var all = procedures.concat(v_procedures);
      var outputs = [];
      all.forEach(function(p) {
         outputs.concat(p.getOutputsProperty());
      });
      var code = this.name;
      var connected = false;
      for (var i = 0; i < outputs.length; i++) {
         if (code === outputs[i].getOutputJSON()["uom"]) {
            alert("CONNECTED TO PROCEDURE");
            connected = true;
            break
         }
      }
      if (connected === false) {
         for (var j = 0; j < uoms_service.length; j++) {
            if (this === uoms_service[j]) {
               uoms_service.splice(j, 1);
            }
         }
      }

      var url = `${this.service.server.getUrl()}wa/istsos/services/${this.service.getServiceJSON()["service"]}/uoms/${this.getUomJSON()["name"]}`;

      let config = {};
      if(this.service.server.getLoginConfig()) {
         config['headers'] = this.service.server.getLoginConfig();
      }
      config['data'] = JSON.stringify(this.getUomJSON());

      return HttpAPI.delete(url, config)
         .then((result) => {
            if (result.success) {
               this.fireEvent('DELETE_UOM', result);
               return result;
            } else {
               throw result.message
            }
         }, (error_message) => {
            throw error_message;
         });
   }
}