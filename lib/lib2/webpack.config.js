const path = require('path');
module.exports = ({prod} = { prod: false }) => {
    const libraryShortname = 'lib2';
    return {
        entry: path.join(__dirname, 'index.js'),
        output: {
            path: path.join(__dirname, 'bundles'),
            pathinfo: !prod,
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
        ],
        devtool: prod ? 'source-map' : 'eval',
        bail: prod
    }
}