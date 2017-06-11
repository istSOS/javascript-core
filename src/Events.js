goog.provide('istsos.events.JSONResponse')

goog.require('istsos');
goog.require('istsos.events.EventType');
goog.require('goog.events');
goog.require('goog.events.Event');
goog.require('goog.events.EventTarget');
goog.require('goog.net.XhrIo');

istsos.events.JSONResponse = class {
   constructor(type, xhrIo, opt_data) {
      this.optional = opt_data || null;
      this.type = type;
      goog.base(this, type);
      /**
       * The response in text plain
       * @type {string}
       * @api stable
       */
      this['text'] = xhrIo.getResponseText();
      /**
       * The JSON response object
       * @type {object}
       * @api stable
       */
      this['json'] = xhrIo.getResponseJson();
      /**
       * Show if the response is successfull
       * @type {string}
       * @api stable
       */
      this['success'] = this['json']['success'];

      /**
       * The server message
       * @type {string}
       * @api stable
       */
      this['message'] = this['json']['message'];
   }

   getData() {
     var optional = this.optional;
     if (this.type === "geojsonReceived") {
        return this['json'];

     } else if (this.type === "getobservationsDataReceived") {
        var observationObj = this['json']['data'];

        var values = observationObj[0]["result"]["DataArray"]["values"];

        var response = [];
        for (var i = 0; i < values.length; i++) {
           response.push({
              "date": values[i][0],
              "measurement": values[i][1]
           })
        }
        return response;

     } else if (this.type === "getObservationsByQualityIndexReceived") {
        var observations = this['json']['data'];

        var observationValues = observations[0]["result"]["DataArray"]["values"];

        var responseValues = [];
        for (var j = 0; j < observationValues.length; j++) {
           switch (optional["type"]) {
              case "lessThan":
                 if (observationValues[j][2] < optional["quality"]) {
                    responseValues.push(observationValues[j]);
                 }
                 break;
              case "lessThanAndEqual":
                 if (observationValues[j][2] <= optional["quality"]) {
                    responseValues.push(observationValues[j]);
                 }
                 break;
              case "equal":
                 if (observationValues[j][2] === optional["quality"]) {
                    responseValues.push(observationValues[j]);
                 }
                 break;
              case "greaterThanAndEqual":
                 if (observationValues[j][2] >= optional["quality"]) {
                    responseValues.push(observationValues[j]);
                 }
                 break;
              case "greaterThan":
                 if (observationValues[j][2] > optional["quality"]) {
                    responseValues.push(observationValues[j]);
                 }
                 break;
              case "between":
                 if (observationValues[j][2] >= optional["quality"][0] && observationValues[j][2] <= optional["quality"][1]) {
                    responseValues.push(observationValues[j]);
                 }
                 break;
              default:
                 console.log("WRONG CONSTRAINT TYPE FOR CHECKING QUALITY INDEX!!! SHOULD BE 'lessThan', 'lessThanAndEqual', 'equal', 'greaterThanAndEqual', 'greaterThan' or 'between'");
           }
        }
        this['json']['data'][0]["result"]["DataArray"]["values"] = responseValues;
        return this['json']['data'];
     } else {
        return this['json']['data'];
     }
   }
};
goog.inherits(istsos.events.JSONResponse, goog.events.Event);

istsos.events._Handler = new goog.events.EventTarget();

istsos.on = (eventType, func, opt_scope) => {
   istsos.events._Handler.listen(eventType, func, false, opt_scope);
};

istsos.once = (eventType, func, opt_scope) => {
   istsos.events._Handler.listenOnce(eventType, func, false, opt_scope);
};

istsos.fire = (eventType, event, opt_data) => {
   console.log("Firing event: " + eventType);
   istsos.events._Handler.dispatchEvent(new istsos.events.JSONResponse(eventType, event, opt_data););
};
