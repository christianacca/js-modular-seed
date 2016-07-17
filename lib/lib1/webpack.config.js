const {merge} = require('../../scripts/webpack-common/tools');

module.exports = ({prod} = { prod: false }) => {

    const parts = require('../../scripts/webpack-common/libParts')(__dirname, prod);

    return merge(
        parts.asUmdLibrary(),
        parts.excludeNodeModule('lodash/upperCase', '_'),
        parts.excludeNodeModule('lodash/keysIn', '_'),
        parts.excludeNodeModules(),
        parts.withEnvironment()
    );
}