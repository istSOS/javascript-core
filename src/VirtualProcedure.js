goog.require('goog.events');
goog.require('goog.events.Event');
goog.require('goog.events.EventTarget');
goog.require('goog.net.XhrIo');

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
istsos.Procedure = class Procedure extends istsos.ProcedureBase {
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
         "code": code
      } || {};
      this.ratingCurve = ratingCurve || {};
      service.addVirtualProcedure(this);
      service.getOfferingsProperty()[0].getMemberProceduresProperty().push(this);
   }

   executeRequest(url, eventType, method, opt_data) {
      goog.net.XhrIo.send(url, function(e) {
         istsos.fire(eventType, e.target);
      }, method, opt_data);
   }

   /**
    * @returns {JSON}
    */
   getProcedureJSON() {
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
    * @fires istsos.VirtualProcedure#istsos.events.EventType: GET_CODE
    */
   getCode() {
      var url = `${this.service.server.getUrl()}wa/istsos/services/${this.service.getServiceJSON()["service"]}/virtualprocedures/${this.getVirtualProcedureJSON()["system"]}/code`;
      this.executeRequest(url, istsos.events.EventType.GET_CODE, "GET");
   }

   /**
    * @fires istsos.VirtualProcedure#istsos.events.EventType: NEW_CODE
    */
   registerCode() {
      var url = `${this.service.server.getUrl()}wa/istsos/services/${this.service.getServiceJSON()["service"]}/virtualprocedures/${this.getVirtualProcedureJSON()["system"]}/code`;
      this.executeRequest(url, istsos.events.EventType.NEW_CODE, "POST", JSON.stringify(this.getCodeProperty()));
   }

   /**
    * @fires istsos.VirtualProcedure#istsos.events.EventType: UPDATE_CODE
    * @param {String} newCode
    */
   updateCode(newCode) {
      this.code = {
         "code": newCode
      } || this.code;
      var url = `${this.service.server.getUrl()}wa/istsos/services/${this.service.getServiceJSON()["service"]}/virtualprocedures/${this.getVirtualProcedureJSON()["system"]}/code`;
      this.executeRequest(url, istsos.events.EventType.UPDATE_CODE, "PUT", JSON.stringify(this.getCodeProperty()));
   }

   /**
    * @fires istsos.VirtualProcedure#istsos.events.EventType: DELETE_CODE
    */
   deleteCode() {
      this.code = "";
      var url = `${this.service.server.getUrl()}wa/istsos/services/${this.service.getServiceJSON()["service"]}/virtualprocedures/${this.getVirtualProcedureJSON()["system"]}/code`;
      this.executeRequest(url, istsos.events.EventType.DELETE_CODE, "DELETE");
   }

   /**
    * @returns {JSON}
    */
   getCodeProperty() {
      return this.code;
   }

   /**
    * @fires istsos.VirtualProcedure#istsos.events.EventType: RATING_CURVE
    */
   getRatingCurve() {
      var url = `${this.service.server.getUrl()}wa/istsos/services/${this.service.getServiceJSON()["service"]}/virtualprocedures/${this.getVirtualProcedureJSON()["system"]}/ratingcurve`;
      this.executeRequest(url, istsos.events.EventType.RATING_CURVE, "GET");
   }

   /**
    * @fires istsos.VirtualProcedure#istsos.events.EventType: NEW_RATING_CURVE
    */
   registerRatingCurve() {
      var url = `${this.service.server.getUrl()}wa/istsos/services/${this.service.getServiceJSON()["service"]}/virtualprocedures/${this.getVirtualProcedureJSON()["system"]}/ratingcurve`;
      this.executeRequest(url, istsos.events.EventType.NEW_RATING_CURVE, "POST", JSON.stringify(this.getRatingCurveProperty()));
   }

   /**
    * @fires istsos.VirtualProcedure#istsos.events.EventType: DELETE_RATING_CURVE
    */
   deleteRatingCurve() {
      this.ratingCurve = {};
      var url = `${this.service.server.getUrl()}wa/istsos/services/${this.service.getServiceJSON()["service"]}/virtualprocedures/${this.getVirtualProcedureJSON()["system"]}/ratingcurve`;
      this.executeRequest(url, istsos.events.EventType.DELETE_RATING_CURVE, "DELETE");
   }

   /**
    * @returns {JSON}
    */
   getRatingCurveProperty() {
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
      this.executeRequest(url, istsos.events.EventType.UPDATE_PROCEDURE, "PUT", JSON.stringify(this.getProcedureJSON()));
   }
}

istsos.VirtualProcedure.prototype = {

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
   updateVirtualProcedure: function(name, description, keywords, foi_name, epsg, x, y, z, outputs, systemType, sensorType) {
      var oldName = this.name;
      this.name = name || this.name;
      this.description = description || this.description;
      this.keywords = keywords || this.keywords;
      this.foi_name = foi_name || this.foi_name;
      this.epsg = epsg || this.epsg;
      this.coordinates = [x, y, z] || this.coordinates;
      var outputs_array = this.outputs;
      if (outputs || outputs.length !== 0) {
         outputs_array.splice(1, outputs_array.length - 1);
         outputs.forEach(function(out) {
            outputs_array.push(out)
         });
      }
      this.systemType = (systemType === "virtual") ? systemType : this.systemType;
      this.sensorType = sensorType || this.sensorType;
      var url = this.service.server.getUrl() + "wa/istsos/services/" + this.service.getServiceJSON()["service"] + "/virtualprocedures/" + oldName;
      this.executeRequest(url, istsos.events.EventType.UPDATE_V_PROCEDURE, "PUT", JSON.stringify(this.getVirtualProcedureJSON()));
   },
   /**
    * @fires istsos.VirtualProcedure#istsos.events.EventType: DELETE_V_PROCEDURE
    */
   deleteVirtualProcedure: function() {
      var v_procedures = this.service.getVirtualProceduresProperty();
      var obj = this.getVirtualProcedureJSON();
      v_procedures.forEach(function(p) {
         if (p.getVirtualProcedureJSON()["system"] === obj["system"]) {
            v_procedures.splice(v_procedures.indexOf(p), 1);
         }
      });
      var url = this.service.server.getUrl() + "wa/istsos/services/" + this.service.getServiceJSON()["service"] + "/virtualprocedures/" + this.name;
      this.executeRequest(url, istsos.events.EventType.DELETE_V_PROCEDURE, "DELETE");
   },
   /**
    * @fires istsos.VirtualProcedure#istsos.events.EventType: ADD_TO_OFFERING
    * @param {istsos.Offering} offering
    */
   addMembershipToOffering: function(offering) {
      offering.getMemberProceduresProperty().push(this);
      var url = this.service.server.getUrl() + "wa/istsos/services/" + this.service.getServiceJSON()["service"] + "/offerings/" +
         offering.getOfferingJSON()["name"] + "/procedures";
      this.executeRequest(url, istsos.events.EventType.ADD_TO_OFFERING, "POST", JSON.stringify([{
         "offering": offering.getOfferingJSON()["name"],
         "procedure": this.getVirtualProcedureJSON()["system"]
      }]));
   },
   /**
    * @fires istsos.VirtualProcedure#istsos.events.EventType: REMOVE_FROM_OFFERING
    * @param offering
    */
   removeMembershipFromOffering: function(offering) {
      var procedures = offering.getMemberProceduresProperty();
      var vp_name = this.name;
      procedures.forEach(function(p) {
         if (p.name === vp_name) {
            procedures.splice(procedures.indexOf(p), 1);
         }
      });
      var url = this.service.server.getUrl() + "wa/istsos/services/" + this.service.getServiceJSON()["service"] + "/offerings/" +
         offering.getOfferingJSON()["name"] + "/procedures/" + this.getVirtualProcedureJSON()["system"];
      this.executeRequest(url, istsos.events.EventType.REMOVE_FROM_OFFERING, "DELETE", JSON.stringify([{
         "offering": offering.getOfferingJSON()["name"],
         "procedure": this.getVirtualProcedureJSON()["system"]
      }]));
   },
   /**
    * @returns {Array<istsos.Output>}
    */
   getOutputsProperty: function() {
      return istsos.ProcedureBase.prototype.getOutputsProperty.call(this);
   }
};