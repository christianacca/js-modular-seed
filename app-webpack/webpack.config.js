const path = require('path');
const {merge} = require('../scripts/webpack-common/tools');

module.exports = (env = { prod: false, debug: false, port: 8080, host: 'localhost' }) => {

    const parts = require('../scripts/webpack-common/appParts')(__dirname, env);

    return merge(
        parts.asAppBundle(),
        parts.utils.isDevServer ? parts.sass() : parts.extractSassChunks({
            styles: [
                path.join(__dirname, 'src', 'shared', 'site.scss'),
                path.join(__dirname, 'src', 'shared', 'logo.scss')
            ]
        }),
        parts.inlineImages(),
        parts.useHtmlPlugin(),
        parts.withEnvironment(),
        parts.resolveLibraryPeerDependencies(),
        parts.resolveLoaders()
    );
}