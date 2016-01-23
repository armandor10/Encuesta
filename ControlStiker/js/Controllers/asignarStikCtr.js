app.controller("asignarStikCtr", function($scope,auxVentanillaService) {

	$scope.detailsStikers = [];
  var id_cargo_auxventanilla = "36";

	$scope.detailsStikerSelected = {};
	var rangoI = {};
	$scope.stikers = [];

  var permisos = function(){
    var rol = sessionStorage.getItem("rol");
    if (rol != 'ADMIN') {
      window.location.href = "#/agregarStik";
    };
  };
  permisos();

	var loadDetails = function(){		
        var list = [];
        var promiseGet = auxVentanillaService.getAll(); //The Method Call from service
        promiseGet.then(function (pl) {
          angular.forEach(pl.data, function(value, key) {
            var auxVentanilla = {};
            auxVentanilla.noDocumento = value.noDocumento;
            auxVentanilla.nombre = value.nombre;
            if(value.inicioStiker == null || value.finStiker.length == null){
              auxVentanilla.stiker = "-";

            }else{
              auxVentanilla.stiker = value.inicioStiker +"-" + value.finStiker;

            }
            auxVentanilla.entregados = value.Entregados;
            auxVentanilla.inicioStiker = value.inicioStiker;
            auxVentanilla.finStiker = value.finStiker;
            auxVentanilla.cargo = value.cargo;
            auxVentanilla.Cargos_id = value.Cargos_id;

            list.push(auxVentanilla);           
          });

          $scope.detailsStikers = list;


        });     
	};
	loadDetails();

    var loadStikers = function(){    	
        var promiseGet = auxVentanillaService.getRegistroAsignacion({noDocumento:$scope.detailsStikerSelected.noDocumento}); //The Method Call from service
        promiseGet.then(function (pl) {
          $scope.stikers = pl.data;
          //console.log($scope.stikers );
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

	$scope.guardarRango = function(){
		      var rango ={};
		      rango.noDocumento = $scope.detailsStikerSelected.noDocumento;
		      rango.inicioStiker = $scope.detailsStikerSelected.inicioStiker;
		      rango.finStiker = $scope.detailsStikerSelected.finStiker;

              var promisePost = auxVentanillaService.saveRango(rango);
              promisePost.then(function (pl) {

	              	if(pl.data.state =='OK'){
		              	  $scope.detailsStikerSelected.stiker = rango.inicioStiker +"-"+rango.finStiker;
	              	}else{
	              		//alert( JSON.stringify(rangoI) );
		              	$scope.detailsStikerSelected.inicioStiker = rangoI.inicioStiker;
		              	$scope.detailsStikerSelected.finStiker = rangoI.finStiker;
	              	}

                  Materialize.toast(pl.data.message ,3000,'rounded');               

                }, function (err) {
                    if(err.status == 401){
                        alert(err.data.message);
                        console.log(err.data.exception);
                    }else{
                         Materialize.toast("Error al procesar la solicitud",3000,'rounded');                       
                    }
                    console.log(err);
                });
	};

	var activeItemMenu = function(){
		for (i = 1; i <= 3; i++) { 
			$( "#m" + i ).removeClass( "active" );           
		}
		$( "#m" + 2 ).addClass( "active" );  
	};
	activeItemMenu();

	$scope.openModalAsignar = function(index){
    
    if( $scope.detailsStikers[index].Cargos_id != id_cargo_auxventanilla ){
      return true;
    }

		rangoI.inicioStiker= $scope.detailsStikers[index].inicioStiker;
		rangoI.finStiker = $scope.detailsStikers[index].finStiker;
		$("label").addClass("active");
		$scope.detailsStikerSelected = $scope.detailsStikers[index];
		$('#modalAsignar').openModal();
	};

	$scope.openModalDetalles = function(index){
		$scope.detailsStikerSelected = $scope.detailsStikers[index];
		loadStikers();
		$('#modalDetalles').openModal();
	};

  $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
      $('#example').dataTable({ "bFilter": false,
                                "language": {
                                  "url": "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
                                }
                              });
  });

  $(".snumero").keypress(function (e) {//if the letter is not digit then display error and don't type anything
    if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
      return false; 
    }
  });

});