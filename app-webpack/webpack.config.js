const path = require('path');
module.exports = ({prod} = { prod: false }) => {
    return {
        entry: path.join(__dirname, 'index.js'),
        output: {
            path: path.join(__dirname, 'bundles'),
            pathinfo: !prod,
            filename: 'bundle.js'
        },
        devtool: prod ? 'source-map' : 'eval',
        bail: prod
    }
}