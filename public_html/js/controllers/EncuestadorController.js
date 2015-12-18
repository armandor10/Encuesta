app.controller("EncuestadorController", function($scope, censadorService) {

  var myInterval;

  $scope.PollsterSelected = {};

	$scope.pollsters = [];

  var loadEcuestador = function(){
        var promiseGet = censadorService.getAll(); //The Method Call from service
        promiseGet.then(function (pl) {
          var list = [];
          angular.forEach(pl.data, function(value, key) {
            var censador = {};
            censador.id = value.id;
            censador.noDocumendo = value.noDocumento;
            censador.name = value.nombres;
            censador.lastName = value.apellidos;
            censador.sex = value.sexo;
            censador.state = value.state;
            censador.address = value.direccion;
            censador.cellphone = value.telefono;
            censador.email = value.correo;

            list.push(censador);           
          });

          $scope.pollsters = list;
          clearInterval(myInterval);
        });
  };
  loadEcuestador();

     
     var initialize = function(){
          $scope.PollsterSelected = {};
          $scope.PollsterSelected.id = "";
          $scope.PollsterSelected.noDocumendo = "";
          $scope.PollsterSelected.name = "";
          $scope.PollsterSelected.user = "";
          $scope.PollsterSelected.cellphone = "";
          $scope.PollsterSelected.email = "";
          $scope.PollsterSelected.state = false;
          $scope.PollsterSelected.address = "";
          $scope.PollsterSelected.nuevo = 'S';

     };

     $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
        //you also get the actual event object
        //do stuff, execute functions -- whatever...
        //alert("Hola");
        angular.forEach($scope.pollsters, function(value, key) {
          var ban = false;
          if(value.state == "A"){
            ban = true;
          }

          $('#' + value.noDocumendo).prop('checked', ban);
          });

     });

     $scope.addPollster = function(index , str){
          $( "label" ).addClass( "active" );

          if (str == 'A') {
               initialize();

          }else{
               $scope.PollsterSelected = $scope.pollsters[index];
               $scope.PollsterSelected.nuevo = 'N';
          };


          $('#mPollster').openModal();
     };

     $scope.save = function(){
          var promiseGet = {} ; //The Method Call from service
          var censador = createPollster();

          if($scope.PollsterSelected.nuevo == 'S'){  
            /*Save the question*/
            promiseGet = censadorService.save(censador);
            //console.log(promiseGet);
          }else{
            /* Update the question */
            promiseGet = censadorService.update( censador.id, censador);

          }
                  promiseGet.then(function (pl) {
                    Materialize.toast(pl.data.message ,3000,'rounded');
                    myInterval = setInterval(function () {
                        loadEcuestador();
                    },1000);
                  },
                  function (errorPl) {
                   console.log('Error al guardar el censador', errorPl);
                 });
     };

     function createPollster(){
        var censador = {};
        censador.id = $scope.PollsterSelected.id;
        censador.noDocumento = $scope.PollsterSelected.noDocumendo;
        censador.nombres = $scope.PollsterSelected.name;
        censador.apellidos = $scope.PollsterSelected.lastName;
        censador.direccion = $scope.PollsterSelected.address;
        censador.telefono = $scope.PollsterSelected.cellphone;
        censador.correo = $scope.PollsterSelected.email;
        return censador;
     };

     $scope.openM = function(index, str) {
       $scope.PollsterSelected = $scope.pollsters[index];
       $('#' + str ).openModal();
     };

        $scope.delete = function() {
           var promiseGet = censadorService.delete($scope.PollsterSelected.id); //The Method Call from service
           promiseGet.then(function (pl) {
                Materialize.toast(pl.data.message ,3000,'rounded');
                    myInterval = setInterval(function () {
                        loadEcuestador();
                    },1000);
              },
              function (errorPl) {
               console.log('Error al borrar el Censador', errorPl);
           });
        };

     $scope.newPassword = function(index){
        $( "label" ).addClass( "active" );
        $scope.PollsterSelected = $scope.pollsters[index];
        $('#password').val('');
        $('#password2').val('');
        $('#mPassword').openModal();
      };

     $scope.updateClave = function() {

        if($('#password').val().length < 1 || $('#password2').val().length < 1 ){
          Materialize.toast("Escriba ambas claves" ,3000,'rounded');
        }
         else if( $('#password').val() == $('#password2').val() ){

             var censador = {};
             censador.clave = $('#password').val();
             var promiseGet = censadorService.updateClave($scope.PollsterSelected.id, censador); //The Method Call from service
             promiseGet.then(function (pl) {
                  Materialize.toast(pl.data.message ,3000,'rounded');
                  $('#mPassword').closeModal();

                },
                function (errorPl) {
                 console.log('Error al cambiar la clave', errorPl);
             });

         }else{
          Materialize.toast("Las claves son diferentes" ,3000,'rounded');
         }
      };

     $scope.updateState = function(index) {
             $scope.PollsterSelected = $scope.pollsters[index];
             var censador = {};
             var ban;            
             if($scope.PollsterSelected.state == "A"){
              censador.estado = "I"; 
              ban = false;
             }else{
              censador.estado = "A";
              ban = false;
             }
             
             var promiseGet = censadorService.updateEstado($scope.PollsterSelected.id, censador); //The Method Call from service
             promiseGet.then(function (pl) {
                  Materialize.toast(pl.data.message ,3000,'rounded');
                  //$('#' + $scope.PollsterSelected.noDocumendo).prop('checked', ban);

                },
                function (errorPl) {
                 console.log('Error al cambiar la clave', errorPl);
             });
     };

        function isEmpty(obj) {

            // null and undefined are "empty"
            if (obj == null) return true;

            // Assume if it has a length property with a non-zero value
            // that that property is correct.
            if (obj.length > 0)    return false;
            if (obj.length === 0)  return true;

            // Otherwise, does it have any properties of its own?
            // Note that this doesn't handle
            // toString and valueOf enumeration bugs in IE < 9
            for (var key in obj) {
                if (hasOwnProperty.call(obj, key)) return false;
            }

            return true;
        };

});