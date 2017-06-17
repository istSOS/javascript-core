goog.require('goog.events');
goog.require('goog.events.Event');
goog.require('goog.events.EventTarget');
goog.require('goog.net.XhrIo');
/** istsos.ObservedProperty class */
/**
 * @param {istsos.Service} service
 * @param {String} observedName
 * @param {String} definitionUrn
 * @param {String} observedDescr
 * @param {String} opt_constraintType (allowed_values:"between", "lessThan", "greaterThan", "valueList")
 * @param {Array|int} opt_value (Array or integer, depending on constraint type)
 * @constructor
 */

istsos.ObservedProperty = class {
   constructor(options) {
      this.observedName = options.observedName;
      this.definitionUrn = options.definitionUrn;
      this.observedDescr = options.observedDescr || "";
      this.constraint = null;
      var check = this.validateConstraintInput(options.opt_constraintType, options.opt_value);
      if (check === true) {
         this.constraint = {};
         this.constraint["role"] = "urn:x-ogc:def:classifiers:x-istsos:1.0:qualityIndexCheck:level0";
         this.constraint[istsos.observedProperty.ConstraintInputs[options.opt_constraintType]] = (options.opt_value.constructor === Array) ?
            options.opt_value.toString().split(",") : options.opt_value.toString();
      } else {
         console.log(`Input constraintType and constraintValue for property <${this.observedName.toUpperCase()}> are INCORRECT or INTENTIONALLY NULL!!! `);
      }
      this.service = options.service;
      this.proceduresIncluded = [];
      this.updateProceduresIncluded();
      service.addObservedProperty(this);
   }

   executeRequest(url, eventType, method, opt_data) {
      goog.net.XhrIo.send(url, function(e) {
         istsos.fire(eventType, e.target);
      }, method, opt_data);
   }

   updateProceduresIncluded() {
      var procedures = this.service.getProceduresProperty();
      var v_procedures = this.service.getVirtualProceduresProperty();
      var all = procedures.concat(v_procedures);
      var name = this.observedName;
      if (all.length !== 0) {
         for (var i = 0; i < all.length; i++) {
            for (var j = 0; j < all[i].getOutputsProperty().length; j++) {
               if (name = all[i].getOutputsProperty()[j]["name"]) {
                  this.getProceduresIncluded().push(all[i]);
               }
            }
         }
      }
   }

   /**
    * @returns {Array<istsos.Procedure|istsos.VirtualProcedure>}
    */
   getProceduresIncluded() {
      return this.proceduresIncluded;
   }

   /**
    * @returns {JSON}
    */
   getObservedPropertyJSON() {
      var observedJSON = {
         "name": this.observedName,
         "definition": this.definitionUrn,
         "description": this.observedDescr,
         "constraint": this.constraint
      };
      return observedJSON;
   }

   /**
    * @fires istsos.ObservedProperty#istsos.events.EventType: UPDATE_OBSERVED_PROPERTY
    * @param {String} newPropertyName
    * @param {String} newDefinitionUrn
    * @param {String} newPropertyDescr
    * @param {String} opt_constraintType
    * @param {Array<int>|int} opt_value
    */
   updateObservedProperty(options) {
      const oldDefinitionUrn = this.definitionUrn;
      this.observedName = options.newPropertyName || this.observedName;
      this.definitionUrn = options.newDefinitionUrn || this.definitionUrn;
      this.observedDescr = options.newPropertyName || this.observedDescr;
      if (this.validateConstraintInput(options.opt_constraintType, options.opt_value) === true) {
         this.constraint = {};
         this.constraint["role"] = "urn:x-ogc:def:classifiers:x-istsos:1.0:qualityIndexCheck:level0";
         this.constraint[istsos.ConstraintInputs[options.opt_constraintType]] = (options.opt_value.constructor === Array) ?
            options.opt_value.toString().split(",") : options.opt_value.toString();
      } else {
         console.log(`Input constraintType and constraintValue for property <${this.observedName.toUpperCase()}> are INCORRECT or INTENTIONALLY NULL!!! `);
      }
      var url = `${this.service.server.getUrl()}wa/istsos/services/${this.service.getServiceJSON()["service"]}/observedproperties/${oldDefinitionUrn}`;
      this.executeRequest(url, istsos.events.EventType.UPDATE_OBSERVED_PROPERTY, "PUT", JSON.stringify(this.getObservedPropertyJSON()));
   }

   /**
    * @fires istsos.ObservedProperty#istsos.events.EventType: DELETE_OBSERVED_PROPERTY
    */
   deleteObservedProperty() {
      var procedures = this.service.getProceduresProperty();
      var v_procedures = this.service.getVirtualProceduresProperty();
      var properties_service = this.service.getObservedPropertiesProperty();
      var all = procedures.concat(v_procedures);
      var outputs = [];
      all.forEach(function(p) {
         outputs.concat(p.getOutputsProperty());
      });
      var name = this.observedName;
      var connected = false;
      for (var i = 0; i < outputs.length; i++) {
         if (name === outputs[i].getOutputJSON()["name"]) {
            alert("CONNECTED TO PROCEDURE");
            connected = true;
            break
         }
      }
      if (connected === false) {
         for (var j = 0; j < properties_service.length; j++) {
            if (this === properties_service[j]) {
               properties_service.splice(j, 1);
            }
         }
      }
      var url = `${this.service.server.getUrl()}wa/istsos/services/${this.service.getServiceJSON()["service"]}/observedproperties/${this.getObservedPropertyJSON()["definition"]}`;
      this.executeRequest(url, istsos.events.EventType.DELETE_OBSERVED_PROPERTY, "DELETE");
   }

   /**
    * @param {String} constraintType
    * @param {Array|int} constraintValue
    * @returns {boolean}
    */
   validateConstraintInput: function(constraintType, constraintValue) {
      switch (constraintType) {
         case "between":
            if (constraintValue.constructor !== Array) {
               return false;
            } else {
               return true;
            }
         case "lessThan":
            if (constraintValue !== parseInt(constraintValue, 10)) {
               return false;
            } else {
               return true;
            }
         case "greaterThan":
            if (constraintValue !== parseInt(constraintValue, 10)) {
               return false;
            } else {
               return true;
            }
         case "valueList":
            if (constraintValue.constructor !== Array) {
               return false;
            } else {
               return true;
            }
         default:
            console.log('Constraint type must be "between", "lessThan", "greaterThan" or "valueList"');
            return false;
      }
   }
}

istsos.observedProperty.ConstraintInputs = {
   "between": "interval",
   "lessThan": "max",
   "greaterThan": "min",
   "valueList": "valueList"
};