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
* registerService(service {istsos.Service|Object})
* deleteService(service {istsos.Service|Object})
* getService(service {istsos.Service|Object})
* getStatus()
* getAboutInfo()
* getConfig()
* getConfigProperty() // @returns {Array<istsos.Configuration|Object>}
* getServicesProperty() // @returns {Array<istsos.Service|Object>}
* getServices()
* getDefaultDbProperty()// @returns {Array<istsos.Database|Object>}
* getDefaultDb()
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
* getDb(
    serviceName {String}
    server {istsos.Server|Object}
)
* setDb(
    dbname {String}
    host {String}
    user {String}
    passwrod {String}
    port {int}
    server {istsos.Server|Object}
    opt_service {istsos.Service|Object} /* optional (if not provided
                                           'default' value will be set */ 
* validateDb({istsos.Server|Object})
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
* getConf()
* getProvider()
* updateProvider()
* getIdentification()
* updateIdentification()
* getMqtt()
* updateMqtt()
* getCrs()
* updateCrs()
* getObservationConf()
* updateObservationConf()
* getProxy()
* updateProxy()
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

###istsos.Procedure *class*

#####*properties:*

#####*methods:*

---

###istsos.UnitOfMeasure *class*

#####*properties:*

#####*methods:*

---

