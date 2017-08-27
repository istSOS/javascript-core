import {Date} from 'Date';

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
var prepareForGetObservations = (options, opt_config, opt_type) => {
   var config = {}
   if (opt_type && opt_type === 'aggregation') {
      config["aggregationURL"] = prepareDataAggregation(opt_config);
   }
   config['offering'] = options.offering.getOfferingJSON()['name'];
   config['procedureNames'] = prepareProcedureNames(options.procedures);
   config['observedPropertyUrns'] = prepareObservedPropertyUrns(options.observedProperties);
   config['begin'] = (options.begin.constructor === Date) ? options.begin.getDateString() : options.begin;
   config['end'] = (options.end.constructor === Date) ? options.end.getDateString() : options.end;
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
   for (let op = 0; op < observedProperties.length; op++) {
      urns.push(observedProperties[op].definitionUrn);
   }
   return urns.toString();
}

var handleMultiplePropertyValues = (measurements, type) => {
   let list = [];
   switch (type) {
      case 'simple':

         for (let i = 0; i < measurements.length; i++) {
            if(i == 0) {
               list.push(measurements[i])
            }

            if(i != 0 && i % 2) {
               list.push(measurements[i])
            }
         }
         return list
         break;
      case 'constraint':
         // statements_1
         break;
      default:
         // statements_def
         break;
   }
}

var transformGetObservationsResponse = (type, response, constraintFilter) => {
   switch (type) {
      case "simple":
         var values = response.data[0].result.DataArray.values;

         var transformed = [];
         for (let i = 0; i < values.length; i++) {
            if (values[i].length > 3) {
               transformed.push(handleMultiplePropertyValues(values[i], 'simple'))
            } else {
               transformed.push({
                  "date": values[i][0],
                  "measurement": values[i][1]
               })
            }
         }
         return transformed;
         break;
      case "constraint":
         var values = response.data[0].result.DataArray.values;

         var transformed = [];
         for (let i = 0; i < values.length; i++) {
            let measurement = filterByConstraint(values[i], constraintFilter.type, constraintFilter.quality);
            if (measurement != undefined) {
               transformed.push(measurement);
            }
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
         if (parseInt(measurement[2]) < parseInt(value)) {
            return [measurement[0], parseFloat(measurement[1]), parseInt(measurement[2])];
         }
         break;
      case "lessThanAndEqual":
         if (parseInt(measurement[2]) <= parseInt(value)) {
            return [measurement[0], parseFloat(measurement[1]), parseInt(measurement[2])];
         }
         break;
      case "equal":
         if (parseInt(measurement[2]) === parseInt(value)) {
            return [measurement[0], parseFloat(measurement[1]), parseInt(measurement[2])];
         }
         break;
      case "greaterThanAndEqual":
         if (parseInt(measurement[2]) >= parseInt(value)) {
            return [measurement[0], parseFloat(measurement[1]), parseInt(measurement[2])];
         }
         break;
      case "greaterThan":
         if (parseInt(measurement[2]) > parseInt(value)) {
            return [measurement[0], parseFloat(measurement[1]), parseInt(measurement[2])];
         }
         break;
      case "between":
         if (parseInt(measurement[2]) >= parseInt(value)[0] && parseInt(measurement[2]) <= parseInt(value)[1]) {
            return [measurement[0], parseFloat(measurement[1]), parseInt(measurement[2])];
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