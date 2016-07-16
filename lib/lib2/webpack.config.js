const merge = require('webpack-merge');

module.exports = ({prod} = { prod: false }) => {

    const parts = require('../../webpack-common/libParts')(__dirname, prod);

    const includeInBundle = [/^core-js\//];
    return merge(
        parts.umdLibrary(),
        parts.excludeNodeModules(includeInBundle),
        parts.environment(prod)
    );
}