const merge = require('webpack-merge');

module.exports = ({prod} = { prod: false }) => {

    const parts = require('../../webpack-common/libParts')(__dirname, prod);

    return merge(
        parts.standardConfigs(),
        {}
    );
}