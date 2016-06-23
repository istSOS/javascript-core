goog.require('goog.events');
goog.require('goog.events.Event');
goog.require('goog.events.EventTarget');
goog.require('goog.net.XhrIo');

/** istsos.Service class */
/**
 * @param {istsos.Server} server
 * @param {string} serviceName
 * @param {istsos.Database} opt_db
 * @param {istsos.Configuration} opt_config
 * @param {int} opt_epsg
 * @constructor
 */
istsos.Service = function (serviceName, server, opt_db, opt_config, opt_epsg) {
    this.serviceName = serviceName;
    this.db = opt_db || server.getDefaultDbProperty();
    this.epsg = opt_epsg || null;
    this.config = opt_config || new istsos.Configuration(serviceName, server); // configsections
    this.server = server;
    this.offerings = [];
    this.procedures = [];
    this.virtualProcedures = [];
    this.observedProperties = [];
    this.uoms = [];
    this.dataQualities = [];
    server.addService(this);
    var temporary_offering = new istsos.Offering("temporary",
        "temporary offering to hold self-registered procedures/sensors waiting for service adimistration acceptance", true, "", this);
};

//methods
istsos.Service.prototype = {
    executeRequest: function (url, eventType, method, opt_data, opt_callback) {
        goog.net.XhrIo.send(url, function (e) {
            var obj = e.target.getResponseJson();
            console.log(obj);
            istsos.fire(eventType, e.target);
        }, method, opt_data);
    },
    getServiceJSON: function () {
        var serviceJSON = {
            "service": this.serviceName
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
    },
    getOfferingsProperty: function () {
        return this.offerings;
    },
    getProceduresProperty: function () {
        return this.procedures;
    },
    getVirtualProceduresProperty: function () {
        return this.virtualProcedures;
    },
    getObservedPropertiesProperty: function () {
        return this.observedProperties;
    },
    getUomsProperty: function () {
        return this.uoms;
    },
    getDataQualitiesProperty: function () {
        return this.dataQualities;
    },
    addOffering: function (offering) {
        this.getOfferingsProperty().push(offering);
    },
    registerOffering: function (offering) {
        var url = this.server.getUrl() + "wa/istsos/services/" + this.getServiceJSON()["service"] + "/offerings";
        console.log(url);
        this.executeRequest(url, istsos.events.EventType.NEW_OFFERING, "POST", JSON.stringify(offering.getOfferingJSON()));
    },
    getOfferingNames: function () {
        var url = this.server.getUrl() + "wa/istsos/services/" + this.getServiceJSON()["service"] + "/offerings/operations/getlist";
        this.executeRequest(url, istsos.events.EventType.OFFERING_NAMES, "GET");
    },
    getOfferings: function () {
        var url = this.server.getUrl() + "wa/istsos/services/" + this.getServiceJSON()["service"] + "/offerings";
        this.executeRequest(url, istsos.events.EventType.OFFERING_LIST, "GET");
    },

    addProcedure: function (procedure) {
        this.getProceduresProperty().push(procedure);
    },
    registerProcedure: function (procedure) {
        var url = this.server.getUrl() + "wa/istsos/services/" + this.serviceName + "/procedures";
        console.log(url);
        console.log(JSON.stringify(procedure.getProcedureJSON()));
        this.executeRequest(url, istsos.events.EventType.NEW_PROCEDURE, "POST", JSON.stringify(procedure.getProcedureJSON()));
    },
    getProcedure: function(procedure) {
        var url = this.server.getUrl() + "wa/istsos/services/" + this.serviceName + "/procedures/" + procedure.getProcedureJSON()["system"];
        console.log(url);
        this.executeRequest(url, istsos.events.EventType.PROCEDURE, "GET");
    },
    getProcedures: function () {
        var url = this.server.getUrl() + "wa/istsos/services/" + this.serviceName + "/procedures/operations/getlist";
        this.executeRequest(url, istsos.events.EventType.PROCEDURES, "GET");
    },
    addVirtualProcedure: function (v_procedure) {
        this.getVirtualProceduresProperty().push(v_procedure);
    },
    registerVirtualProcedure: function (v_procedure) {
        var url = this.server.getUrl() + "wa/istsos/services/" + this.serviceName + "/procedures";
        console.log(JSON.stringify(v_procedure.getVirtualProcedureJSON()));
        this.executeRequest(url, istsos.events.EventType.NEW_VIRTUAL_PROCEDURE, "POST", JSON.stringify(v_procedure.getVirtualProcedureJSON()));
    },
    getVirtualProcedure: function(v_procedure) {
        var url = this.server.getUrl() + "wa/istsos/services/" + this.serviceName + "/virtualprocedures/" + v_procedure.getVirtualProcedureJSON()["system"];
        this.executeRequest(url, istsos.events.EventType.VIRTUAL_PROCEDURE, "GET");
    },
    getVirtualProcedures: function () {
        var url = this.server.getUrl() + "wa/istsos/services/" + this.serviceName + "/virtualprocedures/operations/getlist";
        this.executeRequest(url, istsos.events.EventType.VIRTUAL_PROCEDURES, "GET");
    },
    /**
     * @param {istsos.ObservedProperty} property
     */
    addObservedProperty: function (property) {
        this.getObservedPropertiesProperty().push(property)
    },
    /**
     * @param {istsos.ObservedProperty} property
     */
    registerObservedProperty: function (property) {
        var url = this.server.getUrl() + "wa/istsos/services/" + this.getServiceJSON()["service"] +
            "/observedproperties";
        console.log(JSON.stringify(property.getObservedPropertyJSON()));
        this.executeRequest(url, istsos.events.EventType.NEW_OBSERVED_PROPERTY, "POST", JSON.stringify(property.getObservedPropertyJSON()));
    },
    getObservedProperties: function () {
        var url = this.server.getUrl() + "wa/istsos/services/" + this.serviceName +  "/observedproperties";
        console.log(url);
        this.executeRequest(url, istsos.events.EventType.OBSERVED_PROPERTIES, "GET");
    },
    getObservedProperty: function (property) {
        var url = this.server.getUrl() + "wa/istsos/services/" + this.serviceName + "/observedproperties/" +
            property.getObservedPropertyJSON()["definition"];
        console.log(url);
        this.executeRequest(url, istsos.events.EventType.OBSERVED_PROPERTY, "GET");
    },
    /**
     * @param {istsos.UnitOfMeasure} uom
     */
    addUom: function (uom) {
        this.getUomsProperty().push(uom);
    },
    registerUom: function (uom) {
        var url = this.server.getUrl() + "wa/istsos/services/" + this.getServiceJSON()["service"] + "/uoms";
        this.executeRequest(url, istsos.events.EventType.NEW_UOM, "POST", JSON.stringify(uom.getUomJSON()));
    },
    getUoms: function () {
        var url = this.server.getUrl() + "wa/istsos/services/" + this.getServiceJSON()["service"] + "/uoms";
        this.executeRequest(url, istsos.events.EventType.UOMS, "GET");
    },
    getUom: function (uom) {
        var url = this.server.getUrl() + "wa/istsos/services/" + this.getServiceJSON()["service"] + "/uoms/" +
            uom.getUomJSON()["name"];
        this.executeRequest(url, istsos.events.EventType.UOM, "GET");
    },
    /**
     * @param {istsos.DataQuality} dataQuality
     */
    addDataQuality: function (dataQuality) {
        this.getDataQualitiesProperty().push(dataQuality);
    },
    registerDataQuality: function (dataQuality) {
        var url = this.server.getUrl() + "wa/istsos/services/" + this.getServiceJSON()["service"] +
            "/dataqualities";
        console.log(url)
        this.executeRequest(url, istsos.events.EventType.NEW_DATAQUALITY, "POST", JSON.stringify(dataQuality.getDataQualityJSON()));
    }
    ,
    getDataQualities: function () {
        var url = this.server.getUrl() + "wa/istsos/services/" + this.getServiceJSON()["service"] +
            "/dataqualities";
        this.executeRequest(url, istsos.events.EventType.DATAQUALITIES, "GET");
    },
    getDataQuality: function (dataQuality) {
        var url = this.server.getUrl() + "wa/istsos/services/" + this.getServiceJSON()["service"] +
            "/dataqualities/" + dataQuality.getDataQualityJSON()["code"];
        console.log(url);
        this.executeRequest(url, istsos.events.EventType.DATAQUALITY, "GET");
    },
    getSystemTypes: function () {
        var url = this.server.getUrl() + "wa/istsos/services/" + this.getServiceJSON()["service"] + "/systemtypes";
        this.executeRequest(url, istsos.events.EventType.SYSTEM_TYPES, "GET");
    },
    getDatabaseProperty: function () {
        return this.db;
    },
    getDatabase: function () {
        this.db.getDb(this.getServiceJSON()["service"], this.server);
    },
    /**
     * @param {istsos.Offering} offering
     * @param {istsos.Procedure|istsos.VirtualProcedure} procedure
     * @param {Array<istsos.ObservedProperty>} observed_properties
     * @param {istsos.Date} begin_time
     * @param {istsos.Date} end_time
     */
    getObservations: function (offering, procedure, observed_properties, begin_time, end_time) {
        var proc_name;
        if (procedure.systemType === "virtual") {
            proc_name = procedure.getVirtualProcedureJSON()["system"];
        } else if (procedure.systemType === "insitu-fixed-point" || procedure.systemType === "insitu-mobile-point") {
            proc_name = procedure.getProcedureJSON()["system"]
        } else {
            console.log("WRONG TYPE");
        }
        var urns = [];
        for (var i = 0; i < observed_properties.length; i++) {
            urns.push(observed_properties[i].getObservedPropertyJSON()["definition"]);
        }
        var url = this.server.getUrl() + "wa/istsos/services/" + this.serviceName + "/operations/getobservation/offerings/" +
            offering.getOfferingJSON()["name"] + "/procedures/" + proc_name + "/observedproperties/" + urns.toString() +
            "/eventtime/" + begin_time.getDateString() + "/" + end_time.getDateString();
        console.log(url);
        this.executeRequest(url, istsos.events.EventType.GETOBSERVATIONS, "GET");
    },
    getObservationsBySingleProperty: function (offering, procedure, observed_property, begin_time, end_time) {
        var proc_name;
        if (procedure.systemType === "virtual") {
            proc_name = procedure.getVirtualProcedureJSON()["system"];
        } else if (procedure.systemType.startsWith("insitu")) {
            proc_name = procedure.getProcedureJSON()["system"]
        } else {
            console.log("WRONG TYPE");
        }
        var url = this.server.getUrl() + "wa/istsos/services/" + this.serviceName + "/operations/getobservation/offerings/" +
            offering.getOfferingJSON()["name"] + "/procedures/" + proc_name + "/observedproperties/" +
            observed_property.getObservedPropertyJSON()["definition"] + "/eventtime/" + begin_time.getDateString() +
            "/" + end_time.getDateString();
        console.log(url);
        this.executeRequest(url, istsos.events.EventType.GETOBSERVATIONS_BY_PROPERTY, "GET");
    },
    /**
     * @param {int} epsg
     * @param {istsos.Offering} opt_offering
     * @param {istsos.Procedure|istsos.VirtualProcedure} opt_procedure
     */
    getFeatureCollection: function (opt_epsg, opt_offering, opt_procedure) {
        var url = this.server.getUrl() + "wa/istsos/services/" + this.serviceName +
            "/procedures/operations/geojson";
        if(opt_epsg) {
            url += "?epsg=" + opt_epsg.toString();
            if(opt_offering || opt_procedure) {
                if(opt_offering) {
                    url += "&offering=" + opt_offering.getOfferingJSON()["name"];
                }
                if(opt_procedure && opt_procedure.constructor === istsos.Procedure) {
                    url += "&procedure=" + opt_procedure.getProcedureJSON()["system"];
                } else if (opt_procedure && opt_procedure.constructor === istsos.VirtualProcedure) {
                    url += "&procedure=" + opt_procedure.getVirtualProcedureJSON()["system"];
                }
            }
        }
        console.log(url);
        this.executeRequest(url, istsos.events.EventType.GEOJSON, "GET");
    }
};