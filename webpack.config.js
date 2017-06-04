const path = require('path');
const webpack = require('webpack');

module.exports = {
   context: path.resolve(__dirname, './src'),
   entry: {
      app: ['./test.js'],
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
            test: /\/src\/.*\.js$/,
            loaders: [
               'closure-loader'
            ],
            exclude: [/node_modules/, /test/]
         }
      ],
   }
};
