const {merge, webpack} = require('./tools');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');

module.exports = createLibraryParts;

function createLibraryParts(rootDir, env = {}) {
    const commonParts = require('./parts')(rootDir, env);
    const pkg = require(path.join(rootDir, 'package'));
    const libraryName = pkg.name.indexOf('/') !== -1 ? pkg.name.split('/')[1] : pkg.name;

    const PATHS = {
        source: path.join(rootDir, 'src')
    };

    return Object.assign({}, commonParts, {
        asUmdLibrary,
        extractSass,
        excludeNodeModule,
        excludeNodeModules,
        inlineImages
    });

    /////

    function asUmdLibrary() {
        const filename = env.prod ? `[name].umd.min.js` : `[name].umd.js`;
        return {
            entry: {
                [libraryName]: path.join(rootDir, 'index.js')
            },
            // tells webpack not to include in bundle require'd node specific objects (eg path)
            target: 'node',
            output: {
                path: path.join(rootDir, 'bundles'),
                filename: filename,
                library: pkg.name,
                libraryTarget: 'umd',
                umdNamedDefine: true
            }
        };
    }

    function excludeNodeModule(modulePath, globalVar) {
        const [rootModule, ...childPathSegments] = modulePath.split('/');
        return {
            externals: [{
                [modulePath]: {
                    commonjs: modulePath,
                    commonjs2: modulePath,
                    // eg lodash/keysIn == ['lodash', 'keysIn'] in amd
                    amd: [rootModule, ...childPathSegments],
                    // eg lodash/keysIn == `_.keysIn` in global environment
                    root: [globalVar || rootModule, ...childPathSegments]
                }
            }]
        };
    }

    function excludeNodeModules(whitelist) {
        whitelist = [].concat(whitelist || []);
        const tests = getDependencies().map(packageName => new RegExp(`^${packageName}`));
        return {
            externals: [function (context, request, callback) {
                if (tests.some(x => x.test(request)) && !isWhitelisted(request))
                    return callback(null, request);
                callback();
            }]
        };

        function isWhitelisted(request) {
            return whitelist.some(function (pattern) {
                if (pattern instanceof RegExp) {
                    return pattern.test(request);
                } else {
                    return pattern == request;
                }
            });
        }
    }

    function extractSass(files) {

        // todo: discover the scss files rather than pass them in
        // todo: exclude redundant JS file created for each css chunk from the index.html file emitted by HtmlWebpackPlugin

        const filename = env.prod ? `${libraryName}.umd.min.css` : `${libraryName}.umd.css`;
        const extractor = new ExtractTextPlugin(filename);
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
                styles: files
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
                    name: libraryName,
                    minChunks: Infinity
                })
            ]
        };
    }

    function getDependencies() {
        var sections = ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies'];
        var deps = {};
        sections.forEach(function (section) {
            Object.keys(pkg[section] || {}).forEach(function (dep) {
                deps[dep] = true;
            });
        });
        return Object.keys(deps);
    }

    function inlineImages(sizeLimit = 1024) {
        return {
            module: {
                loaders: [
                    {
                        test: /\.(jpg|png)$/,
                        loader: `url?limit=${sizeLimit}&name=[path][name].[ext]`,
                        include: PATHS.source
                    }
                ]
            }
        }
    }
}