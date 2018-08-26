const webpack = require('webpack');
const webpackManifestPlugin = require('webpack-manifest-plugin');
const miniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require('path');
const devMode = process.env.NODE_ENV === 'development';
module.exports = {
    mode: devMode ? 'development' : 'production',
    resolve: {
        extensions: ['.js', '.jsx']
    },
    entry: ['./src/entry-client.js'],
    output: {
        path: path.resolve(__dirname, '../static'),
        publicPath: '/static/',
        filename: 'client.bundle.js'
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
                loader: ['style-loader', 'css-loader']
            }
        ]
    },
    plugins: [
        // new miniCssExtractPlugin({
        //     filename: devMode ? '[name].css' : '[name].[hash].css',
        //     chunkFilename: devMode ? '[id].css' : '[id].[hash].css',
        // }),
        // new webpackManifestPlugin()
    ]
};

if (devMode) {
    module.exports.entry.push('webpack-hot-middleware/client');
    module.exports.plugins.push(new webpack.HotModuleReplacementPlugin());
    module.exports.devtool = 'cheap-module-source-map';
}