const merge = require('webpack-merge');

module.exports = ({prod} = { prod: false }) => {

    const parts = require('../../webpack-common/libParts')(__dirname, prod);

    const includeInBundle = [/^core-js\//];
    return merge(
        parts.asUmdLibrary(),
        parts.excludeNodeModules(includeInBundle),
        parts.withEnvironment()
    );
}