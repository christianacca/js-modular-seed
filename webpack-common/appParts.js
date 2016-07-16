const merge = require('webpack-merge');
const path = require('path');
const commonParts = require('./parts');

module.exports = createAppParts;

function createAppParts(sourceDir, isProd) {

    return Object.assign({}, commonParts, {
        asAppBundle,
        useHtmlPlugin,
        withEnvironment: commonParts.withEnvironment.bind(null, isProd)
    });

    /////

    function useHtmlPlugin() {
        var HtmlWebpackPlugin = require('html-webpack-plugin');
        return {
            plugins: [new HtmlWebpackPlugin({
                template: path.join(sourceDir, 'index.tpl.html')
            })]
        }
    }

    function asAppBundle() {
        const filename = isProd ? 'bundle.min.js' : 'bundle.js';
        return {
            entry: path.join(sourceDir, 'index.js'),
            output: {
                path: path.join(sourceDir, 'dist'),
                filename: filename
            }
        };
    }
}
