app.controller("MapsController", function($scope, uiGmapGoogleMapApi) {
  
  // Define variables for our Map object
  /*var areaLat      = 10.461835,
      areaLng      = -73.253903,
      areaZoom     = 14;*/

  uiGmapGoogleMapApi.then(function(maps) {
    /*
     $scope.map = {
          center: {
            latitude: 10.461835,
            longitude: -73.253903
          },
          zoom: 14,
          bounds: {}
        };

        $scope.options = {
          scrollwheel: false
        };


   var createRandomMarker = function(i, bounds, idKey) {
      var lat_min = bounds.southwest.latitude,
        lat_range = bounds.northeast.latitude - lat_min,
        lng_min = bounds.southwest.longitude,
        lng_range = bounds.northeast.longitude - lng_min;

      if (idKey == null) {
        idKey = "id";
      }

      var latitude = lat_min + (Math.random() * lat_range);
      var longitude = lng_min + (Math.random() * lng_range);
      var ret = {
        latitude: latitude,
        longitude: longitude,
        title: 'm' + i
      };
      ret[idKey] = i;
      return ret;
    };

    $scope.randomMarkers = [];
    // Get the bounds from the map once it's loaded
    $scope.$watch(function() {
      return $scope.map.bounds;
    }, function(nv, ov) {
      // Only need to regenerate once
      if (!ov.southwest && nv.southwest) {
        var markers = [];
        for (var i = 0; i < 50; i++) {
          markers.push(createRandomMarker(i, $scope.map.bounds))
        }
        $scope.randomMarkers = markers;
        $scope.map.markers = markers;
      }
    }, true);


    $scope.onMarkerClicked = function (marker) {
      //alert(marker.title);
      console.log(marker);
    //marker.showWindow = true;
    $scope.$apply();
    //window.alert("Marker: lat: " + marker.latitude + ", lon: " + marker.longitude + " clicked!!")
  };

  //call the on-click-funcionality with my collection of objects.
    $scope.addMarkerClickFunction($scope.map.markers);

//On-click-functionality
   $scope.addMarkerClickFunction = function (markers) {
    angular.forEach(markers, function (value, key) {
        value.onClick = function () {
            $scope.onMarkerClicked(value);
        };
    });    
  };*/

  /* $scope.map     = { center: { latitude: areaLat, longitude: areaLng }, zoom: areaZoom , bounds: {}};
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
    ];*/

    $scope.markerseleted=null;
    $scope.modelseleted;
    $scope.markers = [
                {
                    id: 1,
                    latitude: 10.469635,
                    longitude: -73.253994,
                    title: 'Servipan SAS',
                    address:'Cll 4 No 44-67',
                    nameOwner:"Mario Castillo Andrade",
                    phone:"5556767",
                    activity:"Comercio",
                },
                {
                    id: 2,
                    latitude: 10.459235,
                    longitude: -73.253802,
                    title: 'Proviciones Don Juan',
                    address:'Cll 4 No 44-67',
                    nameOwner:"Carlos Pulgarin Reyes",
                    phone:"5556768",
                    activity:"Industria"
                },
                {
                    id: 3,
                    latitude: 10.469832,
                    longitude: -73.263902,
                    title: 'Restaurante Yeyo',
                    address:'Cll 4 No 44-67',
                    nameOwner:"Keiner Valencia Paez",
                    phone:"5556766",
                    activity:"Servicio"
                }];


        var data = {};
        $scope.markerControl = {};

        data.map = {
            zoom: 14,
            center: {
                latitude: 10.461835,
                longitude: -73.253903
            },
            options:{
              scrollwheel: false
            },
            markersEvents: {
                click: function(marker, eventName, model, arguments) {
                    console.log('Marker was clicked (' + marker + ', ' + eventName);//+', '+mydump(model, 0)+', '+mydump(arguments)+')');
                    $scope.map.window.model = model;
                    $scope.map.window.title = model.title;
                    $scope.map.window.show = true;
                    
                    //alert(JSON.stringify(model));
                    console.log(marker);
                    toggleBounce(marker);
                    $scope.modelselected = model;
                    //alert('C'+model.id);
                    $('#C'+ model.id).trigger('click');
                    //$('.collapsible').collapsible();
                }
            },
            window: {
                marker: {},
                show: false,
                closeClick: function() {
                    this.show = false;
                },
                options: {}, // define when map is ready
                title: ''
            }
        };

        //$scope.window = false;

        $scope.onMarkerClicked = function (m) {
            //this.windowOptions = !this.windowOptions;
            console.log('Marker was clicked');
            console.log(m);
        };

        $scope.closeClick = function () {
            this.window = false;
        };

        function toggleBounce(marker) {
          if($scope.markerseleted != null){
            $scope.markerseleted.setAnimation(null);
          }          
          marker.setAnimation(google.maps.Animation.BOUNCE);
          $scope.markerseleted = marker;

          /*if (marker.getAnimation() !== null) {
            marker.setAnimation(null);
          } else {
            marker.setAnimation(google.maps.Animation.BOUNCE);
          }*/
        };



        data.map.markers = $scope.markers;

        $scope.map = data.map;

         $scope.listClickEvent = function (index){
          //alert("Entro");
          //console.log(marker);
          var marker = $scope.map.markers[index];
          console.log(marker);
          var mar = $scope.markerControl.getPlurals().get(marker.id);
          //console.log($scope.markerControl.getGMarkers());
          //console.log(mar);
          //mar.gObject.setAnimation(google.maps.Animation.BOUNCE);
          toggleBounce(mar.gObject);
        }

        

});
});
