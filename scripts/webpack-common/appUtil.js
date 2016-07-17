const path = require('path');

module.exports = createAppUtil;

function createAppUtil(sourceDir) {

    const PATHS = {
        project: path.resolve(sourceDir, '../')
    };

    const rootPkg = require(path.resolve(PATHS.project, 'package'));
    const pkg = require(path.join(sourceDir, 'package'));

    const projectScopeName = `@${rootPkg.name}`;

    return {
        getLibraryNames,
        getLibraryWebpackConfigs,
        pkg,
        projectScopeName,
        rootPkg
    }

    function getLibraryWebpackConfigs() {
        return getLibraryNames()
            .map(name => path.join(PATHS.project, 'lib', name, 'webpack.config'))
            .map(wepbackConfigPath => require(wepbackConfigPath));
    }

    function getLibraryNames() {
        return Object.keys(pkg.dependencies)
            .filter(name => name.startsWith(projectScopeName))
            .map(name => name.split('/')[1]);
    }
}