const merge = require('webpack-merge');
const path = require('path');
const commonParts = require('./parts');

module.exports = createLibraryParts;

function createLibraryParts(sourceDir, isProd) {
    const pkg = require(path.join(sourceDir, 'package'));
    const libraryName = pkg.name.split('/')[1];

    return Object.assign({}, commonParts, {
        environment,
        excludeNodeModule,
        excludeNodeModules,
        umdLibrary
    });

    /////

    function environment(isProd) {
        if (isProd) {
            return merge(
                {
                    devtool: 'source-map',
                    bail: true
                },
                commonParts.prodOptimize()
            );
        } else {
            return {
                output: {
                    pathinfo: true
                },
                devtool: 'eval'
            };
        }
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

    function umdLibrary() {
        const filename = isProd ? `${libraryName}.umd.min.js` : `${libraryName}.umd.js`;
        return {
            entry: path.join(sourceDir, 'index.js'),
            output: {
                path: path.join(sourceDir, 'bundles'),
                filename: filename,
                library: pkg.name,
                libraryTarget: 'umd',
                umdNamedDefine: true
            }
        };
    }
}
