import {Lib1Class1} from '@js-modular-seed/lib1';
import {Lib2Class1} from '@js-modular-seed/lib2';
import '../public/site.css'

export default function AppClass1(name) {
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

AppClass1.prototype.startCounter = startCounter;

function startCounter(displayContainer) {
    var counter = 0;
    increment();
    setInterval(increment, 1000);

    function increment() {
        displayContainer.innerHTML = counter;
        counter++;
    }
}

var nameProperty = { 
    enumerable: true, 
    get: function(){
        return this._name;
    },
    set: function(val) {
        this._name = val;
    }
};
Object.defineProperty(AppClass1.prototype, "name", nameProperty);