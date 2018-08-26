const webpack = require('webpack');
const path = require('path');
const devMode = process.env.NODE_ENV === 'development';
module.exports = {
    target: 'node',
    mode: devMode ? 'development' : 'production',
    resolve: {
        extensions: ['.js', '.jsx']
    },
    entry: ['./src/entry-server.js'],
    output: {
        libraryTarget: 'commonjs2',
        path: path.resolve(__dirname, '../static'),
        publicPath: '/static/',
        filename: 'server.bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                loader: ['babel-loader'],
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                loader: ['css-loader']
            }
        ]
    },
};