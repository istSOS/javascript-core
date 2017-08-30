/**
 * Simple promisified HTTP request API
 * @type {Object}
 */
export var HttpAPI = {
   _request: (config) => {
      return new Promise(function(resolve, reject) {
         let xhr = new XMLHttpRequest();

         xhr.open(config.method || "GET", config.url);

         if (config.headers) {
            Object.keys(config.headers).forEach(key => {
               xhr.setRequestHeader(key, config.headers[key]);
            });
         }
         xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
               
               if(JSON.parse(xhr.response).success) {
                  resolve(JSON.parse(xhr.response));
               } else {
                  reject(JSON.parse(xhr.response).message)
               }
               

            } else {
               reject(xhr.statusText);
            }
         };
         xhr.onerror = () => reject(xhr.statusText);
         xhr.send(config.data);
      });
   },
   get: function(url, opt_config) {
      let config = {};
      config.method = "GET";
      config.url = url;
      for (var c in opt_config) {
         config[c] = opt_config[c];
      }
      return HttpAPI._request(config);
   },
   put: function(url, opt_config) {
      let config = {};
      config.method = "PUT";
      config.url = url;
      for (var c in opt_config) {
         config[c] = opt_config[c];
      }

      return HttpAPI._request(config);
   },
   post: function(url, opt_config) {
      let config = {};
      config.method = "POST";
      config.url = url;
      for (var c in opt_config) {
         config[c] = opt_config[c];
      }

      return HttpAPI._request(config);
   },
   delete: function(url, opt_config) {
      let config = {};
      config.method = "DELETE";
      config.url = url;
      for (var c in opt_config) {
         config[c] = opt_config[c];
      }

      return HttpAPI._request(config);
   }
};