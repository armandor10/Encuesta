var app = angular.module("myApp", ['uiGmapgoogle-maps']);

app.config(function(uiGmapGoogleMapApiProvider) {
 uiGmapGoogleMapApiProvider.configure({
  key: 'AIzaSyDe9J6-DNDqHvB9zU_icstOH0TtGA4vLcw',
  v: '3.21.10',
  libraries: 'weather,geometry,visualization'
 });
});