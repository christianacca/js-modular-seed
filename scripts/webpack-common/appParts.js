const {merge, webpack} = require('./tools');
const path = require('path');
const commonParts = require('./parts');

module.exports = createAppParts;

function createAppParts(sourceDir, options = {}) {
    const PATHS = {
        build: path.join(sourceDir, 'build'),
        project: path.resolve(sourceDir, '../')
    };

    const appUtil = require('./appUtil')(sourceDir);
    const pkg = appUtil.pkg;

    return Object.assign({}, commonParts, {
        asAppBundle,
        resolveLibraryPeerDependencies,
        useHtmlPlugin,
        withEnvironment: commonParts.withEnvironment.bind(null, options.prod, options.debug)
    });

    /////

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
        return appUtil.getLibraryNames()
            .map(name => path.join(sourceDir, 'node_modules', appUtil.projectScopeName, name, 'package'))
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
            acc[name] = path.join(sourceDir, 'node_modules', name);
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
            devServer()
        );
    }
}
