const path = require('path');
const merge = require('webpack-merge');

module.exports = ({prod} = { prod: false }) => {

    const parts = require('../webpack-common/appParts')(__dirname, prod);

    return merge(
        parts.asAppBundle(),
        parts.withEnvironment()
    );
}