const {merge, webpack} = require('./tools');

module.exports = {
    tools: {
        merge,
        webpack
    },
    prodOptimize,
    withEnvironment
};

function prodOptimize () {
    return {
        plugins: [
            // doesn't save anything in this small app. npm@3 mostly takes care of this
            new webpack.optimize.DedupePlugin(),
            new webpack.LoaderOptionsPlugin({
                minimize: true,
                debug: false,
                quiet: true,
            }),
            new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: '"production"',
                },
            }),
            new webpack.optimize.UglifyJsPlugin({
                compress: {
                    screw_ie8: true, // eslint-disable-line
                    warnings: false,
                },
                sourceMap: true
            })
        ]
    };
}

function withEnvironment(prod, debug) {
        if (prod) {
            return merge(
                {
                    devtool: 'source-map',
                    bail: true
                },
                prodOptimize()
            );
        } else if (debug) {
            return {
                output: {
                    pathinfo: true
                },
                // note: wanted to use eval-source-map to increase build times, but chrome would not stop on breakpoint
                // therefore instead using source-map
                devtool: 'source-map'
            };
        } else {
            return {
                devtool: 'eval'
            };
        }
    }