app.controller("MapsController", function($scope, uiGmapGoogleMapApi, matriculadoService) {
  
  // Define variables for our Map object
  /*var areaLat      = 10.461835,
      areaLng      = -73.253903,
      areaZoom     = 14;*/

  uiGmapGoogleMapApi.then(function(maps) {

    //console.log(matriculadoService.getAll());

   // initialize
   $('select').material_select();
    
    $scope.markerseleted=null;
    $scope.modelseleted;
    $scope.actividades = {};
    $scope.actividades.actividadSelect = "";
    $scope.actividades.list = [];

    function loadMaticulado() {
        var promiseGet = matriculadoService.getAll2(); //The Method Call from service
        promiseGet.then(function (pl) {
          $scope.markers = [];
          $scope.map.markers = [];
          angular.forEach(pl.data, function(value, key) {
              var marker = {
                           id: value.id,
                           latitude: value.latitud,
                           longitude: value.longitud,
                           title: value.razonSocial_nombre,
                           address: value.direccion,
                           ownerName: value.propietario,
                           phone: value.telefono,
                           matricula: value.noMatricula,
                           activity: value.actividad,
                           idactivity:value.idactividad
                         };

            /* Codigo para buscar un objeto dentro dentro de una arraylist
            var result = $.grep($scope.actividades.list , function(e){ return e.id == value.actividad; });
              if (result.length == 0) {
                // not found
              } else if (result.length == 1) {
                // access the foo property using result[0].foo
                //console.log(result[0]);
                marker.activity = result[0].actividad;
                marker.idactivity = value.actividad;
              } else {
                // multiple items found
              }*/

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
    function loadActividad(){
        var promiseGet = matriculadoService.getAllActividad(); //The Method Call from service
        promiseGet.then(function (pl) {
          $scope.actividades.list = pl.data;
          //console.log(pl.data);
        },
        function (errorPl) {
         $log.error('Error al cargar las actividades', errorPl);
       });
    };
    loadActividad();
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
                    //console.log('Marker was clicked (' + marker + ', ' + eventName);//+', '+mydump(model, 0)+', '+mydump(arguments)+')');
                    $scope.map.window.model = model;
                    $scope.map.window.title = model.title;
                    $scope.map.window.show = true;
                    
                    //alert(JSON.stringify(model));
                    //console.log(marker);
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
          //console.log(marker);
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
            $('select').material_select();

        });

        $scope.openModal = function(){
          $('#repeatSelect').val($scope.modelselected.idactivity);
          $('#repeatSelect').material_select();
          //$scope.actividades.actividadSelect = $scope.modelselected.idactivity;
          $('#modal1').openModal();
        };

        $scope.addEstablishment = function(){
          $scope.modelselected = {};
          $('#repeatSelect').val('0');
          $('#repeatSelect').material_select();
          //console.log($scope.modelselected);
          $scope.modelselected.id = '';
          $('#modal1').openModal();
        };

        $scope.saveEstablishment = function(){
          //console.log($scope.modelselected);
          var matriculado = {};
          matriculado.noMatricula = $scope.modelselected.matricula;
          matriculado.razonSocial_nombre = $scope.modelselected.title;
          matriculado.propietario = $scope.modelselected.ownerName;
          matriculado.direccion = $scope.modelselected.address;
          matriculado.telefono = $scope.modelselected.phone;
          matriculado.actividad = $('#repeatSelect').val();

          if($scope.modelselected.id == ''){
              var promisePost = matriculadoService.postMatriculado(matriculado);
              promisePost.then(function (d) {
                 Materialize.toast("Establecimiento guardado",3000,'rounded');                

                }, function (err) {
                    if(err.status == 401){
                        alert(err.data.message);
                        console.log(err.data.exception);
                    }else{
                         Materialize.toast("Error al procesar la solicitud",3000,'rounded');                       
                    }
                    console.log(err);
                });

          }else{
              var promisePost = matriculadoService.put($scope.modelselected.id, matriculado);
              promisePost.then(function (d) {  
                  Materialize.toast("Establecimiento actualizado",3000,'rounded');               

                }, function (err) {
                    if(err.status == 401){
                        alert(err.data.message);
                        console.log(err.data.exception);
                    }else{
                         Materialize.toast("Error al procesar la solicitud",3000,'rounded');                       
                    }
                    console.log(err);
                });

          }
          loadMaticulado();

        };

        //console.log($scope.map);
});
});
