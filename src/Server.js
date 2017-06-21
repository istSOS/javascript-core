import {Configuration} from 'Configuration';
import {HttpAPI } from 'HttpAPI'; 
import {EventEmitter } from 'EventEmitter';

/** istsos.Server class */
/**
 * @param {String} serverName
 * @param {String} url
 * @param {istsos.Database} defaultDb
 * @param {istsos.Configuration} opt_config
 * @constructor
 */
export var Server = class Server extends EventEmitter {
	constructor(options) {
		super()
		this.name = options.name;
		this.url = (options.url.charAt(options.url.length - 1) === "/") ? options.url : options.url + "/";
		this.defaultDb = options.defaultDb;
		this.config = options.opt_config || new Configuration({
			serviceName: null,
			server: this
		});
		this.loginConfig = null;
		this.services = [];
	}

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

   setLoginConfig(username, password) {
      let loginStr = `${username}:${password}`
      this.loginConfig = {
         Authorization: `Basic ${btoa(loginStr)}`
      }
   }

	removeLoginConfig() {
		this.loginConfig = null;
	}

	getLoginConfig() {
		return this.loginConfig;
	}

	/**
	 * @fires istsos.Server#istsos.events.EventType: SERVICE
	 * @param {istsos.Service} service
	 */
	getService(service) {
		var url = `${this.url}wa/istsos/services/${service.name}`;

      let config = {};
      if(this.getLoginConfig()) {
         config['headers'] = this.getLoginConfig();
      }
      
      return HttpAPI.get(url, config)
         .then((result) => {
            if (result.success) {
               this.fireEvent('SERVICE', result);
               return result;
            } else {
               throw result.message
            }
         }, (error_message) => {
            throw error_message;
         });
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
		
		let config = {};
      if(this.getLoginConfig()) {
         config['headers'] = this.getLoginConfig();
      }
      config['data'] = JSON.stringify(service.getServiceJSON());

      return HttpAPI.post(url, config)
         .then((result) => {
            if (result.success) {
               this.fireEvent('NEW_SERVICE', result);
               return result;
            } else {
               throw result.message
            }
         }, (error_message) => {
            throw error_message;
         });
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
		
		let config = {};
      if(this.getLoginConfig()) {
         config['headers'] = this.getLoginConfig();
      }
      config['data'] = JSON.stringify({'name': service.name});

      return HttpAPI.delete(url, config)
         .then((result) => {
            if (result.success) {
               this.fireEvent('DELETE_SERVICE', result);
               return result;
            } else {
               throw result.message
            }
         }, (error_message) => {
            throw error_message;
         });
	}

	/**
	 * @fires istsos.Service#istsos.events.EventType: STATUS
	 */
	getStatus() {
		var url = `${this.url}wa/istsos/operations/status`;
		this.executeRequest(url, 'STATUS', "GET");

		let config = {};
      if(this.getLoginConfig()) {
         config['headers'] = this.getLoginConfig();
      }

      return HttpAPI.delete(url, config)
         .then((result) => {
            if (result.success) {
               this.fireEvent('STATUS', result);
               return result;
            } else {
               throw result.message
            }
         }, (error_message) => {
            throw error_message;
         });
	}

	/**
	 * @fires istsos.Service#istsos.events.EventType: ABOUT
	 */
	getAboutInfo() {
		var url = `${this.url}wa/istsos/operations/about`;

		let config = {};
      if(this.getLoginConfig()) {
         config['headers'] = this.getLoginConfig();
      }

      return HttpAPI.delete(url, config)
         .then((result) => {
            if (result.success) {
               this.fireEvent('ABOUT', result);
               return result;
            } else {
               throw result.message
            }
         }, (error_message) => {
            throw error_message;
         });
	}

	/**
	 * @fires istsos.Configuration#istsos.events.EventType: CONFIGURATION
	 */
	getConfig() {
		return this.config.getConf();
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
		this.executeRequest(url, 'SERVICES', "GET");

		let config = {};
      if(this.getLoginConfig()) {
         config['headers'] = this.getLoginConfig();
      }

      return HttpAPI.delete(url, config)
         .then((result) => {
            if (result.success) {
               this.fireEvent('SERVICES', result);
               return result;
            } else {
               throw result.message
            }
         }, (error_message) => {
            throw error_message;
         });
	}

	/**
	 * @fires istsos.Database#istsos.events.EventType: DATABASE
	 */
	getDefaultDb() {
		return this.defaultDb.getDb("default", this);
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