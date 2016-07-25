import {Lib1Class1} from '@js-modular-seed/lib1';
import {Lib2Class1} from '@js-modular-seed/lib2';
import {ClockComponent} from '@js-modular-seed/lib3';
import {LandingComponent} from './landing';
import './shared/site.scss'
import './shared/logo.scss'

export function AppClass1(name) {
    /**
     * reference to an instance of the Lib1Class1
     */
    this.lib1Obj = new Lib1Class1(name);
    /**
     * reference to an instance of the Lib2Class1
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

    const landing = new LandingComponent(document.getElementsByClassName('landing')[0]);
    landing.startCounter();
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