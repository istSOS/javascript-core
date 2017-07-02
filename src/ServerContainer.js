/**
 * istsos.ServerContainer
 * 
 * @class
 */
export var ServerContainer = class {

   /**
    * constructor - Instantiates istsos.ServerContainer
    *
    * @constructor
    */
   constructor() {
      this.servers = [];
   }

   /**
    * getServer - Get the istsos.Server instance from the list by providing the name of the server
    *
    * @param  {String} name     Name of the server
    * @return {istsos.Server}   istsos.Server instance
    */
   getServer(name) {
      if (!name || typeof name != "string") {
         throw "Parameter must be a string representing the name of the server!"
      }

      for (var s of this.servers) {
         if (s.name === name) {
            return s;
         }
      }
   }

   /**
    * getServers - Get the list of created servers
    *
    * @return {Array<istsos.Server>}  List of istsos.Server instances
    */
   getServers() {
      return this.servers;
   }

   /**
    * addServer - Add istsos.Server instance to the servers list
    *
    * @param  {istsos.Server} server istsos.Server instance
    */
   addServer(server) {
     if (!server || server.constructor != istsos.Server) {
        throw "Parameter must be an instance of istsos.Server class!"
     }
      this.servers.push(server);
   }

   /**
    * removeServer - Remove istsos.Server instance from the list by providing name of the server or istsos.Server instance
    *
    * @param  {istsos.Server|String} server istsos.Server instance or name of the server
    */
   removeServer(server) {
      if (typeof server == "string") {
        for (var s of this.servers) {
          if (s.name === server) {
            this.servers.splice(this.servers.indexOf(s), 1);
            break;
          }
        }
      } else if (server.constructor == istsos.Server){
        this.servers.splice(this.servers.indexOf(server), 1);
      } else {
        throw "Parameter must be a string representing the name of the server or an instance of istsos.Server class!"
      }
   }
}
