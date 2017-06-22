import {EventEmitter} from 'EventEmitter';
import {HttpAPI} from 'HttpAPI';
import {Configuration} from 'Configuration';
import {Offering} from 'Offering';
import {prepareForGetObservations, transformGetObservationResponse} from 'IstsosHelper';

/** istsos.Service class */
/**
 * @param {istsos.Server} server
 * @param {String} name
 * @param {istsos.Database} opt_db
 * @param {istsos.Configuration} opt_config
 * @param {int} opt_epsg
 * @constructor
 */
export var Service = class Service extends EventEmitter {
   cosntructor(options) {
      super();
      this.name = options.name;
      this.db = options.opt_db || server.getDefaultDbProperty();
      this.epsg = options.opt_epsg || null;
      this.config = options.opt_config || new istsos.Configuration({
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
      server.addService(this);

      var offering_config = {
        offeringName : "temporary",
        offeringDescription : "temporary offering to hold self-registered procedures/sensors waiting for service adimistration acceptance",
        active : true,
        expirationDate : ""
        service : this
      }

      var temporary_offering = new istsos.Offering(offering_config);
   }

   /**
    * @param {String} url
    * @param {istsos.events.EventType} eventType
    * @param {String} method
    * @param {JSON} opt_data
    */
   
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
    * @returns {JSON}
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
    * @returns {Array<istsos.Offering>}
    */
   getOfferingsProperty() {
      return this.offerings;
   }

   /**
    * @returns {Array<istsos.Procedure>}
    */
   getProceduresProperty() {
      return this.procedures;
   }

   /**
    * @returns {Array<istsos.VirtualProcedure>}
    */
   getVirtualProceduresProperty() {
      return this.virtualProcedures;
   }

   /**
    * @returns {Array<istsos.ObservedProperty>}
    */
   getObservedPropertiesProperty() {
      return this.observedProperties;
   }

   /**
    * @returns {Array<istsos.UnitOfMeasure>}
    */
   getUomsProperty() {
      return this.uoms;
   }

   /**
    * @returns {Array<istsos.DataQuality>}
    */
   getDataQualitiesProperty() {
      return this.dataQualities;
   }

   /**
    * @param {istsos.Offering} offering
    */
   addOffering(offering) {
      this.getOfferingsProperty().push(offering);
   }

   /**
    * @fires istsos.Service#istsos.events.EventType: NEW_OFFERING
    * @param {istsos.Offering} offering
    */
   registerOffering(offering) {
      var url = `${this.server.getUrl()}wa/istsos/services/${this.getServiceJSON()["service"]}/offerings`;
   	 
      let config = {};
      if(this.server.getLoginConfig()) {
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
    * @fires istsos.Service#istsos.events.EventType: OFFERING_NAMES
    */
   getOfferingNames() {
      var url = `${this.server.getUrl()}wa/istsos/services/${this.getServiceJSON()["service"]}/offerings/operations/getlist`;
   	   	 
      let config = {};
      if(this.server.getLoginConfig()) {
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
    * @fires istsos.Service#istsos.events.EventType: OFFERING_LIST
    */
   getOfferings() {
      var url = `${this.server.getUrl()}wa/istsos/services/${this.getServiceJSON()["service"]}/offerings`;
		
		let config = {};
      if(this.server.getLoginConfig()) {
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
    * @param {istsos.Procedure} procedure
    */
   addProcedure(procedure) {
      this.getProceduresProperty().push(procedure);
   }

   /**
    * @fires istsos.Service#istsos.events.EventType: NEW_PROCEDURE
    * @param {istsos.Procedure} procedure
    */
   registerProcedure(procedure) {
      var url = `${this.server.getUrl()}wa/istsos/services/${this.getServiceJSON()["service"]}/procedures`;

		let config = {};
      if(this.server.getLoginConfig()) {
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
    * @fires istsos.Service#istsos.events.EventType: PROCEDURE
    * @param {istsos.Procedure} procedure
    */
   getProcedure(procedure) {
      var url = `${this.server.getUrl()}wa/istsos/services/${this.getServiceJSON()["service"]}/procedures/${procedure.getProcedureJSON()["system"]}`;
   	
		let config = {};
      if(this.server.getLoginConfig()) {
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
    * @fires istsos.Service#istsos.events.EventType: PROCEDURES
    */
   getProcedures() {
      var url = `${this.server.getUrl()}wa/istsos/services/${this.getServiceJSON()["service"]}/procedures/operations/getlist`;

		let config = {};
      if(this.server.getLoginConfig()) {
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
    * @param {istsos.VirtualProcedure} v_procedure
    */
   addVirtualProcedure(v_procedure) {
      this.getVirtualProceduresProperty().push(v_procedure);
   }

   /**
    * @fires istsos.Service#istsos.events.EventType: NEW_VIRTUAL_PROCEDURE
    * @param {istsos.VirtualProcedure} v_procedure
    */
   registerVirtualProcedure(v_procedure) {
      var url = `${this.server.getUrl()}wa/istsos/services/${this.getServiceJSON()["service"]}/procedures`;

		let config = {};
      if(this.server.getLoginConfig()) {
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
    * @fires istsos.Service#istsos.events.EventType: VIRTUAL_PROCEDURE
    * @param {istsos.VirtualProcedure} v_procedure
    */
   getVirtualProcedure(v_procedure) {
      var url = `${this.server.getUrl()}wa/istsos/services/${this.getServiceJSON()["service"]}/virtualprocedures`;
   	
		let config = {};
      if(this.server.getLoginConfig()) {
         config['headers'] = this.server.getLoginConfig();
      }
      
      return HttpAPI.get(url, config)
         .then((result) => {
            if (result.success) {
               this.fireEvent('VIRTUAL_PROCEURE', result);
               return result;
            } else {
               throw result.message
            }
         }, (error_message) => {
            throw error_message;
         });
   }

   /**
    * @fires istsos.Service#istsos.events.EventType: VIRTUAL_PROCEDURES
    */
   getVirtualProcedures() {
      var url = `${this.server.getUrl()}wa/istsos/services/${this.getServiceJSON()["service"]}/virtualprocedures/operations/getlist`;
   	
		let config = {};
      if(this.server.getLoginConfig()) {
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
    * @param {istsos.ObservedProperty} property
    */
   addObservedProperty(property) {
      this.getObservedPropertiesProperty().push(property)
   }

   /**
    * @fires istsos.Service#istsos.events.EventType: NEW_OBSERVED_PROPERTY
    * @param {istsos.ObservedProperty} property
    */
   registerObservedProperty(property) {
      var url = `${this.server.getUrl()}wa/istsos/services/${this.getServiceJSON()["service"]}/observedproperties`;
      this.executeRequest(url, istsos.events.EventType.NEW_OBSERVED_PROPERTY, "POST", JSON.stringify(property.getObservedPropertyJSON()));
   	
		let config = {};
      if(this.server.getLoginConfig()) {
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
    * @fires istsos.Service#istsos.events.EventType: OBSERVED_PROPERTIES
    */
   getObservedProperties() {
      var url = `${this.server.getUrl()}wa/istsos/services/${this.getServiceJSON()["service"]}/observedproperties`;
   	
		let config = {};
      if(this.server.getLoginConfig()) {
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
    * @fires istsos.Service#istsos.events.EventType: OBSERVED_PROPERTY
    * @param {istsos.ObservedProperty} property
    */
   getObservedProperty(property) {
      var url = `${this.server.getUrl()}wa/istsos/services/${this.getServiceJSON()["service"]}/observedproperties/${property.getObservedPropertyJSON()["definition"]}`;
   	
		let config = {};
      if(this.server.getLoginConfig()) {
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
    * @param {istsos.UnitOfMeasure} uom
    */
   addUom(uom) {
      this.getUomsProperty().push(uom);
   }

   /**
    * @fires istsos.Service#istsos.events.EventType: NEW_UOM
    * @param {istsos.UnitOfMeasure} uom
    */
   registerUom(uom) {
      var url = `${this.server.getUrl()}wa/istsos/services/${this.getServiceJSON()["service"]}/uoms`;
  	
		let config = {};
      if(this.server.getLoginConfig()) {
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
    * @fires istsos.Service#istsos.events.EventType: UOMS
    */
   getUoms() {
      var url = `${this.server.getUrl()}wa/istsos/services/${this.getServiceJSON()["service"]}/uoms`;
  		
		let config = {};
      if(this.server.getLoginConfig()) {
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
    * @fires istsos.Service#istsos.events.EventType: UOM
    * @param {istsos.UnitOfMeasure} uom
    */
   getUom(uom) {
      var url = `${this.server.getUrl()}wa/istsos/services/${this.getServiceJSON()["service"]}/uoms/${uom.getUomJSON()["name"]}`;
 	
		let config = {};
      if(this.server.getLoginConfig()) {
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
    * @param {istsos.DataQuality} dataQuality
    */
   addDataQuality(dataQuality) {
      this.getDataQualitiesProperty().push(dataQuality);
   }

   /**
    * @fires istsos.Service#istsos.events.EventType: NEW_DATAQUALITY
    * @param {istsos.DataQuality} dataQuality
    */
   registerDataQuality(dataQuality) {
      var url = `${this.server.getUrl()}wa/istsos/services/${this.getServiceJSON()["service"]}/dataqualities`;
      this.executeRequest(url, istsos.events.EventType.NEW_DATAQUALITY, "POST", JSON.stringify(dataQuality.getDataQualityJSON()));
   	
		let config = {};
      if(this.server.getLoginConfig()) {
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
    * @fires istsos.Service#istsos.events.EventType: DATAQUALITIES
    */
   getDataQualities() {
      var url = `${this.server.getUrl()}wa/istsos/services/${this.getServiceJSON()["service"]}/dataqualities`;
   	   	
		let config = {};
      if(this.server.getLoginConfig()) {
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
    * @fires istsos.Service#istsos.events.EventType: DATA_QUALITY
    * @param {istsos.DataQuality} dataQuality
    */
   getDataQuality(dataQuality) {
      var url = `${this.server.getUrl()}wa/istsos/services/${this.getServiceJSON()["service"]}/dataqualities/${dataQuality.getDataQualityJSON()["code"]}`;
   	   	
		let config = {};
      if(this.server.getLoginConfig()) {
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
    * @fires istsos.Service#istsos.events.EventType: SYSTEM_TYPES
    */
   getSystemTypes() {
      var url = `${this.server.getUrl()}wa/istsos/services/${this.getServiceJSON()["service"]}/systemtypes`;
   		   	
		let config = {};
      if(this.server.getLoginConfig()) {
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
    * @returns {istsos.Database}
    */
   getDatabaseProperty() {
      return this.db;
   }

   /**
    * @fires istsos.Database#istsos.events.EventType: DATABASE
    */
   getDatabase() {
      return this.db.getDb(this.getServiceJSON()["service"], this.server);
   }

   /**
    * @fires istsos.Service#istsos.events.EventType: GETOBSERVATIONS
    * @param {istsos.Offering} offering
    * @param {Array<istsos.Procedure|istsos.VirtualProcedure>} procedures
    * @param {Array<istsos.ObservedProperty>} observed_properties
    * @param {istsos.Date} begin_time
    * @param {istsos.Date} end_time
    * @param {JSON} opt_aggregationConf
    */
   /*
   << HOW TO CREATE AGGREGATION CONF JSON >>
   {
      "function": "SUM", "MAX", "MIN" OR "AVG",
      "interval": example - "P1DT" is (1 day), "PT24H" is (24 hours),
      "noData": optional
      "noDataQi": optional
   }
   */
   getObservations(options) {
      var urlConfig = prepareForGetObservations(options);
      var url = `${this.server.getUrl()}wa/istsos/services/${this.name}/operations/getobservation/offerings/${urlConfig.offering}/procedures/${urlConfig.procedureNames}/observedproperties/${urlConfig.observedPropertyUrns}/eventtime/${begin}/${end}`;

      let config = {};
      if(this.server.getLoginConfig()) {
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
    * @fires istsos.Service#istsos.events.EventType: GETOBSERVATIONS_AGG
    * @param {istsos.Offering} offering
    * @param {Array<istsos.Procedure|istsos.VirtualProcedure>} procedures
    * @param {Array<istsos.ObservedProperty>} observed_properties
    * @param {istsos.Date} begin_time
    * @param {istsos.Date} end_time
    * @param {String} aggFunc allowed - "SUM", "MAX", "MIN" OR "AVG"
    * @param {String} aggInterval example - "P1DT" is 1 day or "PT24H" is 24H...
    * @param {int} aggNoData
    * @param {int} aggNoDataQI
    */
   getObservationsWithAggregation(options, aggregationConfig) {
      var urlConfig = prepareForGetObservations(options, aggregationConfig);
      var url = `${this.server.getUrl()}wa/istsos/services/${this.name}/operations/getobservation/offerings/${urlConfig.offering}/procedures/${urlConfig.procedureNames}/observedproperties/${urlConfig.observedPropertyUrns}/eventtime/${begin}/${end}/${urlConfig.aggregationUrl}`;

      let config = {};
      if(this.server.getLoginConfig()) {
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
    * @fires istsos.Service#istsos.events.EventType: GETOBSERVATIONS_BY_PROPERTY
    * @param {istsos.Offering} offering
    * @param {istsos.Procedure|istsos.VirtualProcedure} procedure
    * @param {istsos.ObservedProperty} observed_property
    * @param {istsos.Date} begin_time
    * @param {istsos.Date} end_time
    */
   getObservationsSimplified(options) {
      var urlConfig = prepareForGetObservations(options);
      var url = `${this.server.getUrl()}wa/istsos/services/${this.name}/operations/getobservation/offerings/${urlConfig.offering}/procedures/${urlConfig.procedureNames}/observedproperties/${urlConfig.observedPropertyUrns}/eventtime/${begin}/${end}`;

      let config = {};
      if(this.server.getLoginConfig()) {
         config['headers'] = this.server.getLoginConfig();
      }
      
      return HttpAPI.get(url, config)
         .then((result) => {
            if (result.success) {
               let transformed = transformGetObservationResponse('simple', result);
               this.fireEvent('GETOBSERVATIONS_BY_PROPERTY', transformed);
               return result;
            } else {
               throw result.message
            }
         }, (error_message) => {
            throw error_message;
         });
   }

   //lessThan, lessThanAndEqual, equal, greaterThanAndEqual, greatherThan, between
   getObservationsByQualityIndexConstraint(options, constraintConfig) {
      var urlConfig = prepareForGetObservations(options);
      var url = `${this.server.getUrl()}wa/istsos/services/${this.name}/operations/getobservation/offerings/${urlConfig.offering}/procedures/${urlConfig.procedureNames}/observedproperties/${urlConfig.observedPropertyUrns}/eventtime/${begin}/${end}`;

      let config = {};
      if(this.server.getLoginConfig()) {
         config['headers'] = this.server.getLoginConfig();
      }
      
      return HttpAPI.get(url, config)
         .then((result) => {
            if (result.success) {
               let transformed = transformGetObservationResponse('constraint', result, constraintConfig);
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
    * @fires istsos.Service#istsos.events.EventType: GEOJSON
    * @param {int} opt_epsg
    * @param {istsos.Offering} opt_offering
    * @param {istsos.Procedure|istsos.VirtualProcedure} opt_procedure
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
      if(this.server.getLoginConfig()) {
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
