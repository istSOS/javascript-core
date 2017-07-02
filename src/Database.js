import {HttpAPI } from 'HttpAPI'; 
import {EventEmitter } from 'EventEmitter';

/**
 * istsos.Database
 * 
 * @class
 * @extends istsos.EventEmitter
 */
export var Database = class Database extends EventEmitter {
   /**
    * constructor - instantiates istsos.Database
    * 
    * @param  {Object} options Set of key-value pairs
    * @constructor
    */
   constructor(options) {
      super();
      this.dbname = options.dbname;
      this.host = options.host;
      this.user = options.user;
      this.password = options.password;
      this.port = options.port;
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
    * Get database information from the server
    * 
    * @param  {String} serviceName   Name of the service
    * @param  {istsos.Server} server Instance of istsos.Server class
    * @return {Promise} 
    * @fires  istsos.Database#DATABASE            
    */
   getDb(serviceName, server) {
      var serviceName = (serviceName) ? serviceName : "default";
      var url = `${server.getUrl()}wa/istsos/services/${serviceName}/configsections/connection`;
      
      let config = {};
      if(server.getLoginConfig()) {
         config['headers'] = server.getLoginConfig();
      }
      
      return HttpAPI.get(url, config)
         .then((result) => {
            if (result.success) {
               this.fireEvent('DATABASE', result);
               return result;
            } else {
               throw result.message
            }
         }, (error_message) => {
            throw error_message;
         });
   }

   /**
    * Set database connection parameters
    * 
    * @param {istsos.Server} server  istsos.Server instance
    * @param {istsos.Service} service istsos.Service instance
    * @param {Object} options Set of key-value pairs
    * @return {Promise}
    * @fires istsos.Database#UPDATE_DATABASE
    */
   setDb(server, service, options) {
      this.dbname = options.dbname || this.dbname;
      this.host = options.host || this.host;
      this.password = options.password || this.password;
      this.port = options.port || this.port;
      var serviceName = (service) ? service.getServiceJSON()["service"] : "default";
      
      var url = `${server.getUrl()}wa/istsos/services/${serviceName}/configsections/connection`;
      
      let config = {}
      if(server.getLoginConfig()) {
         config['headers'] = server.getLoginConfig();
      }
      config['data'] = JSON.stringify(this.getDbJSON());

      return HttpAPI.put(url, config)
         .then((result) => {
            if (result.success) {
               this.fireEvent('UPDATE_DATABASE', result);
               return result;
            } else {
               throw result.message
            }

         }, (error_message) => {
            throw error_message;
         });
   }

   /**
    * Validate database status
    * 
    * @param  {istsos.Server} server istsos.Server instance
    * @return {Promise}
    * @fires istsos.Database#VALIDATE_DB
    */
   validateDb(server) {
      var url = `${server.getUrl()}wa/istsos/operations/validatedb`;
      
      let config = {}
      if(server.getLoginConfig()) {
         config['headers'] = server.getLoginConfig();
      }
      config['data'] = JSON.stringify(this.getDbJSON());

      return HttpAPI.post(url, config)
         .then((result) => {
            if (result.success) {
               this.fireEvent('VALIDATE_DB', result);
               return result;
            } else {
               throw result.message
            }

         }, (error_message) => {
            throw error_message;
         });
   }

   /**
    * Get JSON configuration prepared for sending via HTTP request payload
    * 
    * @return {Object}
    */
   getDbJSON() {
      return {
         "dbname": this.dbname,
         "host": this.host,
         "user": this.user,
         "password": this.password,
         "port": this.port.toString(),
      };
   }
}

