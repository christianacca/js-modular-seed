import {AppClass1} from './app-class1';
import {LandingComponent} from './landing';

var obj = new AppClass1('app-cc');
console.log(obj.name);
console.log(obj.lib1Obj.name);
console.log(obj.lib2Obj.name);
console.log(obj.lib2Obj.lib1Obj.name);
console.log(obj.lib1Obj.nameUpperCase());
console.log(obj.lib1Obj.myKeys());
console.log(obj.lib2Obj.getUniqueNameCount());

var landing = new LandingComponent(document.getElementsByClassName('landing')[0]);
landing.startCounter();