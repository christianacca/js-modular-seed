const {merge} = require('../../scripts/webpack-common/tools');

module.exports = ({prod} = { prod: false }) => {

    const parts = require('../../scripts/webpack-common/libParts')(__dirname, prod);

    const includeInBundle = [/^core-js\//];
    return merge(
        parts.asUmdLibrary(),
        parts.excludeNodeModules(includeInBundle),
        parts.withEnvironment()
    );
}