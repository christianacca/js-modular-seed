import upperCase from 'lodash/upperCase';
import keysIn from 'lodash/keysIn';

export function Lib1Class1(name) {
    /**
     * name of this instance
     */
    this.name = name || 'libclass1';
}

Lib1Class1.prototype.myKeys = myKeys;
Lib1Class1.prototype.nameUpperCase = nameUpperCase;


function myKeys() {
    return keysIn(this);
}

function nameUpperCase() {
    return upperCase(this.name);
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
Object.defineProperty(Lib1Class1.prototype, "name", nameProperty);