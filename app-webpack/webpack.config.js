const path = require('path');
const {merge} = require('../scripts/webpack-common/tools');

module.exports = (env = { prod: false, debug: false, port: 8080, host: 'localhost' }) => {

    const parts = require('../scripts/webpack-common/appParts')(__dirname, env);

    return merge(
        parts.asAppBundle(),
        parts.useHtmlPlugin(),
        parts.withEnvironment(),
        parts.resolveLibraryPeerDependencies()
    );
}