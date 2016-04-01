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
   .when('/agregarlibro', {
    controller: 'agregarlibroCtr',
    controllerAs: 'vm',
    templateUrl: 'views/agregarlibro.html'
  })
   .when('/agregartemas', {
    controller: 'agregartemaCtr',
    templateUrl: 'views/agregartemas.html'
  })
   .when('/consultar', {
    controller: 'consultarCtr',
    templateUrl: 'views/consultar.html'
  })
   .when('/categorias', {
    controller: 'categoriasCtr',
    templateUrl: 'views/categorias.html'
  })
  .otherwise({
    redirectTo: '/agregarlibro'
  });
});