import 'reflect-metadata';
import 'es6-shim';
import "zone.js";

import {Component, View, bootstrap, NgFor} from "angular2/angular2";
import {httpInjectables} from "angular2/http";
import {HashLocationStrategy, LocationStrategy, Router, RouterLink, RouteConfig, RouterOutlet, routerInjectables} from "angular2/router";
import {bind, Injectable} from "angular2/di";
import {EventEmitter, ObservableWrapper} from 'angular2/src/facade/async';


import Home from "./home";
import RepoList from "./repo-list";

class FriendsService {
    names: Array<string>;
    constructor() {
        this.names = ["Aarav", "Martín"];
    }
    addFriend(friend: string) {
        this.names.push(friend);
    }
}

@RouteConfig([
    {path: '/', as: "home", component:Home},
    {path: '/repo-list', as: "repo-list", component:RepoList},
])
@Component({
    selector: "app",
    appInjector: [FriendsService]
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

    constructor(friendsService: FriendsService) {
        //this.friendsService = friendsService;
        this.names = friendsService.names;
        console.log("Names", this.names);
    }
}

bootstrap(App, [
    httpInjectables,
    routerInjectables,
    FriendsService,
    bind(LocationStrategy).toClass(HashLocationStrategy)
]).then(
        success => console.log(`Bootstrap success`),
        error => console.log(error)
);