const merge = require('webpack-merge');

module.exports = ({prod} = { prod: false }) => {

    const parts = require('../../webpack-common/libParts')(__dirname, prod);

    return merge(
        parts.umdLibrary(),
        parts.excludeNodeModule('lodash/upperCase', '_'),
        parts.excludeNodeModule('lodash/keysIn', '_'),
        parts.excludeNodeModules(),
        parts.environment(prod)
    );
}