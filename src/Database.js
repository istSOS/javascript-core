import {HttpAPI } from 'HttpAPI'; 
import {EventEmitter } from 'EventEmitter';

/**
 * @class istsos.Database
 */
export var Database = class Database extends EventEmitter {
   constructor(options) {
      super();
      this.dbname = options.dbname;
      this.host = options.host;
      this.user = options.user;
      this.password = options.password;
      this.port = options.port;
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

   getDb(serviceName = 'default', server) {
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

