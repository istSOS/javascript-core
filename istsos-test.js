istsos.on(istsos.events.EventType.ABOUT, function (ev) {
    log(ev.getData(), 'ABOUT')
});

istsos.on(istsos.events.EventType.SERVICE, function (ev) {
    log(ev.getData(), 'SERVICE')
});

istsos.on(istsos.events.EventType.STATUS, function (ev) {
    log(ev.getData(), 'STATUS')
});

istsos.on(istsos.events.EventType.CONFIGSECTIONS, function (ev) {
    log(ev.getData(), 'CONFIGURATION SECTIONS');
});

istsos.on(istsos.events.EventType.SERVICES, function (ev) {
    log(ev.getData(), 'LIST OF SERVICES')
});

istsos.on(istsos.events.EventType.PROVIDER, function (ev) {
    log(ev.getData(), 'SERVICE PROVIDER')
});


istsos.on(istsos.events.EventType.PROXY, function (ev) {
    log(ev.getData(), 'PROXY')
});

istsos.on(istsos.events.EventType.IDENTIFICATION, function (ev) {
    log(ev.getData(), 'SERVICE IDENTIFICATION');
});

istsos.on(istsos.events.EventType.OBSERVATION_CONF, function (ev) {
    log(ev.getData(), 'OBSERVATION CONFIGURATION')
});

istsos.on(istsos.events.EventType.MQTT, function (ev) {
    log(ev.getData(), 'MQTT')
});

istsos.on(istsos.events.EventType.CRS, function (ev) {
    log(ev.getData(), 'COORDINATE SYSTEMS');
});

istsos.on(istsos.events.EventType.SYSTEM_TYPES, function (ev) {
    log(ev.getData(), 'SYSTEM TYPES')
});

istsos.on(istsos.events.EventType.EPSG_CODES, function (ev) {
    log(ev.getData(), 'EPSG CODES')
});

istsos.on(istsos.events.EventType.OFFERING_NAMES, function (ev) {
    log(ev.getData(), 'OFFERING NAMES')
});

istsos.on(istsos.events.EventType.OFFERING_LIST, function (ev) {
    log(ev.getData(), 'OFFERING LIST')
});

istsos.on(istsos.events.EventType.PROCEDURE, function (ev) {
    log(ev.getData(), 'PROCEDURE')
});

istsos.on(istsos.events.EventType.PROCEDURES, function (ev) {
    log(ev.getData(), 'PROCEDURES')
});

istsos.on(istsos.events.EventType.OFFERING_LIST, function (ev) {
    log(ev.getData(), 'OFFERINGS')
});

istsos.on(istsos.events.EventType.OFFERING_NAMES, function (ev) {
    log(ev.getData(), 'OFFERING NAMES')
});

istsos.on(istsos.events.EventType.VIRTUAL_PROCEDURE, function (ev) {
    log(ev.getData(), 'VIRTUAL PROCEDURE')
});

istsos.on(istsos.events.EventType.VIRTUAL_PROCEDURES, function (ev) {
    log(ev.getData(), 'VIRTUAL PROCEDURES')
});

istsos.on(istsos.events.EventType.OBSERVED_PROPERTIES, function (ev) {
    log(ev.getData(), 'OBSERVED PROPERTIES')
});

istsos.on(istsos.events.EventType.OBSERVED_PROPERTY, function (ev) {
    log(ev.getData(), 'OBSERVED PROPERTY')
});

istsos.on(istsos.events.EventType.DATAQUALITIES, function (ev) {
    log(ev.getData(), 'DATA QUALITIES')
});

istsos.on(istsos.events.EventType.DATAQUALITY, function (ev) {
    log(ev.getData(), 'DATA QUALITY')
});

istsos.once(istsos.events.EventType.UOMS, function (ev) {
    log(ev.getData(), 'UNITS OF MEASURE')
});

istsos.once(istsos.events.EventType.UOM, function (ev) {
    log(ev.getData(), 'UNIT OF MEASURE')
});

istsos.on(istsos.events.EventType.DATABASE, function (ev) {
    log(ev.getData(), 'DATABASE');
});

istsos.on(istsos.events.EventType.MEMBERLIST, function (ev) {
    log(ev.getData(), 'MEMBER PROCEDURES');
});

istsos.on(istsos.events.EventType.NONMEMBERLIST, function (ev) {
    log(ev.getData(), 'NON-MEMBER PROCEDURES')
});

istsos.on(istsos.events.EventType.GET_CODE, function (ev) {
    log(ev.getData(), 'CODE');
});

istsos.on(istsos.events.EventType.RATING_CURVE, function (ev) {
    log(ev.getData(), 'RATING CURVE');
});

istsos.on(istsos.events.EventType.GEOJSON, function (ev) {
    log(ev.getData(), 'GET FEATURE COLLECTION');
});

istsos.on(istsos.events.EventType.GETOBSERVATIONS, function (ev) {
    log(ev.getData(), 'GET OBSERVATIONS');
});

istsos.on(istsos.events.EventType.GETOBSERVATIONS_BY_PROPERTY, function (ev) {
    log(ev.getData(), 'GET OBSERVATIONS DATA BY SINGLE PROPERTY')
});

istsos.on(istsos.events.EventType.NEW_SERVICE, function (ev) {
    console.log(ev.getData());
    server_local.getService(service_local);
});

istsos.on(istsos.events.EventType.DELETE_SERVICE, function (ev) {
    console.log("DELETE SERVICE")
});

istsos.on(istsos.events.EventType.UPDATE_PROVIDER, function (ev) {
    console.log(ev.getData());
    service_local.config.getProvider();
});

istsos.on(istsos.events.EventType.UPDATE_IDENTIFICATION, function (ev) {
    console.log(ev.getData());
    service_local.config.getIdentification();
});

istsos.on(istsos.events.EventType.UPDATE_CRS, function (ev) {
    console.log(ev.getData());
    service_local.config.getCrs();
});

istsos.on(istsos.events.EventType.UPDATE_OBSERVATION_CONF, function (ev) {
    console.log(ev.getData());
    service_local.config.getObservationConf();
});

istsos.on(istsos.events.EventType.UPDATE_MQTT, function (ev) {
    console.log(ev.getData());
    service_local.config.getMqtt();
});

istsos.on(istsos.events.EventType.UPDATE_PROXY, function (ev) {
    console.log(ev.getData());
    service_local.config.getProxy();
});


var ist = new istsos.IstSOS();
var default_db = new istsos.Database('istsos', 'localhost', 'postgres', 'postgres', 5432);
var server = new istsos.Server('test', 'http://istsos.org/istsos/', default_db);
ist.addServer(server);
ist.addServer(server_local);
var default_conf = new istsos.Configuration("default", server);
var service = new istsos.Service('demo', server);
var procedure = new istsos.Procedure(service, "BELLINZONA", "", "", "foi", 3857, 25, 35, 45, [], "insitu-fixed", "");
var v_procedure = new istsos.VirtualProcedure(service, "V_GNOSCA", "", "", "foi", 3857, 26, 36, 46, [], "virtual", "");
var observed_prop = new istsos.ObservedProperty(service, "air-rainfall", "urn:ogc:def:parameter:x-istsos:1.0:meteo:air:rainfall", "", "between", [0, 1]);

var dataQuality = new istsos.DataQuality(service, 100, "raw", "format is correct");
var uom = new istsos.UnitOfMeasure(service, "mm", "milimeter");
var offering = new istsos.Offering("BELLINZONA", "", true, null, service);
var v_offering = new istsos.Offering("V_GNOSCA", "", true, null, service);
var beginTime = new istsos.Date(2014, 05, 27, 00, 00, 00, 2, "");
var endTime = new istsos.Date(2014, 05, 28, 00, 00, 00, 2, "");
/** GET REQUEST TESTS */
//server methods
function getServiceReq() {
    server.getService(service);
}

function getStatusReq() {
    server.getStatus();
}

function getAbout() {
    server.getAboutInfo();
}

function getConf() {
    server.getConfig();
}

function getDb() {
    server.getDefaultDb();
}

function getList() {
    server.getServices();
}

//configuration methods
function getConfigurationReq() {
    var resp = prompt("Service name or default?", "default")
    if (resp === "default") {
        default_conf.getConf();
    } else {
        var service_conf = new istsos.Configuration(resp, server);
        service_conf.getConf();
    }
}

function getProviderReq() {
    var resp = prompt("Service name or default?", "default")
    if (resp === "default") {
        default_conf.getProvider();
    } else {
        var service_conf = new istsos.Configuration(resp, server);
        service_conf.getProvider();
    }
}


function getIdentReq() {
    var resp = prompt("Service name or default?", "default")
    if (resp === "default") {
        default_conf.getIdentification();
    } else {
        var service_conf = new istsos.Configuration(resp, server);
        service_conf.getIdentification();
    }
}

function getCoordSysReq() {
    var resp = prompt("Service name or default?", "default")
    if (resp === "default") {
        default_conf.getCrs();
    } else {
        var service_conf = new istsos.Configuration(resp, server);
        service_conf.getCrs();
    }
}

function mqtt() {
    var resp = prompt("Service name or default?", "default")
    if (resp === "default") {
        default_conf.getMqtt();
    } else {
        var service_conf = new istsos.Configuration(resp, server);
        service_conf.getMqtt();
    }
}

function getOC() {
    var resp = prompt("Service name or default?", "default")
    if (resp === "default") {
        default_conf.getObservationConf();
    } else {
        var service_conf = new istsos.Configuration(resp, server);
        service_conf.getObservationConf();
    }
}

function getProxyReq() {
    var resp = prompt("Service name or default?", "default")
    if (resp === "default") {
        default_conf.getProxy();
    } else {
        var service_conf = new istsos.Configuration(resp, server);
        service_conf.getProxy();
    }
}

function getEPSGS() {
    var resp = prompt("Service name or default?", "default")
    if (resp === "default") {
        default_conf.getEpsgCodes();
    } else {
        var service_conf = new istsos.Configuration(resp, server);
        service_conf.getEpsgCodes();
    }
}

//Service methods
function getOffNames() {
    service.getOfferingNames();
}

function getOffs() {
    service.getOfferings();
}

function getProcs() {
    service.getProcedures();
}

function getProc() {
    service.getProcedure(procedure);
}

function getVProcs() {
    service.getVirtualProcedures();
}

function getVProc() {
    service.getVirtualProcedure(v_procedure);
}

function getOPS() {
    service.getObservedProperties();
}

function getOP() {
    service.getObservedProperty(observed_prop);
}

function getDQs() {
    service.getDataQualities();
}

function getDQ() {
    service.getDataQuality(dataQuality);
}

function getUOMs() {
    service.getUoms();
}

function getUOM() {
    service.getUom(uom);
}

function getSysTypes() {
    service.getSystemTypes();
}

function getServiceDatabase() {
    service.getDatabase();
}

function getMembers() {
    offering.getMemberProcedures();
}

function getNonMembers() {
    offering.getNonMemberProcedures();
}

function getRCurve() {
    v_procedure.getRatingCurve();
}

function getCodeReq() {
    v_procedure.getCode();
}

function getGEOJSON() {
    //TRY WITH
    //service.getFeatureCollection(3857)
    //service.getFeatureCollection(3857, offering)
    //service.getFeatureCollection(3857, null, procedure)
    //service.getFeatureCollection(3857, null, v_procedure)
    //service.getFeatureCollection(3857, offering, procedure)
    //service.getFeatureCollection(3857, offering, v_procedure)
    service.getFeatureCollection(3857, offering);
}
var air_rainfall = new istsos.ObservedProperty(service, "air-rainfall", "urn:ogc:def:parameter:x-istsos:1.0:meteo:air:rainfall", "", null, null);
var air_temperature = new istsos.ObservedProperty(service, "air-temperature", "urn:ogc:def:parameter:x-istsos:1.0:meteo:air:temperature", "", null, null);
var air_relative_humidity = new istsos.ObservedProperty(service, "air-relative-humidity", "urn:ogc:def:parameter:x-istsos:1.0:meteo:air:relative:humidity", "", null, null);
var air_wind_velocity = new istsos.ObservedProperty(service, "air-wind-velocity", "urn:ogc:def:parameter:x-istsos:1.0:meteo:air:wind:velocity", "", null, null);

function getOBSERVATIONS() {
    //TRY WITH
    //service.getObservations(v_offering, v_procedure, [], beginTime, endTime);
    /*air-rainfall (mm)
     air-temperature (°C)
     air-relative-humidity (%)
     air-wind-velocity (m/s)*/
    service.getObservations(offering, procedure, [air_rainfall, air_temperature, air_wind_velocity, air_relative_humidity], beginTime, endTime);
}

function getOBSERVATIONDATA() {
    service.getObservationsBySingleProperty(offering, procedure, air_rainfall, beginTime, endTime);
}

//POST
var server_local = new istsos.Server("example", "http://localhost/istsos/", default_db);
var service_local = new istsos.Service("test_post", server_local);
function registerSERVICE() {
    server_local.registerService(service_local);
}

function deleteSERVICE() {
    server_local.deleteService(service_local);
}


//PUT
function putProviderReq() {
    var resp = prompt("Default or not?", "default")
    if (resp === "default") {
        server_local.config.updateProvider("LukaG", "www.lukaglusica.com", "Luka Glusica", "", "12121212", "12121212",
            "llll@Llll.com", "Street name 3/19", "11080", "Belgrade", "Zemun", "Serbia");
    } else {
        service_local.config.updateProvider("LukaG", "www.lukaglusica.com", "Luka Glusica", "", "12121212", "12121212",
            "llll@Llll.com", "Street name 3/19", "11080", "Belgrade", "Zemun", "Serbia");
    }
}

function putIdentificationReq() {
    var resp = prompt("Default or not?", "default");
    if (resp === "default") {
        server_local.config.updateIdentification("Observation Service", "", "2.0", "x-istsos-belgrade", "NONE", "new", "NONE");
    } else {
        service_local.config.updateIdentification("Observation Service", "", "2.0", "x-istsos-belgrade", "NONE", "new", "NONE");
    }
}

function putCRS() {
    var resp = prompt("Default or not?", "default");
    if (resp === "default") {
        server_local.config.updateCrs("height", "east", "north", "3857,21781", "4326");
    } else {
        service_local.config.updateCrs("height", "east", "north", "3857,21781", "4326");
    }
}
function putMqtt() {
    var resp = prompt("Default or not?", "default");
    if (resp === "default") {
        server_local.config.updateMqtt("somePasword","someUser", "someTopic", "someUrl", "somePort");
    } else {
        service_local.config.updateMqtt("somePasword","someUser", "someTopic", "someUrl", "somePort");
    }
}

function putOC() {
    var resp = prompt("Default or not?", "default");
    if (resp === "default") {
        server_local.config.updateObservationConf("100", "150", "200", "300", "0", "True", "-999");
    } else {
        service_local.config.updateObservationConf("100", "150", "200", "300", "0", "True", "-999");
    }
}

function putProxy() {
    var resp = prompt("Default or not?", "default");
    if (resp === "default") {
        server_local.config.updateProxy("www.newUrl.com");
    } else {
        service_local.config.updateProxy("www.newUrl.com");
    }
}