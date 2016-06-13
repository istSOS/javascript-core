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
        'constraint': {}
    };
    var check = this.validateConstraintInput(opt_constraintType, opt_value);
    if(check === true) {
        this.observedPropertyObject['constraint']['role'] = 'urn:x-ogc:def:classifiers:x-istsos:1.0:qualityIndexCheck:level0';
        this.observedPropertyObject['constraint'][opt_constraintType] = opt_value;
    } else {
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
        var url = this.server.getUrl() + 'wa/istsos/services/' + this.service.getServiceObject()['service'] + '/observedproperties/' +
            this.getObservedPropertyObject()['definition'];
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

istsos.Output = function (property, uom, description, opt_constraintType, opt_constraintValue) {
    this.outputObject = {
        "name": property.getObservedPropertyObject()['name'],
        "definition": property.getObservedPropertyObject()['definition'],
        "uom": uom.getUomObject()['code'],
        "description": description || "",
        "constraint": {}
    };
    var check = this.validateConstraintInput(opt_constraintType, opt_constraintValue)
    if(check === true) {
        this.outputObject['constraint']['role'] = 'urn:ogc:def:classifiers:x-istsos:1.0:qualityIndex:check:reasonable';
        this.outputObject['constraint'][opt_constraintType] = [opt_constraintValue];
    } else {
        console.log('Input constraintType and constraintValue are incorrect or intentionally null/undefined!!! ' +
            'Object created with null/undefined constraint OR not properly created!!!');
        alert('Input constraintType and constraintValue are incorrect or intentionally null/undefined!!! ' +
            'Object created with null/undefined constraint OR not properly created!!!');
    }
};

istsos.Output.prototype = {
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
    },
    getOutputObject: function () {
        return this.outputObject;
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
 * @param {Array<istsos.Outputs|Object>} outputs
 * @constructor
 */
istsos.ProcedureBase = function (name, description, keywords, foi_name, epsg, x, y, z, outputs ) {
    this.ProcedureBaseObject = {
        'system_id': name,
        'system': name,
        'description': description,
        'keywords': keywords,
        'location': {
            'type': 'Feature',
            'geometry': {
                'type': 'Point',
                'coordinates': [x, y, z]
            },
            'crs': {
                'type': 'name',
                'properties': {
                    'name': epsg
                }
            },
            'properties': {
                'name': foi_name
            }
        },
        'outputs': [
            {
                "name": "Time",
                "definition": "urn:ogc:def:parameter:x-istsos:1.0:time:iso8601",
                "uom": "iso8601",
                "description": "",
                "constraint": {}
            }
        ],
        'inputs': [],
        'history': []
    };
    outputs.forEach(function (out) {
        this.getProcedureBaseObject()['outputs'].push(out);
    })
};

istsos.ProcedureBase.prototype = {
    getProcedureBaseObject: function () {
        return this.ProcedureBaseObject;
    },
    createContactForm: function (individualName, voice, fax, email, web, deliveryPoint, city, administrativeArea, postalCode, country) {
        return  {
            'individualName': individualName || '',
            'voice': voice || '',
            'fax': fax || '',
            'email': email || '',
            'web': web || '',
            'deliveryPoint': deliveryPoint || '',
            'city': city || '',
            'administrativeArea': administrativeArea || '',
            'postalCode': postalCode || '',
            'country':country  || ''
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
            "combo": "Memory Capacity (Byte)",
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
    },
    getDocumentFormats: function () {
        return [
            {
                "extension": ".3dm",
                "format": "x-world/x-3dmf"
            },
            {
                "extension": ".3dmf",
                "format": "x-world/x-3dmf"
            },
            {
                "extension": ".a",
                "format": "application/octet-stream"
            },
            {
                "extension": ".aab",
                "format": "application/x-authorware-bin"
            },

            {
                "extension": ".aam",
                "format": "application/x-authorware-map"
            },

            {
                "extension": ".aas",
                "format": "application/x-authorware-seg"
            },

            {
                "extension": ".abc",
                "format": "text/vnd.abc"
            },

            {
                "extension": ".acgi",
                "format": "text/html"
            },

            {
                "extension": ".afl",
                "format": "video/animaflex"
            },

            {
                "extension": ".ai",
                "format": "application/postscript"
            },

            {
                "extension": ".aif",
                "format": "audio/aiff"
            },

            {
                "extension": ".aif",
                "format": "audio/x-aiff"
            },

            {
                "extension": ".aifc",
                "format": "audio/aiff"
            },

            {
                "extension": ".aifc",
                "format": "audio/x-aiff"
            },

            {
                "extension": ".aiff",
                "format": "audio/aiff"
            },

            {
                "extension": ".aiff",
                "format": "audio/x-aiff"
            },

            {
                "extension": ".aim",
                "format": "application/x-aim"
            },

            {
                "extension": ".aip",
                "format": "text/x-audiosoft-intra"
            },

            {
                "extension": ".ani",
                "format": "application/x-navi-animation"
            },

            {
                "extension": ".aos",
                "format": "application/x-nokia-9000-communicator-add-on-software"
            },

            {
                "extension": ".aps",
                "format": "application/mime"
            },

            {
                "extension": ".arc",
                "format": "application/octet-stream"
            },

            {
                "extension": ".arj",
                "format": "application/arj"
            },

            {
                "extension": ".arj",
                "format": "application/octet-stream"
            },

            {
                "extension": ".art",
                "format": "image/x-jg"
            },

            {
                "extension": ".asf",
                "format": "video/x-ms-asf"
            },

            {
                "extension": ".asm",
                "format": "text/x-asm"
            },

            {
                "extension": ".asp",
                "format": "text/asp"
            },

            {
                "extension": ".asx",
                "format": "application/x-mplayer2"
            },

            {
                "extension": ".asx",
                "format": "video/x-ms-asf"
            },

            {
                "extension": ".asx",
                "format": "video/x-ms-asf-plugin"
            },

            {
                "extension": ".au",
                "format": "audio/basic"
            },

            {
                "extension": ".au",
                "format": "audio/x-au"
            },

            {
                "extension": ".avi",
                "format": "application/x-troff-msvideo"
            },

            {
                "extension": ".avi",
                "format": "video/avi"
            },

            {
                "extension": ".avi",
                "format": "video/msvideo"
            },

            {
                "extension": ".avi",
                "format": "video/x-msvideo"
            },

            {
                "extension": ".avs",
                "format": "video/avs-video"
            },

            {
                "extension": ".bcpio",
                "format": "application/x-bcpio"
            },

            {
                "extension": ".bin",
                "format": "application/mac-binary"
            },

            {
                "extension": ".bin",
                "format": "application/macbinary"
            },

            {
                "extension": ".bin",
                "format": "application/octet-stream"
            },

            {
                "extension": ".bin",
                "format": "application/x-binary"
            },

            {
                "extension": ".bin",
                "format": "application/x-macbinary"
            },

            {
                "extension": ".bm",
                "format": "image/bmp"
            },

            {
                "extension": ".bmp",
                "format": "image/bmp"
            },

            {
                "extension": ".bmp",
                "format": "image/x-windows-bmp"
            },

            {
                "extension": ".boo",
                "format": "application/book"
            },

            {
                "extension": ".book",
                "format": "application/book"
            },

            {
                "extension": ".boz",
                "format": "application/x-bzip2"
            },

            {
                "extension": ".bsh",
                "format": "application/x-bsh"
            },

            {
                "extension": ".bz",
                "format": "application/x-bzip"
            },

            {
                "extension": ".bz2",
                "format": "application/x-bzip2"
            },

            {
                "extension": ".c",
                "format": "text/plain"
            },

            {
                "extension": ".c",
                "format": "text/x-c"
            },

            {
                "extension": ".c++",
                "format": "text/plain"
            },

            {
                "extension": ".cat",
                "format": "application/vnd.ms-pki.seccat"
            },

            {
                "extension": ".cc",
                "format": "text/plain"
            },

            {
                "extension": ".cc",
                "format": "text/x-c"
            },

            {
                "extension": ".ccad",
                "format": "application/clariscad"
            },

            {
                "extension": ".cco",
                "format": "application/x-cocoa"
            },

            {
                "extension": ".cdf",
                "format": "application/cdf"
            },

            {
                "extension": ".cdf",
                "format": "application/x-cdf"
            },

            {
                "extension": ".cdf",
                "format": "application/x-netcdf"
            },

            {
                "extension": ".cer",
                "format": "application/pkix-cert"
            },

            {
                "extension": ".cer",
                "format": "application/x-x509-ca-cert"
            },

            {
                "extension": ".cha",
                "format": "application/x-chat"
            },

            {
                "extension": ".chat",
                "format": "application/x-chat"
            },

            {
                "extension": ".class",
                "format": "application/java"
            },

            {
                "extension": ".class",
                "format": "application/java-byte-code"
            },

            {
                "extension": ".class",
                "format": "application/x-java-class"
            },

            {
                "extension": ".com",
                "format": "application/octet-stream"
            },

            {
                "extension": ".com",
                "format": "text/plain"
            },

            {
                "extension": ".conf",
                "format": "text/plain"
            },

            {
                "extension": ".cpio",
                "format": "application/x-cpio"
            },

            {
                "extension": ".cpp",
                "format": "text/x-c"
            },

            {
                "extension": ".cpt",
                "format": "application/mac-compactpro"
            },

            {
                "extension": ".cpt",
                "format": "application/x-compactpro"
            },

            {
                "extension": ".cpt",
                "format": "application/x-cpt"
            },

            {
                "extension": ".crl",
                "format": "application/pkcs-crl"
            },

            {
                "extension": ".crl",
                "format": "application/pkix-crl"
            },

            {
                "extension": ".crt",
                "format": "application/pkix-cert"
            },

            {
                "extension": ".crt",
                "format": "application/x-x509-ca-cert"
            },

            {
                "extension": ".crt",
                "format": "application/x-x509-user-cert"
            },

            {
                "extension": ".csh",
                "format": "application/x-csh"
            },

            {
                "extension": ".csh",
                "format": "text/x-script.csh"
            },

            {
                "extension": ".css",
                "format": "application/x-pointplus"
            },

            {
                "extension": ".css",
                "format": "text/css"
            },

            {
                "extension": ".cxx",
                "format": "text/plain"
            },

            {
                "extension": ".dcr",
                "format": "application/x-director"
            },

            {
                "extension": ".deepv",
                "format": "application/x-deepv"
            },

            {
                "extension": ".def",
                "format": "text/plain"
            },

            {
                "extension": ".der",
                "format": "application/x-x509-ca-cert"
            },

            {
                "extension": ".dif",
                "format": "video/x-dv"
            },

            {
                "extension": ".dir",
                "format": "application/x-director"
            },

            {
                "extension": ".dl",
                "format": "video/dl"
            },

            {
                "extension": ".dl",
                "format": "video/x-dl"
            },

            {
                "extension": ".doc",
                "format": "application/msword"
            },

            {
                "extension": ".dot",
                "format": "application/msword"
            },

            {
                "extension": ".dp",
                "format": "application/commonground"
            },

            {
                "extension": ".drw",
                "format": "application/drafting"
            },

            {
                "extension": ".dump",
                "format": "application/octet-stream"
            },

            {
                "extension": ".dv",
                "format": "video/x-dv"
            },

            {
                "extension": ".dvi",
                "format": "application/x-dvi"
            },

            {
                "extension": ".dwf",
                "format": "drawing/x-dwf (old)"
            },

            {
                "extension": ".dwf",
                "format": "model/vnd.dwf"
            },

            {
                "extension": ".dwg",
                "format": "application/acad"
            },

            {
                "extension": ".dwg",
                "format": "image/vnd.dwg"
            },

            {
                "extension": ".dwg",
                "format": "image/x-dwg"
            },

            {
                "extension": ".dxf",
                "format": "application/dxf"
            },

            {
                "extension": ".dxf",
                "format": "image/vnd.dwg"
            },

            {
                "extension": ".dxf",
                "format": "image/x-dwg"
            },

            {
                "extension": ".dxr",
                "format": "application/x-director"
            },

            {
                "extension": ".el",
                "format": "text/x-script.elisp"
            },

            {
                "extension": ".elc",
                "format": "application/x-bytecode.elisp (compiled elisp)"
            },

            {
                "extension": ".elc",
                "format": "application/x-elc"
            },

            {
                "extension": ".env",
                "format": "application/x-envoy"
            },

            {
                "extension": ".eps",
                "format": "application/postscript"
            },

            {
                "extension": ".es",
                "format": "application/x-esrehber"
            },

            {
                "extension": ".etx",
                "format": "text/x-setext"
            },

            {
                "extension": ".evy",
                "format": "application/envoy"
            },

            {
                "extension": ".evy",
                "format": "application/x-envoy"
            },

            {
                "extension": ".exe",
                "format": "application/octet-stream"
            },

            {
                "extension": ".f",
                "format": "text/plain"
            },

            {
                "extension": ".f",
                "format": "text/x-fortran"
            },

            {
                "extension": ".f77",
                "format": "text/x-fortran"
            },

            {
                "extension": ".f90",
                "format": "text/plain"
            },

            {
                "extension": ".f90",
                "format": "text/x-fortran"
            },

            {
                "extension": ".fdf",
                "format": "application/vnd.fdf"
            },

            {
                "extension": ".fif",
                "format": "application/fractals"
            },

            {
                "extension": ".fif",
                "format": "image/fif"
            },

            {
                "extension": ".fli",
                "format": "video/fli"
            },

            {
                "extension": ".fli",
                "format": "video/x-fli"
            },

            {
                "extension": ".flo",
                "format": "image/florian"
            },

            {
                "extension": ".flx",
                "format": "text/vnd.fmi.flexstor"
            },

            {
                "extension": ".fmf",
                "format": "video/x-atomic3d-feature"
            },

            {
                "extension": ".for",
                "format": "text/plain"
            },

            {
                "extension": ".for",
                "format": "text/x-fortran"
            },

            {
                "extension": ".fpx",
                "format": "image/vnd.fpx"
            },

            {
                "extension": ".fpx",
                "format": "image/vnd.net-fpx"
            },

            {
                "extension": ".frl",
                "format": "application/freeloader"
            },

            {
                "extension": ".funk",
                "format": "audio/make"
            },

            {
                "extension": ".g",
                "format": "text/plain"
            },

            {
                "extension": ".g3",
                "format": "image/g3fax"
            },

            {
                "extension": ".gif",
                "format": "image/gif"
            },

            {
                "extension": ".gl",
                "format": "video/gl"
            },

            {
                "extension": ".gl",
                "format": "video/x-gl"
            },

            {
                "extension": ".gsd",
                "format": "audio/x-gsm"
            },

            {
                "extension": ".gsm",
                "format": "audio/x-gsm"
            },

            {
                "extension": ".gsp",
                "format": "application/x-gsp"
            },

            {
                "extension": ".gss",
                "format": "application/x-gss"
            },

            {
                "extension": ".gtar",
                "format": "application/x-gtar"
            },

            {
                "extension": ".gz",
                "format": "application/x-compressed"
            },

            {
                "extension": ".gz",
                "format": "application/x-gzip"
            },

            {
                "extension": ".gzip",
                "format": "application/x-gzip"
            },

            {
                "extension": ".gzip",
                "format": "multipart/x-gzip"
            },

            {
                "extension": ".h",
                "format": "text/plain"
            },

            {
                "extension": ".h",
                "format": "text/x-h"
            },

            {
                "extension": ".hdf",
                "format": "application/x-hdf"
            },

            {
                "extension": ".help",
                "format": "application/x-helpfile"
            },

            {
                "extension": ".hgl",
                "format": "application/vnd.hp-hpgl"
            },

            {
                "extension": ".hh",
                "format": "text/plain"
            },

            {
                "extension": ".hh",
                "format": "text/x-h"
            },

            {
                "extension": ".hlb",
                "format": "text/x-script"
            },

            {
                "extension": ".hlp",
                "format": "application/hlp"
            },

            {
                "extension": ".hlp",
                "format": "application/x-helpfile"
            },

            {
                "extension": ".hlp",
                "format": "application/x-winhelp"
            },

            {
                "extension": ".hpg",
                "format": "application/vnd.hp-hpgl"
            },

            {
                "extension": ".hpgl",
                "format": "application/vnd.hp-hpgl"
            },

            {
                "extension": ".hqx",
                "format": "application/binhex"
            },

            {
                "extension": ".hqx",
                "format": "application/binhex4"
            },

            {
                "extension": ".hqx",
                "format": "application/mac-binhex"
            },

            {
                "extension": ".hqx",
                "format": "application/mac-binhex40"
            },

            {
                "extension": ".hqx",
                "format": "application/x-binhex40"
            },

            {
                "extension": ".hqx",
                "format": "application/x-mac-binhex40"
            },

            {
                "extension": ".hta",
                "format": "application/hta"
            },

            {
                "extension": ".htc",
                "format": "text/x-component"
            },

            {
                "extension": ".htm",
                "format": "text/html"
            },

            {
                "extension": ".html",
                "format": "text/html"
            },

            {
                "extension": ".htmls",
                "format": "text/html"
            },

            {
                "extension": ".htt",
                "format": "text/webviewhtml"
            },

            {
                "extension": ".htx",
                "format": "text/html"
            },

            {
                "extension": ".ice",
                "format": "x-conference/x-cooltalk"
            },

            {
                "extension": ".ico",
                "format": "image/x-icon"
            },

            {
                "extension": ".idc",
                "format": "text/plain"
            },

            {
                "extension": ".ief",
                "format": "image/ief"
            },

            {
                "extension": ".iefs",
                "format": "image/ief"
            },

            {
                "extension": ".iges",
                "format": "application/iges"
            },

            {
                "extension": ".iges",
                "format": "model/iges"
            },

            {
                "extension": ".igs",
                "format": "application/iges"
            },

            {
                "extension": ".igs",
                "format": "model/iges"
            },

            {
                "extension": ".ima",
                "format": "application/x-ima"
            },

            {
                "extension": ".imap",
                "format": "application/x-httpd-imap"
            },

            {
                "extension": ".inf",
                "format": "application/inf"
            },

            {
                "extension": ".ins",
                "format": "application/x-internett-signup"
            },

            {
                "extension": ".ip",
                "format": "application/x-ip2"
            },

            {
                "extension": ".isu",
                "format": "video/x-isvideo"
            },

            {
                "extension": ".it",
                "format": "audio/it"
            },

            {
                "extension": ".iv",
                "format": "application/x-inventor"
            },

            {
                "extension": ".ivr",
                "format": "i-world/i-vrml"
            },

            {
                "extension": ".ivy",
                "format": "application/x-livescreen"
            },

            {
                "extension": ".jam",
                "format": "audio/x-jam"
            },

            {
                "extension": ".jav",
                "format": "text/plain"
            },

            {
                "extension": ".jav",
                "format": "text/x-java-source"
            },

            {
                "extension": ".java",
                "format": "text/plain"
            },

            {
                "extension": ".java",
                "format": "text/x-java-source"
            },

            {
                "extension": ".jcm",
                "format": "application/x-java-commerce"
            },

            {
                "extension": ".jfif",
                "format": "image/jpeg"
            },

            {
                "extension": ".jfif",
                "format": "image/pjpeg"
            },

            {
                "extension": ".jfif-tbnl",
                "format": "image/jpeg"
            },

            {
                "extension": ".jpe",
                "format": "image/jpeg"
            },

            {
                "extension": ".jpe",
                "format": "image/pjpeg"
            },

            {
                "extension": ".jpeg",
                "format": "image/jpeg"
            },

            {
                "extension": ".jpeg",
                "format": "image/pjpeg"
            },

            {
                "extension": ".jpg",
                "format": "image/jpeg"
            },

            {
                "extension": ".jpg",
                "format": "image/pjpeg"
            },

            {
                "extension": ".jps",
                "format": "image/x-jps"
            },

            {
                "extension": ".js",
                "format": "application/x-javascript"
            },

            {
                "extension": ".jut",
                "format": "image/jutvision"
            },

            {
                "extension": ".kar",
                "format": "audio/midi"
            },

            {
                "extension": ".kar",
                "format": "music/x-karaoke"
            },

            {
                "extension": ".ksh",
                "format": "application/x-ksh"
            },

            {
                "extension": ".ksh",
                "format": "text/x-script.ksh"
            },

            {
                "extension": ".la",
                "format": "audio/nspaudio"
            },

            {
                "extension": ".la",
                "format": "audio/x-nspaudio"
            },

            {
                "extension": ".lam",
                "format": "audio/x-liveaudio"
            },

            {
                "extension": ".latex",
                "format": "application/x-latex"
            },

            {
                "extension": ".lha",
                "format": "application/lha"
            },

            {
                "extension": ".lha",
                "format": "application/octet-stream"
            },

            {
                "extension": ".lha",
                "format": "application/x-lha"
            },

            {
                "extension": ".lhx",
                "format": "application/octet-stream"
            },

            {
                "extension": ".list",
                "format": "text/plain"
            },

            {
                "extension": ".lma",
                "format": "audio/nspaudio"
            },

            {
                "extension": ".lma",
                "format": "audio/x-nspaudio"
            },

            {
                "extension": ".log",
                "format": "text/plain"
            },

            {
                "extension": ".lsp",
                "format": "application/x-lisp"
            },

            {
                "extension": ".lsp",
                "format": "text/x-script.lisp"
            },

            {
                "extension": ".lst",
                "format": "text/plain"
            },

            {
                "extension": ".lsx",
                "format": "text/x-la-asf"
            },

            {
                "extension": ".ltx",
                "format": "application/x-latex"
            },

            {
                "extension": ".lzh",
                "format": "application/octet-stream"
            },

            {
                "extension": ".lzh",
                "format": "application/x-lzh"
            },

            {
                "extension": ".lzx",
                "format": "application/lzx"
            },

            {
                "extension": ".lzx",
                "format": "application/octet-stream"
            },

            {
                "extension": ".lzx",
                "format": "application/x-lzx"
            },

            {
                "extension": ".m",
                "format": "text/plain"
            },

            {
                "extension": ".m",
                "format": "text/x-m"
            },

            {
                "extension": ".m1v",
                "format": "video/mpeg"
            },

            {
                "extension": ".m2a",
                "format": "audio/mpeg"
            },

            {
                "extension": ".m2v",
                "format": "video/mpeg"
            },

            {
                "extension": ".m3u",
                "format": "audio/x-mpequrl"
            },

            {
                "extension": ".man",
                "format": "application/x-troff-man"
            },

            {
                "extension": ".map",
                "format": "application/x-navimap"
            },

            {
                "extension": ".mar",
                "format": "text/plain"
            },

            {
                "extension": ".mbd",
                "format": "application/mbedlet"
            },

            {
                "extension": ".mc$",
                "format": "application/x-magic-cap-package-1.0"
            },

            {
                "extension": ".mcd",
                "format": "application/mcad"
            },

            {
                "extension": ".mcd",
                "format": "application/x-mathcad"
            },

            {
                "extension": ".mcf",
                "format": "image/vasa"
            },

            {
                "extension": ".mcf",
                "format": "text/mcf"
            },

            {
                "extension": ".mcp",
                "format": "application/netmc"
            },

            {
                "extension": ".me",
                "format": "application/x-troff-me"
            },

            {
                "extension": ".mht",
                "format": "message/rfc822"
            },

            {
                "extension": ".mhtml",
                "format": "message/rfc822"
            },

            {
                "extension": ".mid",
                "format": "application/x-midi"
            },

            {
                "extension": ".mid",
                "format": "audio/midi"
            },

            {
                "extension": ".mid",
                "format": "audio/x-mid"
            },

            {
                "extension": ".mid",
                "format": "audio/x-midi"
            },

            {
                "extension": ".mid",
                "format": "music/crescendo"
            },

            {
                "extension": ".mid",
                "format": "x-music/x-midi"
            },

            {
                "extension": ".midi",
                "format": "application/x-midi"
            },

            {
                "extension": ".midi",
                "format": "audio/midi"
            },

            {
                "extension": ".midi",
                "format": "audio/x-mid"
            },

            {
                "extension": ".midi",
                "format": "audio/x-midi"
            },

            {
                "extension": ".midi",
                "format": "music/crescendo"
            },

            {
                "extension": ".midi",
                "format": "x-music/x-midi"
            },

            {
                "extension": ".mif",
                "format": "application/x-frame"
            },

            {
                "extension": ".mif",
                "format": "application/x-mif"
            },

            {
                "extension": ".mime",
                "format": "message/rfc822"
            },

            {
                "extension": ".mime",
                "format": "www/mime"
            },

            {
                "extension": ".mjf",
                "format": "audio/x-vnd.audioexplosion.mjuicemediafile"
            },

            {
                "extension": ".mjpg",
                "format": "video/x-motion-jpeg"
            },

            {
                "extension": ".mm",
                "format": "application/base64"
            },

            {
                "extension": ".mm",
                "format": "application/x-meme"
            },

            {
                "extension": ".mme",
                "format": "application/base64"
            },

            {
                "extension": ".mod",
                "format": "audio/mod"
            },

            {
                "extension": ".mod",
                "format": "audio/x-mod"
            },

            {
                "extension": ".moov",
                "format": "video/quicktime"
            },

            {
                "extension": ".mov",
                "format": "video/quicktime"
            },

            {
                "extension": ".movie",
                "format": "video/x-sgi-movie"
            },

            {
                "extension": ".mp2",
                "format": "audio/mpeg"
            },

            {
                "extension": ".mp2",
                "format": "audio/x-mpeg"
            },

            {
                "extension": ".mp2",
                "format": "video/mpeg"
            },

            {
                "extension": ".mp2",
                "format": "video/x-mpeg"
            },

            {
                "extension": ".mp2",
                "format": "video/x-mpeq2a"
            },

            {
                "extension": ".mp3",
                "format": "audio/mpeg3"
            },

            {
                "extension": ".mp3",
                "format": "audio/x-mpeg-3"
            },

            {
                "extension": ".mp3",
                "format": "video/mpeg"
            },

            {
                "extension": ".mp3",
                "format": "video/x-mpeg"
            },

            {
                "extension": ".mpa",
                "format": "audio/mpeg"
            },

            {
                "extension": ".mpa",
                "format": "video/mpeg"
            },

            {
                "extension": ".mpc",
                "format": "application/x-project"
            },

            {
                "extension": ".mpe",
                "format": "video/mpeg"
            },

            {
                "extension": ".mpeg",
                "format": "video/mpeg"
            },

            {
                "extension": ".mpg",
                "format": "audio/mpeg"
            },

            {
                "extension": ".mpg",
                "format": "video/mpeg"
            },

            {
                "extension": ".mpga",
                "format": "audio/mpeg"
            },

            {
                "extension": ".mpp",
                "format": "application/vnd.ms-project"
            },

            {
                "extension": ".mpt",
                "format": "application/x-project"
            },

            {
                "extension": ".mpv",
                "format": "application/x-project"
            },

            {
                "extension": ".mpx",
                "format": "application/x-project"
            },

            {
                "extension": ".mrc",
                "format": "application/marc"
            },

            {
                "extension": ".ms",
                "format": "application/x-troff-ms"
            },

            {
                "extension": ".mv",
                "format": "video/x-sgi-movie"
            },

            {
                "extension": ".my",
                "format": "audio/make"
            },

            {
                "extension": ".mzz",
                "format": "application/x-vnd.audioexplosion.mzz"
            },

            {
                "extension": ".nap",
                "format": "image/naplps"
            },

            {
                "extension": ".naplps",
                "format": "image/naplps"
            },

            {
                "extension": ".nc",
                "format": "application/x-netcdf"
            },

            {
                "extension": ".ncm",
                "format": "application/vnd.nokia.configuration-message"
            },

            {
                "extension": ".nif",
                "format": "image/x-niff"
            },

            {
                "extension": ".niff",
                "format": "image/x-niff"
            },

            {
                "extension": ".nix",
                "format": "application/x-mix-transfer"
            },

            {
                "extension": ".nsc",
                "format": "application/x-conference"
            },

            {
                "extension": ".nvd",
                "format": "application/x-navidoc"
            },

            {
                "extension": ".o",
                "format": "application/octet-stream"
            },

            {
                "extension": ".oda",
                "format": "application/oda"
            },

            {
                "extension": ".omc",
                "format": "application/x-omc"
            },

            {
                "extension": ".omcd",
                "format": "application/x-omcdatamaker"
            },

            {
                "extension": ".omcr",
                "format": "application/x-omcregerator"
            },

            {
                "extension": ".p",
                "format": "text/x-pascal"
            },

            {
                "extension": ".p10",
                "format": "application/pkcs10"
            },

            {
                "extension": ".p10",
                "format": "application/x-pkcs10"
            },

            {
                "extension": ".p12",
                "format": "application/pkcs-12"
            },

            {
                "extension": ".p12",
                "format": "application/x-pkcs12"
            },

            {
                "extension": ".p7a",
                "format": "application/x-pkcs7-signature"
            },

            {
                "extension": ".p7c",
                "format": "application/pkcs7-mime"
            },

            {
                "extension": ".p7c",
                "format": "application/x-pkcs7-mime"
            },

            {
                "extension": ".p7m",
                "format": "application/pkcs7-mime"
            },

            {
                "extension": ".p7m",
                "format": "application/x-pkcs7-mime"
            },

            {
                "extension": ".p7r",
                "format": "application/x-pkcs7-certreqresp"
            },

            {
                "extension": ".p7s",
                "format": "application/pkcs7-signature"
            },

            {
                "extension": ".part",
                "format": "application/pro_eng"
            },

            {
                "extension": ".pas",
                "format": "text/pascal"
            },

            {
                "extension": ".pbm",
                "format": "image/x-portable-bitmap"
            },

            {
                "extension": ".pcl",
                "format": "application/vnd.hp-pcl"
            },

            {
                "extension": ".pcl",
                "format": "application/x-pcl"
            },

            {
                "extension": ".pct",
                "format": "image/x-pict"
            },

            {
                "extension": ".pcx",
                "format": "image/x-pcx"
            },

            {
                "extension": ".pdb",
                "format": "chemical/x-pdb"
            },

            {
                "extension": ".pdf",
                "format": "application/pdf"
            },

            {
                "extension": ".pfunk",
                "format": "audio/make"
            },

            {
                "extension": ".pfunk",
                "format": "audio/make.my.funk"
            },

            {
                "extension": ".pgm",
                "format": "image/x-portable-graymap"
            },

            {
                "extension": ".pgm",
                "format": "image/x-portable-greymap"
            },

            {
                "extension": ".pic",
                "format": "image/pict"
            },

            {
                "extension": ".pict",
                "format": "image/pict"
            },

            {
                "extension": ".pkg",
                "format": "application/x-newton-compatible-pkg"
            },

            {
                "extension": ".pko",
                "format": "application/vnd.ms-pki.pko"
            },

            {
                "extension": ".pl",
                "format": "text/plain"
            },

            {
                "extension": ".pl",
                "format": "text/x-script.perl"
            },

            {
                "extension": ".plx",
                "format": "application/x-pixclscript"
            },

            {
                "extension": ".pm",
                "format": "image/x-xpixmap"
            },

            {
                "extension": ".pm",
                "format": "text/x-script.perl-module"
            },

            {
                "extension": ".pm4",
                "format": "application/x-pagemaker"
            },

            {
                "extension": ".pm5",
                "format": "application/x-pagemaker"
            },

            {
                "extension": ".png",
                "format": "image/png"
            },

            {
                "extension": ".pnm",
                "format": "application/x-portable-anymap"
            },

            {
                "extension": ".pnm",
                "format": "image/x-portable-anymap"
            },

            {
                "extension": ".pot",
                "format": "application/mspowerpoint"
            },

            {
                "extension": ".pot",
                "format": "application/vnd.ms-powerpoint"
            },

            {
                "extension": ".pov",
                "format": "model/x-pov"
            },

            {
                "extension": ".ppa",
                "format": "application/vnd.ms-powerpoint"
            },

            {
                "extension": ".ppm",
                "format": "image/x-portable-pixmap"
            },

            {
                "extension": ".pps",
                "format": "application/mspowerpoint"
            },

            {
                "extension": ".pps",
                "format": "application/vnd.ms-powerpoint"
            },

            {
                "extension": ".ppt",
                "format": "application/mspowerpoint"
            },

            {
                "extension": ".ppt",
                "format": "application/powerpoint"
            },

            {
                "extension": ".ppt",
                "format": "application/vnd.ms-powerpoint"
            },

            {
                "extension": ".ppt",
                "format": "application/x-mspowerpoint"
            },

            {
                "extension": ".ppz",
                "format": "application/mspowerpoint"
            },

            {
                "extension": ".pre",
                "format": "application/x-freelance"
            },

            {
                "extension": ".prt",
                "format": "application/pro_eng"
            },

            {
                "extension": ".ps",
                "format": "application/postscript"
            },

            {
                "extension": ".psd",
                "format": "application/octet-stream"
            },

            {
                "extension": ".pvu",
                "format": "paleovu/x-pv"
            },

            {
                "extension": ".pwz",
                "format": "application/vnd.ms-powerpoint"
            },

            {
                "extension": ".py",
                "format": "text/x-script.phyton"
            },

            {
                "extension": ".pyc",
                "format": "applicaiton/x-bytecode.python"
            },

            {
                "extension": ".qcp",
                "format": "audio/vnd.qcelp"
            },

            {
                "extension": ".qd3",
                "format": "x-world/x-3dmf"
            },

            {
                "extension": ".qif",
                "format": "image/x-quicktime"
            },

            {
                "extension": ".qt",
                "format": "video/quicktime"
            },

            {
                "extension": ".qtc",
                "format": "video/x-qtc"
            },

            {
                "extension": ".qti",
                "format": "image/x-quicktime"
            },

            {
                "extension": ".qtif",
                "format": "image/x-quicktime"
            },

            {
                "extension": ".ra",
                "format": "audio/x-pn-realaudio"
            },

            {
                "extension": ".ra",
                "format": "audio/x-pn-realaudio-plugin"
            },

            {
                "extension": ".ra",
                "format": "audio/x-realaudio"
            },

            {
                "extension": ".ram",
                "format": "audio/x-pn-realaudio"
            },

            {
                "extension": ".ras",
                "format": "application/x-cmu-raster"
            },

            {
                "extension": ".ras",
                "format": "image/cmu-raster"
            },

            {
                "extension": ".ras",
                "format": "image/x-cmu-raster"
            },

            {
                "extension": ".rast",
                "format": "image/cmu-raster"
            },

            {
                "extension": ".rexx",
                "format": "text/x-script.rexx"
            },

            {
                "extension": ".rf",
                "format": "image/vnd.rn-realflash"
            },

            {
                "extension": ".rgb",
                "format": "image/x-rgb"
            },

            {
                "extension": ".rm",
                "format": "application/vnd.rn-realmedia"
            },

            {
                "extension": ".rm",
                "format": "audio/x-pn-realaudio"
            },

            {
                "extension": ".rmi",
                "format": "audio/mid"
            },

            {
                "extension": ".rmm",
                "format": "audio/x-pn-realaudio"
            },

            {
                "extension": ".rmp",
                "format": "audio/x-pn-realaudio"
            },

            {
                "extension": ".rmp",
                "format": "audio/x-pn-realaudio-plugin"
            },

            {
                "extension": ".rng",
                "format": "application/ringing-tones"
            },

            {
                "extension": ".rng",
                "format": "application/vnd.nokia.ringing-tone"
            },

            {
                "extension": ".rnx",
                "format": "application/vnd.rn-realplayer"
            },

            {
                "extension": ".roff",
                "format": "application/x-troff"
            },

            {
                "extension": ".rp",
                "format": "image/vnd.rn-realpix"
            },

            {
                "extension": ".rpm",
                "format": "audio/x-pn-realaudio-plugin"
            },

            {
                "extension": ".rt",
                "format": "text/richtext"
            },

            {
                "extension": ".rt",
                "format": "text/vnd.rn-realtext"
            },

            {
                "extension": ".rtf",
                "format": "application/rtf"
            },

            {
                "extension": ".rtf",
                "format": "application/x-rtf"
            },

            {
                "extension": ".rtf",
                "format": "text/richtext"
            },

            {
                "extension": ".rtx",
                "format": "application/rtf"
            },

            {
                "extension": ".rtx",
                "format": "text/richtext"
            },

            {
                "extension": ".rv",
                "format": "video/vnd.rn-realvideo"
            },

            {
                "extension": ".s",
                "format": "text/x-asm"
            },

            {
                "extension": ".s3m",
                "format": "audio/s3m"
            },

            {
                "extension": ".saveme",
                "format": "application/octet-stream"
            },

            {
                "extension": ".sbk",
                "format": "application/x-tbook"
            },

            {
                "extension": ".scm",
                "format": "application/x-lotusscreencam"
            },

            {
                "extension": ".scm",
                "format": "text/x-script.guile"
            },

            {
                "extension": ".scm",
                "format": "text/x-script.scheme"
            },

            {
                "extension": ".scm",
                "format": "video/x-scm"
            },

            {
                "extension": ".sdml",
                "format": "text/plain"
            },

            {
                "extension": ".sdp",
                "format": "application/sdp"
            },

            {
                "extension": ".sdp",
                "format": "application/x-sdp"
            },

            {
                "extension": ".sdr",
                "format": "application/sounder"
            },

            {
                "extension": ".sea",
                "format": "application/sea"
            },

            {
                "extension": ".sea",
                "format": "application/x-sea"
            },

            {
                "extension": ".set",
                "format": "application/set"
            },

            {
                "extension": ".sgm",
                "format": "text/sgml"
            },

            {
                "extension": ".sgm",
                "format": "text/x-sgml"
            },

            {
                "extension": ".sgml",
                "format": "text/sgml"
            },

            {
                "extension": ".sgml",
                "format": "text/x-sgml"
            },

            {
                "extension": ".sh",
                "format": "application/x-bsh"
            },

            {
                "extension": ".sh",
                "format": "application/x-sh"
            },

            {
                "extension": ".sh",
                "format": "application/x-shar"
            },

            {
                "extension": ".sh",
                "format": "text/x-script.sh"
            },

            {
                "extension": ".shar",
                "format": "application/x-bsh"
            },

            {
                "extension": ".shar",
                "format": "application/x-shar"
            },

            {
                "extension": ".shtml",
                "format": "text/html"
            },

            {
                "extension": ".shtml",
                "format": "text/x-server-parsed-html"
            },

            {
                "extension": ".sid",
                "format": "audio/x-psid"
            },

            {
                "extension": ".sit",
                "format": "application/x-sit"
            },

            {
                "extension": ".sit",
                "format": "application/x-stuffit"
            },

            {
                "extension": ".skd",
                "format": "application/x-koan"
            },

            {
                "extension": ".skm",
                "format": "application/x-koan"
            },

            {
                "extension": ".skp",
                "format": "application/x-koan"
            },

            {
                "extension": ".skt",
                "format": "application/x-koan"
            },

            {
                "extension": ".sl",
                "format": "application/x-seelogo"
            },

            {
                "extension": ".smi",
                "format": "application/smil"
            },

            {
                "extension": ".smil",
                "format": "application/smil"
            },

            {
                "extension": ".snd",
                "format": "audio/basic"
            },

            {
                "extension": ".snd",
                "format": "audio/x-adpcm"
            },

            {
                "extension": ".sol",
                "format": "application/solids"
            },

            {
                "extension": ".spc",
                "format": "application/x-pkcs7-certificates"
            },

            {
                "extension": ".spc",
                "format": "text/x-speech"
            },

            {
                "extension": ".spl",
                "format": "application/futuresplash"
            },

            {
                "extension": ".spr",
                "format": "application/x-sprite"
            },

            {
                "extension": ".sprite",
                "format": "application/x-sprite"
            },

            {
                "extension": ".src",
                "format": "application/x-wais-source"
            },

            {
                "extension": ".ssi",
                "format": "text/x-server-parsed-html"
            },

            {
                "extension": ".ssm",
                "format": "application/streamingmedia"
            },

            {
                "extension": ".sst",
                "format": "application/vnd.ms-pki.certstore"
            },

            {
                "extension": ".step",
                "format": "application/step"
            },

            {
                "extension": ".stl",
                "format": "application/sla"
            },

            {
                "extension": ".stl",
                "format": "application/vnd.ms-pki.stl"
            },

            {
                "extension": ".stl",
                "format": "application/x-navistyle"
            },

            {
                "extension": ".stp",
                "format": "application/step"
            },

            {
                "extension": ".sv4cpio",
                "format": "application/x-sv4cpio"
            },

            {
                "extension": ".sv4crc",
                "format": "application/x-sv4crc"
            },

            {
                "extension": ".svf",
                "format": "image/vnd.dwg"
            },

            {
                "extension": ".svf",
                "format": "image/x-dwg"
            },

            {
                "extension": ".svr",
                "format": "application/x-world"
            },

            {
                "extension": ".svr",
                "format": "x-world/x-svr"
            },

            {
                "extension": ".swf",
                "format": "application/x-shockwave-flash"
            },

            {
                "extension": ".t",
                "format": "application/x-troff"
            },

            {
                "extension": ".talk",
                "format": "text/x-speech"
            },

            {
                "extension": ".tar",
                "format": "application/x-tar"
            },

            {
                "extension": ".tbk",
                "format": "application/toolbook"
            },

            {
                "extension": ".tbk",
                "format": "application/x-tbook"
            },

            {
                "extension": ".tcl",
                "format": "application/x-tcl"
            },

            {
                "extension": ".tcl",
                "format": "text/x-script.tcl"
            },

            {
                "extension": ".tcsh",
                "format": "text/x-script.tcsh"
            },

            {
                "extension": ".tex",
                "format": "application/x-tex"
            },

            {
                "extension": ".texi",
                "format": "application/x-texinfo"
            },

            {
                "extension": ".texinfo",
                "format": "application/x-texinfo"
            },

            {
                "extension": ".text",
                "format": "application/plain"
            },

            {
                "extension": ".text",
                "format": "text/plain"
            },

            {
                "extension": ".tgz",
                "format": "application/gnutar"
            },

            {
                "extension": ".tgz",
                "format": "application/x-compressed"
            },

            {
                "extension": ".tif",
                "format": "image/tiff"
            },

            {
                "extension": ".tif",
                "format": "image/x-tiff"
            },

            {
                "extension": ".tiff",
                "format": "image/tiff"
            },

            {
                "extension": ".tiff",
                "format": "image/x-tiff"
            },

            {
                "extension": ".tr",
                "format": "application/x-troff"
            },

            {
                "extension": ".tsi",
                "format": "audio/tsp-audio"
            },

            {
                "extension": ".tsp",
                "format": "application/dsptype"
            },

            {
                "extension": ".tsp",
                "format": "audio/tsplayer"
            },

            {
                "extension": ".tsv",
                "format": "text/tab-separated-values"
            },

            {
                "extension": ".turbot",
                "format": "image/florian"
            },

            {
                "extension": ".txt",
                "format": "text/plain"
            },

            {
                "extension": ".uil",
                "format": "text/x-uil"
            },

            {
                "extension": ".uni",
                "format": "text/uri-list"
            },

            {
                "extension": ".unis",
                "format": "text/uri-list"
            },

            {
                "extension": ".unv",
                "format": "application/i-deas"
            },

            {
                "extension": ".uri",
                "format": "text/uri-list"
            },

            {
                "extension": ".uris",
                "format": "text/uri-list"
            },

            {
                "extension": ".ustar",
                "format": "application/x-ustar"
            },

            {
                "extension": ".ustar",
                "format": "multipart/x-ustar"
            },

            {
                "extension": ".uu",
                "format": "application/octet-stream"
            },

            {
                "extension": ".uu",
                "format": "text/x-uuencode"
            },

            {
                "extension": ".uue",
                "format": "text/x-uuencode"
            },

            {
                "extension": ".vcd",
                "format": "application/x-cdlink"
            },

            {
                "extension": ".vcs",
                "format": "text/x-vcalendar"
            },

            {
                "extension": ".vda",
                "format": "application/vda"
            },

            {
                "extension": ".vdo",
                "format": "video/vdo"
            },

            {
                "extension": ".vew",
                "format": "application/groupwise"
            },

            {
                "extension": ".viv",
                "format": "video/vivo"
            },

            {
                "extension": ".viv",
                "format": "video/vnd.vivo"
            },

            {
                "extension": ".vivo",
                "format": "video/vivo"
            },

            {
                "extension": ".vivo",
                "format": "video/vnd.vivo"
            },

            {
                "extension": ".vmd",
                "format": "application/vocaltec-media-desc"
            },

            {
                "extension": ".vmf",
                "format": "application/vocaltec-media-file"
            },

            {
                "extension": ".voc",
                "format": "audio/voc"
            },

            {
                "extension": ".voc",
                "format": "audio/x-voc"
            },

            {
                "extension": ".vos",
                "format": "video/vosaic"
            },

            {
                "extension": ".vox",
                "format": "audio/voxware"
            },

            {
                "extension": ".vqe",
                "format": "audio/x-twinvq-plugin"
            },

            {
                "extension": ".vqf",
                "format": "audio/x-twinvq"
            },

            {
                "extension": ".vql",
                "format": "audio/x-twinvq-plugin"
            },

            {
                "extension": ".vrml",
                "format": "application/x-vrml"
            },

            {
                "extension": ".vrml",
                "format": "model/vrml"
            },

            {
                "extension": ".vrml",
                "format": "x-world/x-vrml"
            },

            {
                "extension": ".vrt",
                "format": "x-world/x-vrt"
            },

            {
                "extension": ".vsd",
                "format": "application/x-visio"
            },

            {
                "extension": ".vst",
                "format": "application/x-visio"
            },

            {
                "extension": ".vsw",
                "format": "application/x-visio"
            },

            {
                "extension": ".w60",
                "format": "application/wordperfect6.0"
            },

            {
                "extension": ".w61",
                "format": "application/wordperfect6.1"
            },

            {
                "extension": ".w6w",
                "format": "application/msword"
            },

            {
                "extension": ".wav",
                "format": "audio/wav"
            },

            {
                "extension": ".wav",
                "format": "audio/x-wav"
            },

            {
                "extension": ".wb1",
                "format": "application/x-qpro"
            },

            {
                "extension": ".wbmp",
                "format": "image/vnd.wap.wbmp"
            },

            {
                "extension": ".web",
                "format": "application/vnd.xara"
            },

            {
                "extension": ".wiz",
                "format": "application/msword"
            },

            {
                "extension": ".wk1",
                "format": "application/x-123"
            },

            {
                "extension": ".wmf",
                "format": "windows/metafile"
            },

            {
                "extension": ".wml",
                "format": "text/vnd.wap.wml"
            },

            {
                "extension": ".wmlc",
                "format": "application/vnd.wap.wmlc"
            },

            {
                "extension": ".wmls",
                "format": "text/vnd.wap.wmlscript"
            },

            {
                "extension": ".wmlsc",
                "format": "application/vnd.wap.wmlscriptc"
            },

            {
                "extension": ".word",
                "format": "application/msword"
            },

            {
                "extension": ".wp",
                "format": "application/wordperfect"
            },

            {
                "extension": ".wp5",
                "format": "application/wordperfect"
            },

            {
                "extension": ".wp5",
                "format": "application/wordperfect6.0"
            },

            {
                "extension": ".wp6",
                "format": "application/wordperfect"
            },

            {
                "extension": ".wpd",
                "format": "application/wordperfect"
            },

            {
                "extension": ".wpd",
                "format": "application/x-wpwin"
            },

            {
                "extension": ".wq1",
                "format": "application/x-lotus"
            },

            {
                "extension": ".wri",
                "format": "application/mswrite"
            },

            {
                "extension": ".wri",
                "format": "application/x-wri"
            },

            {
                "extension": ".wrl",
                "format": "application/x-world"
            },

            {
                "extension": ".wrl",
                "format": "model/vrml"
            },

            {
                "extension": ".wrl",
                "format": "x-world/x-vrml"
            },

            {
                "extension": ".wrz",
                "format": "model/vrml"
            },

            {
                "extension": ".wrz",
                "format": "x-world/x-vrml"
            },

            {
                "extension": ".wsc",
                "format": "text/scriplet"
            },

            {
                "extension": ".wsrc",
                "format": "application/x-wais-source"
            },

            {
                "extension": ".wtk",
                "format": "application/x-wintalk"
            },

            {
                "extension": ".xbm",
                "format": "image/x-xbitmap"
            },

            {
                "extension": ".xbm",
                "format": "image/x-xbm"
            },

            {
                "extension": ".xbm",
                "format": "image/xbm"
            },

            {
                "extension": ".xdr",
                "format": "video/x-amt-demorun"
            },

            {
                "extension": ".xgz",
                "format": "xgl/drawing"
            },

            {
                "extension": ".xif",
                "format": "image/vnd.xiff"
            },

            {
                "extension": ".xl",
                "format": "application/excel"
            },

            {
                "extension": ".xla",
                "format": "application/excel"
            },

            {
                "extension": ".xla",
                "format": "application/x-excel"
            },

            {
                "extension": ".xla",
                "format": "application/x-msexcel"
            },

            {
                "extension": ".xlb",
                "format": "application/excel"
            },

            {
                "extension": ".xlb",
                "format": "application/vnd.ms-excel"
            },

            {
                "extension": ".xlb",
                "format": "application/x-excel"
            },

            {
                "extension": ".xlc",
                "format": "application/excel"
            },

            {
                "extension": ".xlc",
                "format": "application/vnd.ms-excel"
            },

            {
                "extension": ".xlc",
                "format": "application/x-excel"
            },

            {
                "extension": ".xld",
                "format": "application/excel"
            },

            {
                "extension": ".xld",
                "format": "application/x-excel"
            },

            {
                "extension": ".xlk",
                "format": "application/excel"
            },

            {
                "extension": ".xlk",
                "format": "application/x-excel"
            },

            {
                "extension": ".xll",
                "format": "application/excel"
            },

            {
                "extension": ".xll",
                "format": "application/vnd.ms-excel"
            },

            {
                "extension": ".xll",
                "format": "application/x-excel"
            },

            {
                "extension": ".xlm",
                "format": "application/excel"
            },

            {
                "extension": ".xlm",
                "format": "application/vnd.ms-excel"
            },

            {
                "extension": ".xlm",
                "format": "application/x-excel"
            },

            {
                "extension": ".xls",
                "format": "application/excel"
            },

            {
                "extension": ".xls",
                "format": "application/vnd.ms-excel"
            },

            {
                "extension": ".xls",
                "format": "application/x-excel"
            },

            {
                "extension": ".xls",
                "format": "application/x-msexcel"
            },

            {
                "extension": ".xlt",
                "format": "application/excel"
            },

            {
                "extension": ".xlt",
                "format": "application/x-excel"
            },

            {
                "extension": ".xlv",
                "format": "application/excel"
            },

            {
                "extension": ".xlv",
                "format": "application/x-excel"
            },

            {
                "extension": ".xlw",
                "format": "application/excel"
            },

            {
                "extension": ".xlw",
                "format": "application/vnd.ms-excel"
            },

            {
                "extension": ".xlw",
                "format": "application/x-excel"
            },

            {
                "extension": ".xlw",
                "format": "application/x-msexcel"
            },

            {
                "extension": ".xm",
                "format": "audio/xm"
            },

            {
                "extension": ".xml",
                "format": "application/xml"
            },

            {
                "extension": ".xml",
                "format": "text/xml"
            },

            {
                "extension": ".xmz",
                "format": "xgl/movie"
            },

            {
                "extension": ".xpix",
                "format": "application/x-vnd.ls-xpix"
            },

            {
                "extension": ".xpm",
                "format": "image/x-xpixmap"
            },

            {
                "extension": ".xpm",
                "format": "image/xpm"
            },

            {
                "extension": ".x-png",
                "format": "image/png"
            },

            {
                "extension": ".xsr",
                "format": "video/x-amt-showrun"
            },

            {
                "extension": ".xwd",
                "format": "image/x-xwd"
            },

            {
                "extension": ".xwd",
                "format": "image/x-xwindowdump"
            },

            {
                "extension": ".xyz",
                "format": "chemical/x-pdb"
            },

            {
                "extension": ".z",
                "format": "application/x-compress"
            },

            {
                "extension": ".z",
                "format": "application/x-compressed"
            },

            {
                "extension": ".zip",
                "format": "application/x-compressed"
            },

            {
                "extension": ".zip",
                "format": "application/x-zip-compressed"
            },

            {
                "extension": ".zip",
                "format": "application/zip"
            },

            {
                "extension": ".zip",
                "format": "multipart/x-zip"
            },

            {
                "extension": ".zoo",
                "format": "application/octet-stream"
            },

            {
                "extension": ".zsh",
                "format": "text/x-script.zsh"
            }
        ]
    }
};

istsos.Procedure = function () {

};

istsos.Procedure.prototype = {

};

istsos.VirtualProcedure = function () {

};

istsos.VirtualProcedure.prototype = {

};





