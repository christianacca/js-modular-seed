const {merge} = require('./tools');
const path = require('path');
const commonParts = require('./parts');

module.exports = createLibraryParts;

function createLibraryParts(sourceDir, options = {}) {

    const PATHS = {
        source: path.join(sourceDir, 'src')
    };

    const pkg = require(path.join(sourceDir, 'package'));
    const libraryName = pkg.name.split('/')[1];

    return Object.assign({}, commonParts, {
        asUmdLibrary,
        excludeNodeModule,
        excludeNodeModules,
        inlineImages,
        sass,
        withEnvironment: commonParts.withEnvironment.bind(null, options.prod, options.debug)
    });

    /////

    function asUmdLibrary() {
        const filename = options.prod ? `${libraryName}.umd.min.js` : `${libraryName}.umd.js`;
        return {
            entry: path.join(sourceDir, 'index.js'),
            // tells webpack not to include in bundle require'd node specific objects (eg path)
            target: 'node',
            output: {
                path: path.join(sourceDir, 'bundles'),
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
                    { test: /\.(jpg|png)$/, loader: `url?limit=${sizeLimit}&name=[path][name].[ext]`, include: PATHS.source }
                ]
            }
        }
    }

    function sass() {
        // note: would like to use sourcemaps in a deployed website but these do not work with relative paths
        return {
            module: {
                loaders: [
                    { test: /\.scss$/, loaders: 'style!css!resolve-url!sass?sourceMap', include: PATHS.source }
                ]
            },
            resolveUrlLoader: {
                root: PATHS.source
            }
        };
    }
}
