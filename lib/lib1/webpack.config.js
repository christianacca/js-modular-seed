const path = require('path');
module.exports = ({prod} = { prod: false }) => {
    const libraryShortname = 'lib1';
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
        devtool: prod ? 'source-map' : 'eval',
        bail: prod
    }
}