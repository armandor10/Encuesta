var uritimeit = "../public";

var app = angular.module("myApp", ['ngRoute','ngResource','ngTable']);
var app2 = angular.module("myApp2", ['ngRoute','ngResource']);

app.directive('onFinishRender', function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            if (scope.$last === true) {
                $timeout(function () {
                    scope.$emit('ngRepeatFinished');
                });
            }
        }
    }
});

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
   .when('/consultarAuxStik', {
    controller: 'consultarAuxStikCtr',
    templateUrl: 'views/consultaAuxStik.html'
  })
  .otherwise({
    redirectTo: '/agregarStik'
  });
});