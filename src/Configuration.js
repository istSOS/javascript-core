import {HttpAPI } from 'HttpAPI'; 
import {EventEmitter } from 'EventEmitter';

/**
 * @class istsos.Configuration
 */
export var Configuration = class Configuration extends EventEmitter {
   constructor(options) {
      super();
      this.serviceName = (options.serviceName) ? options.serviceName : "default";
      this.serverUrl = options.server.getUrl();
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

   getConf() {
      var url = `${this.serverUrl}wa/istsos/services/${this.serviceName}/configsections`;
      return HttpAPI.get(url)
         .then((result) => {
            if (result.success) {
               this.fireEvent('CONFIGSECTIONS', result);
               return result;
            } else {
               throw result.message
            }
         }, (error_message) => {
            throw error_message;
         });
   }

   getProvider() {
      var url = `${this.serverUrl}wa/istsos/services/${this.serviceName}/configsections/provider`;
      return HttpAPI.get(url)
         .then((result) => {
            if (result.success) {
               this.fireEvent('PROVIDER', result);
               return result;
            } else {
               throw result.message
            }

         }, (error_message) => {
            throw error_message;
         });
   }

   updateProvider(options = {}) {
      // var data = {
      //    "providername": options.providerName || "",
      //    "providersite": options.providerSite || "",
      //    "contactname": options.contactName || "",
      //    "contactposition": options.contactPosition || "",
      //    "contactvoice": options.contactVoice || "",
      //    "contactfax": options.contactFax || "",
      //    "contactemail": options.contactEmail || "",
      //    "contactdeliverypoint": options.contactDeliveryPoint || "",
      //    "contactpostalcode": options.contactPostalCode || "",
      //    "contactcity": options.contactCity || "",
      //    "contactadminarea": options.contactAdminArea || "",
      //    "contactcountry": options.contactCountry || ""
      // };
      var url = `${this.serverUrl}wa/istsos/services/${this.serviceName}/configsections/provider`;
      return HttpAPI.put(url, {
            data: JSON.stringify(options)
         })
         .then((result) => {
            if (result.success) {
               this.fireEvent('UPDATE_PROVIDER', result);
               return result;
            } else {
               throw result.message
            }

         }, (error_message) => {
            throw error_message;
         });
   }

   getIdentification() {
      var url = `${this.serverUrl}wa/istsos/services/${this.serviceName}/configsections/identification`;

      return HttpAPI.put(url)
         .then((result) => {
            if (result.success) {
               this.fireEvent('IDENTIFICATION', result);
               return result;
            } else {
               throw result.message
            }

         }, (error_message) => {
            throw error_message;
         });
   }

   updateIdentification(options = {}) {
      // var data = {
      //    "title": title || "",
      //    "abstract": abstract || "",
      //    "urnversion": urnVersion || "",
      //    "authority": authority || "",
      //    "fees": fees || "",
      //    "keywords": keywords || "",
      //    "accessconstrains": accessConstrains || ""
      // };
      var url = `${this.serverUrl}wa/istsos/services/${this.serviceName}/configsections/identification`;

      return HttpAPI.put(url, {
            data: JSON.stringify(options)
         })
         .then((result) => {
            if (result.success) {
               this.fireEvent('UPDATE_IDENTIFICATION', result);
               return result;
            } else {
               throw result.message
            }

         }, (error_message) => {
            throw error_message;
         });
   }

   getMqtt() {
      var url = `${this.serverUrl}wa/istsos/services/${this.serviceName}/configsections/mqtt`;
      
      return HttpAPI.get(url)
         .then((result) => {
            if (result.success) {
               this.fireEvent('MQTT', result);
               return result;
            } else {
               throw result.message
            }

         }, (error_message) => {
            throw error_message;
         });
   }

   updateMqtt(options = {}) {
      // var data = {
      //    "broker_password": brokerPassword || "",
      //    "broker_user": brokerUser || "",
      //    "broker_topic": brokerTopic || "",
      //    "broker_url": brokerUrl || "",
      //    "broker_port": brokerPort || ""
      // };
      var url = `${this.serverUrl}wa/istsos/services/${this.serviceName}/configsections/mqtt`;
     
      return HttpAPI.put(url, {
            data: JSON.stringify(options)
         })
         .then((result) => {
            if (result.success) {
               this.fireEvent('UPDATE_MQTT', result);
               return result;
            } else {
               throw result.message
            }

         }, (error_message) => {
            throw error_message;
         });
   }

   getCrs() {
      var url = `${this.serverUrl}wa/istsos/services/${this.serviceName}/configsections/geo`;

      return HttpAPI.get(url)
         .then((result) => {
            if (result.success) {
               this.fireEvent('CRS', result);
               return result;
            } else {
               throw result.message
            }

         }, (error_message) => {
            throw error_message;
         });
   }

   updateCrs(options = {}) {
      // var data = {
      //    "zaxisname": z_axis_name || "",
      //    "xaxisname": x_axis_name || "",
      //    "yaxisname": y_axis_name || "",
      //    "allowedepsg": allowedEpsg.toString() || "",
      //    "istsosepsg": istsosEpsg.toString() || ""
      // };
      var url = `${this.serverUrl}wa/istsos/services/${this.serviceName}/configsections/geo`;
      
      return HttpAPI.put(url, {
            data: JSON.stringify(options)
         })
         .then((result) => {
            if (result.success) {
               this.fireEvent('UPDATE_CRS', result);
               return result;
            } else {
               throw result.message
            }

         }, (error_message) => {
            throw error_message;
         });
   }

   getObservationConf() {
      var url = `${this.serverUrl}wa/istsos/services/${this.serviceName}/configsections/getobservation`;

      return HttpAPI.get(url)
         .then((result) => {
            if (result.success) {
               this.fireEvent('OBSERVATION_CONF', result);
               return result;
            } else {
               throw result.message
            }

         }, (error_message) => {
            throw error_message;
         });
   }

   updateObservationConf(options = {}) {
      // var data = {
      //    "correct_qi": correctQi || "",
      //    "stat_qi": statQi || "",
      //    "defaultqi": defaultQi || "",
      //    "aggregatenodataqi": aggregateNoDataQi || "",
      //    "maxgoperiod": maxGoPeriod || "",
      //    "transactional_log": transactionalLog || "",
      //    "aggregatenodata": aggregateNoData || ""
      // };
      var url = `${this.serverUrl}wa/istsos/services/${this.serviceName}/configsections/getobservation`;
      
      return HttpAPI.put(url, {
            data: JSON.stringify(options)
         })
         .then((result) => {
            if (result.success) {
               this.fireEvent('UPDATE_OBSERVATION_CONF', result);
               return result;
            } else {
               throw result.message
            }

         }, (error_message) => {
            throw error_message;
         });
   }

   getProxy() {
      var url = `${this.serverUrl}wa/istsos/services/${this.serviceName}/configsections/serviceurl`;

      return HttpAPI.get(url)
         .then((result) => {
            if (result.success) {
               this.fireEvent('PROXY', result);
               return result;
            } else {
               throw result.message
            }

         }, (error_message) => {
            throw error_message;
         });
   }

   updateProxy(newUrl = "") {
      var data = {
         "url": newUrl || ""
      }
      var url = `${this.serverUrl}wa/istsos/services/${this.serviceName}/configsections/serviceurl`;
      return HttpAPI.put(url, {
            data: JSON.stringify(data)
         })
         .then((result) => {
            if (result.success) {
               this.fireEvent('UPDATE_PROXY', result);
               return result;
            } else {
               throw result.message
            }

         }, (error_message) => {
            throw error_message;
         });
   }

   getEpsgCodes() {
      var url = `${this.serverUrl}wa/istsos/services/${this.serviceName}/epsgs`;

      return HttpAPI.get(url)
         .then((result) => {
            if (result.success) {
               this.fireEvent('EPSG_CODES', result);
               return result;
            } else {
               throw result.message
            }

         }, (error_message) => {
            throw error_message;
         });
   }
}