const {merge} = require('../../scripts/webpack-common/tools');
const partsFactory = require('../../scripts/webpack-common/libParts');
const multiConfig = require('../../scripts/webpack-common/multiConfig')(partsFactory);

module.exports = (env = { prod: false, debug: false }) => {
    return multiConfig(__dirname, env, createConfig);
}

function createConfig(env, parts) {
    return merge(
        parts.asUmdLibrary(),
        parts.excludeNodeModule('lodash/upperCase', '_'),
        parts.excludeNodeModule('lodash/keysIn', '_'),
        parts.excludeNodeModules(),
        parts.withEnvironment()
    );
}