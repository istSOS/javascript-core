const path = require('path');
const webpack = require('webpack');

module.exports = {
   context: path.resolve(__dirname, './src'),
   entry: {
      app: [
        "../node_modules/closure-library/closure/goog/base.js",
        "./index.js",
        "./ServerContainer.js",
        "./Date.js",
        //  "./Database.js",
        //  "./Configuration.js",
        // "./Server.js",
        //  "./ObservedProperty.js",
        //  "./ProcedureBase.js",
        //  "./Service.js",
        //  "./EventHandling.js",
        //  "./Offering.js",
        //  "./Procedure.js",
        //  "./UnitOfMeasure.js",
        //  "./DataQuality.js",
        //  "./Output.js",
        //  "./VirtualProcedure.js"
      ],
   },
   output: {
      path: path.resolve(__dirname, './dist'),
      filename: 'istsos.js',
   },
   module: {
      rules: [{
            test: /\.js$/,
            exclude: [/node_modules/],
            use: [{
               loader: 'babel-loader',
               options: {
                  presets: ['es2015']
               },
            }],
         }
      ],
   }
};
