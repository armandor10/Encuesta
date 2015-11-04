var app = angular.module("myApp", ['ngRoute','uiGmapgoogle-maps']);

app.config(function($routeProvider) {
  $routeProvider
   .when('/', {
    controller: 'MapsController',
    templateUrl: 'views/maps.html'
  })
  .when('/encuesta', {
    controller: 'EncuestaController',
    templateUrl: 'views/encuesta.html'
  })
  .otherwise({
    redirectTo: '/'
  });
});

app.run(function($rootScope) {
    $rootScope.main = [
                  {
                    display:'Gestión de Establecimiento',
                    path:'#/'
                  },
                  {
                    display:'Gestión de Encuesta',
                    path:'#/encuesta'
                  },
                  {
                    display:'Encuestador',
                    path:'#'
                  }
                ];
});

app.config(function(uiGmapGoogleMapApiProvider) {
 uiGmapGoogleMapApiProvider.configure({
  key: 'AIzaSyDe9J6-DNDqHvB9zU_icstOH0TtGA4vLcw',
  v: '3.21.10',
  libraries: 'weather,geometry,visualization'
 });
});