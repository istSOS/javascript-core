const path = require('path');
const webpack = require('webpack');
module.exports = {
   context: path.resolve(__dirname, './src'),
   entry: {
      app: './index.js'
   },
   output: {
      path: path.resolve(__dirname, './dist'),
      filename: 'istsos.js',
      library: 'istsos',
      libraryTarget: 'umd'
   },
   resolve: {
      alias: {
         ServerContainer: path.resolve(__dirname, 'src/ServerContainer.js'),
         Date: path.resolve(__dirname, 'src/Date.js'),
         Database: path.resolve(__dirname, 'src/Database.js'),
         Configuration: path.resolve(__dirname, 'src/Configuration.js'),
         Server: path.resolve(__dirname, 'src/Server.js'),
         ObservedProperty: path.resolve(__dirname, 'src/ObservedProperty.js'),
         ProcedureBase: path.resolve(__dirname, 'src/ProcedureBase.js'),
         Service: path.resolve(__dirname, 'src/Service.js'),
         EventTypes: path.resolve(__dirname, 'src/EventTypes.js'),
         EventEmitter: path.resolve(__dirname, 'src/EventEmitter.js'),
         Offering: path.resolve(__dirname, 'src/Offering.js'),
         Procedure: path.resolve(__dirname, 'src/Procedure.js'),
         VirtualProcedure: path.resolve(__dirname, 'src/VirtualProcedure.js'),
         UnitOfMeasure: path.resolve(__dirname, 'src/UnitOfMeasure.js'),
         DataQuality: path.resolve(__dirname, 'src/DataQuality.js'),
         Output: path.resolve(__dirname, 'src/Output.js'),
         HttpAPI: path.resolve(__dirname, 'src/HttpAPI.js'),
         IstsosHelper: path.resolve(__dirname, 'src/IstsosHelper.js')
      }
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
      }],

   },
   plugins: [
      new webpack.HotModuleReplacementPlugin() // Enable HMR
   ],
   devServer: {
      historyApiFallback: true,
      contentBase: './',
      port: 9005,
      inline: true,
      hot: true
   }
};