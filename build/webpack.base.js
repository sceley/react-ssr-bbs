const path = require('path');
const webpack = require('webpack');
const webpackManifestPlugin = require('webpack-manifest-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const devMode = process.env.NODE_ENV === 'development';
module.exports = {
    mode: devMode ? 'development' : 'production',
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
                loader: [
                    'babel-loader'
                ],
                exclude: /node_modules/
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    'url-loader'
                ]
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    'url-loader'
                ]
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: devMode ? JSON.stringify('development') : JSON.stringify('production')
            }
        })
    ]
};

if (!devMode) {
    module.exports.optimization = {
        minimizer: [
            new UglifyJsPlugin({
                uglifyOptions: {
                    compress: {
                        ecma: 5,
                        warnings: false,
                        comparisons: false,
                    }
                }
            })
        ]
    };
}