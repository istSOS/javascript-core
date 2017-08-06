import {ProcedureBase} from 'ProcedureBase';
import {HttpAPI} from 'HttpAPI';
/**
 * istsos.Procedure 
 * 
 * @class
 * @extends istsos.EventEmitter
 */
export var Procedure = class Procedure extends ProcedureBase {
   /**
    * constructor - instantiates istsos.Procedure
    * 
    * @param  {Object} options Set of key-value pairs
    * @constructor
    */
   constructor(options) {
      super({
         name: options.name,
         description: options.description,
         keywords: options.keywords,
         foi_name: options.foi_name,
         epsg: options.epsg,
         x: options.x,
         y: options.y,
         z: options.z,
         outputs: options.outputs
      });
      this.systemType = (options.systemType === "insitu-fixed-point" || options.systemType === "insitu-mobile-point") ? options.systemType : null;
      this.sensorType = options.sensorType || "";
      this.service = options.service;
      this.service.addProcedure(this);
      this.service.getOfferingsProperty()[0].getMemberProceduresProperty().push(this);
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
   getProcedureJSON() {
      var procedureJSON = super.getProcedureBaseJSON();
      procedureJSON["classification"] = [{
         "name": "System Type",
         "definition": "urn:ogc:def:classifier:x-istsos:1.0:systemType",
         "value": (this.systemType === "insitu-mobile-point" || this.systemType === "insitu-fixed-point") ? this.systemType : null
      }, {
         "name": "Sensor Type",
         "definition": "urn:ogc:def:classifier:x-istsos:1.0:sensorType",
         "value": this.sensorType
      }];
      return procedureJSON
   }

   /**
    * Update procedure on the server
    *
    * @param {object} options Set of key-value pairs
    * @return {Promise} 
    * @fires  istsos.Procedure#UPDATE_PROCEDURE            
    */
   updateProcedure(options) {
      const oldName = this.name;
      this.name = options.name || this.name;
      this.description = options.description || this.description;
      this.keywords = options.keywords || this.keywords;
      this.foi_name = options.foi_name || this.foi_name;
      this.epsg = option.sepsg || this.epsg;
      this.coordinates = [options.x, options.y, options.z] || this.coordinates;
      var outputs_array = this.outputs;
      if (options.outputs || options.outputs.length !== 0) {
         outputs_array.splice(1, outputs_array.length - 1);
         options.outputs.forEach(function(out) {
            outputs_array.push(out)
         });
      }
      this.systemType = (options.systemType === "insitu-fixed-point" || options.systemType === "insitu-mobile-point") ?
         options.systemType : null;
      this.sensorType = options.sensorType || "";

      var url = `${this.service.server.getUrl()}wa/istsos/services/${this.service.getServiceJSON()["service"]}/procedures/${oldName}`;

      let config = {};
      if (this.service.server.getLoginConfig()) {
         config['headers'] = this.service.server.getLoginConfig();
      }
      config['data'] = JSON.stringify(this.getProcedureJSON());

      return HttpAPI.put(url, config)
         .then((result) => {
            if (result.success) {
               this.fireEvent('UPDATE_PROCEDURE', result);
               return result;
            } else {
               throw result.message
            }
         }, (error_message) => {
            throw error_message;
         });
   }

   /**
    * Delete procedure on the server
    *
    * @return {Promise} 
    * @fires  istsos.Procedure#DELETE_PROCEDURE            
    */
   deleteProcedure() {
      var procedures = this.service.getProceduresProperty();
      var obj = this.getProcedureJSON();
      procedures.forEach(function(p) {
         if (p.getProcedureJSON()["system"] === obj["system"]) {
            procedures.splice(procedures.indexOf(p), 1);
         }
      });

      var url = `${this.service.server.getUrl()}wa/istsos/services/${this.service.getServiceJSON()["service"]}/procedures/${this.name}`;

      let config = {};
      if (this.service.server.getLoginConfig()) {
         config['headers'] = this.service.server.getLoginConfig();
      }

      return HttpAPI.delete(url, config)
         .then((result) => {
            if (result.success) {
               this.fireEvent('DELETE_PROCEDURE', result);
               return result;
            } else {
               throw result.message
            }
         }, (error_message) => {
            throw error_message;
         });
   }

   /**
    * Add procedure's membership to offering on the server
    *
    * @param {istsos.Offering} offering istsos.Offering class
    * @return {Promise} 
    * @fires  istsos.Offering#ADD_TO_OFFERING            
    */
   addMembershipToOffering(offering) {
      offering.getMemberProceduresProperty().push(this);
      var url = `${this.service.server.getUrl()}wa/istsos/services/${this.service.getServiceJSON()["service"]}/offerings/${offering.getOfferingJSON()["name"]}/procedures`;

      var data = [{
         "offering": offering.getOfferingJSON()["name"],
         "procedure": this.getProcedureJSON()["system"]
      }];

      let config = {};
      if (this.service.server.getLoginConfig()) {
         config['headers'] = this.service.server.getLoginConfig();
      }
      config['data'] = JSON.stringify(data);

      return HttpAPI.post(url, config)
         .then((result) => {
            if (result.success) {
               this.fireEvent('ADD_TO_OFFERING', result);
               return result;
            } else {
               throw result.message
            }
         }, (error_message) => {
            throw error_message;
         });
   }

   /**
    * Remove procedure's membership from offering on the server
    *
    * @param {istsos.Offering} offering istsos.Offering class
    * @return {Promise} 
    * @fires  istsos.Offering#REMOVE_FROM_OFFERING            
    */
   removeMembershipFromOffering(offering) {
      var procedures = offering.getMemberProceduresProperty();
      var pname = this.name;
      procedures.forEach(function(p) {
         if (p.name === pname) {
            procedures.splice(procedures.indexOf(p), 1);
         }
      });

      var url = `${this.service.server.getUrl()}wa/istsos/services/${this.service.getServiceJSON()["service"]}/offerings/${offering.getOfferingJSON()["name"]}/procedures/${this.getProcedureJSON()["system"]}`;

      var data = [{
         "offering": offering.getOfferingJSON()["name"],
         "procedure": this.getProcedureJSON()["system"]
      }];

      let config = {};
      if (this.service.server.getLoginConfig()) {
         config['headers'] = this.service.server.getLoginConfig();
      }
      config['data'] = JSON.stringify(data);

      return HttpAPI.delete(url, config)
         .then((result) => {
            if (result.success) {
               this.fireEvent('REMOVE_FROM_OFFERING', result);
               return result;
            } else {
               throw result.message
            }
         }, (error_message) => {
            throw error_message;
         });
   }

   /**
    * @return {Array<istsos.Output>}
    */
   getOutputsProperty() {
      return super.getOutputsProperty();
   }
}