const path = require('path');

module.exports = createAppUtil;

function createAppUtil(sourceDir) {

    const PATHS = {
        project: path.resolve(sourceDir, '../../')
    };

    const projectPkg = require(path.resolve(PATHS.project, 'package'));
    const pkg = require(path.join(sourceDir, 'package'));

    const isDevServer = process.argv.find(v => v.indexOf('webpack-dev-server') !== -1);

    return {
        getLibraryPaths,
        getLibraryWebpackConfigs,
        isDevServer,
        pkg,
        projectPkg
    }

    function getLibraryWebpackConfigs() {
        return getLibraryPaths()
            .map(libPath => path.join(libPath, 'webpack.config'))
            .map(wepbackConfigPath => require(wepbackConfigPath));
    }

    function getLibraryPaths() {
        return getLibraryNames()
            .map(({package, scope} = name) => {
                return path.join(PATHS.project, scope || 'lib', package);
            });
    }

    function getLibraryNames() {
        return Object.keys(pkg.dependencies)
            .filter(name => name.startsWith(projectPkg.name) || name.startsWith(`@${projectPkg.name}`))
            .map(name => {
                const parts = name.split('/');
                return {
                    scope: parts[0],
                    package: parts[1]
                }
            });
    }
}