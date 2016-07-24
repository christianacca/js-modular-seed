(function(/*globals*/) {

    var maps = {
        '@js-modular-seed': 'node_modules/@js-modular-seed',
        'lodash': 'node_modules/lodash',
        'plugin-babel': 'node_modules/systemjs-plugin-babel/plugin-babel.js',
        'systemjs-babel-build': 'node_modules/systemjs-plugin-babel/systemjs-babel-browser.js'
    };

    var packages = {
        'lodash': { defaultExtension: 'js' },
        'src': { defaultExtension: 'js' }
    };

    var libPackages = [
        'lib1', 'lib2'
    ];

    function packIndex(pkgName) {
        packages['@js-modular-seed/' + pkgName] = { main: 'index.js', defaultExtension: 'js' };
    }

    function packUmd(pkgName) {
        let mainFile = '/bundles/' + pkgName;
        if (System.packageOptimize) {
            mainFile += '.umd.min.js';
        } else {
            mainFile += '.umd.js';
        }
        packages['@js-modular-seed/' + pkgName] = { main: mainFile, defaultExtension: 'js' };
    }

    // Most environments should use UMD; some (Karma) need the individual index files
    var setPackageConfig = System.packageWithIndex ? packIndex : packUmd;

    // Add package entries for angular packages
    libPackages.forEach(setPackageConfig);

    System.config({
        map: maps,
        packages: packages,
        transpiler: 'plugin-babel',
        meta: {
            '*.js': {
                babelOptions: {
                    // chrome supports es2015 so don't need to transpile code to ecmascript5
                    es2015: false
                }
            }
        }
    });
})(this);