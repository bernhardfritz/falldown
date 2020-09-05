const { merge } = require('webpack-merge');
const TerserPlugin = require('terser-webpack-plugin');
const path = require('path');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    mode: 'production',
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    mangle: {
                        properties: {
                            regex: /^_/, // mangle private properties
                        },
                    },
                },
            }),
        ],
    },
    output: {
        filename: 'main.min.js',
        path: path.resolve(__dirname, 'dist'),
    },
});