app.controller("MapsController", function($scope, uiGmapGoogleMapApi) {
  
  // Define variables for our Map object
  var areaLat      = 10.461835,
      areaLng      = -73.253903,
      areaZoom     = 14;

  uiGmapGoogleMapApi.then(function(maps) {
    $scope.map     = { center: { latitude: areaLat, longitude: areaLng }, zoom: areaZoom , bounds: {}};
    $scope.options = { scrollwheel: false };
    
    $scope.randomMarkers = [
    	{
    		id: 0,
      		coords: {
		        latitude: 10.461835,
		        longitude: -73.253904
      		}
  		},
  		{
    		id: 1,
      		coords: {
		        latitude: 10.461835,
		        longitude: -73.253902
      		}
  		}
    ];

  });





});
