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
    NONMEMBERLIST: 'nonmemberlistReceived'
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
    getDefaultDbProperty: function () {
        return this.defaultDb;
    },
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
     */
    setDb: function (dbname, host, user, password, port, server, service) {
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
    validateDb: function (server) {
        var url = server.getUrl() + 'wa/istsos/operations/validatedb';
        this.executeRequest(url, istsos.events.EventType.VALIDATE_DB, 'POST', this.dbConf);
    },
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
    this.config = opt_config || new istsos.Configuration(this.serviceObject["service"], server); // configsections
    this.server = server;
    this.offerings = [];
    this.procedures = [];
    this.virtualProcedures = [];
    this.observedProperties = [];
    this.uom = [];
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
    addOffering: function(offering) {
        this.offerings.push(offering);
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

    addObservedProperty: '',
    registerObservedProperty: '',
    getObservedProperties: '',
    getObservedProperty: '',

    addUom: '',
    registerUom: '',
    getUoms: '',

    addDataQualityIndex: '',
    registerDataQualityIndex: '',
    getDataQualities: '',

    getSystemTypes: function () {
        var url = this.server.getUrl() + 'wa/istsos/services/' + this.serviceObject['service'] + '/systemtypes';
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
 * @param {int} year
 * @param {int} month
 * @param {int} day
 * @param {int} hours
 * @param {int} minutes
 * @param {int} seconds
 * @param {int} gmt
 * @constructor
 */
istsos.Date = function (year, month, day, hours, minutes, seconds, gmt) {
    this.year = year.toString();
    this.month = month.toString();
    this.day = day.toString();
    this.hours = hours.toString();
    this.minutes = minutes.toString();
    this.seconds = seconds.toString();
    this.gmt = (gmt > 9) ? gmt.toString() : '0' + gmt.toString();
};

istsos.Date.prototype = {
    /**
     * @returns {string}
     */
    getDateString: function () {
        var date = this.year + '-' + this.month + '-' + this.day + 'T' +
                    this.hours + ':' + this.minutes + ':' + this.seconds + '+' +
                    this.gmt + ':' + '00';
        return date;
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
     * @param {string} newName
     * @param {string} newDescription
     * @param {boolean} newActive
     * @param {istsos.Date|Object} newExpirationDate
     */
    addProcedure: function (procedure) {
        this.memberProcedures.push(procedure);
    },
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

istsos.ObservedProperty = function () {
    
};

istsos.ObservedProperty.prototype = {
    updateObservedProperty: '',
    deleteObservedProperty: ''
};


/** istsos.DataQuality class */

istsos.DataQuality = function () {

};

istsos.DataQuality.prototype = {
    updateDataQualityIndex: '',
    deleteDataQualityIndex: ''
};


/** istsos.UnitOfMeasure  class */

istsos.UnitOfMeasure  = function () {

};

istsos.UnitOfMeasure .prototype = {
    updateUom: '',
    deleteUom: ''
};





