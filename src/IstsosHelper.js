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

var aggregateFunctions = ["SUM", "MAX", "MIN", "AVG"];

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
 * Prepare input data for getObservation request based on type and config
 * @param  {String} type       One of the observation getter types
 * @param  {Object} options    Required params for get observation request
 * @param  {Object} opt_config Config object for data aggregation or quality index constraint
 * @return {[type]}            [description]
 */
var prepareForGetObservations = (options, opt_config) => {
   var config = {}
   if (type === 'aggregation') {
      config["aggregationURL"] = prepareDataAggregation(opt_config);
   }
   config['offering'] = options.offering.getOfferingJSON()['name'];
   config['procedureNames'] = prepareProcedureNames(options.procedures);
   config['observedPropertyUrns'] = prepareObservedPropertyUrns(options.observedProperties);
   config['begin'] = (options.beginTime instanceof istsos.Date) ? options.beginTime.getDateString() : options.beginTime;
   config['end'] = (options.endTime instanceof istsos.Date) ? options.endTime.getDateString() : options.endTime;
   return config;
}

var prepareDataAggregation = (aggregationConfig) => {
   let url = '';
   if (aggregationConfig.aggFunc && aggregationConfig.aggInterval) {
      url += '?';

      if (aggregateFunctions.indexOf(aggregationConfig.aggFunc) > 0) {
         url += `aggregatefunction=${aggregationConfig.aggFunc}&aggregateinterval=${aggregationConfig.aggInterval}`;
      } else {
         throw "AGGREGATE FUNCTION NOT RECOGNIZED! SHOULD BE 'MAX', 'MIN', 'SUM' OR 'AVG'!";
      }

      if (aggregationConfig.aggNoData && aggregationConfig.aggNoDataQI) {
         url += `&aggregatenodata=${aggregationConfig.aggNoData.toString()}&aggregatenodataqi=${aggregationConfig.aggNoDataQI.toString()}`;
      }
   }
   return url;
}

var prepareProcedureNames = (procedures) => {
   let names = [];
   procedures.forEach((p) => {
      if (p.systemType === 'virtual') {
         names.push(p.getVirtualProcedureJSON()['system']);
      } else if (p.systemType === 'insitu-fixed-point' || p.systemType === 'insitu-mobile-point') {
         names.push(p.getProcedureJSON()['system']);
      } else {
         throw `${p}: WRONG PROCEDURE SYSTEM TYPE!!!`
      }
   })
   return names.toString();
}

var prepareObservedPropertyUrns = (observedProperties) => {
   let urns = [];
   observedProperties.forEach((op) => {
      urns.push(op.getObservedPropertiesJSON()['definition']);
   })
   return urns.toString;
}

var transformGetObservationsResponse = (type, response, constraintFilter) => {
   switch (type) {
      case "simple":
         var values = response.data[0].result.DataArray.values;

         var transformed = [];
         for (let i = 0; i < values.length; i++) {
            transformed.push({
               "date": values[i][0],
               "measurement": values[i][1]
            })
         }
         return transformed;
         break;
      case "constraint":
         var values = response.data[0].result.DataArray.values;

         var transformed = [];
         for (let i = 0; i < values.length; i++) {
            transformed.push(filterByConstraint(values[i], constraintFilter.type, constraintFilter.quiality));
         }
         response.data[0].result.DataArray.values = transformed
         return response;
         break;
      default:
         throw "OBSERVATION METHOD TYPE NOT RECOGNIZED!";
         break;
   }
}

var filterByConstraint = (measurement, type, value) => {

   switch (type) {
      case "lessThan":
         if (measurement[2] < value) {
            return measurement;
         }
         break;
      case "lessThanAndEqual":
         if (measurement[2] <= value) {
            return measurement;
         }
         break;
      case "equal":
         if (measurement[2] === value) {
            return measurement;
         }
         break;
      case "greaterThanAndEqual":
         if (measurement[2] >= value) {
            return measurement;
         }
         break;
      case "greaterThan":
         if (measurement[2] > value) {
            return measurement;
         }
         break;
      case "between":
         if (measurement[2] >= value[0] && measurement[2] <= value[1]) {
            return measurement;
         }
         break;
      default:
         throw "WRONG CONSTRAINT TYPE FOR CHECKING QUALITY INDEX!!! SHOULD BE 'lessThan', 'lessThanAndEqual', 'equal', 'greaterThanAndEqual', 'greaterThan' or 'between'";
   }
}

export {
   validateConstraintInput,
   ConstraintInputs,
   prepareForGetObservations,
   transformGetObservationsResponse
}