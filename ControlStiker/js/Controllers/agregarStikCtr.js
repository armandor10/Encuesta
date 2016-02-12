app.controller("agregarStikCtr", function($scope, agregarStikerService) {

  $scope.aux = {};

    var permisos = function(){
      var rol = sessionStorage.getItem("rol");
      if (rol == 'ADMIN') {
        window.location.href = "#/asignarStik";
        return false;
      } else {
        return true;
      }
    };

  function getFecha(){

      var today = new Date();
      //alert(today.toLocaleTimeString());
      var dd = today.getDate();
      var mm = today.getMonth()+1; //January is 0!

      var yyyy = today.getFullYear();
      if(dd<10){
          dd='0'+dd
      } 
      if(mm<10){
          mm='0'+mm
      } 
      return yyyy + '/' + mm + '/' + dd + ' ' + today.toLocaleTimeString();
  };

	$scope.reg = {
		           matricula:"",
		           stiker:"",
		           noDocumento:sessionStorage.getItem('noDocumento'),
               cargo_id:sessionStorage.getItem('cargo_id'),
               fecha: getFecha()
		         };

  function initialize() {
    $scope.reg = {
                 matricula:"",
                 stiker:"",
                 noDocumento:sessionStorage.getItem('noDocumento'),
                 cargo_id:sessionStorage.getItem('cargo_id'),
                 fecha: getFecha()
               };
  };

	var activeItemMenu = function(){
		for (i = 1; i <= 4; i++) { 
			$( "#m" + i ).removeClass( "active" );           
		}
		$( "#m" + 1 ).addClass( "active" );  
	};
	activeItemMenu();

  var getConsecutivo = function(){
            var promiseGet = agregarStikerService.getconsecutivo({noDocumento:$scope.reg.noDocumento}); //The Method Call from service
            promiseGet.then(function (pl) {
              $scope.reg.stiker = pl.data;

            },
             function (err) {
                        if(err.status == 401){
                            alert(err.data.message);
                            console.log(err.data.exception);
                        }else{
                             Materialize.toast("Error al procesar la solicitud",3000,'rounded');                       
                        }
                        console.log(err);
            });
  };

  function load(callback) {
    if( permisos() ){
      callback();
    }    
  };
  load(getConsecutivo);

	$scope.guardar = function(){

    var isnum1 = /^\d+$/.test($scope.reg.matricula);
    var isnum2 = /^\d+$/.test($scope.reg.stiker);

    if( $scope.reg.matricula.length == 0 || 
        $scope.reg.stiker.length == 0 || 
        $("#name_matri").val().length == 0 ){

      Materialize.toast("Complete todos los campos!!!",3000,'rounded');

    }else{
        if( isnum1 && isnum2 ){

          //console.log($scope.reg);
            $scope.reg.razonSocial_nombre = $("#name_matri").val();     
            var promiseGet = agregarStikerService.add($scope.reg ); //The Method Call from service
            promiseGet.then(function (pl) {          
              //console.log(pl.data );
              Materialize.toast(pl.data.message,3000,'rounded');
              if( pl.data.estado == "OK" ) {
                  // Inicializo los datos
                  $scope.aux = angular.copy($scope.reg);
                  $scope.aux.name_matri = $("#name_matri").val();
                  $("#name_matri").val('');
                  initialize();                   
                  $('#modal1').openModal();                 
              }
              
            },
             function (err) {
                        if(err.status == 401){
                            alert(err.data.message);
                            console.log(err.data.exception);
                        }else{
                             Materialize.toast("Error al procesar la solicitud",3000,'rounded');                       
                        }
                        console.log(err);
            });
        }else{
          Materialize.toast("Digite solo numeros!!!",3000,'rounded');
        }
    }
	};

  $scope.noImprimir = function(){
    getConsecutivo();
  };

  $scope.imprimir = function(){
              $.get("printStiker.html", function (data) {

                getConsecutivo();

                  data = data.replace("{{nombre}}", $scope.aux.name_matri) ;
                  data = data.replace("{{matricula}}", $scope.aux.matricula );
                  //console.log(data);

                  // Esta es la parte que te abre la ventana de imprecion...
                  var win;
                  win = window.open();
                  win.document.write(data);
                  win.print();
                  win.close();

              });
  };

  $('input').focusout( function() {
    $('label').addClass('active');
  });

  $('#name_matri').focusout( function() {
     $("#name_matri").val($("#name_matri").val().toUpperCase());
  });

  $( "#last_name" ).focusout(function() {

    if($scope.reg.matricula < 1 || isEmpty($scope.reg.matricula) ){
      $("#name_matri").val('');
      return true;
    }
            var promiseGet = agregarStikerService.getMatriculado({noMatricula:$scope.reg.matricula}); //The Method Call from service
            promiseGet.then(function (pl) {          
              //console.log(pl.data );
              //Materialize.toast(pl.data.message,3000,'rounded');
              $("#name_matri").val(pl.data.razonSocial_nombre)
              if( $("#name_matri").val().length > 1 ) {
                $("#name_matri").val($("#name_matri").val().toUpperCase());  
              }
                           
              if( isEmpty(pl.data) ){
                Materialize.toast("Matricula no encontrada",3000,'rounded');  
              } 
              /*
              if ( $("#name_matri").val().length > 0 ) {
                                
              }else{
                Materialize.toast("Matricula no encontrada",3000,'rounded');  
              }*/
              $( "#agregar" ).removeClass( "disabled" ); 
              
            },
             function (err) {
                        if(err.status == 401){
                            alert(err.data.message);
                            console.log(err.data.exception);
                        }else{
                             Materialize.toast("Error al procesar la solicitud",3000,'rounded');                       
                        }
                        console.log(err);
            });

  });

  $( "#last_name" ).focus(function() {
    $( "#agregar" ).addClass( "disabled" ); 
  });

  	$(".snumero").keypress(function (e) {//if the letter is not digit then display error and don't type anything
    	if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
      	return false; 
    	}
  	});

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