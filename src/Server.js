goog.provide("istsos.Server");
goog.require("istsos.Configuration");
goog.require("goog.net.XhrIo");
goog.require("istsos.events.EventType")

/** istsos.Server class */
/**
 * @param {String} serverName
 * @param {String} url
 * @param {istsos.Database} defaultDb
 * @param {istsos.Configuration} opt_config
 * @param {JSON} opt_loginConfig
 * @constructor
 */
istsos.Server = class {
   constructor(options) {
      this.name = options.name;
      this.url = (otpions.url.charAt(otpions.url.length - 1) === "/") ? otpions.url : otpions.url + "/";
      this.defaultDb = otpions.defaultDb;
      this.config = otpions.opt_config || new istsos.Configuration({
         serviceName: null,
         server: this
      });
      this.loginConfig = otpions.opt_loginConfig || {};
      this.services = [];
      this.login();
   }

   /**
    * @param {String} url
    * @param {istsos.events.EventType} eventType
    * @param {String} method
    * @param {JSON} opt_data
    */
   executeRequest(url, eventType, method, opt_data) {
      goog.net.XhrIo.send(url, function(e) {
         istsos.fire(eventType, e.target);
      }, method, opt_data);
   }

   login() {
      var authStr = `${this.loginConfig.user}:${this.loginConfig.password}@`;
      var url = this.url.match(/http:/gi) ? [this.url.slice(0, 7), authStr, this.url.slice(7), "wa/istsos/operations/status"].join("") : `http://${authStr}${this.url}wa/istsos/operations/status`;
      this.executeRequest(url, istsos.events.EventType.LOGIN, "GET");
   }

   /**
    * @fires istsos.Server#istsos.events.EventType: SERVICE
    * @param {istsos.Service} service
    */
   getService(service) {
      var url = `${this.url}wa/istsos/services/${service.name}`;
      this.executeRequest(url, istsos.events.EventType.SERVICE, "GET");
   }

   /**
    * @param {istsos.Service} service
    */
   addService(service) {
      this.services.push(service);
   }

   /**
    * @fires istsos.Service#istsos.events.EventType: NEW_SERVICE
    * @param {istsos.Service} service
    */
   registerService(service) {
      var url = `${this.getUrl()}wa/istsos/services`;
      this.executeRequest(url, istsos.events.EventType.NEW_SERVICE, "POST", JSON.stringify(service.getServiceJSON()));
   }

   /**
    * @fires istsos.Service#istsos.events.EventType: DELETE_SERVICE
    * @param {istsos.Service} service
    */
   deleteService(service) {
      for (var i = 0; i < this.services.length; i++) {
         if (this.services[i].getServiceJSON()["service"] === service.getServiceJSON()["service"]) {
            this.services.splice(i, 1);
         }
      }
      var url = `${this.url}wa/istsos/services/${service.name}`;
      this.executeRequest(url, istsos.events.EventType.DELETE_SERVICE, "DELETE", JSON.stringify({
         "name": service.name
      }));
   }

   /**
    * @fires istsos.Service#istsos.events.EventType: STATUS
    */
   getStatus() {
      var url = `${this.url}wa/istsos/operations/status`;
      this.executeRequest(url, istsos.events.EventType.STATUS, "GET");
   }

   /**
    * @fires istsos.Service#istsos.events.EventType: ABOUT
    */
   getAboutInfo() {
      var url = `${this.url}wa/istsos/operations/about`;
      this.executeRequest(url, istsos.events.EventType.ABOUT, "GET");
   }

   /**
    * @fires istsos.Configuration#istsos.events.EventType: CONFIGURATION
    */
   getConfig() {
      this.config.getConf();
   }

   /**
    * @returns {istsos.Configuration}
    */
   getConfigProperty() {
      return this.config;
   }

   /**
    * @returns {Array<istsos.Service>}
    */
   getServicesProperty() {
      return this.services
   }

   /**
    * @fires istsos.Service#istsos.events.EventType: SERVICES
    */
   getServices() {
      var url = `${this.url}wa/istsos/services`;
      this.executeRequest(url, istsos.events.EventType.SERVICES, "GET");
   }

   /**
    * @fires istsos.Database#istsos.events.EventType: DATABASE
    */
   getDefaultDb() {
      this.defaultDb.getDb("default", this);
   }

   /**
    * @returns {istsos.Database}
    */
   getDefaultDbProperty() {
      return this.defaultDb;
   }

   /**
    * @returns {String}
    */
   getUrl() {
      return this.url;
   }
}