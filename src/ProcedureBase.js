import {EventEmitter } from 'EventEmitter';
/**
 * istsos.ProcedureBase 
 * 
 * @class
 * @extends istsos.EventEmitter
 */
export var ProcedureBase = class ProcedureBase extends EventEmitter {
   /**
    * constructor - instantiates istsos.ProcedureBase
    * 
    * @param  {Object} options Set of key-value pairs
    * @constructor
    */
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
    * @return {Array<istsos.Output>}
    */
   getOutputsProperty() {
      return this.outputs;
   }

   /**
    * @return {Object}
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
    * @param {Object} options
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
    * @return {Array<String>}
    */
   getCapabilitiesUom() {
      return ["µs", "ms", "s", "min", "h", "d"];
   }

   /**
    * @return {Array<Object>}
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
    * @return {Array<Object>}
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