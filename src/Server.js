goog.require('goog.events');
goog.require('goog.events.Event');
goog.require('goog.events.EventTarget');
goog.require('goog.net.XhrIo');

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
            var obj = e.target.getResponseJson();
            console.log(obj);
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
        console.log(service.getServiceJSON())
        this.executeRequest(url, istsos.events.EventType.NEW_SERVICE, 'POST', JSON.stringify(service.getServiceJSON()));
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
        var url = this.url + 'wa/istsos/services/' + service.serviceName;
        this.executeRequest(url, istsos.events.EventType.DELETE_SERVICE, 'DELETE', JSON.stringify({"name": service.serviceName}));
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
