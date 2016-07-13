const path = require('path');
const merge = require('webpack-merge');

module.exports = ({prod} = { prod: false }) => {
    
    const common = {
        entry: path.join(__dirname, 'index.js'),
        output: {
            path: path.join(__dirname, 'bundles'),
            filename: 'bundle.js'
        }
    };

    let config = {};
    if (prod) {
        config = merge(common, {
            devtool: 'source-map',
            bail: true
        });
    } else {
        config = merge(common, {
            output: {
                pathinfo: true
            },
            devtool: 'eval'
        });
    }

    return config;
}