const {merge} = require('../../scripts/webpack-common/tools');
const path = require('path');
const partsFactory = require('../../scripts/webpack-common/libParts');
const multiConfig = require('../../scripts/webpack-common/multiConfig')(partsFactory);

module.exports = (env = { prod: false, debug: false }) => {
    return multiConfig(__dirname, env, createConfig);
}

function createConfig(env, parts) {
    return merge(
        parts.asUmdLibrary(),
        parts.inlineImages(33792),
        // parts.sass(),
        parts.extractSass([
            path.join(__dirname, 'src', 'clock', 'clock.scss')
        ]),
        parts.excludeNodeModule('lodash/upperCase', '_'),
        parts.excludeNodeModule('lodash/keysIn', '_'),
        parts.excludeNodeModules(),
        parts.resolveLoaders(),
        parts.withEnvironment()
    );
}