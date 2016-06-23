goog.require('goog.events');
goog.require('goog.events.Event');
goog.require('goog.events.EventTarget');
goog.require('goog.net.XhrIo');

istsos.VirtualProcedure = function (service, name, description, keywords, foi_name, epsg, x, y, z, outputs, systemType, sensorType, code, ratingCurve) {
    istsos.ProcedureBase.call(this, name, description, keywords, foi_name, epsg, x, y, z, outputs);
    this.systemType = (systemType === "virtual") ?
        systemType : null;
    this.sensorType = sensorType || "";
    this.code = {"code": code} || {};
    this.ratingCurve = ratingCurve || {};
    this.service = service;
    service.addVirtualProcedure(this);
    service.getOfferingsProperty()[0].getMemberProceduresProperty().push(this);
};
goog.inherits(istsos.VirtualProcedure, istsos.ProcedureBase);

istsos.VirtualProcedure.prototype = {
    executeRequest: function (url, eventType, method, opt_data, opt_callback) {
        goog.net.XhrIo.send(url, function (e) {
            var obj = e.target.getResponseJson();
            console.log(obj);
            istsos.fire(eventType, e.target);
        }, method, opt_data);
    },
    getVirtualProcedureJSON: function () {
        var vProcedureJSON = istsos.ProcedureBase.prototype.getProcedureBaseJSON.call(this);
        vProcedureJSON["classification"] = [{
            "name": "System Type",
            "definition": "urn:ogc:def:classifier:x-istsos:1.0:systemType",
            "value": (this.systemType === "virtual") ? this.systemType : null
        }, {
            "name": "Sensor Type",
            "definition": "urn:ogc:def:classifier:x-istsos:1.0:sensorType",
            "value": this.sensorType
        }];
        return vProcedureJSON;
    },
    getCode: function () {
        var url = this.service.server.getUrl() + "wa/istsos/services/" + this.service.getServiceJSON()["service"] +
            "/virtualprocedures/" + this.getVirtualProcedureJSON()["system"] + "/code";
        this.executeRequest(url, istsos.events.EventType.GET_CODE, "GET");
    },
    registerCode: function () {
        var url = this.service.server.getUrl() + "wa/istsos/services/" + this.service.getServiceJSON()["service"] +
            "/virtualprocedures/" + this.getVirtualProcedureJSON()["system"] + "/code";
        this.executeRequest(url, istsos.events.EventType.NEW_CODE, "POST", JSON.stringify(this.getCodeProperty()));
    },
    updateCode: function (newCode) {
        this.code = {"code" : newCode} || this.code;
        var url = this.service.server.getUrl() + "wa/istsos/services/" + this.service.getServiceJSON()["service"] +
            "/virtualprocedures/" + this.getVirtualProcedureJSON()["system"] + "/code";
        this.executeRequest(url, istsos.events.EventType.UPDATE_CODE, "PUT", JSON.stringify(this.getCodeProperty()));
    },
    deleteCode: function () {
        this.code = "";
        var url = this.service.server.getUrl() + "wa/istsos/services/" + this.service.getServiceJSON()["service"] +
            "/virtualprocedures/" + this.getVirtualProcedureJSON()["system"] + "/code";
        this.executeRequest(url, istsos.events.EventType.DELETE_CODE, "DELETE");
    },
    getCodeProperty: function () {
        return this.code;
    },
    getRatingCurve: function () {
        var url = this.service.server.getUrl() + "wa/istsos/services/" + this.service.getServiceJSON()["service"] +
            "/virtualprocedures/" + this.getVirtualProcedureJSON()["system"] + "/ratingcurve";
        console.log(url);
        this.executeRequest(url, istsos.events.EventType.RATING_CURVE, "GET");
    },
    registerRatingCurve: function () {
        var url = this.service.server.getUrl() + "wa/istsos/services/" + this.service.getServiceJSON()["service"] +
            "/virtualprocedures/" + this.getVirtualProcedureJSON()["system"] + "/ratingcurve";
        this.executeRequest(url, istsos.events.EventType.NEW_RATING_CURVE, "POST", JSON.stringify(this.getRatingCurveProperty()));
    },
    deleteRatingCurve: function () {
        this.ratingCurve = {};
        var url = this.service.server.getUrl() + "wa/istsos/services/" + this.service.getServiceJSON()["service"] +
            "/virtualprocedures/" + this.getVirtualProcedureJSON()["system"] + "/ratingcurve";
        this.executeRequest(url, istsos.events.EventType.DELETE_RATING_CURVE, "DELETE");
    },
    getRatingCurveProperty: function () {
        return this.ratingCurve;
    },
    updateVirtualProcedure: function (name, description, keywords, foi_name, epsg, x, y, z, outputs, systemType, sensorType) {
        var oldName = this.name;
        this.name = name || this.name;
        this.description = description || this.description;
        this.keywords = keywords || this.keywords;
        this.foi_name = foi_name || this.foi_name;
        this.epsg = epsg || this.epsg;
        this.coordinates = [x, y, z] || this.coordinates;
        var outputs_array = this.outputs;
        if (outputs || outputs.length !== 0) {
            outputs_array.splice(1, outputs_array.length - 1);
            outputs.forEach(function (out) {
                outputs_array.push(out)
            });
        }
        this.systemType = (systemType === "virtual") ? systemType : this.systemType;
        this.sensorType = sensorType || this.sensorType;
        var url = this.service.server.getUrl() + "wa/istsos/services/" + this.service.getServiceJSON()["service"] + "/virtualprocedures/" + oldName;
        this.executeRequest(url, istsos.events.EventType.UPDATE_V_PROCEDURE, "PUT", JSON.stringify(this.getVirtualProcedureJSON()));
    },
    deleteVirtualProcedure: function () {
        var v_procedures = this.service.getVirtualProceduresProperty();
        var obj = this.getVirtualProcedureJSON();
        v_procedures.forEach(function (p) {
            if (p.getVirtualProcedureJSON()["system"] === obj["system"]) {
                v_procedures.splice(v_procedures.indexOf(p), 1);
            }
        });
        var url = this.service.server.getUrl() + "wa/istsos/services/" + this.service.getServiceJSON()["service"] + "/virtualprocedures/" + this.name;
        this.executeRequest(url, istsos.events.EventType.DELETE_V_PROCEDURE, "DELETE");
    },
    addMembershipToOffering: function (offering) {
        offering.getMemberProceduresProperty().push(this);
        var url = this.service.server.getUrl() + "wa/istsos/services/" + this.service.getServiceJSON()["service"] + "/offerings/" +
            offering.getOfferingJSON()["name"] + "/procedures";
        this.executeRequest(url, istsos.events.EventType.ADD_TO_OFFERING, "POST", JSON.stringify([{
            "offering": offering.getOfferingJSON()["name"],
            "procedure": this.getVirtualProcedureJSON()["system"]
        }]));
    },
    removeMembershipFromOffering: function (offering) {
        var procedures = offering.getMemberProceduresProperty();
        procedures.forEach(function (p) {
            if (p === this) {
                procedures.splice(procedures.indexOf(p), 1);
            }
        });
        var url = this.service.server.getUrl() + "wa/istsos/services/" + this.service.getServiceJSON()["service"] + "/offerings/" +
            offering.getOfferingJSON()["name"] + "/procedures/" + this.getVirtualProcedureJSON()["system"];
        this.executeRequest(url, istsos.events.EventType.REMOVE_FROM_OFFERING, "DELETE", JSON.stringify([{
            "offering": offering.getOfferingJSON()["name"],
            "procedure": this.getVirtualProcedureJSON()["system"]
        }]));
    },
    getOutputsProperty: function () {
        return istsos.ProcedureBase.prototype.getOutputsProperty.call(this);
    }

};