app.controller("MapsController", function($scope, uiGmapGoogleMapApi) {
  
  // Define variables for our Map object
  /*var areaLat      = 10.461835,
      areaLng      = -73.253903,
      areaZoom     = 14;*/

  uiGmapGoogleMapApi.then(function(maps) {
    
    $scope.markerseleted=null;
    $scope.modelseleted;
    $scope.markers = [
                {
                    id: 1,
                    latitude: 10.469635,
                    longitude: -73.253994,
                    title: 'Servipan SAS',
                    address:'Cll 4 No 44-67',
                    ownerName:"Mario Castillo Andrade",
                    phone:"5556767",
                    activity:"Comercio",
                    matricula:"1234"
                },
                {
                    id: 2,
                    latitude: 10.459235,
                    longitude: -73.253802,
                    title: 'Proviciones Don Juan',
                    address:'Cll 4 No 44-67',
                    ownerName:"Carlos Pulgarin Reyes",
                    phone:"5556768",
                    activity:"Industria",
                    matricula:"5678"
                },
                {
                    id: 3,
                    latitude: 10.469832,
                    longitude: -73.263902,
                    title: 'Restaurante Yeyo',
                    address:'Cll 4 No 44-67',
                    ownerName:"Keiner Valencia Paez",
                    phone:"5556766",
                    activity:"Servicio",
                    matricula:"5432"
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
          $scope.modelselected = mar.model;
          toggleBounce(mar.gObject);
        };

        // Updating the collapsible (los establecimientos en el collapsible)
        $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
            //you also get the actual event object
            //do stuff, execute functions -- whatever...
            $('.collapsible').collapsible();
        });

        $scope.openModal = function(){
          $('#modal1').openModal();
        };

        $scope.addEstablishment = function(){
          $scope.modelselected = {};
          //console.log($scope.modelselected);
          $('#modal1').openModal();
        };


});
});
