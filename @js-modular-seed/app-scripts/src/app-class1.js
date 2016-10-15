(function (Lib1, Lib2, Lib3, App) {
    'use strict';

    // imports
    var Lib1Class1 = Lib1.Lib1Class1;
    var Lib2Class1 = Lib2.Lib2Class1;
    var ClockComponent = Lib3.ClockComponent;

    // exports
    App.AppClass1 = AppClass1;

    function AppClass1(name) {
        /**
         * reference to an instance of the Lib1Class1
         */
        this.lib1Obj = new Lib1Class1(name);
        /**
         * reference to an instance of the Lib1Class1
         */
        this.lib2Obj = new Lib2Class1(name);
        /**
         * name of this application class instance
         */
        this.name = name || this.lib1Obj.name;
    }

    AppClass1.prototype.run = run;

    function run() {
        console.log(this.name);
        console.log(this.lib1Obj.name);
        console.log(this.lib2Obj.name);
        console.log(this.lib2Obj.lib1Obj.name);
        console.log(this.lib1Obj.nameUpperCase());
        console.log(this.lib1Obj.myKeys());
        console.log(this.lib2Obj.getUniqueNameCount());

        const clock = new ClockComponent(document.getElementsByClassName('clock')[0]);
        clock.render();
    }


    var nameProperty = {
        enumerable: true,
        get: function () {
            return this._name;
        },
        set: function (val) {
            this._name = val;
        }
    };
    Object.defineProperty(AppClass1.prototype, "name", nameProperty);
})(
    this['@js-modular-seed/lib1'],
    this['@js-modular-seed/lib2'],
    this['@js-modular-seed/lib3'],
    this['@js-modular-seed/app'] || (this['@js-modular-seed/app'] = {})
    );