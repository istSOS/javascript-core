import {HttpAPI } from 'HttpAPI'; 
import {EventEmitter } from 'EventEmitter';
import {validateConstraintInput, ConstraintInputs} from 'IstsosHelper';

/**
 * istsos.ObservedProperty
 * 
 * @class
 * @extends istsos.EventEmitter
 */
export var ObservedProperty = class ObservedProperty extends EventEmitter {
	/**
    * constructor - instantiates istsos.ObservedProperty
    * 
    * @param  {Object} options Set of key-value pairs
    * @constructor
    */
	constructor(options) {
		super();
		this.observedName = options.observedName;
		this.definitionUrn = options.definitionUrn;
		this.observedDescr = options.observedDescr || "";
		this.constraint = null;
		var check = validateConstraintInput(options.constraintType, options.value);
		if (check === true) {
			this.constraint = {};
			this.constraint["role"] = "urn:x-ogc:def:classifiers:x-istsos:1.0:qualityIndexCheck:level0";
			this.constraint[ConstraintInputs[options.constraintType]] = (options.value.constructor === Array) ?
				options.value.toString().split(",") : options.value.toString();
		} else {
			console.log(`Input constraintType and constraintValue for property <${this.observedName.toUpperCase()}> are INCORRECT or INTENTIONALLY NULL!!! `);
		}
		this.service = options.service;
		this.proceduresIncluded = [];
		this.updateProceduresIncluded();
		options.service.addObservedProperty(this);
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
    * Refresh the list of procedures that use this observed property
    */
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
	 * @return {Array<istsos.Procedure|istsos.VirtualProcedure>}
	 */
	getProceduresIncluded() {
		return this.proceduresIncluded;
	}

	/**
	 * @returns {Object}
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
    * Update observed property on the server
    *
    * @param {object} options Set of key-value pairs
    * @return {Promise} 
    * @fires  istsos.ObservedProperty#UPDATE_OBSERVED_PROPERTY            
    */
	updateObservedProperty(options) {
		const oldDefinitionUrn = this.definitionUrn;
		this.observedName = options.newPropertyName || this.observedName;
		this.definitionUrn = options.newDefinitionUrn || this.definitionUrn;
		this.observedDescr = options.newPropertyName || this.observedDescr;
		if (validateConstraintInput(options.constraintType, options.value) === true) {
			this.constraint = {};
			this.constraint["role"] = "urn:x-ogc:def:classifiers:x-istsos:1.0:qualityIndexCheck:level0";
			this.constraint[ConstraintInputs[options.constraintType]] = (options.value.constructor === Array) ?
				options.value.toString().split(",") : options.value.toString();
		} else {
			console.log(`Input constraintType and constraintValue for property <${this.observedName.toUpperCase()}> are INCORRECT or INTENTIONALLY NULL!!! `);
		}
		var url = `${this.service.server.getUrl()}wa/istsos/services/${this.service.getServiceJSON()["service"]}/observedproperties/${oldDefinitionUrn}`;

      let config = {};
      if(this.service.server.getLoginConfig()) {
         config['headers'] = this.service.server.getLoginConfig();
      }
      config['data'] = JSON.stringify(this.getObservedPropertyJSON());

      return HttpAPI.put(url, config)
         .then((result) => {
            if (result.success) {
               this.fireEvent('UPDATE_OBSERVED_PROPERTY', result);
               return result;
            } else {
               throw result.message
            }
         }, (error_message) => {
            throw error_message;
         });
	}

	/**
    * Delete observed property from the server
    *
    * @return {Promise} 
    * @fires  istsos.ObservedProperty#DELETE_OBSERVED_PROPERTY            
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

      let config = {};
      if(this.service.server.getLoginConfig()) {
         config['headers'] = this.service.server.getLoginConfig();
      }
      config['data'] = JSON.stringify(this.getObservedPropertyJSON());

      return HttpAPI.delete(url, config)
         .then((result) => {
            if (result.success) {
               this.fireEvent('DELETE_OBSERVED_PROPERTY', result);
               return result;
            } else {
               throw result.message
            }
         }, (error_message) => {
            throw error_message;
         });
	}
}