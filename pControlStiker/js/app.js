var uritimeit = "http://localhost/laravel/public";

var app = angular.module("myApp", ['ngRoute','ngResource']);
var app2 = angular.module("myApp2", ['ngRoute','ngResource']);

app.config(function($routeProvider) {
  $routeProvider
   .when('/agregarStik', {
    controller: 'agregarStikCtr',
    templateUrl: 'views/agregarStik.html'
  })
   .when('/asignarStik', {
    controller: 'asignarStikCtr',
    templateUrl: 'views/asignarStik.html'
  })
   .when('/consultarStik', {
    controller: 'consultarStikCtr',
    templateUrl: 'views/consultaStik.html'
  })
  .otherwise({
    redirectTo: '/agregarStik'
  });
});