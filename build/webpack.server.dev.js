const path = require('path');
const webpack = require('webpack');
const ManifestPlugin = require('webpack-manifest-plugin');

const publicPath = '/static/';

module.exports = {
    target: 'node',
    mode: 'development',
    entry: ['./view/entry-server.js'],
    output: {
        libraryTarget: 'commonjs2',
        path: path.resolve(__dirname, '../static'),
        publicPath: publicPath,
        filename: 'js/server.bundle.js'
    },
    resolve: {
        modules: [
            "node_modules"
        ],
        extensions: ['.js', '.jsx', '.json']
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                loader: ['css-loader']
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: 'media/[name].[hash:8].[ext]',
                }
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: 'fonts/[name].[hash:7].[ext]'
                }
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('development')
            }
        }),
        new ManifestPlugin({
            fileName: 'server-manifest.json',
            publicPath: publicPath
        }),
    ]
};