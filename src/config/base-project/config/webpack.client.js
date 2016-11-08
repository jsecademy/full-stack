const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const root = require('app-root-path').path;

module.exports = {
    devtool: 'cheap-module-eval-source-map',
    entry: {
        polyfills: `${root}/client/polyfills.ts`,
        vendor: `${root}/client/vendor.ts`,
        app: [`${root}/client/app.ts`]
    },
    output: {
        path: `${root}/build/client`,
        publicPath: '/',
        filename: '[name].js',
        chunkFilename: '[id].chunk.js'
    },
    resolve: {
        extensions: ['', '.js', '.ts']
    },
    module: {
        loaders: [{
                test: /\.ts$/,
                loaders: ['awesome-typescript-loader', 'angular2-template-loader']
            },
            {
                test: /\.html$/,
                loader: 'html'
            },
            {
                test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
                loader: 'file?name=assets/[name].[hash].[ext]'
            },
            {
                test: /\.css$/,
                exclude: `${root}/client/components`,
                loader: ExtractTextPlugin.extract('style', 'css?sourceMap')
            },
            {
                test: /\.css$/,
                include: `${root}/client/components`,
                loader: 'raw'
            }
        ]
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: ['app', 'vendor', 'polyfills']
        }),

        new HtmlWebpackPlugin({
            template: `${root}/client/index.html`
        }),
        new ExtractTextPlugin('[name].css')
    ],
    devServer: {
        historyApiFallback: true,
        port: 3000,
        host: '0.0.0.0',
        inline: true,
        progress: true,
        stats: 'minimal',
        proxy: {}
    }
};