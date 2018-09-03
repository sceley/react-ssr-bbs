const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');
// const webpackManifestPlugin = require('webpack-manifest-plugin');
// const miniCssExtractPlugin = require("mini-css-extract-plugin");
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const base = require('./webpack.base.js');
const devMode = process.env.NODE_ENV === 'development';
module.exports = merge(base, {
    devtool: devMode ? 'cheap-module-source-map' : false,
    entry: ['./view/entry-client.js'],
    output: {
        path: path.resolve(__dirname, '../static'),
        publicPath: '/static/',
        filename: 'client.bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                loader: ['style-loader', 'css-loader']
            }
        ]
    }
});

if (devMode) {
    module.exports.entry.push('webpack-hot-middleware/client');
    module.exports.plugins.push(new webpack.HotModuleReplacementPlugin());
}