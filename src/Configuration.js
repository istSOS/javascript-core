goog.provide('istsos.Configuration');

goog.require('istsos');
goog.require('istsos.events.EventType');
goog.require('goog.net.XhrIo');

istsos.Configuration = class {
   constructor(options) {
      this.serviceName = (options.serviceName) ? options.serviceName : "default";
      this.serverUrl = options.server.getUrl();
   }

   executeRequest(url, eventType, method, opt_data) {
      goog.net.XhrIo.send(url, function(e) {
         istsos.fire(eventType, e.target);
      }, method, opt_data);
   }

   getConf() {
      var url = `${this.serverUrl}wa/istsos/services/${this.serviceName}/configsections`;
      this.executeRequest(url, istsos.events.EventType.CONFIGSECTIONS, "GET");
   }

   getProvider() {
      var url = `${this.serverUrl}wa/istsos/services/${this.serviceName}/configsections/provider`;
      this.executeRequest(url, istsos.events.EventType.PROVIDER, "GET");
   }

   updateProvider(options) {
      // var data = {
      //    "providername": providerName || "",
      //    "providersite": providerSite || "",
      //    "contactname": contactName || "",
      //    "contactposition": contactPosition || "",
      //    "contactvoice": contactVoice || "",
      //    "contactfax": contactFax || "",
      //    "contactemail": contactEmail || "",
      //    "contactdeliverypoint": contactDeliveryPoint || "",
      //    "contactpostalcode": contactPostalCode || "",
      //    "contactcity": contactCity || "",
      //    "contactadminarea": contactAdminArea || "",
      //    "contactcountry": contactCountry || ""
      // };
      var url = `${this.serverUrl}wa/istsos/services/${this.serviceName}/configsections/provider`;
      this.executeRequest(url, istsos.events.EventType.UPDATE_PROVIDER, "PUT", JSON.stringify(options));
   }

   getIdentification() {
      var url = `${this.serverUrl}wa/istsos/services/${this.serviceName}/configsections/identification`;
      this.executeRequest(url, istsos.events.EventType.IDENTIFICATION, "GET");
   }

   updateIdentification(options) {
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
      this.executeRequest(url, istsos.events.EventType.UPDATE_IDENTIFICATION, "PUT", JSON.stringify(options));
   }

   getMqtt() {
      var url = `${this.serverUrl}wa/istsos/services/${this.serviceName}/configsections/mqtt`;
      this.executeRequest(url, istsos.events.EventType.MQTT, "GET");
   }

   updateMqtt(options) {
      // var data = {
      //    "broker_password": brokerPassword || "",
      //    "broker_user": brokerUser || "",
      //    "broker_topic": brokerTopic || "",
      //    "broker_url": brokerUrl || "",
      //    "broker_port": brokerPort || ""
      // };
      var url = `${this.serverUrl}wa/istsos/services/${this.serviceName}/configsections/mqtt`;
      this.executeRequest(url, istsos.events.EventType.UPDATE_MQTT, "PUT", JSON.stringify(options));
   }

   getCrs() {
      var url = `${this.serverUrl}wa/istsos/services/${this.serviceName}/configsections/geo`;
      this.executeRequest(url, istsos.events.EventType.CRS, "GET");
   }

   updateCrs(options) {
      // var data = {
      //    "zaxisname": z_axis_name || "",
      //    "xaxisname": x_axis_name || "",
      //    "yaxisname": y_axis_name || "",
      //    "allowedepsg": allowedEpsg.toString() || "",
      //    "istsosepsg": istsosEpsg.toString() || ""
      // };
      var url = `${this.serverUrl}wa/istsos/services/${this.serviceName}/configsections/geo`;
      this.executeRequest(url, istsos.events.EventType.UPDATE_CRS, "PUT", JSON.stringify(options));
   }

   getObservationConf() {
      var url = `${this.serverUrl}wa/istsos/services/${this.serviceName}/configsections/getobservation`;
      this.executeRequest(url, istsos.events.EventType.OBSERVATION_CONF, "GET");
   }

   updateObservationConf(options) {
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
      this.executeRequest(url, istsos.events.EventType.UPDATE_OBSERVATION_CONF, "PUT", JSON.stringify(options));
   }

   getProxy() {
      var url = `${this.serverUrl}wa/istsos/services/${this.serviceName}/configsections/serviceurl`;
      this.executeRequest(url, istsos.events.EventType.PROXY, "GET");
   }

   updateProxy(newUrl) {
      var data = {
         "url": newUrl || ""
      }
      var url = `${this.serverUrl}wa/istsos/services/${this.serviceName}/configsections/serviceurl`;
      this.executeRequest(url, istsos.events.EventType.UPDATE_PROXY, "PUT", JSON.stringify(data));
   }

   getEpsgCodes() {
      var url = `${this.serverUrl}wa/istsos/services/${this.serviceName}/epsgs`;
      this.executeRequest(url, istsos.events.EventType.EPSG_CODES, "GET");
   }
}
