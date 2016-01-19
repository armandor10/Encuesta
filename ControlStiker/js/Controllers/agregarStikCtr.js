app.controller("agregarStikCtr", function($scope, agregarStikerService) {

	$scope.reg = {
		           matricula:"",
		           stiker:"",
		           noDocumento:sessionStorage.getItem('noDocumento')
		         };

  	var permisos = function(){
    	var rol = sessionStorage.getItem("rol");
    	if (rol == 'ADMIN') {
      	window.location.href = "#/asignarStik";
    	};
  	};
  	permisos();

	var activeItemMenu = function(){
		for (i = 1; i <= 3; i++) { 
			$( "#m" + i ).removeClass( "active" );           
		}
		$( "#m" + 1 ).addClass( "active" );  
	};
	activeItemMenu();

	$scope.guardar = function(){

    var isnum1 = /^\d+$/.test($scope.reg.matricula);
    var isnum2 = /^\d+$/.test($scope.reg.stiker);

    if($scope.reg.matricula.length == 0 || $scope.reg.stiker.length == 0){
      Materialize.toast("Complete todos los campos!!!",3000,'rounded');

    }else{
        if(isnum1 && isnum2){
     
            var promiseGet = agregarStikerService.add($scope.reg ); //The Method Call from service
            promiseGet.then(function (pl) {          
              //console.log(pl.data );
              Materialize.toast(pl.data.message,3000,'rounded');  
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

  $( "#last_name" ).focusout(function() {
            var promiseGet = agregarStikerService.getMatriculado({noMatricula:$scope.reg.matricula}); //The Method Call from service
            promiseGet.then(function (pl) {          
              //console.log(pl.data );
              //Materialize.toast(pl.data.message,3000,'rounded');  
              $("#name_matri").val(pl.data.razonSocial_nombre);
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

  	$(".snumero").keypress(function (e) {//if the letter is not digit then display error and don't type anything
    	if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
      	return false; 
    	}
  	});

});