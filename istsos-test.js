
istsos.on(istsos.events.EventType.ABOUT, function (ev) {
    log(ev.getData(), 'ABOUT')
});

istsos.on(istsos.events.EventType.SERVICE, function (ev) {
    log(ev.getData(), 'GET SERVICE')
});

istsos.on(istsos.events.EventType.STATUS, function (ev) {
    log(ev.getData(), 'STATUS')
});

istsos.on(istsos.events.EventType.CONFIGSECTIONS, function(ev){
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

istsos.on(istsos.events.EventType.IDENTIFICATION, function(ev){
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
    console.log(ev.getData());
});

istsos.on(istsos.events.EventType.DATABASE, function (ev) {
    log(ev.getData(), 'DEFAULT DATABASE') 
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

var ist = new istsos.IstSOS();
var default_db = new istsos.Database('istsos','localhost','postgres', 'postgres', '5432');
var server = new istsos.Server('test','http://istsos.org/istsos/', default_db);
ist.addServer(server);

var service = new istsos.Service('demo', server);

/** GET REQUEST TESTS */

server.getService(service);
server.getStatus();
server.getAboutInfo();
server.getConfig(); 
server.getDefaultDb();

server.config.getProvider();
server.config.getProxy();
server.config.getIdentification();
server.config.getObservationConf();
server.config.getMqtt();
server.config.getCrs();
server.config.getEpsgCodes();

service.getSystemTypes();
service.getOfferingNames();
service.getOfferings();