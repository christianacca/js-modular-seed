(function(/*globals*/) {

    var maps = {
        '@js-modular-seed': 'node_modules/@js-modular-seed',
        'plugin-babel': 'node_modules/systemjs-plugin-babel/plugin-babel.js',
        'systemjs-babel-build': 'node_modules/systemjs-plugin-babel/systemjs-babel-browser.js'
    };

    var packages = {
        'src': { defaultExtension: 'js' }
    };

    var libPackages = [
        'lib1', 'lib2'
    ];

    function packIndex(pkgName) {
        packages['@js-modular-seed/' + pkgName] = { main: 'index.js', defaultExtension: 'js' };
    }

    function packUmd(pkgName) {
        packages['@js-modular-seed/' + pkgName] = { main: '/bundles/' + pkgName + '.umd.js', defaultExtension: 'js' };
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