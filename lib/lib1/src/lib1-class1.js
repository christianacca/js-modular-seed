export function Lib1Class1(name) {
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
Object.defineProperty(Lib1Class1.prototype, "name", nameProperty);