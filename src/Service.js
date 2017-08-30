import {EventEmitter} from 'EventEmitter';
import {HttpAPI} from 'HttpAPI';
import {Configuration} from 'Configuration';
import {Offering} from 'Offering';
import {prepareForGetObservations, transformGetObservationsResponse} from 'IstsosHelper';

/**
 * istsos.Service
 * 
 * @class
 * @extends istsos.EventEmitter
 */
export var Service = class Service extends EventEmitter {
	/**
	 * constructor - instantiates istsos.Service
	 * 
	 * @param  {Object} options Set of key-value pairs
	 * @constructor
	 */
	constructor(options) {
		super();
		this.name = options.name;
		this.db = options.opt_db || options.server.getDefaultDbProperty();
		this.epsg = options.opt_epsg || null;
		this.config = options.opt_config || new Configuration({
			serviceName: options.name,
			server: options.server
		});
		this.server = options.server;
		this.offerings = [];
		this.procedures = [];
		this.virtualProcedures = [];
		this.observedProperties = [];
		this.uoms = [];
		this.dataQualities = [];
		options.server.addService(this);

		var offering_config = {
			offeringName: "temporary",
			offeringDescription: "temporary offering to hold self-registered procedures/sensors waiting for service adimistration acceptance",
			active: true,
			expirationDate: "",
			service: this
		}

		var temporary_offering = new Offering(offering_config);
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
    * Get JSON configuration prepared for sending as a HTTP request payload
    * 
    * @return {Object}
    */
	getServiceJSON() {
		var serviceJSON = {
			"service": this.name
		};
		if (this.epsg) {
			serviceJSON["epsg"] = this.epsg.toString();
		}
		if (this.db !== this.server.getDefaultDbProperty()) {
			serviceJSON["dbname"] = this.db["dbname"];
			serviceJSON["host"] = this.db["host"];
			serviceJSON["user"] = this.db["user"];
			serviceJSON["password"] = this.db["password"];
			serviceJSON["port"] = this.db["port"].toString();
		}
		return serviceJSON;
	}

	/**
	 * Return list of istsos.Offering instances, that belong to this service
	 * 
	 * @return {Array<istsos.Offering>}
	 */
	getOfferingsProperty() {
		return this.offerings;
	}

	/**
	 *	Return list of istsos.Procedure instances, that belong to this service
	 * 
	 * @returns {Array<istsos.Procedure>}
	 */
	getProceduresProperty() {
		return this.procedures;
	}

	/**
	 * Return list of istsos.VirtualProcedure instances, that belong to this service
	 * 
	 * @returns {Array<istsos.VirtualProcedure>}
	 */
	getVirtualProceduresProperty() {
		return this.virtualProcedures;
	}

	/**
	 *	Return list of istsos.ObservedProperty instances, that belong to this service
	 * 
	 * @returns {Array<istsos.ObservedProperty>}
	 */
	getObservedPropertiesProperty() {
		return this.observedProperties;
	}

	/**
	 *	Return list of istsos.UnitOfMeasure instances, that belong to this service
	 * 
	 * @returns {Array<istsos.UnitOfMeasure>}
	 */
	getUomsProperty() {
		return this.uoms;
	}

	/**
	 *	Return list of istsos.DataQuality instances, that belong to this service
	 * 
	 * @returns {Array<istsos.DataQuality>}
	 */
	getDataQualitiesProperty() {
		return this.dataQualities;
	}

	/**
	 * Add offering to the offering list
	 * 
	 * @param {istsos.Offering} offering
	 */
	addOffering(offering) {
		this.getOfferingsProperty().push(offering);
	}

	/**
    * Register new offering on the server
    * 
    * @param  {istsos.Server} server istsos.Server instance
    * @return {Promise}
    * @fires istsos.Service#NEW_OFFERING
    */
	registerOffering(offering) {
		var url = `${this.server.getUrl()}wa/istsos/services/${this.getServiceJSON()["service"]}/offerings`;

		let config = {};
		if (this.server.getLoginConfig()) {
			config['headers'] = this.server.getLoginConfig();
		}
		config['data'] = JSON.stringify(offering.getOfferingJSON());

		return HttpAPI.post(url, config)
			.then((result) => {
				if (result.success) {
					this.fireEvent('NEW_OFFERING', result);
					return result;
				} else {
					throw result.message
				}
			}, (error_message) => {
				throw error_message;
			});
	}

	/**
    * Get offering names from the server
    * 
    * @return {Promise}
    * @fires istsos.Service#OFFERING_NAMES
    */
	getOfferingNames() {
		var url = `${this.server.getUrl()}wa/istsos/services/${this.getServiceJSON()["service"]}/offerings/operations/getlist`;

		let config = {};
		if (this.server.getLoginConfig()) {
			config['headers'] = this.server.getLoginConfig();
		}

		return HttpAPI.get(url, config)
			.then((result) => {
				if (result.success) {
					this.fireEvent('OFFERING_NAMES', result);
					return result;
				} else {
					throw result.message
				}
			}, (error_message) => {
				throw error_message;
			});

	}

	/**
    * Get list of offerings from the server
    * 
    * @return {Promise}
    * @fires istsos.Service#OFFERING_LIST
    */
	getOfferings() {
		var url = `${this.server.getUrl()}wa/istsos/services/${this.getServiceJSON()["service"]}/offerings`;

		let config = {};
		if (this.server.getLoginConfig()) {
			config['headers'] = this.server.getLoginConfig();
		}

		return HttpAPI.get(url, config)
			.then((result) => {
				if (result.success) {
					this.fireEvent('OFFERING_LIST', result);
					return result;
				} else {
					throw result.message
				}
			}, (error_message) => {
				throw error_message;
			});
	}

	/**
	 * Add istsos.Procedure instance to procedure list
	 * 
	 * @param {istsos.Procedure} procedure
	 */
	addProcedure(procedure) {
		this.getProceduresProperty().push(procedure);
	}

	/**
    * Register new procedure on the server.
    *
    * @param {istsos.Procedure} procedure istsos.Procedure instance
    * @return {Promise}
    * @fires istsos.Service#NEW_PROCEDURE
    */
	registerProcedure(procedure) {
		var url = `${this.server.getUrl()}wa/istsos/services/${this.getServiceJSON()["service"]}/procedures`;

		let config = {};
		if (this.server.getLoginConfig()) {
			config['headers'] = this.server.getLoginConfig();
		}
		config['data'] = JSON.stringify(procedure.getProcedureJSON());

		return HttpAPI.post(url, config)
			.then((result) => {
				if (result.success) {
					this.fireEvent('NEW_PROCEDURE', result);
					return result;
				} else {
					throw result.message
				}
			}, (error_message) => {
				throw error_message;
			});

	}

	/**
    * Get procedure from the server.
    *
    * @param {istsos.Procedure} procedure istsos.Procedure instance
    * @return {Promise}
    * @fires istsos.Service#PROCEDURE
    */
	getProcedure(procedure) {
		var url = `${this.server.getUrl()}wa/istsos/services/${this.getServiceJSON()["service"]}/procedures/${procedure.getProcedureJSON()["system"]}`;

		let config = {};
		if (this.server.getLoginConfig()) {
			config['headers'] = this.server.getLoginConfig();
		}

		return HttpAPI.get(url, config)
			.then((result) => {
				if (result.success) {
					this.fireEvent('PROCEDURE', result);
					return result;
				} else {
					throw result.message
				}
			}, (error_message) => {
				throw error_message;
			});
	}

	/**
    * Get procedures from the server.
    *
    * @return {Promise}
    * @fires istsos.Service#PROCEDURES
    */
	getProcedures() {
		var url = `${this.server.getUrl()}wa/istsos/services/${this.getServiceJSON()["service"]}/procedures/operations/getlist`;

		let config = {};
		if (this.server.getLoginConfig()) {
			config['headers'] = this.server.getLoginConfig();
		}

		return HttpAPI.get(url, config)
			.then((result) => {
				if (result.success) {
					this.fireEvent('PROCEDURES', result);
					return result;
				} else {
					throw result.message
				}
			}, (error_message) => {
				throw error_message;
			});
	}

	/**
	 * Add istsos.VirtualProcedure instance to virtual procedure list
	 * 
	 * @param {istsos.VirtualProcedure} procedure
	 */
	addVirtualProcedure(v_procedure) {
		this.getVirtualProceduresProperty().push(v_procedure);
	}

	/**
    * Register virtual procedure on the server.
    *
    * @return {Promise}
    * @fires istsos.Service#NEW_VIRTUAL_PROCEDURE
    */
	registerVirtualProcedure(v_procedure) {
		var url = `${this.server.getUrl()}wa/istsos/services/${this.getServiceJSON()["service"]}/procedures`;

		let config = {};
		if (this.server.getLoginConfig()) {
			config['headers'] = this.server.getLoginConfig();
		}
		config['data'] = JSON.stringify(v_procedure.getVirtualProcedureJSON());

		return HttpAPI.post(url, config)
			.then((result) => {
				if (result.success) {
					this.fireEvent('NEW_VIRTUAL_PROCEDURE', result);
					return result;
				} else {
					throw result.message
				}
			}, (error_message) => {
				throw error_message;
			});
	}

	/**
    * Get virtual procedure from the server.
    *
    * @param {istsos.VirtualProcedure} v_procedure istsos.VirtualProcedure instance
    * @return {Promise}
    * @fires istsos.Service#VIRTUAL_PROCEDURE;

    */
	getVirtualProcedure(v_procedure) {
		var url = `${this.server.getUrl()}wa/istsos/services/${this.getServiceJSON()["service"]}/virtualprocedures`;

		let config = {};
		if (this.server.getLoginConfig()) {
			config['headers'] = this.server.getLoginConfig();
		}

		return HttpAPI.get(url, config)
			.then((result) => {
				if (result.success) {
					this.fireEvent('VIRTUAL_PROCEDURE', result);
					return result;
				} else {
					throw result.message
				}
			}, (error_message) => {
				throw error_message;
			});
	}

	/**
    * Get virtual procedures from the server.
    *
    * @return {Promise}
    * @fires istsos.Service#VIRTUAL_PROCEDURES
    */
	getVirtualProcedures() {
		var url = `${this.server.getUrl()}wa/istsos/services/${this.getServiceJSON()["service"]}/virtualprocedures/operations/getlist`;

		let config = {};
		if (this.server.getLoginConfig()) {
			config['headers'] = this.server.getLoginConfig();
		}

		return HttpAPI.get(url, config)
			.then((result) => {
				if (result.success) {
					this.fireEvent('VIRTUAL_PROCEDURES', result);
					return result;
				} else {
					throw result.message
				}
			}, (error_message) => {
				throw error_message;
			});
	}

	/**
	 * Add istsos.ObservedProperty to the list of observed properties
	 * 
	 * @param {istsos.ObservedProperty} property
	 */
	addObservedProperty(property) {
		this.getObservedPropertiesProperty().push(property)
	}

	/**
    * Register observed property on the server.
    *
    * @return {Promise}
    * @fires istsos.Service#NEW_OBSERVED_PROPERTY
    */
	registerObservedProperty(property) {
		var url = `${this.server.getUrl()}wa/istsos/services/${this.getServiceJSON()["service"]}/observedproperties`;
		this.executeRequest(url, istsos.events.EventType.NEW_OBSERVED_PROPERTY, "POST", JSON.stringify(property.getObservedPropertyJSON()));

		let config = {};
		if (this.server.getLoginConfig()) {
			config['headers'] = this.server.getLoginConfig();
		}
		config['data'] = JSON.stringify(property.getObservedPropertyJSON());

		return HttpAPI.post(url, config)
			.then((result) => {
				if (result.success) {
					this.fireEvent('NEW_OBSERVED_PROPERTY', result);
					return result;
				} else {
					throw result.message
				}
			}, (error_message) => {
				throw error_message;
			});
	}

	/**
    * Get observed properties from the server.
    *
    * @return {Promise}
    * @fires istsos.Service#OBSERVED_PROPERTIES
    */
	getObservedProperties() {
		var url = `${this.server.getUrl()}wa/istsos/services/${this.getServiceJSON()["service"]}/observedproperties`;

		let config = {};
		if (this.server.getLoginConfig()) {
			config['headers'] = this.server.getLoginConfig();
		}

		return HttpAPI.get(url, config)
			.then((result) => {
				if (result.success) {
					this.fireEvent('OBSERVED_PROPERTIES', result);
					return result;
				} else {
					throw result.message
				}
			}, (error_message) => {
				throw error_message;
			});
	}

	/**
    * Get observed property from the server
    * 
    * @param {istsos.ObservedProperty} property istsos.ObservedProperty instance
    * @return {Promise}
    * @fires istsos.Service#OBSERVED_PROPERTIES
    */
	getObservedProperty(property) {
		var url = `${this.server.getUrl()}wa/istsos/services/${this.getServiceJSON()["service"]}/observedproperties/${property.getObservedPropertyJSON()["definition"]}`;

		let config = {};
		if (this.server.getLoginConfig()) {
			config['headers'] = this.server.getLoginConfig();
		}

		return HttpAPI.get(url, config)
			.then((result) => {
				if (result.success) {
					this.fireEvent('OBSERVED_PROPERTY', result);
					return result;
				} else {
					throw result.message
				}
			}, (error_message) => {
				throw error_message;
			});
	}

	/**
	 * Add instance of istsos.UnitOfMeasure to the unit of measure list
	 * 
	 * @param {istsos.UnitOfMeasure} uom
	 */
	addUom(uom) {
		this.getUomsProperty().push(uom);
	}

	
	/**
    * Register unit of measure on the server.
    *
    * @return {Promise}
    * @fires istsos.Service#NEW_UOM
    */
	registerUom(uom) {
		var url = `${this.server.getUrl()}wa/istsos/services/${this.getServiceJSON()["service"]}/uoms`;

		let config = {};
		if (this.server.getLoginConfig()) {
			config['headers'] = this.server.getLoginConfig();
		}
		config['data'] = JSON.stringify(property.getUomJSON());

		return HttpAPI.post(url, config)
			.then((result) => {
				if (result.success) {
					this.fireEvent('NEW_UOM', result);
					return result;
				} else {
					throw result.message
				}
			}, (error_message) => {
				throw error_message;
			});
	}

	/**
    * Get units of measure from the server.
    *
    * @return {Promise}
    * @fires istsos.Service#UOMS
    */
	getUoms() {
		var url = `${this.server.getUrl()}wa/istsos/services/${this.getServiceJSON()["service"]}/uoms`;

		let config = {};
		if (this.server.getLoginConfig()) {
			config['headers'] = this.server.getLoginConfig();
		}

		return HttpAPI.get(url, config)
			.then((result) => {
				if (result.success) {
					this.fireEvent('UOMS', result);
					return result;
				} else {
					throw result.message
				}
			}, (error_message) => {
				throw error_message;
			});
	}

	/**
    * Get unit of measure from the server.
    *
    * @param {istsos.UnitOfMeasure} uom istsos.UnitOfMeasure instance
    * @return {Promise}
    * @fires istsos.Service#UOM
    */
	getUom(uom) {
		var url = `${this.server.getUrl()}wa/istsos/services/${this.getServiceJSON()["service"]}/uoms/${uom.getUomJSON()["name"]}`;

		let config = {};
		if (this.server.getLoginConfig()) {
			config['headers'] = this.server.getLoginConfig();
		}

		return HttpAPI.get(url, config)
			.then((result) => {
				if (result.success) {
					this.fireEvent('UOM', result);
					return result;
				} else {
					throw result.message
				}
			}, (error_message) => {
				throw error_message;
			});
	}

	/**
	 * Add istsos.DataQuality instance to the dataqualities list
	 * 
	 * @param {istsos.DataQuality} dataQuality
	 */
	addDataQuality(dataQuality) {
		this.getDataQualitiesProperty().push(dataQuality);
	}

	/**
    * Register data quality on the server.
    *
    * @return {Promise}
    * @fires istsos.Service#NEW_DATAQUALITY
    */
	registerDataQuality(dataQuality) {
		var url = `${this.server.getUrl()}wa/istsos/services/${this.getServiceJSON()["service"]}/dataqualities`;
		this.executeRequest(url, istsos.events.EventType.NEW_DATAQUALITY, "POST", JSON.stringify(dataQuality.getDataQualityJSON()));

		let config = {};
		if (this.server.getLoginConfig()) {
			config['headers'] = this.server.getLoginConfig();
		}
		config['data'] = JSON.stringify(property.getDataQualityJSON());

		return HttpAPI.post(url, config)
			.then((result) => {
				if (result.success) {
					this.fireEvent('NEW_DATAQUALITY', result);
					return result;
				} else {
					throw result.message
				}
			}, (error_message) => {
				throw error_message;
			});
	}

	/**
    * Get data qualities from the server.
    *
    * @return {Promise}
    * @fires istsos.Service#DATAQUALITIES
    */
	getDataQualities() {
		var url = `${this.server.getUrl()}wa/istsos/services/${this.getServiceJSON()["service"]}/dataqualities`;

		let config = {};
		if (this.server.getLoginConfig()) {
			config['headers'] = this.server.getLoginConfig();
		}

		return HttpAPI.get(url, config)
			.then((result) => {
				if (result.success) {
					this.fireEvent('DATAQUALITIES', result);
					return result;
				} else {
					throw result.message
				}
			}, (error_message) => {
				throw error_message;
			});

	}

	/**
    * Get data quality from the server.
    *
    * @param {istsos.DataQuality} dataQuality istsos.DataQuality instance
    * @return {Promise}
    * @fires istsos.Service#DATAQUALITY
    */
	getDataQuality(dataQuality) {
		var url = `${this.server.getUrl()}wa/istsos/services/${this.getServiceJSON()["service"]}/dataqualities/${dataQuality.getDataQualityJSON()["code"]}`;

		let config = {};
		if (this.server.getLoginConfig()) {
			config['headers'] = this.server.getLoginConfig();
		}

		return HttpAPI.get(url, config)
			.then((result) => {
				if (result.success) {
					this.fireEvent('DATAQUALITY', result);
					return result;
				} else {
					throw result.message
				}
			}, (error_message) => {
				throw error_message;
			});

	}

	/**
    * Get system types from the server
    *
    * @return {Promise}
    * @fires istsos.Service#DATAQUALITIES
    */
	getSystemTypes() {
		var url = `${this.server.getUrl()}wa/istsos/services/${this.getServiceJSON()["service"]}/systemtypes`;

		let config = {};
		if (this.server.getLoginConfig()) {
			config['headers'] = this.server.getLoginConfig();
		}

		return HttpAPI.get(url, config)
			.then((result) => {
				if (result.success) {
					this.fireEvent('SYSTEM_TYPES', result);
					return result;
				} else {
					throw result.message
				}
			}, (error_message) => {
				throw error_message;
			});
	}

	/**
	 *	Returns istsos.Database instance
	 * 
	 * @return {istsos.Database}
	 */
	getDatabaseProperty() {
		return this.db;
	}

	/**
    * Get service database
    *
    * @return {Promise}
    * @fires istsos.Database#DATABASE
    */
	getDatabase() {
		return this.db.getDb(this.getServiceJSON()["service"], this.server);
	}

	/**
    * Get observations from the server.
    *
    * @param {Object} options Set of key-value pairs
    * @return {Promise}
    * @fires istsos.Service#GETOBSERVATIONS
    */
	getObservations(options) {
		var urlConfig = prepareForGetObservations(options);
		var url = `${this.server.getUrl()}wa/istsos/services/${this.name}/operations/getobservation/offerings/${urlConfig.offering}/procedures/${urlConfig.procedureNames}/observedproperties/${urlConfig.observedPropertyUrns}/eventtime/${urlConfig.begin}/${urlConfig.end}`;

		let config = {};
		if (this.server.getLoginConfig()) {
			config['headers'] = this.server.getLoginConfig();
		}

		return HttpAPI.get(url, config)
			.then((result) => {
				if (result.success) {
					this.fireEvent('GETOBSERVATIONS', result);
					return result;
				} else {
					throw result.message
				}
			}, (error_message) => {
				throw error_message;
			});
	}


	/**
    * Get observations with data aggregation from the server.
    *
    * @param {Object} options Set of key-value pairs
    * @param {Object} aggregationConfig Set of key-value pairs
    * @return {Promise}
    * @fires istsos.Service#GETOBSERVATIONS_AGG
    */
	getObservationsWithAggregation(options, aggregationConfig) {
		var urlConfig = prepareForGetObservations(options, aggregationConfig, 'aggregation');
		var url = `${this.server.getUrl()}wa/istsos/services/${this.name}/operations/getobservation/offerings/${urlConfig.offering}/procedures/${urlConfig.procedureNames}/observedproperties/${urlConfig.observedPropertyUrns}/eventtime/${urlConfig.begin}/${urlConfig.end}/${urlConfig.aggregationURL}`;

		let config = {};
		if (this.server.getLoginConfig()) {
			config['headers'] = this.server.getLoginConfig();
		}

		return HttpAPI.get(url, config)
			.then((result) => {
				if (result.success) {
					this.fireEvent('GETOBSERVATIONS_AGG', result);
					return result;
				} else {
					throw result.message
				}
			}, (error_message) => {
				throw error_message;
			});
	}


	/**
    * Get observations from the server, with simplified response
    *
    * @param {Object} options Set of key-value pairs
    * @return {Promise}
    * @fires istsos.Service#GETOBSERVATIONS_SIMPLIFIED
    */
	getObservationsSimplified(options) {
		var urlConfig = prepareForGetObservations(options);
		var url = `${this.server.getUrl()}wa/istsos/services/${this.name}/operations/getobservation/offerings/${urlConfig.offering}/procedures/${urlConfig.procedureNames}/observedproperties/${urlConfig.observedPropertyUrns}/eventtime/${urlConfig.begin}/${urlConfig.end}`;

		let config = {};
		if (this.server.getLoginConfig()) {
			config['headers'] = this.server.getLoginConfig();
		}

		return HttpAPI.get(url, config)
			.then((result) => {
				if (result.success) {
					let transformed = transformGetObservationsResponse('simple', result);
					this.fireEvent('GETOBSERVATIONS_SIMPLIFIED', transformed);
					return transformed;
				} else {
					throw result.message
				}
			}, (error_message) => {
				throw error_message;
			});
	}

	/**
    * Get observations from the server filtered by QI constraint.
    *
    * @param {Object} options Set of key-value pairs
    * @param {Object} aggregationConfig Set of key-value pairs
    * @return {Promise}
    * @fires istsos.Service#GETOBSERVATIONS_BY_QUALITY
    */
	getObservationsByQualityIndexConstraint(options, constraintConfig) {
		var urlConfig = prepareForGetObservations(options);
		var url = `${this.server.getUrl()}wa/istsos/services/${this.name}/operations/getobservation/offerings/${urlConfig.offering}/procedures/${urlConfig.procedureNames}/observedproperties/${urlConfig.observedPropertyUrns}/eventtime/${urlConfig.begin}/${urlConfig.end}`;

		let config = {};
		if (this.server.getLoginConfig()) {
			config['headers'] = this.server.getLoginConfig();
		}

		return HttpAPI.get(url, config)
			.then((result) => {
				if (result.success) {
					let transformed = transformGetObservationsResponse('constraint', result, constraintConfig);
					this.fireEvent('GETOBSERVATIONS_BY_QUALITY', transformed);
					return result;
				} else {
					throw result.message
				}
			}, (error_message) => {
				throw error_message;
			});
	}

	/**
    * Get feature collection from the server.
    *
    * @param {Object} opt_options Set of key-value pairs
    * @return {Promise}
    * @fires istsos.Service#GEOJSON
    */
	getFeatureCollection(opt_options) {
		var url = `${this.server.getUrl()}wa/istsos/services/${this.nane}/procedures/operations/geojson`;
		if (opt_options.opt_epsg) {
			url += "?epsg=" + opt_options.opt_epsg.toString();
			if (opt_options.opt_offering || opt_options.opt_procedure) {
				if (opt_options.opt_offering) {
					url += "&offering=" + opt_options.opt_offering.getOfferingJSON()["name"];
				}
				if (opt_options.opt_procedure && opt_options.opt_procedure instanceof istsos.Procedure) {
					url += "&procedure=" + opt_options.opt_procedure.getProcedureJSON()["system"];
				} else if (opt_options.opt_procedure && opt_options.opt_procedure instanceof istsos.VirtualProcedure) {
					url += "&procedure=" + opt_options.opt_procedure.getVirtualProcedureJSON()["system"];
				}
			}
		}

		let config = {};
		if (this.server.getLoginConfig()) {
			config['headers'] = this.server.getLoginConfig();
		}

		return HttpAPI.get(url, config)
			.then((result) => {
				if (result.success) {
					this.fireEvent('GEOJSON', result);
					return result;
				} else {
					throw result.message
				}
			}, (error_message) => {
				throw error_message;
			});
	}
}
