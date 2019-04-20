/* eslint-disable import/no-commonjs, global-require */
const webpack = require('webpack');
const path = require('path');
const ExtractCssChunks = require('extract-css-chunks-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const Stylish = require('webpack-stylish');

const postcssConfig = require('./postcssPlugins.js');

const cssLocalIdentName = '[name]__[local]_[hash:base64:5]'; // '[hash:base64:5]'
const isSourceMapEnabled = !!process.env.SOURCE_MAP;

let
    common = {
        entry: {
            app: './src/apps/app/AppProvider.jsx',
            admin: './src/apps/admin/App'
        },
        resolve: {
            extensions: ['.js', '.jsx'],
            alias: {
                src: path.resolve(__dirname, 'src')
            }
        },
        mode: 'development',
        optimization: {
            minimize: false,
            splitChunks: {
                chunks: 'all',
                name: 'vendor'
            },
            runtimeChunk: false
        },
        module: {
            rules: [
                {
                    test: /\.ttf$/,
                    loader: 'url-loader',
                    options: {
                        limit: 1000,
                        mimetype: 'application/octet-stream'
                    }
                },
                {
                    test: /\.eot$/,
                    loader: 'file-loader'
                },
                {
                    test: /\.svg$/,
                    loader: 'file-loader'
                },
                {
                    test: /\.png$/,
                    loader: 'url-loader',
                    options: {
                        limit: 1000,
                        mimetype: 'image/png'
                    }
                },
                {
                    test: /\.gif$/,
                    loader: 'url-loader',
                    options: {
                        limit: 1000,
                        mimetype: 'image/gif'
                    }
                },
                {
                    test: /\.jpg$/,
                    loader: 'url-loader',
                    options: {
                        limit: 1000,
                        mimetype: 'image/jpg'
                    }
                },
                {
                    test: /\.webp$/,
                    loader: 'url-loader',
                    options: {
                        limit: 1000,
                        mimetype: 'image/webp'
                    }
                },
                {
                    test: /\.css?$/,
                    use: [
                        ExtractCssChunks.loader,
                        {
                            loader: 'cache-loader',
                            options: {
                                cacheDirectory: path.resolve('.tmp/cache-loader')
                            }
                        },
                        {
                            loader: 'css-loader',
                            options: {
                                minimize: false,
                                modules: true,
                                localIdentName: cssLocalIdentName,
                                sourceMap: isSourceMapEnabled,
                                importLoaders: 1
                            }
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                plugins: postcssConfig,
                                sourceMap: isSourceMapEnabled
                            }
                        }
                    ]
                }
            ]
        },
        plugins: [
            new CleanWebpackPlugin(['public'], {
                root: path.join(__dirname, '..')
            }),
            new webpack.NormalModuleReplacementPlugin(/babel-runtime\/core-js\/promise/, path.resolve(__dirname, '../utils/polyfill/promise')),
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),

                'process.env.BROWSER': process.env.BROWSER || false,
                'process.env.SERVER': process.env.SERVER || false,

                'process.env.ENABLE_DEVTOOLS': process.env.NODE_ENV === 'development'
            }),
            new Stylish()
        ]
    };

module.exports = common;
