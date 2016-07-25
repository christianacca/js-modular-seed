const path = require('path');

module.exports = createAppUtil;

function createAppUtil(sourceDir) {

    const PATHS = {
        project: path.resolve(sourceDir, '../')
    };

    const projectPkg = require(path.resolve(PATHS.project, 'package'));
    const pkg = require(path.join(sourceDir, 'package'));

    const projectScopeName = `@${projectPkg.name}`;
    const isDevServer = process.argv.find(v => v.indexOf('webpack-dev-server') !== -1);

    return {
        getLibraryNames,
        getLibraryPaths,
        getLibraryWebpackConfigs,
        isDevServer,
        pkg,
        projectScopeName,
        projectPkg
    }

    function getLibraryWebpackConfigs() {
        return getLibraryPaths()
            .map(libPath => path.join(libPath, 'webpack.config'))
            .map(wepbackConfigPath => require(wepbackConfigPath));
    }

    function getLibraryPaths() {
        return getLibraryNames()
            .map(name => path.join(PATHS.project, 'lib', name));
    }

    function getLibraryNames() {
        return Object.keys(pkg.dependencies)
            .filter(name => name.startsWith(projectScopeName))
            .map(name => name.split('/')[1]);
    }
}