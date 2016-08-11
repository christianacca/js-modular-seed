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