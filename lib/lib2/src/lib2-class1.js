import {Lib1Class1} from '@js-modular-seed/lib1';

export function Lib2Class1(name) {
    /**
     * reference to an instance of the Lib1Class1
     */
    this.lib1Obj = new Lib1Class1(name);
    /**
     * name of this instance
     */
    this.name = name || 'class1';
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
Object.defineProperty(Lib2Class1.prototype, "name", nameProperty);