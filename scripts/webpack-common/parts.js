const {merge, webpack} = require('./tools');
const path = require('path');

module.exports = createParts;

function createParts(rootDir, options) {

    const isDevServer = process.argv.find(v => v.indexOf('webpack-dev-server') !== -1);

    return {
        tools: {
            merge,
            webpack
        },
        prodOptimize,
        resolveLoaders,
        sass,
        withEnvironment
    };

    ////////

    function prodOptimize() {
        return {
            plugins: [
                // doesn't save anything in this small app. npm@3 mostly takes care of this
                new webpack.optimize.DedupePlugin(),
                new webpack.LoaderOptionsPlugin({
                    minimize: true,
                    debug: false,
                    quiet: true,
                }),
                new webpack.DefinePlugin({
                    'process.env': {
                        NODE_ENV: '"production"',
                    },
                }),
                new webpack.optimize.UglifyJsPlugin({
                    compress: {
                        screw_ie8: true, // eslint-disable-line
                        warnings: false,
                    },
                    sourceMap: true
                })
            ]
        };
    }

    function resolveLoaders() {
        return {
            resolveLoader: {
                modules: [path.resolve(__dirname, '..', 'node_modules')]
            }
        }
    }

    function sass(excludeFiles) {
        excludeFiles = excludeFiles || [];
        // note: would like to use sourcemaps in a deployed website (ie outside of dev-server)
        // but these do not work with relative paths (see the configuration of ouput options 
        // in this file for more details)
        let loaders;
        if ((options.debug || options.prod) && isDevServer) {
            loaders = 'style!css?sourceMap!resolve-url!sass?sourceMap';
        } else {
            // note: the 
            loaders = 'style!css!resolve-url!sass?sourceMap';
        }
        return {
            module: {
                loaders: [
                    {
                        test: /\.scss$/,
                        loaders: loaders,
                        exclude: [/node_modules/, ...excludeFiles]
                    }
                ]
            }
        };
    }

    function withEnvironment() {
        if (options.prod) {
            return merge(
                {
                    devtool: 'source-map',
                    bail: true
                },
                prodOptimize()
            );
        } else if (options.debug) {
            return {
                output: {
                    pathinfo: true
                },
                // note: wanted to use eval-source-map to increase build times, but chrome would not stop on breakpoint
                // therefore instead using source-map
                devtool: 'source-map'
            };
        } else {
            return {
                devtool: 'eval'
            };
        }
    }
}