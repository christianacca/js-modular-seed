// note: leaving this commented out css import as a reminder that when it comes to bundling css *for a library* 
// you have a choice at *design* time
// note: would prefer that this choice could be at build time leaving the css import in our code, but
// the CommonsChunkPlugin creates some mangled code
// 1. inline all css into the js bundle (ie reference the css file in js)
// 2. create a bundle using an explicit webpack bundle (using ExtractTextPlugin)
// import './clock.scss'

export function ClockComponent(clockElem) {
    this._clockElem = clockElem;
}

ClockComponent.prototype.render = render;

function render() {
    var self = this;
    update();
    setInterval(update, 1000);

    function update() {
        self._clockElem.innerHTML = new Date().toLocaleTimeString()
    }
}