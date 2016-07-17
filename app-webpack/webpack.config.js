const path = require('path');
const {merge} = require('../scripts/webpack-common/tools');

module.exports = ({prod} = { prod: false }) => {

    const parts = require('../scripts/webpack-common/appParts')(__dirname, prod);

    return merge(
        parts.asAppBundle(),
        parts.useHtmlPlugin(),
        parts.withEnvironment(),
        parts.resolveLibraryPeerDependencies()
    );
}