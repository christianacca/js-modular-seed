(function (App) {
    'use strict';

    var AppClass1 = App.AppClass1;

    const obj = new AppClass1()
    console.log(obj.name);
})(this['@js-modular-seed/app'] || (this['@js-modular-seed/app'] = {}));