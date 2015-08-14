import 'reflect-metadata';
import 'es6-shim';
import "zone.js";
import "../node_modules/firebase/lib/firebase-web.js";

import {Component, View, bootstrap, NgFor} from "angular2/angular2";
import {httpInjectables} from "angular2/http";
import {HashLocationStrategy, LocationStrategy, Router, RouterLink, RouteConfig, RouterOutlet, routerInjectables} from "angular2/router";
import {bind, Injectable} from "angular2/di";
import {EventEmitter, ObservableWrapper} from 'angular2/src/facade/async';

import Home from "./home";
import RepoList from "./repo-list";

class FirebaseObject {
    ref;
    constructor() {
        var ref = new Firebase("https://blinding-heat-8535.firebaseio.com/Greetings");
        this.ref = ref;

        //this.names = ["Aarav", "Martín"];
        //myFirebaseRef = new Firebase("https://blinding-heat-8535.firebaseio.com/Greetings");
        //myFirebaseRef.set({
        //    title: "Hello World!",
        //    author: "Firebase",
        //    location: {
        //        city: "San Francisco",
        //        state: "California",
        //        zip: 94103
        //    }
        //});
        //myFirebaseRef.on("value", function(snapshot) {
        //    console.log(snapshot.val());
        //}, function (errorObject) {
        //    console.log("The read failed: " + errorObject.code);
        //});
        //myFirebaseRef.once("value", function(data) {
        //    console.log(data.value);
        //});
        //console.log(myFirebaseRef);
    }
    $ref() {
        return this.ref;
    }
    $value() {
        this.ref.on("value", function(snapshot) {
            console.log("$value()", snapshot.val());
            return snapshot.val();
        }, function (errorObject) {
            console.log("The read failed: " + errorObject.code);
        });
    }
    $save() {
        //this.ref.set(this.myObj);
        console.log("$save", this);
        var obj = {};
        for(prop in this) {
            if(this.hasOwnProperty(prop) && (prop !== "ref")) {
                obj[prop] = this[prop];
            }
        }
        console.log("$save", obj);
        this.ref.set(obj);
        //this.ref.set({author: this.author});
        //this.ref.set({
        //    title: "Hallo World!",
        //    author: this.author,
        //    location: {
        //        city: "San Diego",
        //        state: "California",
        //        zip: 92222
        //    }
        //});
    }
    //addFriend(friend: string) {
    //    this.names.push(friend);
    //}
}

@RouteConfig([
    {path: '/', as: "home", component:Home},
    {path: '/repo-list', as: "repo-list", component:RepoList},
])
@Component({
    selector: "app",
    appInjector: [FirebaseObject]
})
@View({
    directives: [RouterOutlet, RouterLink],
    template: `
        <nav>
            <a [router-link]="['/home']">Home</a>
            <a [router-link]="['/repo-list']">Repo List</a>
        </nav>
        <main>
            <router-outlet></router-outlet>
        </main>
    `
})
class App {
    names:Array<string>;
    fbObj;

    constructor(firebaseObject: FirebaseObject) {

        var newObj = firebaseObject;
        console.log(newObj);

        newObj.field1 = "today";
        newObj.field2 = "tomorrow";
        newObj.$save();

    }
}

bootstrap(App, [
    httpInjectables,
    routerInjectables,
    FirebaseObject,
    bind(LocationStrategy).toClass(HashLocationStrategy)
]).then(
        success => console.log(`Bootstrap success`),
        error => console.log(error)
);