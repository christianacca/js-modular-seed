const merge = require('webpack-merge');
const path = require('path');
const commonParts = require('./parts');

module.exports = createLibraryParts;

function createLibraryParts(sourceDir, isProd) {
    const pkg = require(path.join(sourceDir, 'package'));
    const libraryName = pkg.name.split('/')[1];

    return Object.assign({}, commonParts, {
        excludePeerDependencies,
        standardConfigs,
        umdLibrary
    });

    /////

    function standardConfigs() {
        let common = merge(
            umdLibrary(),
            excludePeerDependencies()
        );

        if (isProd) {
            return merge(
                common,
                {
                    devtool: 'source-map',
                    bail: true
                },
                commonParts.prodOptimize()
            );
        } else {
            return merge(
                common,
                {
                    output: {
                        pathinfo: true
                    },
                    devtool: 'eval'
                }
            );
        }
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

    function excludePeerDependencies() {
        if (!pkg.peerDependencies) {
            return {};
        }

        const externals = Object.keys(pkg.peerDependencies).reduce((acc, key) => {
            return Object.assign(acc, { [key]: true })
        }, {});
        return { externals };
    }
}
