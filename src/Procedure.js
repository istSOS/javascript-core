goog.require('goog.events');
goog.require('goog.events.Event');
goog.require('goog.events.EventTarget');
goog.require('goog.net.XhrIo');
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
      this.systemType = (options.systemType === "insitu-fixed-point" || options.systemType === "insitu-mobile-point") ? options.systemType : null;
      this.sensorType = options.sensorType || "";
      this.service = options.service;
      service.addProcedure(this);
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

   /**
    * @fires istsos.Procedure#istsos.events.EventType: DELETE_PROCEDURE
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
      this.executeRequest(url, istsos.events.EventType.DELETE_PROCEDURE, "DELETE");
   }

   /**
    * @fires istsos.Procedure#istsos.events.EventType: ADD_TO_OFFERING
    * @param {istsos.Offering} offering
    */
   addMembershipToOffering(offering) {
      offering.getMemberProceduresProperty().push(this);
      var url = `${this.service.server.getUrl()}wa/istsos/services/${this.service.getServiceJSON()["service"]}/offerings/${offering.getOfferingJSON()["name"]}/procedures`;
      this.executeRequest(url, istsos.events.EventType.ADD_TO_OFFERING, "POST", JSON.stringify([{
         "offering": offering.getOfferingJSON()["name"],
         "procedure": this.getProcedureJSON()["system"]
      }]));
   }

   /**
    * @fires istsos.Procedure#istsos.events.EventType: REMOVE_FROM_OFFERING
    * @param {istsos.Offering} offering
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
      this.executeRequest(url, istsos.events.EventType.REMOVE_FROM_OFFERING, "DELETE", JSON.stringify([{
         "offering": offering.getOfferingJSON()["name"],
         "procedure": this.getProcedureJSON()["system"]
      }]));
   }

   /**
    * @returns {Array<istsos.Output>}
    */
   getOutputsProperty() {
      return super.getOutputsProperty();
   }
}