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
* addServer({Server|Object} server)
* updateServer(
    {String} old_name, 
    {String} new_name,
    {String} new_url,
    {istsos.Configuration} new_config,
    {istsos.Database} new_defaultDb
)
* removeServer({String} name)
* getServer({String} name) - returns {istsos.Server|Object}
* getServerList() - returns {Array<istsos.Server|Object>}
```

---

###istsos.Server *class*
```javascript
@constructor
new istsos.Server(
                {String} serverName, 
                {String} url, 
                {istsos.Database|Object} defaultDb, 
                {istsos.Config} opt_config, 
                {JSON|Object} opt_loginConfig
)
```
#####*properties:*
```javascript
* serverName {String}
* url {String}
* defaultDb {istsos.Database|Object}
* opt_config {istsos.Config|Object} opt_config} /* optional (if empty, 
                                                  instance of istsos.Configuration is created 
                                                  with defualt config) */
* opt_loginConfig {JSON|Object} opt_loginConfig /* optional (if empty,
                                                   empty object is created */
```
#####*methods:*
```javascript
* executeRequest()
* addService()
* createService()
* deleteService()
* getService()
* getStatus()
* getAboutInfo()
* getConfig()
* getServicesList()
* getServices()
* getDefaultDb()
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