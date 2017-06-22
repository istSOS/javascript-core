import {HttpAPI } from 'HttpAPI'; 
import {EventEmitter } from 'EventEmitter';
/** istsos.Offering class */
/**
 * @param {String} offeringName
 * @param {String} offeringDescription
 * @param {boolean} active
 * @param {istsos.Date} expirationDate
 * @param {istsos.Service} service
 * @constructor
 */

export var Offering = class Offering extends EventEmitter {
   constructor(options) {
   	super();
      this.offeringName = options.offeringName;
      this.offeringDescription = options.offeringDescription || "";
      this.active = options.active || false;
      this.expirationDate = (options.expirationDate && options.expirationDate.constructor === istsos.Date) ? options.expirationDate.getDateString() : "";
      this.service = options.service;
      this.memberProcedures = [];
      service.addOffering(this);
   }

   /**
    * @param {String} url
    * @param {istsos.events.EventType} eventType
    * @param {String} method
    * @param {JSON} opt_data
    */

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

   /**
    * @param {istsos.Procedure|istsos.VirtualProcedure} procedure
    */
   addProcedure(procedure) {
      this.memberProcedures.push(procedure);
   }

   /**
    * @fires istsos.Offering#istsos.events.EventType: UPDATE_OFFFERING
    * @param {String} newName
    * @param {String} newDescription
    * @param {boolean} newActive
    * @param {istsos.Date} newExpirationDate
    */
   updateOffering(options) {
      const oldOfferingName = this.offeringName;
      this.offeringName = options.newName || this.offeringName
      this.offeringDescription = options.newDescription || this.offeringDescription;
      this.active = options.newActive || this.active;
      this.expirationDate = options.newExpirationDate || this.expirationDate;

      var url = `${this.service.server.getUrl()}wa/istsos/services/${this.service.getServiceJSON()["service"]}/offerings/${oldOfferingName}`
   	
      let config = {};
      if(this.service.server.getLoginConfig()) {
         config['headers'] = this.service.server.getLoginConfig();
      }
      config['data'] = JSON.stringify(this.getUomJSON());

      return HttpAPI.put(url, config)
         .then((result) => {
            if (result.success) {
               this.fireEvent('UPDATE_OFFERING', result);
               return result;
            } else {
               throw result.message
            }
         }, (error_message) => {
            throw error_message;
         });
   }

   /**
    * @fires istsos.Offering#istsos.events.EventType: DELETE_OFFERING
    */
   deleteOffering() {
      for (var i = 0; i < this.service.getOfferingsProperty().length; i++) {
         if (this.offeringName === this.service.getOfferingsProperty()[i]["name"]) {
            this.service.getOfferingsProperty().splice(i, 1);
         }
      }
      var url = `${this.service.server.getUrl()}wa/istsos/services/${this.service.getServiceJSON()["service"]}/offerings/${this.getOfferingJSON()["name"]}`;

      var data = {
         "name": this.getOfferingJSON()["name"],
         "description": this.getOfferingJSON()["description"]
      };

      let config = {};
      if(this.service.server.getLoginConfig()) {
         config['headers'] = this.service.server.getLoginConfig();
      }
      config['data'] = JSON.stringify(data);

      return HttpAPI.delete(url, config)
         .then((result) => {
            if (result.success) {
               this.fireEvent('DELETE_OFFERING', result);
               return result;
            } else {
               throw result.message
            }
         }, (error_message) => {
            throw error_message;
         });
   }

   /**
    * @returns {Array<istsos.Procedure|istsos.VirtualProcedure>}
    */
   getMemberProceduresProperty() {
      return this.memberProcedures;
   }

   /**
    * @fires istsos.Offering#istsos.events.EventType: MEMBERLIST
    */
   getMemberProcedures() {
      var url = `${this.service.server.getUrl()}wa/istsos/services/${this.service.getServiceJSON()["service"]}/offerings/${this.getOfferingJSON()["name"]}/procedures/operations/memberslist`;
      
      let config = {};
      if(this.service.server.getLoginConfig()) {
         config['headers'] = this.service.server.getLoginConfig();
      }

      return HttpAPI.get(url, config)
         .then((result) => {
            if (result.success) {
               this.fireEvent('MEMBERLIST', result);
               return result;
            } else {
               throw result.message
            }
         }, (error_message) => {
            throw error_message;
         });
   }

   /**
    * @fires istsos.Offering#istsos.events.EventType: NONMEMBERLIST
    */
   getNonMemberProcedures() {
      var url = `${this.service.server.getUrl()}wa/istsos/services/${this.service.getServiceJSON()["service"]}/offerings/${this.getOfferingJSON()["name"]}/procedures/operations/nonmemberslist`;
               
      let config = {};
      if(this.service.server.getLoginConfig()) {
         config['headers'] = this.service.server.getLoginConfig();
      }

      return HttpAPI.get(url, config)
         .then((result) => {
            if (result.success) {
               this.fireEvent('NONMEMBERLIST', result);
               return result;
            } else {
               throw result.message
            }
         }, (error_message) => {
            throw error_message;
         });
   }

   /**
    * @returns {JSON}
    */
   getOfferingJSON() {
      var offeringJSON = {
         "name": this.offeringName,
         "description": this.offeringDescription,
         "expiration": this.expirationDate
      };
      if (this.active === true) {
         offeringJSON["active"] = "on"
      }
      return offeringJSON;
   }
}