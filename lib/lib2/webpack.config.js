const {merge} = require('../../scripts/webpack-common/tools');

module.exports = (env = { prod: false, debug: false }) => {

    const parts = require('../../scripts/webpack-common/libParts')(__dirname, env);

    const includeInBundle = [/^core-js\//];
    return merge(
        parts.asUmdLibrary(),
        parts.excludeNodeModules(includeInBundle),
        parts.withEnvironment()
    );
}