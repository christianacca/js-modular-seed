const path = require('path');
const merge = require('webpack-merge');

module.exports = ({prod} = { prod: false }) => {

    const libraryShortname = 'lib2';
    const common = {
        entry: path.join(__dirname, 'index.js'),
        output: {
            path: path.join(__dirname, 'bundles'),
            filename: `${libraryShortname}.umd.js`,
            library: `@js-modular-seed/${libraryShortname}`,
            libraryTarget: 'umd',
            umdNamedDefine: true
        },
        externals: [
            function (context, request, callback) {
                // Every @js-modular-seed module becomes external
                if (/^@js-modular-seed/.test(request))
                    return callback(null, request);
                callback();
            }
        ]
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