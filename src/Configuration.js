goog.require('goog.events');
goog.require('goog.events.Event');
goog.require('goog.events.EventTarget');
goog.require('goog.net.XhrIo');
/** istsos.Configuration class */
/**
 * @param {string} serviceName
 * @param {istsos.Server} server
 * @constructor
 */
istsos.Configuration = function (serviceName, server) {
    this.sname = (serviceName) ? serviceName : "default";
    this.serverUrl = server.getUrl();
};
//methods
istsos.Configuration.prototype = {
    /**
     * @param {string} url
     * @param {istsos.events.EventType} eventType
     * @param {string} method
     * @param {JSON} opt_data
     * @param {function} opt_callback
     */
    executeRequest: function (url, eventType, method, opt_data, opt_callback) {
        goog.net.XhrIo.send(url, function (e) {
            var obj = e.target.getResponseJson();
            console.log(obj);
            istsos.fire(eventType, e.target);
        }, method, opt_data);
    },
    getConf: function () {
        var url = this.serverUrl + "wa/istsos/services/" + this.sname + "/configsections";
        this.executeRequest(url, istsos.events.EventType.CONFIGSECTIONS, "GET");
    },
    getProvider: function () {
        var url = this.serverUrl + "wa/istsos/services/" + this.sname + "/configsections/provider";
        this.executeRequest(url, istsos.events.EventType.PROVIDER, "GET");
    },
    /**
     * @param {string} providerName
     * @param {string} providerSite
     * @param {string} contactName
     * @param {string} contactPosition
     * @param {string} contactVoice
     * @param {string} contactFax
     * @param {string} contactEmail
     * @param {string} contactDeliveryPoint
     * @param {string} contactPostalCode
     * @param {string} contactCity
     * @param {string} contactAdminArea
     * @param {string} contactCountry
     */
    updateProvider: function (providerName, providerSite, contactName, contactPosition, contactVoice, contactFax,
                              contactEmail, contactDeliveryPoint, contactPostalCode,
                              contactCity, contactAdminArea, contactCountry) {
        var data = {
            "providername": providerName,
            "providersite": providerSite,
            "contactname": contactName,
            "contactposition": contactPosition,
            "contactvoice": contactVoice,
            "contactfax": contactFax,
            "contactemail": contactEmail,
            "contactdeliverypoint": contactDeliveryPoint,
            "contactpostalcode": contactPostalCode,
            "contactcity": contactCity,
            "contactadminarea": contactAdminArea,
            "contactcountry": contactCountry
        };
        var url = this.serverUrl + "wa/istsos/services/" + this.sname + "/configsections/provider";
        this.executeRequest(url, istsos.events.EventType.UPDATE_PROVIDER, "PUT", JSON.stringify(data));
    },
    getIdentification: function () {
        var url = this.serverUrl + "wa/istsos/services/" + this.sname + "/configsections/identification";
        this.executeRequest(url, istsos.events.EventType.IDENTIFICATION, "GET");
    },
    /**
     * @param {string} title
     * @param {string} abstract
     * @param {string} urnVersion
     * @param {string} authority
     * @param {string} fees
     * @param {string} keywords
     * @param {string} accessConstrains
     */
    updateIdentification: function (title, abstract, urnVersion, authority, fees, keywords, accessConstrains) {
        var data = {
            "title": title,
            "abstract": abstract,
            "urnversion": urnVersion,
            "authority": authority,
            "fees": fees,
            "keywords": keywords,
            "accessconstrains": accessConstrains
        };
        var url = this.serverUrl + "wa/istsos/services/" + this.sname + "/configsections/identification";
        console.log(url);
        console.log(JSON.stringify(data));
        this.executeRequest(url, istsos.events.EventType.UPDATE_IDENTIFICATION, "PUT", JSON.stringify(data));
    },
    getMqtt: function () {
        var url = this.serverUrl + "wa/istsos/services/" + this.sname + "/configsections/mqtt";
        this.executeRequest(url, istsos.events.EventType.MQTT, "GET");
    },
    /**
     * @param {string} brokerPassword
     * @param {string} brokerUser
     * @param {string} brokerTopic
     * @param {string} brokerUrl
     * @param {string} brokerPort
     */
    updateMqtt: function (brokerPassword, brokerUser, brokerTopic, brokerUrl, brokerPort) {
        var data = {
            "broker_password": brokerPassword,
            "broker_user": brokerUser,
            "broker_topic": brokerTopic,
            "broker_url": brokerUrl,
            "broker_port": brokerPort
        };
        var url = this.serverUrl + "wa/istsos/services/" + this.sname + "/configsections/mqtt";
        this.executeRequest(url, istsos.events.EventType.UPDATE_MQTT, "PUT", JSON.stringify(data));
    },
    getCrs: function () {
        var url = this.serverUrl + "wa/istsos/services/" + this.sname + "/configsections/geo";
        this.executeRequest(url, istsos.events.EventType.CRS, "GET");
    },
    /**
     * @param {string} z_axis_name
     * @param {string} x_axis_name
     * @param {string} y_axis_name
     * @param {string} allowedEpsg
     * @param {string} istsosEpsg
     */
    updateCrs: function (z_axis_name, x_axis_name, y_axis_name, allowedEpsg, istsosEpsg) {
        var data = {
            "zaxisname": z_axis_name,
            "xaxisname": x_axis_name,
            "yaxisname": y_axis_name,
            "allowedepsg": allowedEpsg,
            "istsosepsg": istsosEpsg
        };
        var url = this.serverUrl + "wa/istsos/services/" + this.sname + "/configsections/geo";
        this.executeRequest(url, istsos.events.EventType.UPDATE_CRS, "PUT", JSON.stringify(data));
    },
    getObservationConf: function () {
        var url = this.serverUrl + "wa/istsos/services/" + this.sname + "/configsections/getobservation";
        this.executeRequest(url, istsos.events.EventType.OBSERVATION_CONF, "GET");
    },
    /**
     * @param {string} correctQi
     * @param {string} statQi
     * @param {string} defaultQi
     * @param {string} aggregateNoDataQi
     * @param {string} maxGoPeriod
     * @param {string} transactionalLog
     * @param {string} aggregateNoData
     */
    updateObservationConf: function (correctQi, statQi, defaultQi, aggregateNoDataQi,
                                     maxGoPeriod, transactionalLog, aggregateNoData) {
        var data = {
            "correct_qi": correctQi,
            "stat_qi": statQi,
            "defaultqi": defaultQi,
            "aggregatenodataqi": aggregateNoDataQi,
            "maxgoperiod": maxGoPeriod,
            "transactional_log": transactionalLog,
            "aggregatenodata": aggregateNoData
        };
        var url = this.serverUrl + "wa/istsos/services/" + this.sname + "/configsections/getobservation";
        this.executeRequest(url, istsos.events.EventType.UPDATE_OBSERVATION_CONF, "PUT", JSON.stringify(data));
    },
    getProxy: function () {
        var url = this.serverUrl + "wa/istsos/services/" + this.sname + "/configsections/serviceurl";
        this.executeRequest(url, istsos.events.EventType.PROXY, "GET");
    },
    /**
     * @param {string} newUrl
     */
    updateProxy: function (newUrl) {
        var data = {
            "url": newUrl
        };
        var url = this.serverUrl + "wa/istsos/services/" + this.sname + "/configsections/serviceurl";
        this.executeRequest(url, istsos.events.EventType.UPDATE_PROXY, "PUT", JSON.stringify(data));
    },
    getEpsgCodes: function () {
        var url = this.serverUrl + "wa/istsos/services/" + this.sname + "/epsgs";
        this.executeRequest(url, istsos.events.EventType.EPSG_CODES, "GET");
    }
};