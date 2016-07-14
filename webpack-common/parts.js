const webpack = require('webpack');

exports.prodOptimize = prodOptimize;

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