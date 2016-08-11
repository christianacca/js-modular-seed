import {Lib1Class1} from '@js-modular-seed/lib1';
import Set from 'core-js/fn/set';

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

Lib2Class1.prototype.getUniqueNameCount = getUniqueNameCount;

function getUniqueNameCount() {
    return new Set([this.name, this.lib1Obj.name]).size;
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