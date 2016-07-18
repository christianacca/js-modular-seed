module.exports = (env = { prod: false, debug: false }) => {
    const appUtil = require('../scripts/webpack-common/appUtil')(__dirname);
    return appUtil.getLibraryWebpackConfigs().map(fn => fn(env));
};