import {validateConstraintInput} from 'IstsosHelper';

/** istsos.Output clas */
/**
 * @param {istsos.ObservedProperty} property
 * @param {istsos.UnitOfMeasure} uom
 * @param {String} description
 * @param {String} opt_constraintType
 * @param {Array|int} opt_constraintValue
 * @constructor
 */
export var Output = class {
   constructor(options) {
      this.observedProperty = options.property;
      this.uom = options.uom;
      this.description = options.description || "";
      this.constraint = {};
      var check = validateConstraintInput(options.opt_constraintType, options.opt_constraintValue);
      if (check === true) {
         this.constraint["role"] = "urn:ogc:def:classifiers:x-istsos:1.0:qualityIndex:check:reasonable";
         this.constraint[istsos.observedProperty.ConstraintInputs[opt_constraintType]] = (opt_constraintValue.constructor === Array) ?
            opt_constraintValue.toString().split(",") : opt_constraintValue.toString();
      } else {
         console.log("Input constraintType and constraintValue are incorrect or intentionally null/undefined!!! ");
      }
   }
   /**
    * @returns {JSON}
    */
   getOutputJSON() {
      var outputJSON = {
         "name": this.observedProperty.getObservedPropertyJSON()["name"],
         "definition": this.observedProperty.getObservedPropertyJSON()["definition"],
         "uom": this.uom.getUomJSON()["name"],
         "description": this.description || "",
         "constraint": this.constraint
      };
      return outputJSON;
   }
}