const merge = require('webpack-merge');
const path = require('path');
const webpack = require('webpack');
const commonParts = require('./parts');

module.exports = createAppParts;

function createAppParts(sourceDir, isProd) {
    const PATHS = {
        build: path.join(sourceDir, 'build'),
        project: path.resolve(sourceDir, '../')
    };

    const rootPkg = require(path.resolve(PATHS.project, 'package'));
    const pkg = require(path.join(sourceDir, 'package'));


    return Object.assign({}, commonParts, {
        asAppBundle,
        useHtmlPlugin,
        withEnvironment: commonParts.withEnvironment.bind(null, isProd)
    });

    /////

    function getLibraryNames() {
        const projectScopeName = `@${rootPkg.name}`;
        return Object.keys(pkg.dependencies)
            .filter(name => name.startsWith(projectScopeName))
            .map(name => name.split('/')[1]);
    }

    function moduleResolvePaths() {
        let libraryNodeModulesPath = getLibraryNames()
            .map(name => path.join(PATHS.project, 'lib', name, 'node_modules'));
        return {
            resolve: {
                modules: [sourceDir, path.join(sourceDir, 'node_modules'), ...libraryNodeModulesPath]
            }
        }
    }

    function useHtmlPlugin() {
        var HtmlWebpackPlugin = require('html-webpack-plugin');
        return {
            plugins: [new HtmlWebpackPlugin({
                template: path.join(sourceDir, 'index.tpl.html')
            })]
        }
    }

    function asAppBundle() {
        const isNodeModule = new RegExp('node_modules');
        return merge(
            {
                entry: {
                    app: path.join(sourceDir, 'index.js')
                },
                output: {
                    path: PATHS.build,
                    filename: '[name].[chunkhash].js',
                    // This is used for require.ensure if/when we want to use it
                    chunkFilename: '[chunkhash].js'
                },
                plugins: [
                    new webpack.optimize.CommonsChunkPlugin({
                        name: 'vendor',
                        minChunks: module => isNodeModule.test(module.resource)
                    }),
                    // ensure vendor hash does not change (as per solution discuess here https://github.com/webpack/webpack/issues/1315)
                    new webpack.optimize.CommonsChunkPlugin({
                        name: 'manifest',
                        minChunks: Infinity
                    })
                ]
            },
            moduleResolvePaths()
        );
    }
}
