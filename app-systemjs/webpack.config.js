module.exports = (env) => {
    const appUtil = require('../scripts/webpack-common/appUtil')(__dirname);
    return appUtil.getLibraryWebpackConfigs().map(fn => fn(env));
};