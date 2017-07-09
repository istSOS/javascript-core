import {Configuration} from 'Configuration';
import {HttpAPI } from 'HttpAPI'; 
import {EventEmitter } from 'EventEmitter';

/**
 * istsos.Server
 * 
 * @class
 * @extends istsos.EventEmitter
 */
export var Server = class Server extends EventEmitter {
	/**
    * constructor - instantiates istsos.Server
    * 
    * @param  {Object} options Set of key-value pairs
    * @constructor
    */
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

   /**
    * Fire event with data - event must match one of the supported event types from istsos.EventTypes
    * 
    * @param  {String} eventType Type of event from istsos.EventTypes
    * @param  {Object|*} response  Data to be passed to a handler
    */
   fireEvent(eventType, response) {
      super.fire(eventType, response)
   }

   /**
    * Add event listener
    * 
    * @param  {String}   event    Event must match one of the supported event types from istsos.EventTypes
    * @param  {Function} callback Handler function
    */
   on(event, callback) {
      super.on(event, callback);
   }

   /**
    * Add event listener, that will listen only once.
    * 
    * @param  {String}   event    Event must match one of the supported event types from istsos.EventTypes
    * @param  {Function} callback Handler function
    */
   once(event, callback) {
      super.once(event, callback);
   }

   /**
    * Remove event listener
    * 
    * @param  {String}   event    Event must match one of the supported event types from istsos.EventTypes
    * @param  {Function} callback Handler function
    */
   off(event, callback) {
      super.off(event, callback);
   }

   /**
    * Remove all event listeners
    */
   unlistenAll() {
      super.unlistenAll();
   }

   /**
    * Set login connection parameters
    * 
    * @param {String} username Username
    * @param {String} password Password
    */
   setLoginConfig(username, password) {
      let loginStr = `${username}:${password}`;
      let base64 = new Buffer(loginStr).toString('base64')
      this.loginConfig = {
         Authorization: `Basic ${base64}`
      }
   }

   /**
    * Remove login configuration
    */
	removeLoginConfig() {
		this.loginConfig = null;
	}

	/**
	 * Get login configuration object
	 * 
	 * @return {Object}
	 */
	getLoginConfig() {
		return this.loginConfig;
	}

	/**
	 *	Get service information from the server
	 * 
	 * @param {String} serviceName Name of the service
	 * @return {Promise}
	 * @fires istsos.Server#SERVICE
	 */
	getService(serviceName) {
		var url = `${this.url}wa/istsos/services/${serviceName}`;

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
	 * Add istsos.Service instance to the list of services
	 * 
	 * @param {istsos.Service} service istsos.Service instance
	 */
	addService(service) {
		this.services.push(service);
	}

	/**
	 * Register new service on the server
	 * 
	 * @param {istsos.Service} service istsos.Service instance
	 * @return {Promise}
	 * @fires istsos.Server#NEW_SERVICE
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
	 * Remove service from the server
	 * 
	 * @param {istsos.Service} service istsos.Service instance
	 * @return {Promise}
	 * @fires istsos.Server#DELETE_SERVICE
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
	 * Get server status
	 * 
	 * @return {Promise}
	 * @fires istsos.Server#STATUS
	 */
	getStatus() {
		var url = `${this.url}wa/istsos/operations/status`;

		let config = {};
      if(this.getLoginConfig()) {
         config['headers'] = this.getLoginConfig();
      }

      return HttpAPI.get(url, config)
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
	 * Get information about the server
	 * 
	 * @return {Promise}
	 * @fires istsos.Server#ABOUT
	 */
	getAboutInfo() {
		var url = `${this.url}wa/istsos/operations/about`;

		let config = {};
      if(this.getLoginConfig()) {
         config['headers'] = this.getLoginConfig();
      }

      return HttpAPI.get(url, config)
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
	 * Get configuration information from the server
	 * 
	 * @return {Promise}
	 * @fires istsos.Configuration#CONFIGURATION
	 */
	getConfig() {
		return this.config.getConf();
	}

	/**
	 * Get configuration property
	 * 
	 * @return {istsos.Configuration}
	 */
	getConfigProperty() {
		return this.config;
	}

	/**
	 *	Get list of services
	 * 
	 * @return{Array<istsos.Service>}
	 */
	getServicesProperty() {
		return this.services
	}

	/**
	 * Get services from the server
	 * 
	 * @return {Promise}
	 * @fires istsos.Server#SERVICES
	 */
	getServices() {
		var url = `${this.url}wa/istsos/services`;

		let config = {};
      if(this.getLoginConfig()) {
         config['headers'] = this.getLoginConfig();
      }

      return HttpAPI.get(url, config)
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
	 * Get default database information from the server
	 * 
	 * @return {Promise}
	 * @fires istsos.Database#DATABASE
	 */
	getDefaultDb() {
		return this.defaultDb.getDb("default", this);
	}

	/**
	 *	Get default database property
	 * 
	 * @return {istsos.Database}
	 */
	getDefaultDbProperty() {
		return this.defaultDb;
	}

	/**
	 *	Get URL of the server
	 * 
	 * @return {String}
	 */
	getUrl() {
		return this.url;
	}
}