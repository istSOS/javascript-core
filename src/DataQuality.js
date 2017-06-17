goog.require('goog.events');
goog.require('goog.events.Event');
goog.require('goog.events.EventTarget');
goog.require('goog.net.XhrIo');
/** istsos.DataQuality class */
/**
 * @param {istsos.Service} service
 * @param {int} codeDQ
 * @param {String} nameDQ
 * @param {String} descrDQ
 * @constructor
 */
istsos.DataQuality = class {
   constructor(options) {
      this.code = options.codeDQ;
      this.name = options.nameDQ;
      this.description = options.descrDQ || "";
      this.service = options.service;
      service.addDataQuality(this);
   }

   executeRequest(url, eventType, method, opt_data) {
      goog.net.XhrIo.send(url, function(e) {
         istsos.fire(eventType, e.target);
      }, method, opt_data);
   }

   /**
    * @returns {JSON}
    */
   getDataQualityJSON() {
      var dqJSON = {
         "code": this.code.toString(),
         "name": this.name,
         "description": this.description
      };
      return dqJSON;
   }

   /**
    * @fires istsos.DataQuality#istsos.events.EventType: UPDATE_DATAQUALITY
    * @param {int} newCodeDQ
    * @param {String} newNameDQ
    * @param {String} newDescrDQ
    */
   updateDataQuality(options) {
      const oldName = this.code;
      this.code = options.newCodeDQ || this.code;
      this.name = options.newNameDQ || this.name;
      this.description = options.newDescrDQ || this.description;

      var url = `${this.service.server.getUrl()}wa/istsos/services/${this.service.getServiceJSON()["service"]}/dataqualities/${oldName}`;
      this.executeRequest(url, istsos.events.EventType.UPDATE_DATAQUALITY, "PUT", JSON.stringify(this.getDataQualityJSON()));
   }

   /**
    * @fires istsos.DataQuality#istsos.events.EventType: DELETE_DATAQUALITY
    */
   deleteDataQuality() {
      var dataQualities = this.service.getDataQualitiesProperty();
      for (var i = 0; i < dataQualities.length; i++) {
         if (this.code === dataQualities[i]["code"]) {
            dataQualities.splice(i, 1);
         }
      }

      var url = `${this.service.server.getUrl()}wa/istsos/services/${this.service.getServiceJSON()["service"]}/dataqualities/${this.getDataQualityJSON()["code"]}`;
      this.executeRequest(url, istsos.events.EventType.DELETE_DATAQUALITY, "DELETE", JSON.stringify(this.getDataQualityJSON()));
   }

}