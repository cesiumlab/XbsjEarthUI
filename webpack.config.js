var path = require('path')
var webpack = require('webpack')
var CleanWebpackPlugin = require('clean-webpack-plugin');
var HtmlwebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var packageJson = require('./package.json');
var version = packageJson.version;

module.exports = {
    entry: {
        'XbsjEarthUI/XbsjEarthUI': './Source/index',
        'XbsjEarthUI/xbsj': './Source/xbsj',
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: '[name].js',
        library: 'XbsjEarthUI',
        libraryTarget: 'var'
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                use: [
                    {
                        loader: 'vue-loader',
                        options: {
                            // extractCSS: process.env.NODE_ENV === 'production',
                            loaders: {
                                sass:
                                    'vue-style-loader!css-loader!sass-loader?indentedSyntax=1',
                                scss: 'vue-style-loader!css-loader!sass-loader',
                                less: 'vue-style-loader!css-loader!less-loader'
                            }
                        }
                    },
                    {
                        loader: 'iview-loader',
                        options: {
                            prefix: false
                        }
                    }
                ]
            },
            {
                test: /\.scss$/,
                use: ['vue-style-loader', 'css-loader', 'sass-loader']
            },
            {
                test: /\.sass$/,
                use: ['vue-style-loader', 'css-loader', 'sass-loader?indentedSyntax']
            },
            {
                test: /\.less$/,
                use: ['vue-style-loader', 'css-loader', 'less-loader']
            },
            {
                test: /\.css$/,
                use: ['vue-style-loader', 'css-loader']
            },
            {
                test: /\.html$/,
                use: 'vue-html-loader'
            },
            {
                test: /\.js$/,
                use: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.node$/,
                use: 'node-loader'
            },
            // {
            //     test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
            //     use: {
            //         loader: 'url-loader',
            //         query: {
            //             limit: 10000,
            //             name: 'imgs/[name]--[folder].[ext]'
            //         }
            //     }
            // },
            // {
            //     test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
            //     loader: 'url-loader',
            //     options: {
            //         limit: 10000,
            //         name: 'media/[name]--[folder].[ext]'
            //     }
            // },
            // {
            //     test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
            //     use: {
            //         loader: 'url-loader',
            //         query: {
            //             limit: 10000,
            //             name: 'fonts/[name]--[folder].[ext]'
            //         }
            //     }
            // },
            {
                test: /\.ts$/,
                use: "ts-loader",
                exclude: /node_modules/
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            // 使用url-loader来替换
            // {
            //     test: /\.(png|jpg|gif|svg)$/,
            //     loader: 'file-loader',
            //     options: {
            //         name: '[path][name].[ext]?[hash]',
            //         useRelativePath: false,
            //         // TODO(vtxf): 这里还有问题
            //         outputPath: function(url){//返回最终的资源相对路径
            //             // console.log('url:' + url);
            //             var path = url.replace(/Demos\/.*?\//g, './');
            //             return path;
            //         },
            //         emitFile: false
            //     }
            // },
            {
                test: /\.(gif|jpg|png|woff|woff2|svg|eot|ttf|topojson|ktx)$/,
                loader: 'url-loader',
                options: {
                    limit: 819200,
                    name: '[name].[hash].[ext]',
                    useRelativePath: false, // 如果是true，会自带引入的路径，这样不好
                    outputPath: './Demos/static/assets', // dist目录下的输出路径
                    publicPath: '../static/assets', // html文件改写的路径
                }
            },
            {
                test: /\.html$/,
                loader: 'raw-loader'
            },
        ]
    },
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
        },
        extensions: ['*', '.js', '.vue', '.json']
    },
    performance: {
        hints: false
    },
    // devtool: '#eval-source-map',
    devServer: {
        historyApiFallback: true,
        noInfo: false, // 升级webpack4以后，需要打开才能正常调试... vtxf 20201103
        overlay: true,
        contentBase: path.join(__dirname, "dist"), // 只有加载静态文件时才需要，比如文档
        port: 9530,
        host: '0.0.0.0',
        hot: true,
        proxy: {
            '/api': {
                target: 'http://localhost:8070/api',
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                    '^/api': ''
                }
            }
        }
    }
}

module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
        'VERSION': JSON.stringify(version),
    }),
    new CopyWebpackPlugin([
        // 'Apps/**/*',
        'index.html',
        {
            // from: 'Static/XbsjCesium', // 如果使用指定的XbsjCesium
            from: process.env.XBSJ_IMPORT !== 'external' ? './node_modules/earthsdk/dist/XbsjCesium' : 'Static/XbsjCesium',
            to: 'XbsjCesium',
            toType: 'dir'
        },
        {
            // from: 'Static/XbsjEarth', // 如果使用指定的XbsjEarth，可以在这里修改下
            from: process.env.XBSJ_IMPORT !== 'external' ? './node_modules/earthsdk/dist/XbsjEarth' : 'Static/XbsjEarth',
            to: 'XbsjEarth',
            toType: 'dir'
        },
        {
            from: process.env.XBSJ_IMPORT !== 'external' ? './node_modules/earthsdk-plotting-symbol/dist/XbsjEarth-Plugins/plottingSymbol' : 'Static/XbsjEarth-Plugins/plottingSymbol',
            to: 'XbsjEarth-Plugins/plottingSymbol',
            toType: 'dir'
        },
        {
            // TODO(vtxf): 暂时不从node_modules读取
            from: process.env.XBSJ_IMPORT !== 'external' ? './node_modules/earthsdk-custom-primitive/dist/XbsjEarth-Plugins/customPrimitive' : 'Static/XbsjEarth-Plugins/customPrimitive',
            // from: 'Static/XbsjEarth-Plugins/customPrimitive',
            to: 'XbsjEarth-Plugins/customPrimitive',
            toType: 'dir'
        },
        {
            from: 'Static/XbsjEarth-Private-Plugins',
            // from: 'Static/XbsjEarth-Plugins/customPrimitive',
            to: 'XbsjEarth-Plugins',
            // toType: 'dir'
        },
        {
            from: 'Static/assets',
            to: 'XbsjEarthUI/assets',
            toType: 'dir'
        },
        {
            from: 'Apps',
            to: 'Apps',
            toType: 'dir',
            transform (content, path) {
                if (!path.endsWith('.html')) {
                    return content;
                }

                var cs = content.toString('utf8');
                if (process.env.NODE_ENV === 'xbsjDebug') {
                    // cs = cs.replace(/\/\/xbsjDebug\b/g, '');
                    cs = cs.replace(/\<head>/, `<head>
    <script>
        window.xbsjEarthDir = 'http://127.0.0.1:9529/XbsjEarth/';
    </script>`)
                    cs = cs.replace(/['"].*\/XbsjEarth.js['"]/, `"http://127.0.0.1:9529/XbsjEarth/XbsjEarth.js"`);
                    return cs;
                } else if (process.env.NODE_ENV === 'xbsjDebug2') {
                    // cs = cs.replace(/\/\/xbsjDebug2\b/g, '');
                    cs = cs.replace(/\<head>/, `<head>
    <script>
        window.xbsjEarthDir = 'http://127.0.0.1:9529/XbsjEarth/';
        window.xbsjCesiumDir = 'http://127.0.0.1:9527/XbsjCesium/';
    </script>`)
                    cs = cs.replace(/['"].*\/XbsjEarth.js['"]/, `"http://127.0.0.1:9529/XbsjEarth/XbsjEarth.js"`);
                    return cs;
                } else if (process.env.NODE_ENV === 'xbsjDebug3') {
                    // cs = cs.replace(/\/\/xbsjDebug2\b/g, '');
                    cs = cs.replace(/\<head>/, `<head>
    <script>
        window.xbsjNativeCesiumDir = '//localhost:8080/Source/';
        window.xbsjEarthDir = 'http://127.0.0.1:9529/XbsjEarth/';
        window.xbsjCesiumDir = 'http://127.0.0.1:9527/XbsjCesium/';
    </script>`)
                    cs = cs.replace(/['"].*\/XbsjEarth.js['"]/, `"http://127.0.0.1:9529/XbsjEarth/XbsjEarth.js"`);
                    return cs;
                } else {
                    return content;
                }
            },
        }
    ], {
        ignore: process.env.NODE_ENV === 'production' ? [
            '.gitignore',
            '*.map',
        ] : [
            '.gitignore',
        ]
    }),
    new webpack.HotModuleReplacementPlugin(),
]);

if (process.env.NODE_ENV === 'production') {
    module.exports.devtool = false // 不生成source map

    // webpack 4.0升级以后需要的 vtxf 20200812
    // module.exports.optimization = module.exports.optimization || {};
    // module.exports.optimization.minimize = false;
    module.exports.mode = "production";

    // http://vue-loader.vuejs.org/en/workflow/production.html
    module.exports.plugins = (module.exports.plugins || []).concat([
        new CleanWebpackPlugin('./dist'),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        // new webpack.optimize.UglifyJsPlugin({
        //     sourceMap: false,
        //     compress: {
        //         warnings: false
        //     }
        // }),
        new webpack.LoaderOptionsPlugin({
            minimize: true
        }),
    ])
} else {
    // module.exports.devtool = '#source-map';
    module.exports.devtool = '#eval-source-map';
}