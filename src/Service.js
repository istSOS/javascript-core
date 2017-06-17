goog.require('goog.events');
goog.require('goog.events.Event');
goog.require('goog.events.EventTarget');
goog.require('goog.net.XhrIo');

/** istsos.Service class */
/**
 * @param {istsos.Server} server
 * @param {String} name
 * @param {istsos.Database} opt_db
 * @param {istsos.Configuration} opt_config
 * @param {int} opt_epsg
 * @constructor
 */
istsos.Service = class {
   cosntructor(options) {
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

      var temporary_offering = new istsos.Offering("temporary",
         "temporary offering to hold self-registered procedures/sensors waiting for service adimistration acceptance",
         true, "", this);
   }

   /**
    * @param {String} url
    * @param {istsos.events.EventType} eventType
    * @param {String} method
    * @param {JSON} opt_data
    */
   executeRequest(url, eventType, method, opt_data, opt_otherData) {
      goog.net.XhrIo.send(url, function(e) {
         istsos.fire(eventType, e.target, opt_otherData);
      }, method, opt_data);
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
      this.executeRequest(url, istsos.events.EventType.NEW_OFFERING, "POST", JSON.stringify(offering.getOfferingJSON()));
   }

   /**
    * @fires istsos.Service#istsos.events.EventType: OFFERING_NAMES
    */
   getOfferingNames() {
      var url = `${this.server.getUrl()}wa/istsos/services/${this.getServiceJSON()["service"]}/offerings/operations/getlist`;
      this.executeRequest(url, istsos.events.EventType.OFFERING_NAMES, "GET");
   }

   /**
    * @fires istsos.Service#istsos.events.EventType: OFFERING_LIST
    */
   getOfferings() {
      var url = `${this.server.getUrl()}wa/istsos/services/${this.getServiceJSON()["service"]}/offerings`;
      this.executeRequest(url, istsos.events.EventType.OFFERING_LIST, "GET");
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
      this.executeRequest(url, istsos.events.EventType.NEW_PROCEDURE, "POST", JSON.stringify(procedure.getProcedureJSON()));
   }

   /**
    * @fires istsos.Service#istsos.events.EventType: PROCEDURE
    * @param {istsos.Procedure} procedure
    */
   getProcedure(procedure) {
      var url = `${this.server.getUrl()}wa/istsos/services/${this.getServiceJSON()["service"]}/procedures/${procedure.getProcedureJSON()["system"]}`;
      this.executeRequest(url, istsos.events.EventType.PROCEDURE, "GET");
   }

   /**
    * @fires istsos.Service#istsos.events.EventType: PROCEDURES
    */
   getProcedures() {
      var url = `${this.server.getUrl()}wa/istsos/services/${this.getServiceJSON()["service"]}/procedures/operations/getlist`;
      this.executeRequest(url, istsos.events.EventType.PROCEDURES, "GET");
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
      this.executeRequest(url, istsos.events.EventType.NEW_VIRTUAL_PROCEDURE, "POST", JSON.stringify(v_procedure.getVirtualProcedureJSON()));
   }

   /**
    * @fires istsos.Service#istsos.events.EventType: VIRTUAL_PROCEDURE
    * @param {istsos.VirtualProcedure} v_procedure
    */
   getVirtualProcedure(v_procedure) {
      var url = `${this.server.getUrl()}wa/istsos/services/${this.getServiceJSON()["service"]}/virtualprocedures`;
      this.executeRequest(url, istsos.events.EventType.VIRTUAL_PROCEDURE, "GET");
   }

   /**
    * @fires istsos.Service#istsos.events.EventType: VIRTUAL_PROCEDURES
    */
   getVirtualProcedures() {
      var url = `${this.server.getUrl()}wa/istsos/services/${this.getServiceJSON()["service"]}/virtualprocedures/operations/getlist`;
      this.executeRequest(url, istsos.events.EventType.VIRTUAL_PROCEDURES, "GET");
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
   }

   /**
    * @fires istsos.Service#istsos.events.EventType: OBSERVED_PROPERTIES
    */
   getObservedProperties() {
      var url = `${this.server.getUrl()}wa/istsos/services/${this.getServiceJSON()["service"]}/observedproperties`;
      this.executeRequest(url, istsos.events.EventType.OBSERVED_PROPERTIES, "GET");
   }

   /**
    * @fires istsos.Service#istsos.events.EventType: OBSERVED_PROPERTY
    * @param {istsos.ObservedProperty} property
    */
   getObservedProperty(property) {
      var url = `${this.server.getUrl()}wa/istsos/services/${this.getServiceJSON()["service"]}/observedproperties/${property.getObservedPropertyJSON()["definition"]}`;
      this.executeRequest(url, istsos.events.EventType.OBSERVED_PROPERTY, "GET");
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
      this.executeRequest(url, istsos.events.EventType.NEW_UOM, "POST", JSON.stringify(uom.getUomJSON()));
   }

   /**
    * @fires istsos.Service#istsos.events.EventType: UOMS
    */
   getUoms() {
      var url = `${this.server.getUrl()}wa/istsos/services/${this.getServiceJSON()["service"]}/uoms`;
      this.executeRequest(url, istsos.events.EventType.UOMS, "GET");
   }

   /**
    * @fires istsos.Service#istsos.events.EventType: UOM
    * @param {istsos.UnitOfMeasure} uom
    */
   getUom(uom) {
      var url = `${this.server.getUrl()}wa/istsos/services/${this.getServiceJSON()["service"]}/uoms/${uom.getUomJSON()["name"]}`;
      this.executeRequest(url, istsos.events.EventType.UOM, "GET");
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
   }

   /**
    * @fires istsos.Service#istsos.events.EventType: DATAQUALITIES
    */
   getDataQualities() {
      var url = `${this.server.getUrl()}wa/istsos/services/${this.getServiceJSON()["service"]}/dataqualities`;
      this.executeRequest(url, istsos.events.EventType.DATAQUALITIES, "GET");
   }

   /**
    * @fires istsos.Service#istsos.events.EventType: DATA_QUALITY
    * @param {istsos.DataQuality} dataQuality
    */
   getDataQuality(dataQuality) {
      var url = `${this.server.getUrl()}wa/istsos/services/${this.getServiceJSON()["service"]}/dataqualities/${dataQuality.getDataQualityJSON()["code"]}`;
      this.executeRequest(url, istsos.events.EventType.DATAQUALITY, "GET");
   }

   /**
    * @fires istsos.Service#istsos.events.EventType: SYSTEM_TYPES
    */
   getSystemTypes() {
      var url = `${this.server.getUrl()}wa/istsos/services/${this.getServiceJSON()["service"]}/systemtypes`;
      this.executeRequest(url, istsos.events.EventType.SYSTEM_TYPES, "GET");
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
      this.db.getDb(this.getServiceJSON()["service"], this.server);
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
      var proc_names = [];
      for (var p = 0; p < options.procedures.length; p++) {
         if (options.procedures[p].systemType === "virtual") {
            proc_names.push(options.procedures[p].getVirtualProcedureJSON()["system"]);
         } else if (options.procedures[p].systemType === "insitu-fixed-point" || options.procedures[p].systemType === "insitu-mobile-point") {
            proc_names.push(options.procedures[p].getProcedureJSON()["system"]);
         } else {
            console.log(options.procedures[p] + ": WRONG TYPE!");
         }
      }

      var urns = [];
      for (var i = 0; i < options.observed_properties.length; i++) {
         urns.push(options.observed_properties[i].getObservedPropertyJSON()["definition"]);
      }
      var begin = (options.begin_time instanceof istsos.Date) ? options.begin_time.getDateString() : options.begin_time;
      var end = (options.end_time instanceof istsos.Date) ? options.end_time.getDateString() : options.end_time;
      var url = `${this.server.getUrl()}wa/istsos/services/${this.name}/operations/getobservation/offerings/${options.offering.getOfferingJSON()["name"]}/procedures/${proc_names.toString()}/observedproperties/${urns.toString()}/eventtime/${begin}/${end}`;
      console.log(url);
      this.executeRequest(url, istsos.events.EventType.GETOBSERVATIONS, "GET");
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
   getObservationsWithAggregation(options, aggregation_config) {
      var proc_names = [];
      var aggTrue = ""
      if (aggregation_config.aggFunc && aggregation_config.aggInterval) {
         aggTrue = "?"
      }
      for (var p = 0; p < options.procedures.length; p++) {
         if (options.procedures[p].systemType === "virtual") {
            proc_names.push(options.procedures[p].getVirtualProcedureJSON()["system"]);
         } else if (options.procedures[p].systemType === "insitu-fixed-point" || options.procedures[p].systemType === "insitu-mobile-point") {
            proc_names.push(options.procedures[p].getProcedureJSON()["system"]);
         } else {
            console.log(options.procedures[p] + ": WRONG TYPE!");
         }
      }

      var urns = [];
      for (var i = 0; i < options.observed_properties.length; i++) {
         urns.push(options.observed_properties[i].getObservedPropertyJSON()["definition"]);
      }
      var begin = (options.begin_time instanceof istsos.Date) ? options.begin_time.getDateString() : options.begin_time;
      var end = (options.end_time instanceof istsos.Date) ? options.end_time.getDateString() : options.end_time;
      var url = `${this.server.getUrl()}wa/istsos/services/${this.name}/operations/getobservation/offerings/${options.offering.getOfferingJSON()["name"]}/procedures/${proc_names.toString()}/observedproperties/${urns.toString()}/eventtime/${begin}/${end}`;

      if (aggregation_config.aggFunc && aggregation_config.aggInterval) {
         url += "?"
         if (aggregation_config.aggFunc === "SUM" || aggregation_config.aggFunc === "MAX" || aggregation_config.aggFunc === "MIN" || aggregation_config.aggFunc === "AVG") {
            url += `aggregatefunction=${aggFunc}&aggregateinterval=${aggInterval}`;
         } else {
            console.log("Incorrect aggregate function!!!");
         }
      }

      if (aggregation_config.aggNoData && aggregation_config.aggNoDataQI) {
         url += `&aggregatenodata=${aggregation_config.aggNoData.toString()}&aggregatenodataqi=${aggregation_config.aggNoDataQI.toString()}`;
      }


      console.log(url);
      this.executeRequest(url, istsos.events.EventType.GETOBSERVATIONS_AGG, "GET");
   }


   /**
    * @fires istsos.Service#istsos.events.EventType: GETOBSERVATIONS_BY_PROPERTY
    * @param {istsos.Offering} offering
    * @param {istsos.Procedure|istsos.VirtualProcedure} procedure
    * @param {istsos.ObservedProperty} observed_property
    * @param {istsos.Date} begin_time
    * @param {istsos.Date} end_time
    */
   getObservationsBySingleProperty(options) {
      var proc_name;
      if (options.procedure.systemType === "virtual") {
         proc_name = options.procedure.getVirtualProcedureJSON()["system"];
      } else if (options.procedure.systemType === "insitu-fixed-point" || options.procedure.systemType === "insitu-mobile-point") {
         proc_name = options.procedure.getProcedureJSON()["system"]
      } else {
         console.log("WRONG TYPE");
      }
      var begin = (options.begin_time instanceof istsos.Date) ? options.begin_time.getDateString() : options.begin_time;
      var end = (options.end_time instanceof istsos.Date) ? options.end_time.getDateString() : options.end_time;
      var url = `${this.server.getUrl()}wa/istsos/services/${this.name}/operations/getobservation/offerings/${options.offering.getOfferingJSON()["name"]}/procedures/${proc_name}/observedproperties/${urns.toString()}/eventtime/${begin}/${end}`;
      console.log(url);
      this.executeRequest(url, istsos.events.EventType.GETOBSERVATIONS_BY_PROPERTY, "GET");
   }

   //lessThan, lessThanAndEqual, equal, greaterThanAndEqual, greatherThan, between
   getObservationsByQualityIndexConstraint(options, constraint_config) {
      var proc_name;
      if (options.procedure.systemType === "virtual") {
         proc_name = options.procedure.getVirtualProcedureJSON()["system"];
      } else if (options.procedure.systemType === "insitu-fixed-point" || options.procedure.systemType === "insitu-mobile-point") {
         proc_name = options.procedure.getProcedureJSON()["system"]
      } else {
         console.log("WRONG TYPE");
      }
      var begin = (options.begin_time instanceof istsos.Date) ? options.begin_time.getDateString() : options.begin_time;
      var end = (options.end_time instanceof istsos.Date) ? options.end_time.getDateString() : options.end_time;
      var url = `${this.server.getUrl()}wa/istsos/services/${this.name}/operations/getobservation/offerings/${options.offering.getOfferingJSON()["name"]}/procedures/${proc_name}/observedproperties/${urns.toString()}/eventtime/${begin}/${end}`;
      console.log(url);
      this.executeRequest(url, istsos.events.EventType.GETOBSERVATIONS_BY_QUALITY, "GET", null, {
         "QI_CONSTRAINT": "TRUE",
         "type": constraint_config.constraintType,
         "quality": constraint_config.qualityIndexNumber
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
      console.log(url);
      this.executeRequest(url, istsos.events.EventType.GEOJSON, "GET");
   }
}
