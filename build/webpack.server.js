const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
const nodeExternals = require('webpack-node-externals');
const base = require('./webpack.base.js');
const devMode = process.env.NODE_ENV === 'development';
module.exports = merge(base, {
    target: 'node',
    mode: devMode ? 'development' : 'production',
    devtool: devMode ? 'source-map' : false,
    resolve: {
        extensions: ['.js', '.jsx']
    },
    entry: ['./view/entry-server.js'],
    output: {
        libraryTarget: 'commonjs2',
        path: path.resolve(__dirname, '../static'),
        publicPath: '/static/',
        filename: 'server.bundle.js'
    },
    // externals: nodeExternals({
    //     whitelist: /\.css$/
    // }),
    module: {
        rules: [
            {
                test: /\.css$/,
                loader: ['css-loader']
            }
        ]
    },
});
