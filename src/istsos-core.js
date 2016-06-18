goog.provide('istsos');
goog.provide('istsos.events');
goog.require('goog.events');
goog.require('goog.events.Event');
goog.require('goog.events.EventTarget');
goog.require('goog.net.XhrIo');

/** istsos event handling */

//EVENT TYPES
istsos.events.EventType = {
    ABOUT: 'aboutReceived',
    STATUS: 'statusReceived',
    CONFIGSECTIONS: 'configSectionsReceived',
    PROVIDER: 'providerReceived',
    UPDATE_PROVIDER: 'PUT ProviderReceived',
    IDENTIFICATION: 'identificationReceived',
    UPDATE_IDENTIFICATION: 'PUT identificationReceived',
    MQTT: 'mqttReceived',
    UPDATE_MQTT: 'PUT mqttReceived',
    CRS: 'crsReceived',
    UPDATE_CRS: 'PUT crsReceived',
    OBSERVATION_CONF: 'observationConfigurationReceived',
    UPDATE_OBSERVATION_CONF: 'PUT observationConfigurationReceived',
    PROXY: 'proxyReceived',
    UPDATE_PROXY: 'PUT proxyReceived',
    SERVICE: 'serviceReceived',
    SERVICES: 'servicesListReceived',
    NEW_SERVICE: 'POST serviceReceived',
    DELETE_SERVICE: 'DELETE serviceReceived',
    DATABASE: 'databaseReceived',
    UPDATE_DATABASE: 'PUT databaseReceived',
    VALIDATE_DB: 'POST validateDbReceived',
    EPSG_CODES: 'epsgsReceived',
    SYSTEM_TYPES: 'systemTypesReceived',
    NEW_OFFERING: 'POST offeringReceived',
    OFFERING_NAMES: 'offeringNamesReceived',
    OFFERING_LIST: 'offeringListReceived',
    DELETE_OFFERING: 'DELETE offeringReceived',
    UPDATE_OFFERING: 'PUT offeringReceived',
    MEMBERLIST: 'memberlistReceived',
    NONMEMBERLIST: 'nonmemberlistReceived',
    OBSERVED_PROPERTIES: 'observedPropertiesReceived',
    OBSERVED_PROPERTY: 'observedPropertyReceived',
    NEW_OBSERVED_PROPERTY: 'POST observedPropertyReceived',
    UPDATE_OBSERVED_PROPERTY: 'PUT observedPropertyReceived',
    DELETE_OBSERVED_PROPERTY: 'DELETE observedPropertyReceived',
    DATAQUALITIES: 'dataQualitiesReceived',
    DATAQUALITY: 'dataQualityReceived',
    NEW_DATAQUALITY: 'POST dataQualityReceived',
    UPDATE_DATAQUALITY: 'PUT dataQualityReceived',
    DELETE_DATAQUALITY: 'DELETE dataQualityReceived',
    UOM: 'unitOfMeasureReceived',
    UOMS: 'unitsOfMeasureReceived',
    NEW_UOM: 'POST unitOfMeasureReceived',
    UPDATE_UOM: 'PUT unitOfMeasureReceived',
    DELETE_UOM: 'DELETE unitOfMeasureReceived',
    GET_CODE: 'codeReceived',
    NEW_CODE: 'POST codeReceived',
    UPDATE_CODE: 'PUT codeReceived',
    DELETE_CODE: 'DELETE codeReceived',
    RATING_CURVE: 'ratingCurveReceived',
    NEW_RATING_CURVE: 'POST ratingCurveReceived',
    DELETE_RATING_CURVE: 'DELETE ratingCurveReceived',
    NEW_PROCEDURE: 'POST procedureReceived',
    UPDATE_PROCEDURE: 'PUT procedureReceived',
    DELETE_PROCEDURE: 'DELETE procedureReceived',
    ADD_TO_OFFERING: 'POST addToOfferingReceived',
    REMOVE_FROM_OFFERING: 'DELETE removeFromOfferingReceived',
    VIRTUAL_PROCEDURES: 'virtualProceduresReceived',
    VIRTUAL_PROCEDURE: 'virtualProcedureReceived',
    NEW_VIRTUAL_PROCEDURE: 'POST virtualProcedureReceived',
    UPDATE_V_PROCEDURE: 'PUT virtualProcedureReceived',
    DELETE_V_PROCEDURE: 'DELETE virtualProcedureReceived',
    PROCEDURES: 'proceduresReceived',
    PROCEDURE: 'procedureReceived',



};

//EVENT RESPONSE
istsos.events.JSONResponse = function (type, xhrIo) {
    goog.base(this, type);
    /**
     * The response in text plain
     * @type {string}
     * @api stable
     */
    this['text'] = xhrIo.getResponseText();

    /**
     * The JSON response object
     * @type {object}
     * @api stable
     */
    this['json'] = xhrIo.getResponseJson();

    /**
     * Show if the response is successfull
     * @type {string}
     * @api stable
     */
    this['success'] = this['json']['success'];

    /**
     * The server message
     * @type {string}
     * @api stable
     */
    this['message'] = this['json']['message'];

};
goog.inherits(istsos.events.JSONResponse, goog.events.Event);

istsos.events.JSONResponse.prototype.getData = function () {
    return this['json']['data'];
};

// EVENT HANDLER
istsos.events._Handler = new goog.events.EventTarget();

istsos.on = function (eventType, func, opt_scope) {
    istsos.events._Handler.listen(eventType, func, false, opt_scope);
};

istsos.once = function (eventType, func, opt_scope) {
    istsos.events._Handler.listenOnce(eventType, func, false, opt_scope);
};

istsos.fire = function (eventType, event) {
    console.log("Firing event: " + eventType);
    istsos.events._Handler.dispatchEvent(
        new istsos.events.JSONResponse(eventType, event)
    );
};

/** istsos.IstSOS class */

/**
 * @constructor
 */
istsos.IstSOS = function () {
    this.servers = [];
};

// methods
istsos.IstSOS.prototype = {
    /**
     * @param {istsos.Server} server
     */
    addServer: function (server) {
        this.servers.push(server);
    },
    /**
     * @param {string} old_name
     * @param {string} new_name
     * @param {string} new_url
     * @param {istsos.Configuration} new_config
     * @param {istsos.Database} new_defaultDb
     */
    updateServer: function (old_name, new_name, new_url, new_config, new_defaultDb) {
        var oldServer = this.getServer(old_name);
        oldServer['serverName'] = new_name || oldServer['serverName'];
        oldServer['url'] = new_url || oldServer['url'];
        oldServer['config'] = new_config || oldServer['config'];
        oldServer['defaultDb'] = new_defaultDb || oldServer['defaultDb'];
    },
    /**
     * @param {string} name
     */
    removeServer: function (name) {
        var i;
        for (i = 0; i < this.servers.length; i++) {
            if (this.servers[i]['serverName'] === name) {
                this.servers.splice(i, 1);
            }
        }
    },
    /**
     * @param {string} name
     * @returns {istsos.Server}
     */
    getServer: function (name) {
        for (i = 0; i < this.servers.length; i++) {
            if (this.servers[i]['serverName'] === name) {
                return this.servers[i];
            }
        }
    },
    /**
     * @returns {Array}
     */
    getServerList: function () {
        return this.servers
    }
};

/** istsos.Server class */

/**
 * @param {string} serverName
 * @param {string} url
 * @param {istsos.Database} defaultDb
 * @param {istsos.Configuration} opt_config
 * @param {JSON} opt_loginConfig
 * @constructor
 */
istsos.Server = function (serverName, url, defaultDb, opt_config, opt_loginConfig) {
    this.serverName = serverName;
    this.url = (url.endsWith('/')) ? url : url + '/';
    this.defaultDb = defaultDb;
    this.config = opt_config || new istsos.Configuration(null, this);
    this.loginConfig = opt_loginConfig || {};
    this.services = [];
};

// methods
istsos.Server.prototype = {
    /**
     * @param {string} url
     * @param {istsos.events.EventType} eventType
     * @param {string} method
     * @param {JSON} opt_data
     * @param {function} opt_callback
     */
    executeRequest: function (url, eventType, method, opt_data, opt_callback) {
        goog.net.XhrIo.send(url, function (e) {
            istsos.fire(eventType, e.target);
        }, method, opt_data);
    },
    /**
     * @param {istsos.Service} service */
    getService: function (service) {
        var url = this.url + 'wa/istsos/services/' + service.getServiceJSON()['service'];
        this.executeRequest(url, istsos.events.EventType.SERVICE, 'GET');
    },
    /**
     * @param {istsos.Service} service */
    addService: function (service) {
        this.services.push(service);
    },
    /**
     * @param {istsos.Service} service
     */
    registerService: function (service) {
        var url = this.getUrl() + 'wa/istsos/services';
        this.executeRequest(url, istsos.events.EventType.NEW_SERVICE, 'POST', service.getServiceJSON());
    },
    /**
     * @param {istsos.Service} service
     */
    deleteService: function (service) {
        var i;
        for (i = 0; i < this.services.length; i++) {
            if (this.services[i].getServiceJSON()['service'] === service.getServiceJSON()['service']) {
                this.services.splice(i, 1);
            }
        }
        var url = this.url + 'wa/istsos/services/' + serviceName;
        this.executeRequest(url, istsos.events.EventType.DELETE_SERVICE, 'DELETE', {"name": serviceName});
    },
    getStatus: function () {
        var url = this.url + 'wa/istsos/operations/status';
        this.executeRequest(url, istsos.events.EventType.STATUS, 'GET');
    },
    getAboutInfo: function () {
        var url = this.url + 'wa/istsos/operations/about';
        this.executeRequest(url, istsos.events.EventType.ABOUT, 'GET');
    },
    getConfig: function () {
        this.config.getConf();
    },
    /**
     * @returns {istsos.Configuration}
     */
    getConfigProperty: function () {
        return this.config;
    },
    /**
     * @returns {Array}
     */
    getServicesProperty: function () {
        return this.services
    },
    getServices: function () {
        var url = this.url + 'wa/istsos/services';
        this.executeRequest(url, istsos.events.EventType.SERVICES, 'GET');
    },
    getDefaultDb: function () {
        this.defaultDb.getDb('default', this);
    },
    /**
     * @returns {istsos.Database}
     */
    getDefaultDbProperty: function () {
        return this.defaultDb;
    },
    /**
     * @returns {string}
     */
    getUrl: function () {
        return this.url;
    }
};

/** istsos.Database class */

/**
 * @param {string} dbname
 * @param {string} host
 * @param {string} user
 * @param {string} password
 * @param {int} port
 * @constructor
 */
istsos.Database = function (dbname, host, user, password, port) {
    this.dbname = dbname;
    this.host = host;
    this.user = user;
    this.password = password;
    this.port = port;
};

// methods
istsos.Database.prototype = {
    /**
     * @param {string} url
     * @param {istsos.events.EventType} eventType
     * @param {string} method
     * @param {JSON} opt_data
     * @param {function} opt_callback
     */
    executeRequest: function (url, eventType, method, opt_data, opt_callback) {
        goog.net.XhrIo.send(url, function (e) {
            istsos.fire(eventType, e.target);
        }, method, opt_data);
    },
    /**
     * @param {string} serviceName
     * @param {istsos.Server} server
     */
    getDb: function (serviceName, server) {
        var sname = serviceName || "default";
        var url = server.getUrl() + "wa/istsos/services/" + sname + "/configsections/connection";
        this.executeRequest(url, istsos.events.EventType.DATABASE, "GET");
    },
    /**
     * @param {string} dbname
     * @param {string} host
     * @param {string} user
     * @param {string} password
     * @param {int} port
     * @param {istsos.Server} server
     * @param {istsos.Service} opt_service
     */
    setDb: function (dbname, host, user, password, port, server, opt_service) {
        this.dbname = dbname || this.dbname;
        this.host = host || this.host;
        this.password = password || this.password;
        this.port = port || this.port;
        var sname = "default" || opt_service.getServiceJSON()["service"];
        var url = server.getUrl() + "wa/istsos/services/" + sname + "/connection";
        this.executeRequest(url, "PUT", this.getDbJSON());
    },
    /**
     * @param {istsos.Server} server
     */
    validateDb: function (server) {
        var url = server.getUrl() + "wa/istsos/operations/validatedb";
        this.executeRequest(url, istsos.events.EventType.VALIDATE_DB, "POST", this.getDbJSON());
    },
    /**
     * @returns {JSON}
     */
    getDbJSON: function () {
        return {
            "user": this.user,
            "password": this.password,
            "host": this.host,
            "port": this.port.toString(),
            "dbname": this.dbname
        };
    }
};

/** istsos.Configuration class */

/**
 * @param {string} serviceName
 * @param {istsos.Server} server
 * @constructor
 */
istsos.Configuration = function (serviceName, server) {
    this.sname = (serviceName) ? serviceName : "default";
    this.serverUrl = server.getUrl();
};
//methods
istsos.Configuration.prototype = {
    /**
     * @param {string} url
     * @param {istsos.events.EventType} eventType
     * @param {string} method
     * @param {JSON} opt_data
     * @param {function} opt_callback
     */
    executeRequest: function (url, eventType, method, opt_data, opt_callback) {
        goog.net.XhrIo.send(url, function (e) {
            istsos.fire(eventType, e.target);
        }, method, opt_data);
    },
    getConf: function () {
        var url = this.serverUrl + "wa/istsos/services/" + this.sname + "/configsections";
        console.log(url);
        this.executeRequest(url, istsos.events.EventType.CONFIGSECTIONS, "GET");
    },
    getProvider: function () {
        var url = this.serverUrl + "wa/istsos/services/" + this.sname + "/configsections/provider";
        console.log(url);
        this.executeRequest(url, istsos.events.EventType.PROVIDER, "GET");
    },
    /**
     * @param {string} providerName
     * @param {string} providerSite
     * @param {string} contactName
     * @param {string} contactPosition
     * @param {string} contactVoice
     * @param {string} contactFax
     * @param {string} contactEmail
     * @param {string} contactDeliveryPoint
     * @param {string} contactPostalCode
     * @param {string} contactCity
     * @param {string} contactAdminArea
     * @param {string} contactCountry
     */
    updateProvider: function (providerName, providerSite, contactName, contactPosition, contactVoice, contactFax,
                              contactEmail, contactDeliveryPoint, contactPostalCode,
                              contactCity, contactAdminArea, contactCountry) {
        var data = {
            "providername": providerName,
            "providersite": providerSite,
            "contactname": contactName,
            "contactposition": contactPosition,
            "contactvoice": contactVoice,
            "contactfax": contactFax,
            "contactemail": contactEmail,
            "contactdeliverypoint": contactDeliveryPoint,
            "contactpostalcode": contactPostalCode,
            "contactcity": contactCity,
            "contactadminarea": contactAdminArea,
            "contactcountry": contactCountry
        };
        var url = this.serverUrl + "wa/istsos/services/" + this.sname + "/configsections/provider";
        this.executeRequest(url, istsos.events.EventType.UPDATE_PROVIDER, "PUT", data);
    },
    getIdentification: function () {
        var url = this.serverUrl + "wa/istsos/services/" + this.sname + "/configsections/identification";
        console.log(url);
        this.executeRequest(url, istsos.events.EventType.IDENTIFICATION, "GET");
    },
    /**
     * @param {string} title
     * @param {string} abstract
     * @param {string} urnVersion
     * @param {string} authority
     * @param {string} fees
     * @param {string} keywords
     * @param {string} accessConstrains
     */
    updateIdentification: function (title, abstract, urnVersion, authority, fees, keywords, accessConstrains) {
        var data = {
            "title": title,
            "abstract": abstract,
            "urnversion": urnVersion,
            "authority": authority,
            "fees": fees,
            "keywords": keywords,
            "accesscontrains": accessConstrains
        };
        var url = this.serverUrl + "wa/istsos/services/" + this.sname + "/configsections/identification";
        this.executeRequest(url, istsos.events.EventType.UPDATE_IDENTIFICATION, "PUT", data);
    },
    getMqtt: function () {
        var url = this.serverUrl + "wa/istsos/services/" + this.sname + "/configsections/mqtt";
        console.log(url);
        this.executeRequest(url, istsos.events.EventType.MQTT, "GET");
    },
    /**
     * @param {string} brokerPassword
     * @param {string} brokerUser
     * @param {string} brokerTopic
     * @param {string} brokerUrl
     * @param {string} brokerPort
     */
    updateMqtt: function (brokerPassword, brokerUser, brokerTopic, brokerUrl, brokerPort) {
        var data = {
            "broker_password": brokerPassword,
            "broker_user": brokerUser,
            "broker_topic": brokerTopic,
            "broker_url": brokerUrl,
            "broker_port": brokerPort
        };
        var url = this.serverUrl + "wa/istsos/services/" + this.sname + "/configsections/mqtt";
        this.executeRequest(url, istsos.events.EventType.UPDATE_MQTT, "PUT", data);
    },
    getCrs: function () {
        var url = this.serverUrl + "wa/istsos/services/" + this.sname + "/configsections/geo";
        console.log(url);
        this.executeRequest(url, istsos.events.EventType.CRS, "GET");
    },
    /**
     * @param {string} z_axis_name
     * @param {string} x_axis_name
     * @param {string} y_axis_name
     * @param {string} allowedEpsg
     * @param {string} istsosEpsg
     */
    updateCrs: function (z_axis_name, x_axis_name, y_axis_name, allowedEpsg, istsosEpsg) {
        var data = {
            "zaxisname": z_axis_name,
            "xaxisname": x_axis_name,
            "yaxisname": y_axis_name,
            "allowedepsg": allowedEpsg,
            "istsosepsg": istsosEpsg
        };
        var url = this.serverUrl + "wa/istsos/services/" + this.sname + "/configsections/geo";
        this.executeRequest(url, istsos.events.EventType.UPDATE_CRS, "PUT", data);
    },
    getObservationConf: function () {
        var url = this.serverUrl + "wa/istsos/services/" + this.sname + "/configsections/getobservation";
        console.log(url);
        this.executeRequest(url, istsos.events.EventType.OBSERVATION_CONF, "GET");
    },
    /**
     * @param {string} correctQi
     * @param {string} statQi
     * @param {string} defaultQi
     * @param {string} aggregateNoDataQi
     * @param {string} maxGoPeriod
     * @param {string} transactionalLog
     * @param {string} aggregateNoData
     */
    updateObservationConf: function (correctQi, statQi, defaultQi, aggregateNoDataQi,
                                     maxGoPeriod, transactionalLog, aggregateNoData) {
        var data = {
            "correct_qi": correctQi,
            "stat_qi": statQi,
            "defaultqi": defaultQi,
            "aggregatenodataqi": aggregateNoDataQi,
            "maxgoperiod": maxGoPeriod,
            "transactional_log": transactionalLog,
            "aggregatenodata": aggregateNoData
        };
        var url = this.serverUrl + "wa/istsos/services/" + this.sname + "/configsections/getobservation";
        this.executeRequest(url, istsos.events.EventType.UPDATE_OBSERVATION_CONF, "PUT", data);
    },
    getProxy: function () {
        var url = this.serverUrl + "wa/istsos/services/" + this.sname + "/configsections/serviceurl";
        console.log(url);
        this.executeRequest(url, istsos.events.EventType.PROXY, "GET");
    },
    /**
     * @param {string} newUrl
     */
    updateProxy: function (newUrl) {
        var data = {
            "url": newUrl
        };
        var url = this.serverUrl + "wa/istsos/services/" + this.sname + "/configsections/serviceurl";
        this.executeRequest(url, istsos.events.EventType.UPDATE_PROXY, "PUT", data);
    },
    getEpsgCodes: function () {
        var url = this.serverUrl + "wa/istsos/services/" + this.sname + "/epsgs";
        console.log(url);
        this.executeRequest(url, istsos.events.EventType.EPSG_CODES, "GET");
    }
};

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
        this.executeRequest(url, istsos.events.EventType.NEW_OFFERING, "POST", offering.getOfferingJSON());
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
        this.executeRequest(url, istsos.events.EventType.NEW_PROCEDURE, "POST", procedure.getProcedureJSON());
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
        this.executeRequest(url, istsos.events.EventType.NEW_VIRTUAL_PROCEDURE, "POST", v_procedure.getVirtualProcedureJSON());
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
        this.executeRequest(url, istsos.events.EventType.NEW_OBSERVED_PROPERTY, "POST", property.getObservedPropertyJSON())
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
        this.executeRequest(url, istsos.events.EventType.NEW_UOM, "POST", uom.getUomJSON());
    },
    getUoms: function () {
        var url = this.server.getUrl() + "wa/istsos/services/" + this.getServiceJSON()["service"] + "/uoms";
        this.executeRequest(url, istsos.events.EventType.UOMS, "GET");
    },
    getUom: function (uom) {
        var url = this.server.getUrl() + "wa/istsos/services/" + this.getServiceJSON()["service"] + "/uoms/" +
            uom.getUomJSON()["code"];
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
        this.executeRequest(url, istsos.events.EventType.NEW_DATAQUALITY, "POST", dataQuality.getDataQualityJSON());
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
    }
};

/** istsos.Date class */
/**
 * @param {int} year
 * @param {int} month
 * @param {int} day
 * @param {int} hours
 * @param {int} minutes
 * @param {int} seconds
 * @param {int} gmt
 * @param {string} opt_description
 * @constructor
 */
istsos.Date = function (year, month, day, hours, minutes, seconds, gmt, opt_description) {
    this.year = year.toString();
    this.month = month.toString();
    this.day = day.toString();
    this.hours = hours.toString();
    this.minutes = minutes.toString();
    this.seconds = seconds.toString();
    this.gmt = (gmt > 9) ? gmt.toString() : "0" + gmt.toString();
    this.description = opt_description || "Class for converting date&time to proper istSOS format";
};

istsos.Date.prototype = {
    /**
     * @returns {string}
     */
    getDateString: function () {
        return this.year + "-" + this.month + "-" + this.day + "T" +
            this.hours + ":" + this.minutes + ":" + this.seconds + "+" +
            this.gmt + ":" + "00";

    },
    /**
     * @returns {string|string|*}
     */
    getDescription: function () {
        return this.description;
    }
};
/** istsos.Offering class */
/**
 * @param {string} offeringName
 * @param {string} offeringDescription
 * @param {boolean} active
 * @param {istsos.Date} expirationDate
 * @param {istsos.Service} service
 * @constructor
 */
istsos.Offering = function (offeringName, offeringDescription, active, expirationDate, service) {
    this.offeringName = offeringName;
    this.offeringDescription = offeringDescription || "";
    this.active = active || false;
    this.expirationDate = (expirationDate && expirationDate.constructor === istsos.Date) ? expirationDate.getDateString() : "";
    this.service = service;
    this.memberProcedures = [];
    service.addOffering(this);
};

istsos.Offering.prototype = {
    executeRequest: function (url, eventType, method, opt_data, opt_callback) {
        goog.net.XhrIo.send(url, function (e) {
            istsos.fire(eventType, e.target);
        }, method, opt_data);
    },
    /**
     * @param {istsos.Procedure|istsos.VirtualProcedure} procedure
     */
    addProcedure: function (procedure) {
        this.memberProcedures.push(procedure);
    },
    /**
     * @param {string} newName
     * @param {string} newDescription
     * @param {boolean} newActive
     * @param {istsos.Date} newExpirationDate
     */
    updateOffering: function (newName, newDescription, newActive, newExpirationDate) {
        this.offeringName = newName || this.offeringName;
        this.offeringDescription = newDescription || this.offeringDescription;
        this.active = newActive || this.active;
        this.expirationDate = newExpirationDate || this.expirationDate;
        var url = this.service.server.getUrl() + "wa/istsos/services/" + this.service.getServiceJSON()["service"] +
            "/offerings/" + this.getOfferingJSON()["name"];
        this.executeRequest(url, istsos.events.EventType.UPDATE_OFFERING, "PUT", this.getOfferingJSON());
    },
    deleteOffering: function () {
        for (var i = 0; i < this.service.getOfferingsProperty().length; i++) {
            if (this === this.service.getOfferingsProperty()[i]) {
                this.service.getOfferingsProperty().splice(i, 1);
            }
        }
        var url = this.service.server.getUrl() + "wa/istsos/services/" + this.service.getServiceJSON()["service"] +
            "/offerings/" + this.getOfferingJSON()["name"];
        var data = {
            "name": this.getOfferingJSON()["name"],
            "description": this.getOfferingJSON()["description"]
        };
        this.executeRequest(url, istsos.events.EventType.DELETE_OFFERING, "DELETE", data);
    },
    getMemberProceduresProperty: function () {
        return this.memberProcedures;
    },
    getMemberProcedures: function () {
        var url = this.service.server.getUrl() + "wa/istsos/services/" + this.service.getServiceJSON()["service"] +
            "/offerings/" + this.getOfferingJSON()["name"] + "/procedures/operations/memberslist";
        console.log(url);
        this.executeRequest(url, istsos.events.EventType.MEMBERLIST, "GET");
    },
    getNonMemberProcedures: function () {
        var url = this.service.server.getUrl() + "wa/istsos/services/" + this.service.getServiceJSON()["service"] +
            "/offerings/" + this.getOfferingJSON()["name"] + "/procedures/operations/nonmemberslist";
        this.executeRequest(url, istsos.events.EventType.NONMEMBERLIST, "GET");
    },
    /**
     * @returns {JSON}
     */
    getOfferingJSON: function () {
        var offeringJSON = {
            "name": this.offeringName,
            "description": this.offeringDescription,
            "expiration": this.expirationDate
        };
        if (this.active === true) {
            offeringJSON["active"] = "on"
        }
        return offeringJSON;
    }
};

/** istsos.ObservedProperty class */
/**
 * @param {istsos.Service} service
 * @param {string} observedName
 * @param {string} definitionUrn
 * @param {string} observedDescr
 * @param {string} opt_constraintType (allowed_values:"between", "lessThan", "greaterThan", "valueList")
 * @param {Array|int} opt_value (Array or integer, depending on constraint type)
 * @constructor
 */

istsos.ObservedProperty = function (service, observedName, definitionUrn, observedDescr, opt_constraintType, opt_value) {
    this.observedName = observedName;
    this.definitionUrn = definitionUrn;
    this.observedDescr = observedDescr;
    this.constraint = {};
    var check = this.validateConstraintInput(opt_constraintType, opt_value);
    if (check === true) {
        this.constraint["role"] = "urn:x-ogc:def:classifiers:x-istsos:1.0:qualityIndexCheck:level0";
        this.constraint[opt_constraintType] = (opt_value.constructor === Array) ?
            opt_value.toString().split(",") : opt_value.toString();
    } else {
        console.log("Input constraintType and constraintValue are incorrect or intentionally null/undefined!!! " +
            "Object created with null/undefined constraint OR not properly created!!!");
        alert("Input constraintType and constraintValue are incorrect or intentionally null/undefined!!! " +
            "Object created with null/undefined constraint OR not properly created!!!");
    }
    this.service = service;
    this.proceduresIncluded = [];
    this.updateProceduresIncluded();
    service.addObservedProperty(this);
};

istsos.ObservedProperty.prototype = {
    executeRequest: function (url, eventType, method, opt_data, opt_callback) {
        goog.net.XhrIo.send(url, function (e) {
            istsos.fire(eventType, e.target);
        }, method, opt_data);
    },
    updateProceduresIncluded: function () {
        var procedures = this.service.getProceduresProperty();
        var v_procedures = this.service.getVirtualProceduresProperty();
        var all = procedures.concat(v_procedures);
        var name = this.observedName;
        if(all.length !== 0) {
            for (var i = 0; i < all.length; i++) {
                for (var j = 0; j < all[i].getOutputsProperty().length; j++) {
                    if(name = all[i].getOutputsProperty()[j]["name"]) {
                        this.getProceduresIncluded().push(all[i]);
                    }
                }
            }
        }
    },
    /**
     * @returns {Array}
     */
    getProceduresIncluded: function () {
        return this.proceduresIncluded;
    },
    /**
     * @returns {JSON}
     */
    getObservedPropertyJSON: function () {
        var observedJSON = {
            "name": this.observedName,
            "definition": this.definitionUrn,
            "description": this.observedDescr,
            "constraint": this.constraint
        }
        return observedJSON;
    },
    /**
     * @param {string} newPropertyName
     * @param {string} newDefinitionUrn
     * @param {string} newPropertyDescr
     * @param {string} opt_constraintType
     * @param {Array<int>|int} opt_value
     */
    updateObservedProperty: function (newPropertyName, newDefinitionUrn, newPropertyDescr, opt_constraintType, opt_value) {
        this.observedName = newPropertyName || this.observedName;
        this.definitionUrn = newDefinitionUrn || this.definitionUrn;
        this.observedDescr = newPropertyName || this.observedDescr;
        if (this.validateConstraintInput(opt_constraintType, opt_value) === true) {
            this.constraint["role"] = "urn:x-ogc:def:classifiers:x-istsos:1.0:qualityIndexCheck:level0";
            this.constraint[opt_constraintType] = (opt_value.constructor === Array) ?
                opt_value.toString().split(",") : opt_value.toString();
        } else {
            this.constraint = {};
            console.log("Input constraintType and constraintValue are incorrect or intentionally null/undefined!!! " +
                "Object created with null/undefined constraint OR not properly created!!!");
            alert("Input constraintType and constraintValue are incorrect or intentionally null/undefined!!! " +
                "Object created with null/undefined constraint OR not properly created!!!");
        }
        var url = this.server.getUrl() + "wa/istsos/services/observedproperties/" +
            this.getObservedPropertyJSON()["definition"];
        this.executeRequest(url, istsos.events.EventType.UPDATE_OBSERVED_PROPERTY, "PUT", this.getObservedPropertyJSON());
    },
    deleteObservedProperty: function () {
        var procedures = this.service.getProceduresProperty();
        var v_procedures = this.service.getVirtualProceduresProperty();
        var properties_service = this.service.getObservedPropertiesProperty();
        var all = procedures.concat(v_procedures);
        var outputs = [];
        all.forEach(function (p) {
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
        if (connected = false) {
            for (var j = 0; j < properties_service.length; j++) {
                if (this === properties_service[j]) {
                    properties_service.splice(j, 1);
                }
            }
        }
        var url = this.server.getUrl() + "wa/istsos/services/" + this.service.getServiceJSON()["service"] + "/observedproperties/" +
            this.getObservedPropertyJSON()["definition"];
        this.executeRequest(url, istsos.events.EventType.DELETE_OBSERVED_PROPERTY, "DELETE");
    },
    /**
     * @param {string} constraintType
     * @param {Array|int} constraintValue
     * @returns {boolean}
     */
    validateConstraintInput: function (constraintType, constraintValue) {
        switch (constraintType) {
            case 'between':
                constraintType = 'interval';
                if (constraintValue.constructor !== Array) {
                    alert('Type of "between" constraint must be Array');
                    return false;
                } else {
                    return true;
                }
            case 'lessThan':
                constraintType = 'max';
                if (constraintValue !== parseInt(constraintValue, 10)) {
                    alert('Type of "lessThan" constraint must be Integer');
                    return false;
                } else {
                    return true;
                }
            case 'greaterThan':
                constraintType = 'min';
                if (constraintValue !== parseInt(constraintValue, 10)) {
                    alert('Type of "greaterThan" constraint must be Integer');
                    return false;
                } else {
                    return true;
                }
            case 'valueList':
                if (constraintValue.constructor !== Array) {
                    alert('Type of "between" constraint must be Array');
                    return false;
                } else {
                    return true;
                }
            default:
                alert('Constraint type must be "between", "lessThan", "greaterThan" or "valueList"');
                return false;
        }
    }
};

/** istsos.DataQuality class */
/**
 * @param {istsos.Service} service
 * @param {int} codeDQ
 * @param {string} nameDQ
 * @param {string} descrDQ
 * @constructor
 */
istsos.DataQuality = function (service, codeDQ, nameDQ, descrDQ) {
    this.code = codeDQ;
    this.name = nameDQ;
    this.description = descrDQ;
    this.service = service;
    service.addDataQuality(this);
};

istsos.DataQuality.prototype = {
    executeRequest: function (url, eventType, method, opt_data, opt_callback) {
        goog.net.XhrIo.send(url, function (e) {
            istsos.fire(eventType, e.target);
        }, method, opt_data);
    },
    /**
     * @returns {JSON}
     */
    getDataQualityJSON: function () {
        var dqJSON = {
            "code": this.code.toString(),
            "name": this.name,
            "description": this.description
        };
        return dqJSON;
    },
    /**
     * @param {int} newCodeDQ
     * @param {string} newNameDQ
     * @param {string} newDescrDQ
     */
    updateDataQuality: function (newCodeDQ, newNameDQ, newDescrDQ) {
        this.code = newCodeDQ || this.code;
        this.name = newNameDQ || this.name;
        this.description = newDescrDQ || this.description;
        var url = this.service.server.getUrl() + "wa/istsos/services" + this.service.getServiceJSON()["service"] +
            "/dataqualities/" + this.getDataQualityJSON()["code"];
        this.executeRequest(url, istsos.events.EventType.UPDATE_DATAQUALITY, "PUT", this.getDataQualityJSON());
    },
    deleteDataQuality: function () {
        var dataQualities = this.service.getDataQualitiesProperty();
        for (var i = 0; i < dataQualities.length; i++) {
            if (this === dataQualities[i]) {
                dataQualities.splice(i, 1);
            }
        }
        var url = this.service.server.getUrl() + "wa/istsos/services" + this.service.getServiceJSON()["service"] +
            "/dataqualities/" + this.getDataQualityJSON()["code"];
        this.executeRequest(url, istsos.events.EventType.DELETE_DATAQUALITY, "DELETE", this.getDataQualityJSON());
    }
};

/** istsos.UnitOfMeasure  class */
/**
 * @param {istsos.Service} service
 * @param {string} code
 * @param {string} description
 * @constructor
 */
istsos.UnitOfMeasure = function (service, code, description) {
    this.code = code;
    this.description = description;
    this.proceduresIncluded = [];
    this.service = service;
    service.addUom(this);
    this.updateProceduresIncluded();
};

istsos.UnitOfMeasure.prototype = {
    executeRequest: function (url, eventType, method, opt_data, opt_callback) {
        goog.net.XhrIo.send(url, function (e) {
            istsos.fire(eventType, e.target);
        }, method, opt_data);
    },
    updateProceduresIncluded: function () {
        var procedures = this.service.getProceduresProperty();
        var v_procedures = this.service.getVirtualProceduresProperty();
        var all = procedures.concat(v_procedures);
        var code = this.code;
        if(all.length !== 0) {
            for (var i = 0; i < all.length; i++) {
                for (var j = 0; j < all[i].getOutputsProperty().length; j++) {
                    if(code = all[i].getOutputsProperty()[j]["uom"]) {
                        this.getProceduresIncluded().push(all[i]);
                    }
                }
            }
        }
    },
    /**
     * @returns {JSON}
     */
    getUomJSON: function () {
        var uomJSON = {
            "code": this.code,
            "description": this.description
        }
        return uomJSON;

    },
    /**
     * @param {string} newCode
     * @param {string} newDescr
     */
    updateUom: function (newCode, newDescr) {
        this.code = newCode || this.code;
        this.description = newDescr || this.description;
        var url = this.service.server.getUrl() + "wa/istsos/services/" + this.service.getServiceJSON()["service"] +
            "/uoms/" + this.getUomJSON()["code"];
        this.executeRequest(url, istsos.events.EventType.UPDATE_UOM, "PUT", this.getUomJSON());
    },
    deleteUom: function () {
        var procedures = this.service.getProceduresProperty();
        var v_procedures = this.service.getVirtualProceduresProperty();
        var uoms_service = this.service.getUomsProperty();
        var all = procedures.concat(v_procedures);
        var outputs = [];
        all.forEach(function (p) {
            outputs.concat(p.getOutputsProperty());
        });
        var code = this.code;
        var connected = false;
        for (var i = 0; i < outputs.length; i++) {
            if (code === outputs[i].getOutputJSON()["uom"]) {
                alert("CONNECTED TO PROCEDURE");
                connected = true;
                break
            }
        }
        if (connected = false) {
            for (var j = 0; j < uoms_service.length; j++) {
                if (this === uoms_service[j]) {
                    uoms_service.splice(j, 1);
                }
            }
        }
        var url = this.service.server.getUrl() + "wa/istsos/services/" + this.service.getServiceJSON()["service"] +
            "/uoms/" + this.getUomJSON()["code"];
        this.executeRequest(url, istsos.events.EventType.DELETE_UOM, "DELETE", this.getUomJSON());
    }
};

istsos.Output = function (property, uom, description, opt_constraintType, opt_constraintValue) {
    this.outputObject = {
        "name": property.getObservedPropertyJSON()["name"],
        "definition": property.getObservedPropertyJSON()["definition"],
        "uom": uom.getUomJSON()["code"],
        "description": description || "",
        "constraint": {}
    };
    this.observedProperty = property;
    this.uom = uom;
    this.description = description;
    this.constraint = {};
    var check = this.validateConstraintInput(opt_constraintType, opt_constraintValue);
    if (check === true) {
        this.constraint["role"] = "urn:ogc:def:classifiers:x-istsos:1.0:qualityIndex:check:reasonable";
        this.constraint[opt_constraintType] = (opt_constraintValue.constructor === Array) ?
            opt_constraintValue.toString().split(",") : opt_constraintValue.toString();
    } else {
        console.log("Input constraintType and constraintValue are incorrect or intentionally null/undefined!!! " +
            "Object created with null/undefined constraint OR not properly created!!!");
        alert("Input constraintType and constraintValue are incorrect or intentionally null/undefined!!! " +
            "Object created with null/undefined constraint OR not properly created!!!");
    }
};

istsos.Output.prototype = {
    validateConstraintInput: function (constraintType, constraintValue) {
        switch (constraintType) {
            case 'between':
                constraintType = 'interval';
                if (constraintValue.constructor !== Array) {
                    alert('Type of "between" constraint must be Array');
                    return false;
                } else {
                    return true;
                }
            case 'lessThan':
                constraintType = 'max';
                if (constraintValue !== parseInt(constraintValue, 10)) {
                    alert('Type of "lessThan" constraint must be Integer');
                    return false;
                } else {
                    return true;
                }
            case 'greaterThan':
                constraintType = 'min';
                if (constraintValue !== parseInt(constraintValue, 10)) {
                    alert('Type of "greaterThan" constraint must be Integer');
                    return false;
                } else {
                    return true;
                }
            case 'valueList':
                if (constraintValue.constructor !== Array) {
                    alert('Type of "between" constraint must be Array');
                    return false;
                } else {
                    return true;
                }
            default:
                alert('Constraint type must be "between", "lessThan", "greaterThan" or "valueList"');
                return false;
        }
    },
    getOutputJSON: function () {
        var outputJSON = {
            "name": this.observedProperty.getObservedPropertyJSON()["name"],
            "definition": this.observedProperty.getObservedPropertyJSON()["definition"],
            "uom": this.uom.getUomJSON()["code"],
            "description": this.description || "",
            "constraint": this.constraint
        };
        return outputJSON;
    }
};
/** istsos.ProcedureBase class - ABSTRACT */
/**
 * @param {string} name
 * @param {string} description
 * @param {string} keywords
 * @param {string} foi_name
 * @param {int} epsg
 * @param {int} x
 * @param {int} y
 * @param {int} z
 * @param {Array<istsos.Output>} outputs
 * @constructor
 */
istsos.ProcedureBase = function (name, description, keywords, foi_name, epsg, x, y, z, outputs) {
    this.name = name;
    this.description = description || "";
    this.keywords = keywords || "";
    this.foi_name = foi_name;
    this.epsg = epsg;
    this.coordinates = [x, y, z];
    this.outputs = outputs || [];

};

istsos.ProcedureBase.prototype = {
    getOutputsProperty: function () {
        return this.outputs;
    },
    getProcedureBaseJSON: function () {
        var procedureBaseJSON = {
            "system_id": this.name,
            "system": this.name,
            "description": this.description,
            "keywords": this.keywords,
            "location": {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": this.coordinates.toString().split(",")
                },
                "crs": {
                    "type": "name",
                    "properties": {
                        "name": this.epsg.toString()
                    }
                },
                "properties": {
                    "name": this.foi_name
                }
            },
            "outputs": [
                {
                    "name": "Time",
                    "definition": "urn:ogc:def:parameter:x-istsos:1.0:time:iso8601",
                    "uom": "iso8601",
                    "description": "",
                    "constraint": {}
                }
            ],
            "inputs": [],
            "history": []
        };
        this.outputs.forEach(function (out) {
            procedureBaseJSON["outputs"].push(out.getOutputJSON());
        });
        return procedureBaseJSON;

    },
    createContactForm: function (individualName, voice, fax, email, web, deliveryPoint, city, administrativeArea, postalCode, country) {
        return {
            'individualName': individualName || '',
            'voice': voice || '',
            'fax': fax || '',
            'email': email || '',
            'web': web || '',
            'deliveryPoint': deliveryPoint || '',
            'city': city || '',
            'administrativeArea': administrativeArea || '',
            'postalCode': postalCode || '',
            'country': country || ''
        };
    },
    getCapabilitiesUom: function () {
        return ['µs', 'ms', 's', 'min', 'h', 'd'];
    },
    getCapabilitiesJson: function () {
        return [
            {
                "name": "Memory Capacity",
                "definition": "urn:x-ogc:def:classifier:x-istsos:1.0:memoryCapacity",
                "uom": "Byte",
                "combo": "Memory Capacity (Byte)"
            }, {
                "name": "Battery Current",
                "definition": "urn:x-ogc:def:phenomenon:x-istsos:1.0:batteryCurrent",
                "uom": "A.h",
                "combo": "Battery Current (A.h)"
            }
        ];
    },
    getIdentificationNames: function () {
        return [
            {
                "name": "Short Name",
                "definition": "urn:x-ogc:def:identifier:x-istsos:1.0:shortName"
            },
            {
                "name": "Long Name",
                "definition": "urn:x-ogc:def:identifier:x-istsos:1.0:longName"
            },
            {
                "name": "Manufacturer Name",
                "definition": "urn:x-ogc:def:identifier:x-istsos:1.0:manufacturerName"
            },
            {
                "name": "Model Number",
                "definition": "urn:x-ogc:def:identifier:x-istsos:1.0:modelNumber"
            },
            {
                "name": "Serial Number",
                "definition": "urn:x-ogc:def:identifier:x-istsos:1.0:serialNumber"
            },
            {
                "name": "Device ID",
                "definition": "urn:x-ogc:def:identifier:x-istsos:1.0:deviceID"
            }
        ]
    }
};

istsos.Procedure = function (service, name, description, keywords, foi_name, epsg, x, y, z, outputs, systemType, sensorType) {
    istsos.ProcedureBase.call(this, name, description, keywords, foi_name, epsg, x, y, z, outputs);
    this.systemType = (systemType === "insitu-fixed" || systemType === "insitu-mobile") ?
        systemType : null;
    this.sensorType = sensorType || "";
    this.service = service;
    service.addProcedure(this);
    service.getOfferingsProperty()[0].getMemberProceduresProperty().push(this);
};
goog.inherits(istsos.Procedure, istsos.ProcedureBase);

istsos.Procedure.prototype = {
    executeRequest: function (url, eventType, method, opt_data, opt_callback) {
        goog.net.XhrIo.send(url, function (e) {
            istsos.fire(eventType, e.target);
        }, method, opt_data);
    },
    getProcedureJSON: function () {
        var procedureJSON = istsos.ProcedureBase.prototype.getProcedureBaseJSON.call(this);
        procedureJSON["classification"] = [{
            "name": "System Type",
            "definition": "urn:ogc:def:classifier:x-istsos:1.0:systemType",
            "value": (this.systemType === "insitu-mobile-point" || this.systemType === "insitu-fixed-point") ? systemType : null
        }, {
            "name": "Sensor Type",
            "definition": "urn:ogc:def:classifier:x-istsos:1.0:sensorType",
            "value": this.sensorType
        }];
        return procedureJSON
    },
    updateProcedure: function (name, description, keywords, foi_name, epsg, x, y, z, outputs, systemType, sensorType) {
        this.name = name || this.name;
        this.description = description || this.description;
        this.keywords = keywords || this.keywords;
        this.foi_name = foi_name || this.foi_name;
        this.epsg = epsg || this.epsg;
        this.coordinates = [x, y, z] || this.coordinates;
        var outputs_array = this.outputs;
        if (outputs || outputs.length !== 0) {
            outputs_array.splice(1, outputs_array.length - 1);
            outputs.forEach(function (out) {
                outputs_array.push(out)
            });
        }

        this.systemType = (systemType === "insitu-fixed" || systemType === "insitu-mobile") ?
            systemType : null;
        this.sensorType = sensorType || "";
        var url = this.service.server.getUrl() + "wa/istsos/services/" + this.service.getServiceJSON()["service"] + "/procedures/" + this.name;
        this.executeRequest(url, istsos.events.EventType.UPDATE_PROCEDURE, "PUT", this.getProcedureJSON());
    },
    deleteProcedure: function () {
        var url = this.service.server.getUrl() + "wa/istsos/services/" + this.service.getServiceJSON()["service"] + "/procedures/" + this.name;
        this.executeRequest(url, istsos.events.EventType.DELETE_PROCEDURE, "DELETE", this.getProcedureJSON());
    },
    addMembershipToOffering: function (offering) {
        offering.getMemberProceduresProperty().push(this);
        var url = this.service.server.getUrl() + "wa/istsos/services/" + this.service.getServiceJSON()["service"] + "/offerings/" +
            offering.getOfferingJSON()["name"] + "/procedures";
        this.executeRequest(url, istsos.events.EventType.ADD_TO_OFFERING, "POST", [{
            "offering": offering.getOfferingJSON()["name"],
            "procedure": this.getProcedureJSON()["system"]
        }])
    },
    removeMembershipFromOffering: function (offering) {
        var procedures = offering.getMemberProceduresProperty();
        procedures.forEach(function (p) {
            if (p === this) {
                procedures.splice(procedures.indexOf(p), 1);
            }
        });
        var url = this.service.server.getUrl() + "wa/istsos/services/" + this.service.getServiceJSON()["service"] + "/offerings/" +
            offering.getOfferingJSON()["name"] + "/procedures" + this.getProcedureJSON()["system"];
        this.executeRequest(url, istsos.events.EventType.REMOVE_FROM_OFFERING, "DELETE", [{
            "offering": offering.getOfferingJSON()["name"],
            "procedure": this.getProcedureJSON()["system"]
        }])
    },
    getOutputsProperty: function () {
        return istsos.ProcedureBase.prototype.getOutputsProperty.call(this);
    }
};

istsos.VirtualProcedure = function (service, name, description, keywords, foi_name, epsg, x, y, z, outputs, systemType, sensorType, code, ratingCurve) {
    istsos.ProcedureBase.call(this, name, description, keywords, foi_name, epsg, x, y, z, outputs);
    this.systemType = (systemType === "insitu-fixed" || systemType === "insitu-mobile") ?
        systemType : null;
    this.sensorType = sensorType || "";
    this.code = {"code": code} || {};
    this.ratingCurve = ratingCurve || {};
    this.service = service;
    service.addVirtualProcedure(this);
    service.getOfferingsProperty()[0].getMemberProceduresProperty().push(this);
};
goog.inherits(istsos.VirtualProcedure, istsos.ProcedureBase);

istsos.VirtualProcedure.prototype = {
    executeRequest: function (url, eventType, method, opt_data, opt_callback) {
        goog.net.XhrIo.send(url, function (e) {
            istsos.fire(eventType, e.target);
        }, method, opt_data);
    },
    getVirtualProcedureJSON: function () {
        var vProcedureJSON = istsos.ProcedureBase.prototype.getProcedureBaseJSON.call(this);
        vProcedureJSON["classification"] = [{
            "name": "System Type",
            "definition": "urn:ogc:def:classifier:x-istsos:1.0:systemType",
            "value": (this.systemType === "virtual") ? this.systemType : null
        }, {
            "name": "Sensor Type",
            "definition": "urn:ogc:def:classifier:x-istsos:1.0:sensorType",
            "value": this.sensorType
        }];
        return vProcedureJSON;
    },
    getCode: function () {
        var url = this.service.server.getUrl() + "wa/istsos/services/" + this.service.getServiceJSON()["service"] +
            "/virtualprocedures/" + this.getVirtualProcedureJSON()["system"] + "/code";
        this.executeRequest(url, istsos.events.EventType.GET_CODE, "GET");
    },
    registerCode: function () {
        var url = this.service.server.getUrl() + "wa/istsos/services/" + this.service.getServiceJSON()["service"] +
            "/virtualprocedures/" + this.getVirtualProcedureJSON()["system"] + "/code";
        this.executeRequest(url, istsos.events.EventType.NEW_CODE, "POST", this.getCodeProperty());
    },
    updateCode: function (newCode) {
        this.code = newCode || this.code;
        var url = this.service.server.getUrl() + "wa/istsos/services/" + this.service.getServiceJSON()["service"] +
            "/virtualprocedures/" + this.getVirtualProcedureJSON()["system"] + "/code";
        this.executeRequest(url, istsos.events.EventType.UPDATE_CODE, "PUT", this.getCodeProperty());
    },
    deleteCode: function () {
        this.code = "";
        var url = this.service.server.getUrl() + "wa/istsos/services/" + this.service.getServiceJSON()["service"] +
            "/virtualprocedures/" + this.getVirtualProcedureJSON()["system"] + "/code";
        this.executeRequest(url, istsos.events.EventType.DELETE_CODE, "DELETE");
    },
    getCodeProperty: function () {
        return this.code;
    },
    getRatingCurve: function () {
        var url = this.service.server.getUrl() + "wa/istsos/services/" + this.service.getServiceJSON()["service"] +
            "/virtualprocedures/" + this.getVirtualProcedureJSON()["system"] + "/ratingcurve";
        console.log(url);
        this.executeRequest(url, istsos.events.EventType.RATING_CURVE, "GET");
    },
    registerRatingCurve: function () {
        var url = this.service.server.getUrl() + "wa/istsos/services/" + this.service.getServiceJSON()["service"] +
            "/virtualprocedures/" + this.getVirtualProcedureJSON()["system"] + "/ratingcurve";
        this.executeRequest(url, istsos.events.EventType.NEW_RATING_CURVE, "POST", this.getRatingCurveProperty());
    },
    deleteRatingCurve: function () {
        this.ratingCurve = {};
        var url = this.service.server.getUrl() + "wa/istsos/services/" + this.service.getServiceJSON()["service"] +
            "/virtualprocedures/" + this.getVirtualProcedureJSON()["system"] + "/ratingcurve";
        this.executeRequest(url, istsos.events.EventType.DELETE_RATING_CURVE, "DELETE");
    },
    getRatingCurveProperty: function () {
        return this.ratingCurve;
    },
    updateVirtualProcedure: function (name, description, keywords, foi_name, epsg, x, y, z, outputs, systemType, sensorType) {
        this.name = name || this.name;
        this.description = description || this.description;
        this.keywords = keywords || this.keywords;
        this.foi_name = foi_name || this.foi_name;
        this.epsg = epsg || this.epsg;
        this.coordinates = [x, y, z] || this.coordinates;
        var outputs_array = this.outputs;
        if (outputs || outputs.length !== 0) {
            outputs_array.splice(1, outputs_array.length - 1);
            outputs.forEach(function (out) {
                outputs_array.push(out)
            });
        }
        this.systemType = systemType || this.systemType;
        this.sensorType = sensorType || this.sensorType;
        var url = this.service.server.getUrl() + "wa/istsos/services/" + this.service.getServiceJSON()["service"] + "/virtualprocedures/" + this.name;
        this.executeRequest(url, istsos.events.EventType.UPDATE_V_PROCEDURE, "PUT", this.getVirtualProcedureJSON());
    },
    deleteVirtualProcedure: function () {
        var v_procedures = this.service.getVirtualProceduresProperty();
        var obj = this.getVirtualProcedureJSON();
        v_procedures.forEach(function (p) {
            if (p.getVirtualProcedureJSON()["system"] === obj["system"]) {
                v_procedures.splice(procedure.indexOf(p), 1);
            }
        });
        var url = this.service.server.getUrl() + "wa/istsos/services/" + this.service.getServiceJSON()["service"] + "/virtualprocedures/" + this.name;
        this.executeRequest(url, istsos.events.EventType.DELETE_V_PROCEDURE, "DELETE", this.getVirtualProcedureJSON());
    },
    addMembershipToOffering: function (offering) {
        offering.getMemberProceduresProperty().push(this);
        var url = this.service.server.getUrl() + "wa/istsos/services/" + this.service.getServiceJSON()["service"] + "/offerings/" +
            offering.getOfferingJSON()["name"] + "/procedures";
        this.executeRequest(url, istsos.events.EventType.ADD_TO_OFFERING, "POST", [{
            "offering": offering.getOfferingJSON()["name"],
            "procedure": this.getProcedureJSON()["system"]
        }])
    },
    removeMembershipFromOffering: function (offering) {
        var procedures = offering.getMemberProceduresProperty();
        procedures.forEach(function (p) {
            if (p === this) {
                procedures.splice(procedures.indexOf(p), 1);
            }
        });
        var url = this.service.server.getUrl() + "wa/istsos/services/" + this.service.getServiceJSON()["service"] + "/offerings/" +
            offering.getOfferingJSON()["name"] + "/procedures" + this.getProcedureJSON()["system"];
        this.executeRequest(url, istsos.events.EventType.REMOVE_FROM_OFFERING, "DELETE", [{
            "offering": offering.getOfferingJSON()["name"],
            "procedure": this.getProcedureJSON()["system"]
        }])
    },
    getOutputsProperty: function () {
        return istsos.ProcedureBase.prototype.getOutputsProperty.call(this);
    }

};





