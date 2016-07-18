const {merge} = require('../../scripts/webpack-common/tools');

module.exports = (env = { prod: false, debug: false }) => {

    const parts = require('../../scripts/webpack-common/libParts')(__dirname, env);

    return merge(
        parts.asUmdLibrary(),
        parts.excludeNodeModule('lodash/upperCase', '_'),
        parts.excludeNodeModule('lodash/keysIn', '_'),
        parts.excludeNodeModules(),
        parts.withEnvironment()
    );
}