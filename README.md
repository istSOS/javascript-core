# istSOS JavaScript Core Library

The istSOS JavaScript Core Library is mainly a REST API wrapper. 
It will expose in JavaScript language the communication with the istSOS WA REST interface.

## Classes, properties, methods
---

###istsos.IstSOS *class*
```javascript
@constructor
new istsos.IstSOS()
```
#####*properties:*
```javascript
* servers {Array<Server|Object>}
```
#####*methods:*
```javascript
* addServer(server {Server|Object})
* updateServer(
    old_name {String}, 
    new_name {String},
    new_url {String},
    new_config {istsos.Configuration|Object},
    new_defaultDb {istsos.Database|Object} 
)
* removeServer(name {String})
* getServer(name {String})  // @returns {istsos.Server|Object}
* getServerList()  // @returns {Array<istsos.Server|Object>}
```

---

###istsos.Server *class*
```javascript
@constructor
@params
new istsos.Server(
                serverName {String}, 
                url {String}, 
                defaultDb {istsos.Database|Object}, 
                opt_config {istsos.Config}, 
                opt_loginConfig {JSON|Object}
)
```
#####*properties:*
```javascript
* serverName {String}
* url {String}
* defaultDb {istsos.Database|Object}
* opt_config {istsos.Config|Object} /* optional (if empty, 
                                                instance of istsos.Configuration is created 
                                                 with defualt config) */
* opt_loginConfig {JSON|Object} /* optional (if empty,
                                             empty object is created */
* services {Array<istsos.Service|Object>}
```
#####*methods:*
```javascript
* executeRequest(
    url {String}
    eventType {istsos.events.EventType}
    method {String}
    opt_data {JSON|Object} /* optional (for POST/PUT/DELETE
                                requests required) */                            
)
* addService(service {istsos.Service|Object})
* registerService(service {istsos.Service|Object}) //AJAX request|POST
* deleteService(service {istsos.Service|Object}) //AJAX request|DELETE
* getService(service {istsos.Service|Object}) //AJAX request|GET
* getStatus() //AJAX request|GET
* getAboutInfo() //AJAX request|GET
* getConfig() //AJAX request|GET
* getConfigProperty() // @returns {Array<istsos.Configuration|Object>}
* getServicesProperty() // @returns {Array<istsos.Service|Object>}
* getServices() AJAX request|GET
* getDefaultDbProperty()// @returns {Array<istsos.Database|Object>}
* getDefaultDb() AJAX request|GET
* getUrl()// @returns {Array<istsos.Service|Object>}
```

---

###istsos.Database *class*
```javascript
@constructor
@params
new istsos.Database(
            dbname {String}
            host {String}
            user {String}
            password {String}
            port {int}
)
```
#####*properties:*
```javascript
dbConf {JSON|Object}
```
#####*methods:*
```javascript
* executeRequest(
    url {String}
    eventType {istsos.events.EventType}
    method {String}
    opt_data {JSON|Object} /* optional (for POST/PUT/DELETE
                                requests required) */                            
)
* getDb( //AJAX request|GET
    serviceName {String}
    server {istsos.Server|Object}
)
* setDb( //AJAX request|PUT
    dbname {String}
    host {String}
    user {String}
    passwrod {String}
    port {int}
    server {istsos.Server|Object}
    opt_service {istsos.Service|Object} /* optional (if not provided
                                           'default' value will be set */ 
* validateDb({istsos.Server|Object}) //AJAX request|POST
* getDbObject() // @returns {JSON|Object}
```

---

###istsos.Configuration *class*
```javascript
@constructor
@params
new istsos.Configuration(
            serviceName {String}
            server {istsos.Server|Object}
```
#####*properties:*
```javascript
* sname {String}
* serverUrl {String}
```
#####*methods:*
```javascript
* executeRequest(
    url {String}
    eventType {istsos.events.EventType}
    method {String}
    opt_data {JSON|Object} /* optional (for POST/PUT/DELETE
                                requests required) */                            
)
* getConf() //AJAX request|GET
* getProvider() //AJAX request|GET
* updateProvider( //AJAX request|PUT
    providerName {String}
    providerSite {String}
    contactName {String}
    contactPosition {String}
    contactVoice {String}
    contactFax {String}
    contactEmail {String}
    contactDeliveryPoint {String}
    contactPostalCode {String}
    contactCity {String}
    contactAdminArea {String}
    contactCountry {String}
)
* getIdentification() //AJAX request|GET
* updateIdentification( //AJAX request|PUT
    title {String}
    abstract {String}
    urnVersion {String}
    authority {String}
    fees {String}
    keywords {String}
    accessConstrains {String}   
)
* getMqtt() //AJAX request|GET
* updateMqtt( //AJAX request|PUT
    brokerPassword {String}
    brokerUser {String}
    brokerTopic {String}
    brokerUrl {String}
    brokerPort {String}
)
* getCrs() //AJAX request|GET
* updateCrs( //AJAX request|PUT
    z_axis_name {String}
    x_axis_name {String}
    y_axis_name {String}
    allowedEpsg {String}
    istsosEpsg {String}
)
* getObservationConf() //AJAX request|GET
* updateObservationConf( //AJAX request|PUT
    correctQi {String}
    statQi {String}
    defaultQi {String}
    aggregateNoDataQi {String}
    maxGoPeriod {String}
    transactionalLog {String}
    aggregateNoData {String}    
)
* getProxy() //AJAX request|GET
* updateProxy( //AJAX request|PUT
    newUrl {String}
)
* getEpsgCodes()
```

---

###istsos.Date *class*
```javascript
@constructor
@params
new istsos.Date(opt_descr {String})
```
#####*properties:*
```javascript
* description {String} /* optional (if not provided,
                        default text will be set) */
```
#####*methods:*
```javascript
* getDescription() // @returns {String}
* getDateString(   // @returns {String}
    year {int}
    month {int}
    day {int}
    hours {int}
    minutes {int}
    seconds {int}
    gmt {int} 
) 
```

---

###istsos.Service *class*

#####*properties:*

#####*methods:*

---

###istsos.Offering *class*

#####*properties:*

#####*methods:*

---

###istsos.BaseProcedure *class*

#####*properties:*

#####*methods:*

---

###istsos.Procedure *class*

#####*properties:*

#####*methods:*

---

###istsos.VirtualProcedure *class*

#####*properties:*

#####*methods:*

---

###istsos.ObservedProperty *class*

#####*properties:*

#####*methods:*

---

###istsos.DataQuality *class*

#####*properties:*

#####*methods:*

---

###istsos.UnitOfMeasure *class*

#####*properties:*

#####*methods:*

---

