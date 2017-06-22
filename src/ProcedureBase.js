import {EventEmitter } from 'EventEmitter';
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
export var ProcedureBase = class ProcedureBase extends EventEmitter {
   constructor(options) {
      super();
      this.name = options.name;
      this.description = options.description || "";
      this.keywords = options.keywords || "";
      this.foi_name = options.foi_name;
      this.epsg = options.epsg;
      this.coordinates = [options.x, options.y, options.z];
      this.outputs = options.outputs || [];
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
    * @returns {Array<istsos.Output>}
    */
   getOutputsProperty() {
      return this.outputs;
   }

   /**
    * @returns {JSON}
    */
   getProcedureBaseJSON() {
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
      this.outputs.forEach(function(out) {
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
   createContactForm(options) {
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
   getCapabilitiesUom() {
      return ["µs", "ms", "s", "min", "h", "d"];
   }

   /**
    * @returns {Array<JSON>}
    */
   getCapabilitiesJson() {
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
   getIdentificationNames() {
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
      }]
   }
}