goog.require('goog.events');
goog.require('goog.events.Event');
goog.require('goog.events.EventTarget');
goog.require('goog.net.XhrIo');
/** istsos.Database class */
/**
 * @param {string} dbname
 * @param {string} host
 * @param {string} user
 * @param {string} password
 * @param {int} port
 * @constructor
 */
istsos.Database = function (dbname, host, user, password, port) {
    this.dbname = dbname;
    this.host = host;
    this.user = user;
    this.password = password;
    this.port = port;
};

// methods
istsos.Database.prototype = {
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
    /**
     * @param {string} serviceName
     * @param {istsos.Server} server
     */
    getDb: function (serviceName, server) {
        var sname = serviceName || "default";
        var url = server.getUrl() + "wa/istsos/services/" + sname + "/configsections/connection";
        console.log(url);
        this.executeRequest(url, istsos.events.EventType.DATABASE, "GET");
    },
    /**
     * @param {string} dbname
     * @param {string} host
     * @param {string} user
     * @param {string} password
     * @param {int} port
     * @param {istsos.Server} server
     * @param {istsos.Service} opt_service
     */
    setDb: function (dbname, host, user, password, port, server, opt_service) {
        this.dbname = dbname || this.dbname;
        this.host = host || this.host;
        this.password = password || this.password;
        this.port = port || this.port;
        var sname = (opt_service) ? opt_service.getServiceJSON()["service"] : "default";
        var url = server.getUrl() + "wa/istsos/services/" + sname + "/configsections/connection";
        console.log(JSON.stringify(this.getDbJSON()));
        this.executeRequest(url, istsos.events.EventType.UPDATE_DATABASE, "PUT", JSON.stringify(this.getDbJSON()));
    },
    /**
     * @param {istsos.Server} server
     */
    validateDb: function (server) {
        var url = server.getUrl() + "wa/istsos/operations/validatedb";
        this.executeRequest(url, istsos.events.EventType.VALIDATE_DB, "POST", JSON.stringify(this.getDbJSON()));
    },
    /**
     * @returns {JSON}
     */
    getDbJSON: function () {
        return {
            "dbname": this.dbname,
            "host": this.host,
            "user": this.user,
            "password": this.password,
            "port": this.port.toString(),
        };
    }
};