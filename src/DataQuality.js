goog.require('goog.events');
goog.require('goog.events.Event');
goog.require('goog.events.EventTarget');
goog.require('goog.net.XhrIo');
/** istsos.DataQuality class */
/**
 * @param {istsos.Service} service
 * @param {int} codeDQ
 * @param {string} nameDQ
 * @param {string} descrDQ
 * @constructor
 */
istsos.DataQuality = function (service, codeDQ, nameDQ, descrDQ) {
    this.code = codeDQ;
    this.name = nameDQ;
    this.description = descrDQ;
    this.service = service;
    service.addDataQuality(this);
};

istsos.DataQuality.prototype = {
    executeRequest: function (url, eventType, method, opt_data, opt_callback) {
        goog.net.XhrIo.send(url, function (e) {
            istsos.fire(eventType, e.target);
        }, method, opt_data);
    },
    /**
     * @returns {JSON}
     */
    getDataQualityJSON: function () {
        var dqJSON = {
            "code": this.code.toString(),
            "name": this.name,
            "description": this.description
        };
        return dqJSON;
    },
    /**
     * @param {int} newCodeDQ
     * @param {string} newNameDQ
     * @param {string} newDescrDQ
     */
    updateDataQuality: function ( newCodeDQ, newNameDQ, newDescrDQ) {
        var oldName = this.code;
        this.code = newCodeDQ || this.code;
        this.name = newNameDQ || this.name;
        this.description = newDescrDQ || this.description;
        var url = this.service.server.getUrl() + "wa/istsos/services/" + this.service.getServiceJSON()["service"] +
            "/dataqualities/" + oldName;
        this.executeRequest(url, istsos.events.EventType.UPDATE_DATAQUALITY, "PUT", JSON.stringify(this.getDataQualityJSON()));
    },
    deleteDataQuality: function () {
        var dataQualities = this.service.getDataQualitiesProperty();
        for (var i = 0; i < dataQualities.length; i++) {
            if (this === dataQualities[i]) {
                dataQualities.splice(i, 1);
            }
        }
        var url = this.service.server.getUrl() + "wa/istsos/services/" + this.service.getServiceJSON()["service"] +
            "/dataqualities/" + this.getDataQualityJSON()["code"];
        this.executeRequest(url, istsos.events.EventType.DELETE_DATAQUALITY, "DELETE", JSON.stringify(this.getDataQualityJSON()));
    }
};