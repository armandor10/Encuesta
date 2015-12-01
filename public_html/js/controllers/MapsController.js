app.controller("MapsController", function($scope, uiGmapGoogleMapApi, matriculadoService) {
  
  // Define variables for our Map object
  /*var areaLat      = 10.461835,
      areaLng      = -73.253903,
      areaZoom     = 14;*/

  uiGmapGoogleMapApi.then(function(maps) {

    //console.log(matriculadoService.getAll());
    
    $scope.markerseleted=null;
    $scope.modelseleted;

    function loadMaticulado() {
        var promiseGet = matriculadoService.getAll2(); //The Method Call from service
        promiseGet.then(function (pl) {
          $scope.markers = [];
          angular.forEach(pl.data, function(value, key) {
              var marker = {
                           id: key,
                           latitude: value.latitud,
                           longitude: value.longitud,
                           title: value.razonSocial_nombre,
                           address: value.direccion,
                           ownerName: value.propietario,
                           phone: value.telefono,
                           activity: value.actividad,
                           matricula: value.noMatricula
                         };
            $scope.markers.push(marker);
            //console.log(key + ': ' + value);
          });          
          //console.log($scope.markers);
          $scope.map.markers = $scope.markers;
        },
        function (errorPl) {
         $log.error('Error al cargar los establecimientos', errorPl);
       });
    }
    loadMaticulado();


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

        $scope.saveEstablishment = function(){
          //alert("Hola");
          //console.log($scope.modelselected);
          var matriculado = {};
          matriculado.noMatriculado = $scope.modelselected.matricula;
          matriculado.razonSocial_nombre = $scope.modelselected.title;
          matriculado.propietario = $scope.modelselected.ownerName;
          matriculado.direccion = $scope.modelselected.address;
          matriculado.telefono = $scope.modelselected.phone;
          matriculado.actividad = 1;

          var request = matriculadoService.postMatriculado(matriculado);
          console.log(request);

        };

        //console.log($scope.map);
});
});
