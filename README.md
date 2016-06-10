# istSOS JavaScript Core Library

The istSOS JavaScript Core Library is mainly a REST API wrapper. 
It will expose in JavaScript language the communication with the istSOS WA REST interface.

## Classes, properties, methods

###istsos.IstSOS
####properties:
```javascript
* servers {Array<Server|Object>}
```
####methods:
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