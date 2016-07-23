import './landing.scss'

export function LandingComponent(containerElement) {
    this._counterElem = containerElement.getElementsByClassName('counter')[0];
}

LandingComponent.prototype.startCounter = startCounter;

function startCounter() {
    var self = this;
    var counter = 0;
    increment();
    setInterval(increment, 1000);

    function increment() {
        self._counterElem.innerHTML = counter;
        counter++;
    }
}