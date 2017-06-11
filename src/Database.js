goog.provide('istsos.Database');

goog.require('istsos');
goog.require('istsos.events.EventType')
goog.require('goog.net.XhrIo');

istsos.Database = class {
   constructor(options) {
      this.dbname = options.dbname;
      this.host = options.host;
      this.user = options.user;
      this.password = options.password;
      this.port = options.port;
   }

   executeRequest(url, eventType, method, opt_data) {
      goog.net.XhrIo.send(url, function(e) {
         istsos.fire(eventType, e.target);
      }, method, opt_data);
   }

   getDb(serviceName = 'default', server) {
      var url = `${server.getUrl()}wa/istsos/services/${serviceName}/configsections/connection`
      this.executeRequest(url, istsos.events.EventType.DATABASE, "GET");
   }

   setDb(options) {
      this.dbname = options.dbname || this.dbname;
      this.host = options.host || this.host;
      this.password = options.password || this.password;
      this.port = options.port || this.port;
      var serviceName = (options.opt_service) ? options.opt_service.getServiceJSON()["service"] : "default";
      var url = `${server.getUrl()}wa/istsos/services/${serviceName}/configsections/connection`;
      this.executeRequest(url, istsos.events.EventType.UPDATE_DATABASE, "PUT", JSON.stringify(this.getDbJSON()));
   }

   validateDb(server) {
      var url = `${server.getUrl()}wa/istsos/operations/validatedb`;
      this.executeRequest(url, istsos.events.EventType.VALIDATE_DB, "POST", JSON.stringify(this.getDbJSON()));
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
