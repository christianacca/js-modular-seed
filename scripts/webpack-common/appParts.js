const {merge, webpack} = require('./tools');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');

module.exports = createAppParts;

function createAppParts(rootDir, env = {}) {
    const commonParts = require('./parts')(rootDir, env);
    const utils = require('./appUtil')(rootDir);
    const pkg = utils.pkg;

    let PATHS = {
        build: path.join(rootDir, 'build'),
        source: path.join(rootDir, 'src'),
        project: path.resolve(rootDir, '../../')
    };

    return Object.assign({}, commonParts, {
        asAppBundle,
        extractSassChunks,
        inlineImages,
        resolveLibraryPeerDependencies,
        useHtmlPlugin,
        utils
    });

    /////

    function hmr() {
        return {
            devServer: {
                hot: true
            },
            plugins: [// Enable multi-pass compilation for enhanced performance
                // in larger projects. Good default.
                new webpack.HotModuleReplacementPlugin({
                    multiStep: true
                })]
        }
    }

    function devServer() {
        return {
            devServer: {
                inline: true,
                // Parse host and port from env to allow customization.
                //
                // If you use Vagrant or Cloud9, set
                // host: options.host || '0.0.0.0';
                //
                // 0.0.0.0 is available to all network devices
                // unlike default `localhost`.
                host: env.host, // Defaults to `localhost`
                port: env.port, // Defaults to 8080
                contentBase: 'build/',
                historyApiFallback: true,
                stats: 'errors-only' // none (or false), errors-only, minimal, normal (or true) and verbose
            }
        };
    }

    function getLibraryPackageDefs() {
        return utils.getLibraryPaths()
            .map(libPath => path.join(libPath, 'package'))
            .map(pkgPath => require(pkgPath));
    }

    /**
     * override the webpack resolution logic but only for peer dependencies defined by our libraries.
     * This is necessary because the standard resolve breaks down when using symlinks
     */
    function resolveLibraryPeerDependencies() {
        const peerDependencies = Object.keys(
            getLibraryPackageDefs().reduce((acc, pkg) => {
                return Object.assign(acc, pkg.peerDependencies);
            }, {})
        );
        const alias = peerDependencies.reduce((acc, name) => {
            acc[name] = path.join(rootDir, 'node_modules', name);
            return acc;
        }, {});
        return {
            resolve: { alias }
        };
    }

    function useHtmlPlugin() {
        var HtmlWebpackPlugin = require('html-webpack-plugin');
        return {
            plugins: [new HtmlWebpackPlugin({
                template: path.join(rootDir, 'index.tpl.html')
            })]
        }
    }

    function extractSassChunks(entries) {

        // todo: exclude redundant JS file created for each css chunk from the index.html file emitted by HtmlWebpackPlugin

        const extractedPaths = Object.keys(entries).reduce((acc, entryName) => {
            const files = entries[entryName];
            return acc.concat(Array.isArray(files) ? files : [files]);
        }, []);

        const chunks = Object.keys(entries).reduce((acc, entryName) => {
            const chunk = _extractSassChunk(entryName, entries[entryName]);
            return acc.concat([chunk]);
        }, []);

        return merge(
            ...chunks,
            commonParts.sass(extractedPaths)
        );
    }

    function _extractSassChunk(entryName, files) {
        const extractor = new ExtractTextPlugin('[name].[chunkhash].css');
        let loader;
        if (env.debug || env.prod) {
            // note: we CAN use source maps for *extracted* css files in a deployed website without 
            // suffering from the problem of image urls not resolving to the correct path
            loader = 'css?sourceMap!resolve-url!sass?sourceMap';
        } else {
            loader = 'css!resolve-url!sass?sourceMap';
        }
        return {
            entry: {
                [entryName]: files
            },
            module: {
                loaders: [
                    {
                        test: /\.scss$/,
                        loader: extractor.extract({
                            fallbackLoader: 'style',
                            loader: loader
                        }),
                        include: files
                    }
                ]
            },
            plugins: [
                extractor,
                new webpack.optimize.CommonsChunkPlugin({
                    name: entryName,
                    chunks: ['main', entryName]
                })
            ]
        };
    }

    function inlineImages(sizeLimit = 1024) {
        return {
            module: {
                loaders: [
                    { 
                        test: /\.(jpg|png)$/, 
                        loader: `url?limit=${sizeLimit}&name=[path][name]-[hash].[ext]`, 
                        exclude: /node_modules/ 
                    }
                ]
            }
        }
    }

    function asAppBundle() {
        const isNodeModule = new RegExp('node_modules');

        const common = merge(
            {
                entry: {
                    main: path.join(PATHS.source, 'main.js')
                },
                output: {
                    path: PATHS.build,
                    filename: '[name].[chunkhash].js',
                    // This is used for require.ensure if/when we want to use it
                    chunkFilename: '[chunkhash].js'
                },
                plugins: [
                    // include node_modules requested in a seperate bundle. This will include:
                    // - all node_modules request by our app
                    // - "external" node_modules requested by our libraries - those node_modules
                    //   that are not otherwise bundled into that library
                    new webpack.optimize.CommonsChunkPlugin({
                        name: 'vendor',
                        minChunks: module => isNodeModule.test(module.resource)
                    }),
                    // extract webpack manifest file into it's own chunk to ensure vendor hash does not change 
                    // (as per solution discuess here https://github.com/webpack/webpack/issues/1315)
                    new webpack.optimize.CommonsChunkPlugin({
                        name: 'manifest',
                        minChunks: Infinity
                    })
                ]
            },
            devServer()
        );

        if (utils.isDevServer) {
            return merge(
                common,
                {
                    output: {
                        // ensure urls in css work in conjunction with source maps
                        // this is required because of the limitation of style-loader
                        // (see https://github.com/webpack/style-loader#recommended-configuration)
                        publicPath: 'http://localhost:8080/'
                    }
                }//,
                // hot module reload not working; wanted it for the css :-(
                // hmr()
            );
        } else {
            // note: we can't configure webpack to use root relative paths (ie publicPath: '/') as this limits
            // site deployment to always the root of that website; in IIS for example it's common to use
            // a subdirectory as the root folder for the web app
            return common;
        }
    }
}
