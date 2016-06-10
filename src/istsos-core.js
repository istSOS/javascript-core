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
    SYSTEM_TYPES: 'systemTypesReceived'
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
     */
    getServer: function (name) {
        for (i = 0; i < this.servers.length; i++) {
            if (this.servers[i]['serverName'] === name) {
                return this.servers[i];
            }
        }
    },
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
    this.config = opt_config || new istsos.Configuration(null, this.url);
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
     * @param {string} serviceName */
    getService: function (serviceName) {
        var url = this.url + 'wa/istsos/services/' + serviceName;
        this.executeRequest(url, istsos.events.EventType.SERVICE, 'GET');
    },
    /**
     * @param {istsos.Service|Object} service */
    addService: function (service) {
        this.services.push(service);
    },
    /**
     * @param {string} serviceName
     * @param {istsos.Database|Object} db
     * @param {istsos.Configuration|Object} config
     * @param {int} opt_epsg
     */
    createService: function (serviceName, db, config, opt_epsg) {
        var database = db || this.defaultDb;
        var newService = new istsos.Service(this.url, serviceName, database, config, opt_epsg);
        this.addService(newService);
        var url = this.url + 'wa/istsos/services';
        this.executeRequest(url, istsos.events.EventType.NEW_SERVICE, 'POST', newService.getServiceObject());
    },
    /**
     * @param {string} serviceName
     */
    deleteService: function (serviceName) {
        var i;
        for (i = 0; i < this.services.length; i++) {
            if (this.services[i]['serviceName'] === serviceName) {
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
     * @returns {Array}
     */
    getServicesList: function () {
        return this.services
    },
    getServices: function () {
        var url = this.url + 'wa/istsos/services';
        this.executeRequest(url, istsos.events.EventType.SERVICES, 'GET');
    },
    getDefaultDb: function () {
        this.defaultDb.getDb('default', this.url);
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
     * @param {string} serverUrl
     */
    getDb: function (serviceName, serverUrl) {
        var sname = 'default' || serviceName;
        var url = serverUrl + 'wa/istsos/services/' + sname + '/configsections/connection';
        this.executeRequest(url, istsos.events.EventType.DATABASE, 'GET');
    },
    /**
     * @param {string} dbname
     * @param {string} host
     * @param {string} user
     * @param {string} password
     * @param {int} port
     */
    setDb: function (dbname, host, user, password, port) {
        var newDbConf = {
            "user": user,
            "password": password,
            "host": host,
            "port": port,
            "dbname": dbname
        };
        var sname = 'default' || service;
        var url = serverUrl + 'wa/istsos/services/' + sname + '/connection';
        this.executeRequest(url, 'PUT', newDbConf);
        this.dbConf = newDbConf;
    },
    validateDb: function () {
        var url = serverUrl + 'wa/istsos/operations/validatedb';
        this.executeRequest(url, istsos.events.EventType.VALIDATE_DB, 'POST', this.dbConf);
    },
    getDbObject: function () {
        return this.dbConf;
    }
};

/** istsos.Configuration class */

/**
 * @param {string} serviceName
 * @param {string} serverUrl
 * @constructor
 */
istsos.Configuration = function (serviceName, serverUrl) {
    this.sname = serviceName || 'default';
    this.serverUrl = serverUrl;
};
//methods - SOLVE PUT REQUESTS
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
     * @param {string} contactVoice
     * @param {string} contactFax
     * @param {string} contactEmail
     * @param {string} contactDeliveryPoint
     * @param {string}  contactPostalCode
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
 * @param {string} serverUrl
 * @param {string} serviceName
 * @param {istsos.Database|Object} opt_db
 * @param {istsos.Configuration|Object} opt_config
 * @param {int} opt_epsg
 * @constructor
 */
istsos.Service = function (serverUrl, serviceName, opt_db, opt_config, opt_epsg) {
    this.serviceObject = {
        "service":serviceName
    };
    if(opt_epsg && opt_db) {
        this.serviceObject["epsg"] = opt_epsg;
        this.serviceObject["dbname"] = opt_db["dbname"];
        this.serviceObject["host"] = opt_db["host"];
        this.serviceObject["user"] = opt_db["user"];
        this.serviceObject["password"] = opt_db["password"];
        this.serviceObject["port"] = opt_db["port"];
    } else if (opt_epsg) {
        this.serviceObject["epsg"] = opt_epsg;
    } else if (opt_db) {
        this.serviceObject["dbname"] = opt_db["dbname"];
        this.serviceObject["host"] = opt_db["host"];
        this.serviceObject["user"] = opt_db["user"];
        this.serviceObject["password"] = opt_db["password"];
        this.serviceObject["port"] = opt_db["port"];
    }
    this.database = opt_db;
    this.config = opt_config || new istsos.Configuration(this.serviceName, serverUrl); // configsections
    this.offerings = [];
    this.procedures = [];
    this.virtualProcedures = [];
    this.observedProperties = [];
    this.uom = [];
    this.dataQualities = [];

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
    addOffering: '',
    addProcedure: '',
    addObservedProperty: '',
    addUnitOfMeasure: '',
    addDataQualityIndex: '',
    getSystemTypes: function () {
        var url = this.serverUrl + 'wa/istsos/services/' + this.serviceObject['service'] + '/systemtypes';
        this.executeRequest(url, istsos.events.EventType.SYSTEM_TYPES, 'GET');
    },
    getDatabase: ''
};






