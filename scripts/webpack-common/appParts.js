const {merge, webpack} = require('./tools');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const commonParts = require('./parts');

module.exports = createAppParts;

function createAppParts(rootDir, options = {}) {
    const PATHS = {
        build: path.join(rootDir, 'build'),
        source: path.join(rootDir, 'src'),
        project: path.resolve(rootDir, '../'),
        scripts: path.resolve(rootDir, '../scripts')
    };

    const utils = require('./appUtil')(rootDir);
    const pkg = utils.pkg;

    return Object.assign({}, commonParts, {
        asAppBundle,
        sass,
        extractSassChunks,
        resolveLibraryPeerDependencies,
        resolveLoaders,
        useHtmlPlugin,
        withEnvironment: commonParts.withEnvironment.bind(null, options.prod, options.debug),
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
                host: options.host, // Defaults to `localhost`
                port: options.port, // Defaults to 8080
                contentBase: 'build/',
                historyApiFallback: true,
                stats: 'errors-only' // none (or false), errors-only, minimal, normal (or true) and verbose
            }
        };
    }

    function getLibraryPackageDefs() {
        return utils.getLibraryNames()
            .map(name => path.join(rootDir, 'node_modules', utils.projectScopeName, name, 'package'))
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

    function resolveLoaders() {
        return {
            resolveLoader: {
                modules: [path.join(PATHS.scripts, 'node_modules')]
            }
        }
    }

    function useHtmlPlugin() {
        var HtmlWebpackPlugin = require('html-webpack-plugin');
        return {
            plugins: [new HtmlWebpackPlugin({
                template: path.join(rootDir, 'index.tpl.html')
            })]
        }
    }

    function sass(excludeFiles) {
        let loaders;
        if (options.debug || options.prod) {
            loaders = 'style!css?sourceMap!sass?sourceMap';
        } else {
            loaders = 'style!css!sass';
        }
        return {
            module: {
                loaders: [
                    { test: /\.scss$/, loaders: loaders, include: PATHS.source, exclude: excludeFiles }
                ]
            }
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
            sass(extractedPaths)
        );
    }

    function _extractSassChunk(entryName, files) {
        const extractor = new ExtractTextPlugin('[name].[chunkhash].css');
        let loader;
        if (options.debug || options.prod) {
            loader = 'css?sourceMap!sass?sourceMap';
        } else {
            loader = 'css!sass';
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
                    chunks: ['app', entryName]
                })
            ]
        };
    }

    function extractCss(paths = PATHS.source) {
        const ExtractTextPlugin = require('extract-text-webpack-plugin');
        return {
            module: {
                loaders: [
                    // Extract CSS during build
                    {
                        test: /\.css$/,
                        loader: ExtractTextPlugin.extract({
                            fallbackLoader: "style",
                            loader: "css?sourceMap"
                        }),
                        include: paths
                    }
                ]
            },
            plugins: [
                // Output extracted CSS to a file
                new ExtractTextPlugin('[name].[chunkhash].css')
            ]
        };
    }


    function inlineImages(sizeLimit = 1024) {
        return {
            module: {
                loaders: [
                    { test: /\.(jpg|png)$/, loader: `url?limit=${sizeLimit}&name=[path][name]-[hash].[ext]`, include: PATHS.source }
                ]
            }
        }
    }

    function asAppBundle() {
        const isNodeModule = new RegExp('node_modules');

        return merge(
            {
                entry: {
                    app: path.join(PATHS.source, 'main.js')
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
                    // - "external"" node_modules requested by our libraries - those node_modules
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
            devServer(),
            // hot module reload not working; wanted it for the css :-(
            // hmr(),
            inlineImages()
        );
    }
}
