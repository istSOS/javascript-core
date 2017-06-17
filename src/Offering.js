goog.require('goog.events');
goog.require('goog.events.Event');
goog.require('goog.events.EventTarget');
goog.require('goog.net.XhrIo');
/** istsos.Offering class */
/**
 * @param {String} offeringName
 * @param {String} offeringDescription
 * @param {boolean} active
 * @param {istsos.Date} expirationDate
 * @param {istsos.Service} service
 * @constructor
 */

istsos.Offering = class {
   constructor(options) {
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
   executeRequest(url, eventType, method, opt_data) {
      goog.net.XhrIo.send(url, function(e) {
         istsos.fire(eventType, e.target);
      }, method, opt_data);
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
      this.executeRequest(url, istsos.events.EventType.UPDATE_OFFERING, "PUT", JSON.stringify(this.getOfferingJSON()));
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
      this.executeRequest(url, istsos.events.EventType.DELETE_OFFERING, "DELETE", JSON.stringify(data));
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
      this.executeRequest(url, istsos.events.EventType.MEMBERLIST, "GET");
   }

   /**
    * @fires istsos.Offering#istsos.events.EventType: NONMEMBERLIST
    */
   getNonMemberProcedures() {
      var url = `${this.service.server.getUrl()}wa/istsos/services/${this.service.getServiceJSON()["service"]}/offerings/${this.getOfferingJSON()["name"]}/procedures/operations/nonmemberslist`;
      this.executeRequest(url, istsos.events.EventType.NONMEMBERLIST, "GET");
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
