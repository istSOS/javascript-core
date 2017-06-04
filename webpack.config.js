const path = require('path');
const webpack = require('webpack');

module.exports = {
   context: path.resolve(__dirname, './src'),
   entry: {
      app: [
         "./Configuration.js",
         "./Date.js",
         "./ObservedProperty.js",
         "./ProcedureBase.js",
         "./Service.js",
         "./Database.js",
         "./EventHandling.js",
         "./Offering.js",
         "./Procedure.js",
         "./UnitOfMeasure.js",
         "./DataQuality.js",
         "./IstSOS.js",
         "./Output.js",
         "./Server.js",
         "./VirtualProcedure.js"
      ],
   },
   output: {
      path: path.resolve(__dirname, './dist'),
      filename: 'bundle.js',
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
         },
         {
             test: /src\/\.*\.js/,
             loader: path.resolve(__dirname, '../..'),
             options: {
                 paths: [
                     path.resolve(__dirname, 'src/'),
                 ],
                 es6mode: true,
             },
             exclude: [/test/, /node_modules/],
         }
      ],
   }
};
