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
* executeRequest()
* addService()
* registerService()
* deleteService()
* getService()
* getStatus()
* getAboutInfo()
* getConfig()
* getConfigProperty()
* getServicesProperty()
* getServices()
* getDefaultDbProperty()
* getDefaultDb()
* getUrl()
```

---

###istsos.Database *class*

#####*properties:*

#####*methods:*

---

###istsos.Configuration *class*

#####*properties:*

#####*methods:*

---
