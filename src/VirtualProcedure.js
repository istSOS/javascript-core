import {ProcedureBase} from 'ProcedureBase';
import {HttpAPI} from 'HttpAPI';
/**
 * istsos.VirtualProcedure 
 * 
 * @class
 * @extends istsos.EventEmitter
 */
export var VirtualProcedure = class VirtualProcedure extends ProcedureBase {
   /**
    * constructor - instantiates istsos.VirtualProcedure
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
      this.systemType = (options.systemType === "virtual") ? options.systemType : null;
      this.sensorType = options.sensorType || "";
      this.service = options.service;
      this.code = {
         "code":options.code
      } || {};
      this.ratingCurve = options.ratingCurve || {};
      options.service.addVirtualProcedure(this);
      options.service.getOfferingsProperty()[0].getMemberProceduresProperty().push(this);
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
   getVirtualProcedureJSON() {
      var vProcedureJSON = super.getProcedureBaseJSON();
      vProcedureJSON["classification"] = [{
         "name": "System Type",
         "definition": "urn:ogc:def:classifier:x-istsos:1.0:systemType",
         "value": (this.systemType === "virtual") ? this.systemType : null
      }, {
         "name": "Sensor Type",
         "definition": "urn:ogc:def:classifier:x-istsos:1.0:sensorType",
         "value": this.sensorType
      }];
      return vProcedureJSON
   }

   /**
    * Get virtual procedure code
    *
    * @return {Promise} 
    * @fires  istsos.VirtualProcedure#GET_CODE            
    */
   getCode() {
      var url = `${this.service.server.getUrl()}wa/istsos/services/${this.service.getServiceJSON()["service"]}/virtualprocedures/${this.getVirtualProcedureJSON()["system"]}/code`;

      let config = {};
      if(this.service.server.getLoginConfig()) {
         config['headers'] = this.service.server.getLoginConfig();
      }

      return HttpAPI.get(url, config)
         .then((result) => {
            if (result.success) {
               this.fireEvent('GET_CODE', result);
               return result;
            } else {
               throw result.message
            }
         }, (error_message) => {
            throw error_message;
         });
   }

   /**
    * Post new virtual procedure code
    *
    * @return {Promise} 
    * @fires  istsos.VirtualProcedure#NEW_CODE            
    */
   registerCode() {
      var url = `${this.service.server.getUrl()}wa/istsos/services/${this.service.getServiceJSON()["service"]}/virtualprocedures/${this.getVirtualProcedureJSON()["system"]}/code`;
      this.executeRequest(url, istsos.events.EventType.NEW_CODE, "POST", JSON.stringify(this.getCodeProperty()));
       
      let config = {};
      if(this.service.server.getLoginConfig()) {
         config['headers'] = this.service.server.getLoginConfig();
      }
      config['data'] = JSON.stringify(this.getCodeProperty());

      return HttpAPI.post(url, config)
         .then((result) => {
            if (result.success) {
               this.fireEvent('NEW_CODE', result);
               return result;
            } else {
               throw result.message
            }
         }, (error_message) => {
            throw error_message;
         });
   }

   /**
    * Update virtual procedure code
    *
    * @return {Promise} 
    * @fires  istsos.VirtualProcedure#UPDATE_CODE            
    */
   updateCode(newCode) {
      this.code = {
         "code": newCode
      } || this.code;
      var url = `${this.service.server.getUrl()}wa/istsos/services/${this.service.getServiceJSON()["service"]}/virtualprocedures/${this.getVirtualProcedureJSON()["system"]}/code`;
      
      let config = {};
      if(this.service.server.getLoginConfig()) {
         config['headers'] = this.service.server.getLoginConfig();
      }
      config['data'] = JSON.stringify(this.getCodeProperty());

      return HttpAPI.put(url, config)
         .then((result) => {
            if (result.success) {
               this.fireEvent('UPDATE_CODE', result);
               return result;
            } else {
               throw result.message
            }
         }, (error_message) => {
            throw error_message;
         });
   }

   /**
    * Delete virtual procedure code
    *
    * @return {Promise} 
    * @fires  istsos.VirtualProcedure#DELETE_CODE            
    */
   deleteCode() {
      this.code = "";
      var url = `${this.service.server.getUrl()}wa/istsos/services/${this.service.getServiceJSON()["service"]}/virtualprocedures/${this.getVirtualProcedureJSON()["system"]}/code`;
      
      let config = {};
      if(this.service.server.getLoginConfig()) {
         config['headers'] = this.service.server.getLoginConfig();
      }

      return HttpAPI.delete(url, config)
         .then((result) => {
            if (result.success) {
               this.fireEvent('DELETE_CODE', result);
               return result;
            } else {
               throw result.message
            }
         }, (error_message) => {
            throw error_message;
         });
   }

   /**
    * @return {Object}
    */
   getCodeProperty() {
      return this.code;
   }

   /**
    * Get virtual procedure rating curve
    *
    * @return {Promise} 
    * @fires  istsos.VirtualProcedure#RATING_CURVE            
    */
   getRatingCurve() {
      var url = `${this.service.server.getUrl()}wa/istsos/services/${this.service.getServiceJSON()["service"]}/virtualprocedures/${this.getVirtualProcedureJSON()["system"]}/ratingcurve`;
       
      let config = {};
      if(this.service.server.getLoginConfig()) {
         config['headers'] = this.service.server.getLoginConfig();
      }

      return HttpAPI.get(url, config)
         .then((result) => {
            if (result.success) {
               this.fireEvent('RATING_CURVE', result);
               return result;
            } else {
               throw result.message
            }
         }, (error_message) => {
            throw error_message;
         });
   }

   /**
    * Post virtual procedure rating curve
    *
    * @return {Promise} 
    * @fires  istsos.VirtualProcedure#NEW_RATING_CURVE            
    */
   registerRatingCurve() {
      var url = `${this.service.server.getUrl()}wa/istsos/services/${this.service.getServiceJSON()["service"]}/virtualprocedures/${this.getVirtualProcedureJSON()["system"]}/ratingcurve`;
       
      let config = {};
      if(this.service.server.getLoginConfig()) {
         config['headers'] = this.service.server.getLoginConfig();
      }
      config['data'] = JSON.stringify(this.getRatingCurveProperty());

      return HttpAPI.post(url, config)
         .then((result) => {
            if (result.success) {
               this.fireEvent('NEW_RATING_CURVE', result);
               return result;
            } else {
               throw result.message
            }
         }, (error_message) => {
            throw error_message;
         });
   }

   /**
    * Delete virtual procedure's rating curve
    *
    * @return {Promise} 
    * @fires  istsos.VirtualProcedure#DELETE_RATING_CURVE            
    */
   deleteRatingCurve() {
      this.ratingCurve = {};
      var url = `${this.service.server.getUrl()}wa/istsos/services/${this.service.getServiceJSON()["service"]}/virtualprocedures/${this.getVirtualProcedureJSON()["system"]}/ratingcurve`;
      
      let config = {};
      if(this.service.server.getLoginConfig()) {
         config['headers'] = this.service.server.getLoginConfig();
      }

      return HttpAPI.delete(url, config)
         .then((result) => {
            if (result.success) {
               this.fireEvent('DELETE_RATING_CURVE', result);
               return result;
            } else {
               throw result.message
            }
         }, (error_message) => {
            throw error_message;
         });
   }

   /**
    * @return {Object}
    */
   getRatingCurveProperty() {
      return this.ratingCurve;
   }


   /**
    * Update virtual procedure on the server
    *
    * @param {object} options Set of key-value pairs
    * @return {Promise} 
    * @fires  istsos.VirtualProcedure#UPDATE_V_PROCEDURE            
    */
   updateVirtualProcedure(options) {
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
      this.systemType = (options.systemType === "virtual") ? options.systemType : null;
      this.sensorType = options.sensorType || "";

      var url = `${this.service.server.getUrl()}wa/istsos/services/${this.service.getServiceJSON()["service"]}/virtualprocedures/${oldName}`;
      
      let config = {};
      if(this.service.server.getLoginConfig()) {
         config['headers'] = this.service.server.getLoginConfig();
      }
      config['data'] = JSON.stringify(this.getVirtualProcedureJSON());

      return HttpAPI.put(url, config)
         .then((result) => {
            if (result.success) {
               this.fireEvent('UPDATE_V_PROCEDURE', result);
               return result;
            } else {
               throw result.message
            }
         }, (error_message) => {
            throw error_message;
         });
   }

   /**
    * Delete virtual procedure on the server
    *
    * @return {Promise} 
    * @fires  istsos.Procedure#DELETE_PROCEDURE            
    */
   deleteVirtualProcedure() {
      var v_procedures = this.service.getVirtualProceduresProperty();
      var obj = this.getVirtualProcedureJSON();
      v_procedures.forEach(function(p) {
         if (p.getVirtualProcedureJSON()["system"] === obj["system"]) {
            v_procedures.splice(v_procedures.indexOf(p), 1);
         }
      });

      var url = `${this.service.server.getUrl()}wa/istsos/services/${this.service.getServiceJSON()["service"]}/virtualprocedures/${this.name}`;
      
      let config = {};
      if(this.service.server.getLoginConfig()) {
         config['headers'] = this.service.server.getLoginConfig();
      }

      return HttpAPI.delete(url, config)
         .then((result) => {
            if (result.success) {
               this.fireEvent('DELETE_V_PROCEDURE', result);
               return result;
            } else {
               throw result.message
            }
         }, (error_message) => {
            throw error_message;
         });
   }

   /**
    * Add virtual procedure's membership to offering on the server
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
         "procedure": this.getVirtualProcedureJSON()["system"]
      }];
       
      let config = {};
      if(this.service.server.getLoginConfig()) {
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
    * Remove virtual procedure's membership from offering on the server
    *
    * @param {istsos.Offering} offering istsos.Offering class
    * @return {Promise} 
    * @fires  istsos.Offering#REMOVE_FROM_OFFERING            
    */
   removeMembershipFromOffering(offering) {
      var procedures = offering.getMemberProceduresProperty();
      var vp_name = this.name;
      procedures.forEach(function(p) {
         if (p.name === vp_name) {
            procedures.splice(procedures.indexOf(p), 1);
         }
      });
      var url = `${this.service.server.getUrl()}wa/istsos/services/${this.service.getServiceJSON()["service"]}/offerings/${offering.getOfferingJSON()["name"]}/procedures/${this.getVirtualProcedureJSON()["system"]}`;

      var data = [{
         "offering": offering.getOfferingJSON()["name"],
         "procedure": this.getVirtualProcedureJSON()["system"]
      }];
       
      let config = {};
      if(this.service.server.getLoginConfig()) {
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