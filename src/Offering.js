import {HttpAPI } from 'HttpAPI'; 
import {EventEmitter } from 'EventEmitter';
/**
 * istsos.Offering
 * 
 * @class
 * @extends istsos.EventEmitter
 */
export var Offering = class Offering extends EventEmitter {
   /**
    * constructor - instantiates istsos.Offering
    * 
    * @param  {Object} options Set of key-value pairs
    * @constructor
    */
   constructor(options) {
      super();
      this.offeringName = options.offeringName;
      this.offeringDescription = options.offeringDescription || "";
      this.active = options.active || false;
      this.expirationDate = (options.expirationDate && options.expirationDate.constructor === istsos.Date) ? options.expirationDate.getDateString() : "";
      this.service = options.service;
      this.memberProcedures = [];
      options.service.addOffering(this);
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
    * Add instance of istsos.Procedure or istsos.VirtualProcedure to the list of members
    * 
    * @param {istsos.Procedure|istsos.VirtualProcedure} procedure
    */
   addProcedure(procedure) {
      this.memberProcedures.push(procedure);
   }

   /**
    * Update provider information on the server
    *
    * @param {object} options Set of key-value pairs
    * @return {Promise} 
    * @fires  istsos.Offering#UPDATE_OFFERING            
    */
   updateOffering(options) {
      const oldOfferingName = this.offeringName;
      this.offeringName = options.newName || this.offeringName
      this.offeringDescription = options.newDescription || this.offeringDescription;
      this.active = options.newActive || this.active;
      this.expirationDate = options.newExpirationDate || this.expirationDate;

      var url = `${this.service.server.getUrl()}wa/istsos/services/${this.service.getServiceJSON()["service"]}/offerings/${oldOfferingName}`

      let config = {};
      if (this.service.server.getLoginConfig()) {
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
    * Delete offering from the server
    *
    * @return {Promise} 
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
      if (this.service.server.getLoginConfig()) {
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
    * Get list of member procedures or/and virtual procedures
    * 
    * @return {Array<istsos.Procedure|istsos.VirtualProcedure>}
    */
   getMemberProceduresProperty() {
      return this.memberProcedures;
   }

   /**
    * Get member procedures or/and virtual procedures from the server.
    * 
    * @fires istsos.Offering#istsos.events.EventType: MEMBERLIST
    */
   getMemberProcedures() {
      var url = `${this.service.server.getUrl()}wa/istsos/services/${this.service.getServiceJSON()["service"]}/offerings/${this.getOfferingJSON()["name"]}/procedures/operations/memberslist`;

      let config = {};
      if (this.service.server.getLoginConfig()) {
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
    * Get non-member procedures or/and virtual procedures from the server.
    * 
    * @fires istsos.Offering#istsos.events.EventType: NONMEMBERLIST
    */
   getNonMemberProcedures() {
      var url = `${this.service.server.getUrl()}wa/istsos/services/${this.service.getServiceJSON()["service"]}/offerings/${this.getOfferingJSON()["name"]}/procedures/operations/nonmemberslist`;

      let config = {};
      if (this.service.server.getLoginConfig()) {
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
    * Get JSON configuration prepared for sending as a HTTP request payload
    * 
    * @returns {Object}
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