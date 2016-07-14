const path = require('path');
const merge = require('webpack-merge');
const parts = require('../webpack-common/parts');

module.exports = ({prod} = { prod: false }) => {

    const common = {
        entry: path.join(__dirname, 'index.js'),
        output: {
            path: path.join(__dirname, 'bundles'),
            filename: 'bundle.js'
        }
    };

    let finalConfig = {};
    if (prod) {
        finalConfig = merge(
            common,
            {
                output: {
                    filename: 'bundle.min.js'
                },
                devtool: 'source-map',
                bail: true
            },
            parts.prodOptimize()
        );
    } else {
        finalConfig = merge(
            common,
            {
                output: {
                    pathinfo: true
                },
                devtool: 'eval'
            });
    }

    return finalConfig;
}