const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/index.ts',
    module: {
        rules: [{
            test: /\.ts$/,
            use: 'ts-loader',
            exclude: /node_modules/,
        },],
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    plugins: [new HtmlWebpackPlugin()]
};