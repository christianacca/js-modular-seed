(function (App) {
    'use strict';

    // imports
    var AppClass1 = App.AppClass1;

    var obj = new AppClass1('app-cc');
    console.log(obj.name);
    console.log(obj.lib1Obj.name);
    console.log(obj.lib2Obj.name);
    console.log(obj.lib2Obj.lib1Obj.name);
    console.log(obj.lib1Obj.nameUpperCase());
    console.log(obj.lib1Obj.myKeys());
    console.log(obj.lib2Obj.getUniqueNameCount());
})(this['@js-modular-seed/app'] || (this['@js-modular-seed/app'] = {}));

