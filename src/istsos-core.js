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
    DATAQUALITY: '=dataQualityReceived',
    NEW_DATAQUALITY: 'POST dataQualityReceived',
    UPDATE_DATAQUALITY: 'PUT dataQualityReceived',
    DELETE_DATAQUALITY: 'DELETE dataQualityReceived',
    UOM: 'unitOfMeasureReceived',
    UOMS: 'unitsOfMeasureReceived',
    NEW_UOM: 'POST unitOfMeasureReceived',
    UPDATE_UOM: 'PUT unitOfMeasureReceived',
    DELETE_UOM: 'DELETE unitOfMeasureReceived'
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
     * @param {istsos.Server|Object} server
     */
    addServer: function (server) {
        this.servers.push(server);
    },
    /**
     * @param {string} old_name
     * @param {string} new_name
     * @param {string} new_url
     * @param {istsos.Configuration|Object} new_config
     * @param {istsos.Database|Object} new_defaultDb
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
     * @returns {istsos.Server|Object}
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
 * @param {istsos.Database|Object} defaultDb
 * @param {istsos.Configuration|Object} opt_config
 * @param {JSON|Object} opt_loginConfig
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
     * @param {JSON|Object} opt_data
     * @param {function} opt_callback
     */
    executeRequest: function (url, eventType, method, opt_data, opt_callback) {
        goog.net.XhrIo.send(url, function (e) {
            istsos.fire(eventType, e.target);
        }, method, opt_data);
    },
    /**
     * @param {istsos.Service|Object} service */
    getService: function (service) {
        var url = this.url + 'wa/istsos/services/' + service.getServiceObject()['service'];
        this.executeRequest(url, istsos.events.EventType.SERVICE, 'GET');
    },
    /**
     * @param {istsos.Service|Object} service */
    addService: function (service) {
        this.services.push(service);
    },
    /**
     * @param {istsos.Service|Object} service
     */
    registerService: function (service) {
        var url = this.getUrl() + 'wa/istsos/services';
        this.executeRequest(url, istsos.events.EventType.NEW_SERVICE, 'POST', service.getServiceObject());
    },
    /**
     * @param {istsos.Service|Object} service
     */
    deleteService: function (service) {
        var i;
        for (i = 0; i < this.services.length; i++) {
            if (this.services[i].getServiceObject()['service'] === service.getServiceObject()['service']) {
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
     * @returns {istsos.Configuration|Object}
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
     * @returns {istsos.Database|Object}
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
    this.dbConf = {
        "user": user,
        "password": password,
        "host": host,
        "port": port,
        "dbname": dbname
    };
};

// methods
istsos.Database.prototype = {
    /**
     * @param {string} url
     * @param {istsos.events.EventType} eventType
     * @param {string} method
     * @param {JSON|Object} opt_data
     * @param {function} opt_callback
     */
    executeRequest: function (url, eventType, method, opt_data, opt_callback) {
        goog.net.XhrIo.send(url, function (e) {
            istsos.fire(eventType, e.target);
        }, method, opt_data);
    },
    /**
     * @param {string} serviceName
     * @param {istsos.Server|Object} server
     */
    getDb: function (serviceName, server) {
        var sname = 'default' || serviceName;
        var url = server.getUrl() + 'wa/istsos/services/' + sname + '/configsections/connection';
        this.executeRequest(url, istsos.events.EventType.DATABASE, 'GET');
    },
    /**
     * @param {string} dbname
     * @param {string} host
     * @param {string} user
     * @param {string} password
     * @param {int} port
     * @param {istsos.Server|Object} server
     * @param {istsos.Service|Object} opt_service
     */
    setDb: function (dbname, host, user, password, port, server, opt_service) {
        var newDbConf = {
            "user": user,
            "password": password,
            "host": host,
            "port": port,
            "dbname": dbname
        };
        var sname = 'default' || service.getServiceObject()['service'];
        var url = server.getUrl() + 'wa/istsos/services/' + sname + '/connection';
        this.executeRequest(url, 'PUT', newDbConf);
        this.dbConf = newDbConf;
    },
    /**
     * @param {istsos.Server|Object} server
     */
    validateDb: function (server) {
        var url = server.getUrl() + 'wa/istsos/operations/validatedb';
        this.executeRequest(url, istsos.events.EventType.VALIDATE_DB, 'POST', this.dbConf);
    },
    /**
     * @returns {JSON|Object}
     */
    getDbObject: function () {
        return this.dbConf;
    }
};

/** istsos.Configuration class */

/**
 * @param {string} serviceName
 * @param {istsos.Server|Object} server
 * @constructor
 */
istsos.Configuration = function (serviceName, server) {
    this.sname = serviceName || 'default';
    this.serverUrl = server.getUrl();
};
//methods
istsos.Configuration.prototype = {
    /**
     * @param {string} url
     * @param {istsos.events.EventType} eventType
     * @param {string} method
     * @param {JSON|Object} opt_data
     * @param {function} opt_callback
     */
    executeRequest: function (url, eventType, method, opt_data, opt_callback) {
        goog.net.XhrIo.send(url, function (e) {
            istsos.fire(eventType, e.target);
        }, method, opt_data);
    },
    getConf: function () {
        var url = this.serverUrl + 'wa/istsos/services/' + this.sname + '/configsections';
        this.executeRequest(url, istsos.events.EventType.CONFIGSECTIONS, 'GET');
    },
    getProvider: function () {
        var url = this.serverUrl + 'wa/istsos/services/' + this.sname + '/configsections/provider';
        this.executeRequest(url, istsos.events.EventType.PROVIDER, 'GET');
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
                              contactCity, contactAdminArea, contactCountry ) {
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
        var url = this.serverUrl + 'wa/istsos/services/' + this.sname + '/configsections/provider';
        this.executeRequest(url, istsos.events.EventType.UPDATE_PROVIDER, 'PUT', data);
    },
    getIdentification: function () {
        var url = this.serverUrl + 'wa/istsos/services/' + this.sname + '/configsections/identification';
        this.executeRequest(url, istsos.events.EventType.IDENTIFICATION, 'GET');
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
        var url = this.serverUrl + 'wa/istsos/services/' + this.sname + '/configsections/identification';
        this.executeRequest(url, istsos.events.EventType.UPDATE_IDENTIFICATION, 'PUT', data);
    },
    getMqtt: function () {
        var url = this.serverUrl + 'wa/istsos/services/' + this.sname + '/configsections/mqtt';
        this.executeRequest(url, istsos.events.EventType.MQTT, 'GET');
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
        var url = this.serverUrl + 'wa/istsos/services/' + this.sname + '/configsections/mqtt';
        this.executeRequest(url, istsos.events.EventType.UPDATE_MQTT, 'PUT', data);
    },
    getCrs: function () {
        var url = this.serverUrl + 'wa/istsos/services/' + this.sname + '/configsections/geo';
        this.executeRequest(url, istsos.events.EventType.CRS, 'GET');
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
        var url = this.serverUrl + 'wa/istsos/services/' + this.sname + '/configsections/geo';
        this.executeRequest(url, istsos.events.EventType.UPDATE_CRS, 'PUT', data);
    },
    getObservationConf: function () {
        var url = this.serverUrl + 'wa/istsos/services/' + this.sname + '/configsections/getobservation';
        this.executeRequest(url, istsos.events.EventType.OBSERVATION_CONF, 'GET');
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
        var url = this.serverUrl + 'wa/istsos/services/' + this.sname + '/configsections/getobservation';
        this.executeRequest(url, istsos.events.EventType.UPDATE_OBSERVATION_CONF, 'PUT', data);
    },
    getProxy: function () {
        var url = this.serverUrl + 'wa/istsos/services/' + this.sname + '/configsections/serviceurl';
        this.executeRequest(url, istsos.events.EventType.PROXY, 'GET');
    },
    /**
     * @param {string} newUrl
     */
    updateProxy: function (newUrl) {
        var data = {
            "url": newUrl
        };
        var url = this.serverUrl + 'wa/istsos/services/' + this.sname + '/configsections/serviceurl';
        this.executeRequest(url, istsos.events.EventType.UPDATE_PROXY, 'PUT', data);
    },
    getEpsgCodes: function () {
        var url = this.serverUrl + 'wa/istsos/services/' + this.sname + '/epsgs';
        this.executeRequest(url, istsos.events.EventType.EPSG_CODES, 'GET');
    }
};

/** istsos.Service class */

/**
 * @param {istsos.Server|Object} server
 * @param {string} serviceName
 * @param {istsos.Database|Object} opt_db
 * @param {istsos.Configuration|Object} opt_config
 * @param {int} opt_epsg
 * @constructor
 */
istsos.Service = function (serviceName, server, opt_db, opt_config, opt_epsg) {
    this.serviceObject = {
        "service":serviceName
    };
    if(opt_epsg || opt_db) {
        if (opt_epsg) {
            this.serviceObject["epsg"] = opt_epsg;
        }
        if (opt_db) {
            this.serviceObject["dbname"] = opt_db["dbname"];
            this.serviceObject["host"] = opt_db["host"];
            this.serviceObject["user"] = opt_db["user"];
            this.serviceObject["password"] = opt_db["password"];
            this.serviceObject["port"] = opt_db["port"];
        }
    }
    this.database = opt_db || server.getDefaultDbProperty();
    this.config = opt_config || new istsos.Configuration(serviceName, server); // configsections
    this.server = server;
    this.offerings = [];
    this.procedures = [];
    this.virtualProcedures = [];
    this.observedProperties = [];
    this.uoms = [];
    this.dataQualities = [];
    server.addService(this);
};

//methods
istsos.Service.prototype = {
    executeRequest: function (url, eventType, method, opt_data, opt_callback) {
        goog.net.XhrIo.send(url, function (e) {
            istsos.fire(eventType, e.target);
        }, method, opt_data);
    },
    getServiceObject: function () {
        return this.serviceObject;
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
    addOffering: function(offering) {
        this.getOfferingsProperty().push(offering);
    },
    registerOffering: function (offering) {
        var url = this.server.getUrl() + 'wa/istsos/services/' + this.getServiceObject()['service'] + '/offerings';
        this.executeRequest(url, istsos.events.EventType.NEW_OFFERING, 'POST', offering.getOfferingObject());
    },
    getOfferingNames: function () {
        var url = this.server.getUrl() + 'wa/istsos/services/' + this.getServiceObject()['service'] + '/offerings/operations/getlist';
        this.executeRequest(url, istsos.events.EventType.OFFERING_NAMES, 'GET');
    },
    getOfferings: function () {
        var url = this.server.getUrl() + 'wa/istsos/services/' + this.getServiceObject()['service'] + '/offerings';
        this.executeRequest(url, istsos.events.EventType.OFFERING_LIST, 'GET');
    },

    addProcedure: '',
    registerProcedure: '',
    getProcedure: '',
    getProcedures: '',
    /**
     * @param {istsos.ObservedProperty|Object} property
     */
    addObservedProperty: function (property) {
        this.getObservedProperties().push(property)
    },
    /**
     * @param {istsos.ObservedProperty|Object} property
     */
    registerObservedProperty: function (property) {
        var url = this.server.getUrl() + 'wa/istsos/services/' + this.getServiceObject()['service'] +
            '/observedproperties';
        this.executeRequest(url, istsos.events.EventType.NEW_OBSERVED_PROPERTY, 'POST', property.getObservedPropertyObject())
    },
    getObservedProperties: function () {
        var url = this.server.getUrl() + 'wa/istsos/services/observedproperties';
        this.executeRequest(url, istsos.events.EventType.OBSERVED_PROPERTIES, 'GET');
    },
    getObservedProperty: function () {
        var url = this.server.getUrl() + 'wa/istsos/services/observedproperties/' +
                                property.getObservedPropertyObject()['definition'];
        this.executeRequest(url, istsos.events.EventType.OBSERVED_PROPERTY, 'GET');
    },
    /**
     * @param {istsos.UnitOfMeasure|Object} uom
     */
    addUom: function (uom) {
        this.getUomsProperty().push(uom);
    },
    registerUom: function (uom) {
        var url = this.server.getUrl() + 'wa/istsos/services/' + this.getServiceObject()['service'] + '/uoms';
        this.executeRequest(url, istsos.events.EventType.NEW_UOM, 'POST', uom.getUomObject());
    },
    getUoms: function () {
        var url = this.server.getUrl() + 'wa/istsos/services/' + this.getServiceObject()['service'] + '/uoms';
        this.executeRequest(url, istsos.events.EventType.UOMS, 'GET');
    },
    getUom: function (uom) {
        var url = this.server.getUrl() + 'wa/istsos/services/' + this.getServiceObject()['service'] + '/uoms/' +
                uom.getUomObject()['code'];
        this.executeRequest(url, istsos.events.EventType.UOM, 'GET');
    },
    /**
     * @param {istsos.DataQuality|Object} dataQuality
     */
    addDataQuality: function (dataQuality) {
        this.getDataQualitiesProperty().push(dataQuality);
    },
    registerDataQuality: function (dataQuality) {
        var url = this.server.getUrl() + 'wa/istsos/services' + this.getServiceObject()['service'] +
            '/dataqualities';
        this.executeRequest(url, istsos.events.EventType.NEW_DATAQUALITY, 'POST', dataQuality.getDataQualityObject());
    }
    ,
    getDataQualities: function () {
        var url = this.server.getUrl() + 'wa/istsos/services' + this.getServiceObject()['service'] +
            '/dataqualities';
        this.executeRequest(url, istsos.events.EventType.DATAQUALITIES, 'GET');
    },
    getDataQuality: function (dataQuality) {
        var url = this.server.getUrl() + 'wa/istsos/services' + this.getServiceObject()['service'] +
            '/dataqualities' + dataQuality.getDataQualityObject()['code'];
        this.executeRequest(url, istsos.events.EventType.DATAQUALITY, 'GET');
    },
    getSystemTypes: function () {
        var url = this.server.getUrl() + 'wa/istsos/services/' + this.getServiceObject()['service'] + '/systemtypes';
        this.executeRequest(url, istsos.events.EventType.SYSTEM_TYPES, 'GET');
    },
    getDatabaseProperty: function() {
        return this.database;
    },
    getDatabase: function () {
        this.database.getDb(this.getServiceObject()['service'], this.server);
    }
};

/** istsos.Date class */
/**
 * @param {string} opt_descr
 * @constructor
 */
istsos.Date = function (opt_descr) {
    this.description = opt_descr || 'Class for converting date&time to proper istSOS format';
};

istsos.Date.prototype = {
    /**
     * @param {int} year
     * @param {int} month
     * @param {int} day
     * @param {int} hours
     * @param {int} minutes
     * @param {int} seconds
     * @param {int} gmt
     * @returns {string}
     */
    getDateString: function (year, month, day, hours, minutes, seconds, gmt) {
        var gmtFormat = (gmt > 9) ? gmt.toString() : '0' +gmt.toString();
        var date = year + '-' + month + '-' + day + 'T' +
                    hours + ':' + minutes + ':' + seconds + '+' +
                    gmtFormat + ':' + '00';
        return date;
    },
    getDescription: function () {
        return this.description;
    }
};
/** istsos.Offering class */
/**
 * @param {string} offeringName
 * @param {string} offeringDescription
 * @param {boolean} active
 * @param {istsos.Date|Object} expirationDate
 * @param {istsos.Service|Object} service
 * @constructor
 */
istsos.Offering = function (offeringName, offeringDescription, active, expirationDate, service) {
    this.offeringObject = {
        "name": offeringName,
        "description": offeringDescription,
        "expiration": expirationDate.getDateString()
    };
    if(active === true) {
        this.offeringObject['active'] = 'on';
    }
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
     * @param procedure
     */
    addProcedure: function (procedure) {
        this.memberProcedures.push(procedure);
    },
    /**
     * @param {string} newName
     * @param {string} newDescription
     * @param {boolean} newActive
     * @param {istsos.Date|Object} newExpirationDate
     */
    updateOffering: function (newName, newDescription, newActive, newExpirationDate ) {
        this.offeringObject['name'] = newName || this.offeringObject['name'];
        this.offeringObject['description'] = newDescription || this.offeringObject['description'];
        this.offeringObject['active'] = newActive || this.offeringObject['active'];
        this.offeringObject['expiration'] = newExpirationDate.getDateString() || this.offeringObject['expiration'];
        var url = this.service.server.getUrl() + 'wa/istsos/services/' + this.service.getServiceObject()['service'] +
                '/offerings/' + this.getOfferingObject()['name'];
        this.executeRequest(url, istsos.events.EventType.UPDATE_OFFERING, 'PUT', this.getOfferingObject());
    },
    deleteOffering: function() {
        for(var i = 0; i < this.service.offerings.length; i++) {
            if(this === this.service.offerings[i]) {
                this.service.offerings.splice(i, 1);
            }
        }
        var url = this.service.server.getUrl() + 'wa/istsos/services/' + this.service.getServiceObject()['service'] +
                '/offerings/' + this.getOfferingObject()['name'];
        var data = {
            "name":this.getOfferingObject()['name'],
            "description": this.getOfferingObject()['description']
        };
        this.executeRequest(url, istsos.events.EventType.DELETE_OFFERING, 'DELETE', data);
    },
    getMemberProcedures: function () {
        var url = this.service.server.getUrl() + 'wa/istsos/services/' + this.service.getServiceObject()['service'] +
                 '/offerings/' + this.getOfferingObject()['name'] + '/procedures/operations/memberlist';
        this.executeRequest(url, istsos.events.EventType.MEMBERLIST, 'GET');
    },
    getNonMemberProcedures: function () {
        var url = this.service.server.getUrl() + 'wa/istsos/services/' + this.service.getServiceObject()['service'] +
            '/offerings/' + this.getOfferingObject()['name'] + '/procedures/operations/nonmemberlist';
        this.executeRequest(url, istsos.events.EventType.NONMEMBERLIST, 'GET');
    },
    /**
     * @returns {JSON|Object}
     */
    getOfferingObject: function () {
        return this.offeringObject;
    }
};

/** istsos.Procedure class */

istsos.Procedure = function () {
    
};

istsos.Procedure.prototype = {
    updateProcedure: '',
    deleteProcedure: ''
};

/** istsos.VirtualProcedure class */

istsos.VirtualProcedure = function () {

};

istsos.VirtualProcedure.prototype = {

};



/** istsos.ObservedProperty class */
/**
 * @param {istsos.Service|Object} service
 * @param {string} propertyName
 * @param {string} definitionUrn
 * @param {string} propertyDescr
 * @param {string} opt_constraintType (allowed_values:"between", "lessThan", "greaterThan", "valueList")
 * @param {Array|int} opt_value (Array or integer, depending on constraint type)
 * @constructor
 */

istsos.ObservedProperty = function (service, propertyName, definitionUrn, propertyDescr, opt_constraintType, opt_value) {
    this.observedPropertyObject = {
        'name': propertyName,
        'definition': definitionUrn,
        'description': propertyDescr,
        'constraint': {
            'role': 'urn:x-ogc:def:classifiers:x-istsos:1.0:qualityIndexCheck:level0'
        }
    };
    if(this.validateConstraintInput(opt_constraintType, opt_value) === true) {
        this.observedPropertyObject['constraint'][opt_constraintType] = opt_value;
    } else {
        this.observedPropertyObject['constraint'] = null;
        console.log('Input constraintType and constraintValue are incorrect or intentionally null/undefined!!! ' +
            'Object created with null/undefined constraint OR not properly created!!!');
        alert('Input constraintType and constraintValue are incorrect or intentionally null/undefined!!! ' +
            'Object created with null/undefined constraint OR not properly created!!!');
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
        all.forEach(function (procedure) {
            procedure.getOutputs()['definition'].forEach(function (obsv_prop) {
                if(this.getObservedPropertyObject()['definition'] === obsv_prop.getObservedPropertyObject()['definition']) {
                    this.getProceduresIncluded().push(procedure);
                }
            })
        });
    },
    /**
     * @returns {Array}
     */
    getProceduresIncluded: function () {
        return this.proceduresIncluded;
    },
    /**
     * @returns {JSON|Object}
     */
    getObservedPropertyObject: function () {
        return this.observedPropertyObject;
    },
    /**
     * @param {string} newPropertyName
     * @param {string} newDefinitionUrn
     * @param {string} newPropertyDescr
     * @param {string} opt_constraintType
     * @param {Array|int} opt_value
     */
    updateObservedProperty: function (newPropertyName, newDefinitionUrn, newPropertyDescr, opt_constraintType, opt_value) {
        this.observedPropertyObject['name'] = newPropertyName || this.observedPropertyObject['name'];
        this.observedPropertyObject['definition'] = newDefinitionUrn || this.observedPropertyObject['definition'];
        this.observedPropertyObject['description'] = newPropertyName || this.observedPropertyObject['description'];
        if(this.validateConstraintInput(opt_constraintType, opt_value) === true) {
            this.observedPropertyObject['constraint'][opt_constraintType] = opt_value;
        } else {
            this.observedPropertyObject['constraint'] = null;
            console.log('Input constraintType and constraintValue are incorrect or intentionally null/undefined!!! ' +
                'Object created with null/undefined constraint OR not properly created!!!');
            alert('Input constraintType and constraintValue are incorrect or intentionally null/undefined!!! ' +
                'Object created with null/undefined constraint OR not properly created!!!');
        }
        var url = this.server.getUrl() + 'wa/istsos/services/observedproperties/' +
            property.getObservedPropertyObject()['definition'];
        this.executeRequest(url, istsos.events.EventType.UPDATE_OBSERVED_PROPERTY, 'PUT', this.getObservedPropertyObject());
    },
    deleteObservedProperty: function () {
        var procedures = this.service.getProceduresProperty();
        var v_procedures = this.service.getVirtualProceduresProperty();
        var properties_service = this.service.getObservedPropertiesProperty();
        var all = procedures.concat(v_procedures);
        var properties_procedure = all.getOutputs();
        for(var i = 0; i < properties_procedure.length; i++) {
            if(this === properties_procedure[i]['definition']) {
                alert('CONNECTED TO PROCEDURE');
                break;
            } else {
                for(var i = 0; i < properties_service.length; i++) {
                    if(this === properties_service[i]) {
                        properties_service.splice(i, 1);
                    }
                }
            }
        }
        var url = this.server.getUrl() + 'wa/istsos/services/observedproperties/' +
            property.getObservedPropertyObject()['definition'];
        this.executeRequest(url, istsos.events.EventType.DELETE_OBSERVED_PROPERTY, 'DELETE');
    },
    /**
     * @param {string} constraintType
     * @param {Array|int} constraintValue
     * @returns {boolean}
     */
    validateConstraintInput: function (constraintType, constraintValue) {
        switch (opt_constraintType) {
            case 'between':
                opt_constraintType = 'interval';
                if(opt_value.constructor !== Array) {
                    alert('Type of "between" constraint must be Array');
                    return false;
                } else {
                    return true;
                }
            case 'lessThan':
                opt_constraintType = 'max';
                if(opt_value !== parseInt(opt_value, 10)) {
                    alert('Type of "lessThan" constraint must be Integer');
                    return false;
                } else {
                    return true;
                }
            case 'greaterThan':
                opt_constraintType = 'min';
                if(opt_value !== parseInt(opt_value, 10)) {
                    alert('Type of "greaterThan" constraint must be Integer');
                    return false;
                } else {
                    return true;
                }
            case 'valueList':
                if(opt_value.constructor !== Array) {
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
 * @param {istsos.Service|Object} service
 * @param {int} codeDQ
 * @param {string} nameDQ
 * @param {string} descrDQ
 * @constructor
 */
istsos.DataQuality = function (service, codeDQ, nameDQ, descrDQ) {
    this.dataQualityObject = {
        "code": codeDQ,
        "name": nameDQ,
        "description": descrDQ
    };
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
     * @returns {JSON|Object}
     */
    getDataQualityObject: function () {
        return this.dataQualityObject;
    },
    /**
     * @param {int} newCodeDQ
     * @param {string} newNameDQ
     * @param {string} newDescrDQ
     */
    updateDataQuality: function (newCodeDQ, newNameDQ, newDescrDQ) {
        this.dataQualityObject['code'] = newCodeDQ || this.dataQualityObject['code'];
        this.dataQualityObject['name'] = newNameDQ || this.dataQualityObject['name'];
        this.dataQualityObject['description'] = newDescrDQ || this.dataQualityObject['description'];
        var url = this.service.server.getUrl() + 'wa/istsos/services' + this.service.getServiceObject()['service'] +
                '/dataqualities/' + this.getDataQualityObject()['code'];
        this.executeRequest(url, istsos.events.EventType.UPDATE_DATAQUALITY, 'PUT', this.getDataQualityObject());
     },
    deleteDataQuality: function () {
        var dataQualities = this.service.getDataQualitiesProperty();
        for(var i = 0; i < dataQualities.length; i++) {
            if(this === dataQualities[i]) {
                dataQualities.splice(i,1);
            }
        }
        var url = this.service.server.getUrl() + 'wa/istsos/services' + this.service.getServiceObject()['service'] +
            '/dataqualities/' + this.getDataQualityObject()['code'];
        this.executeRequest(url, istsos.events.EventType.DELETE_DATAQUALITY, 'DELETE', this.getDataQualityObject());
    }
};


/** istsos.UnitOfMeasure  class */
/**
 * @param service
 * @param code
 * @param description
 * @constructor
 */
istsos.UnitOfMeasure  = function (service, code, description) {
    this.uomObject = {
        'code': code,
        'description': description
    };
    this.proceduresIncluded = [];
    this.service = service;
    service.addUom(this);
    this.updateProceduresIncluded();
};

istsos.UnitOfMeasure .prototype = {
    executeRequest: function (url, eventType, method, opt_data, opt_callback) {
        goog.net.XhrIo.send(url, function (e) {
            istsos.fire(eventType, e.target);
        }, method, opt_data);
    },
    updateProceduresIncluded: function () {
        var procedures = this.service.getProceduresProperty();
        var v_procedures = this.service.getVirtualProceduresProperty();
        var all = procedures.concat(v_procedures);
        all.forEach(function (procedure) {
            procedure.getOutputs().forEach(function (uom) {
                if(this.getUomObject()['code'] === uom.getUomObject()['code']) {
                    this.getProceduresIncluded().push(procedure);
                }
            })
        });
    },
    /**
     * @returns {JSON|Object}
     */
    getUomObject: function () {
        return this.uomObject;
    },
    /**
     * @param {string} newCode
     * @param {string} newDescr
     */
    updateUom: function (newCode, newDescr) {
        this.uomObject['code'] = newCode || this.uomObject['code'];
        this.uomObject['description'] = newDescr || this.uomObject['description'];
        var url = this.service.server.getUrl() + 'wa/istsos/services/' + this.service.getServiceObject()['service'] +
                '/uoms/' + this.getUomObject()['code'];
        this.executeRequest(url, istsos.events.EventType.UPDATE_UOM, 'PUT', this.getUomObject());
    },
    deleteUom: function () {
        var uoms_service = this.service.getUomsProperty();
        var procedures = this.service.getProceduresProperty();
        var v_procedures = this.service.getVirtualProceduresProperty();
        var all = procedures.concat(v_procedures);
        var uoms_procedures = all.getOutputs();

        for(var i = 0; i < uoms_procedures.length; i++) {
            if(this === uoms_procedures[i]['uom']) {
                alert('CONNECTED TO PROCEDURE');
                break;
            } else {
                for(var i = 0; i < uoms_service.length; i++) {
                    if(this === uoms_service[i]) {
                        uoms_service.splice(i, 1);
                    }
                }
            }
        }
        var url = this.service.server.getUrl() + 'wa/istsos/services/' + this.service.getServiceObject()['service'] +
            '/uoms/' + this.getUomObject()['code'];
        this.executeRequest(url, istsos.events.EventType.DELETE_UOM, 'DELETE', this.getUomObject());
    }
};





