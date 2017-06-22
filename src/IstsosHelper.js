/**
 * Constraint input validation
 * @param  {String} constraintType  Type of constraint
 * @param  {int} constraintValue    Constraint value
 * @return {boolean}    Returns validation confirmation - true or false
 */
var validateConstraintInput = (constraintType, constraintValue) => {
   switch (constraintType) {
      case 'between':
         if (constraintValue.constructor !== Array) {
            return false;
         } else {
            return true;
         }
      case 'lessThan':
         if (constraintValue !== parseInt(constraintValue, 10)) {
            return false;
         } else {
            return true;
         }
      case 'greaterThan':
         if (constraintValue !== parseInt(constraintValue, 10)) {
            return false;
         } else {
            return true;
         }
      case 'valueList':
         if (constraintValue.constructor !== Array) {
            return false;
         } else {
            return true;
         }
      default:
         throw 'Constraint type must be "between", "lessThan", "greaterThan" or "valueList"';
         return false;
   }
}

/**
 * Constraint inputs map for observed property
 * @type {Object}
 */
var ConstraintInputs = {
   "between": "interval",
   "lessThan": "max",
   "greaterThan": "min",
   "valueList": "valueList"
};

export {
   validateConstraintInput,
   ConstraintInputs
}