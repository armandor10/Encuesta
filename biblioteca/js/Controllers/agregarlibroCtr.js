app.controller("agregarlibroCtr", function($scope, agregarlibroService,$filter, NgTableParams) {

	$scope.libros = [];
	$scope.libroselected = {};
	$scope.operacion = "";
	var nuevoLibro;
	var input;
	var picker,table;
	var self = this;
	var idx;
    var cargo_id_presidencia = "9";
    var cargo_id_digitalizador = "35";

	function initialize(){
		$scope.libroselected = {};
		$scope.libroselected.id = "";
		$scope.libroselected.codigo = "";
		$scope.libroselected.titulo = "";
		$scope.libroselected.fecha = "";
	};

	var activeItemMenu = function(){
		for (i = 1; i <= 3; i++) { 
			$( "#m" + i ).removeClass( "active" );           
		}
		$( "#m" + 1 ).addClass( "active" );  
	};
	activeItemMenu();

	function load(callback){
    	if( sessionStorage.getItem("cargo_id") == cargo_id_presidencia ){
    		window.location.href = "#/consultar";
    		return true;
    	}
		callback();		
		getAll();		
	};

	function loading(){
	    $('#loading').openModal({
	      dismissible: false, // Modal can be dismissed by clicking outside of the modal
	      opacity: .8, // Opacity of modal background
	    });
	};

	function loadngtable(){
		//$scope.tableParams = new NgTableParams({}, { dataset: $scope.libros});
		$scope.tableParams =  new NgTableParams({
	                page: 1,
	                count: 5
	            }, {
	                total: $scope.libros.length, 
	                getData: function ($defer, params) {
					   $scope.data = params.sorting() ? $filter('orderBy')($scope.libros, params.orderBy()) : $scope.libros;
					   $scope.data = params.filter() ? $filter('filter')($scope.data, params.filter()) : $scope.data;
					   $scope.data = $scope.data.slice((params.page() - 1) * params.count(), params.page() * params.count());
					   $defer.resolve($scope.data);
	                }
	            });
	};

	function getAll(){
		var promiseGet = agregarlibroService.getAll(); //The Method Call from service
		promiseGet.then(function (pl) {			
			$scope.libros = pl.data;
			//$scope.tableParams.reload();
			loadngtable();

		},function (err) {
			if(err.status == 401){
				alert(err.data.message);
				console.log(err.data.exception);
			}else{
				Materialize.toast("Error al procesar la solicitud",3000,'rounded');
			}
			console.log(err);
		});
	};
	
	$scope.guardarLibro = function(){
		$scope.libroselected.fecha = picker.get();
		var promiseGet;
		if( nuevoLibro ){
			promiseGet = agregarlibroService.add($scope.libroselected);

		}else{
			promiseGet = agregarlibroService.update($scope.libroselected);

		}

		promiseGet.then(function (pl) {

			if ( nuevoLibro ) {
				$scope.libroselected.id = pl.data.request.id;
				$scope.libros.push($scope.libroselected);
			}else{
				// Reemplazo el libro modificado
				var aux = $.grep( $scope.libros , function( item, index1) {
				                    if( item.id == $scope.libroselected.id) {
				                    	item.index = index1;
				                    	return true;
				                    } 
				})[0];
				$scope.libros[aux.index] = $scope.libroselected;
			};

            // Actualizo el ng-table
			$scope.tableParams.reload();			
			Materialize.toast( pl.data.message ,3000,'rounded');

		},function (err) {
			if(err.status == 401){
				alert(err.data.message);
				console.log(err.data.exception);
			}else{
				Materialize.toast("Error al procesar la solicitud",3000,'rounded');
			}
			console.log(err);
		});
	};

	$scope.eliminarLibro = function() {
		var promiseGet = agregarlibroService.delete($scope.libroselected.id);
		promiseGet.then(function (pl) {
			// Elimino el item de libros
				var aux = $.grep( $scope.libros , function( item, index1) {
				                    if( item.id == $scope.libroselected.id) {
				                    	item.index = index1;
				                    	return true;
				                    } 
				})[0];
			$scope.libros.splice(aux.index, 1);

            // Actualizo el ng-table
			$scope.tableParams.reload();			
			Materialize.toast( pl.data.message ,3000,'rounded');

		},function (err) {
			if(err.status == 401){
				alert(err.data.message);
				console.log(err.data.exception);
			}else{
				Materialize.toast("Error al procesar la solicitud",3000,'rounded');
			}
			console.log(err);
		});

	};

	load(loading);

	$scope.openModalLibro = function(nuevo){
		picker = input.pickadate('picker');
		nuevoLibro = nuevo;

		if (nuevo) {
			$scope.operacion = "Agregar";
			initialize();
			$("#icodigo").prop('disabled', false);
			picker.set('select', new Date())

		}else{
			$scope.operacion = "Editar";
			$("#icodigo").prop('disabled', true);			
			picker.set('select', $scope.libroselected.fecha, { format: 'yyyy-mm-dd' })

		};

		$("label").addClass("active");

	    $('#modal2').openModal({
	      dismissible: false, // Modal can be dismissed by clicking outside of the modal
	      opacity: .8, // Opacity of modal background
	    });
	};

	$scope.openModalEliminar = function(libro) {
		$scope.libroselected = angular.copy( libro );
	    $('#mEliminar').openModal({
	      dismissible: false, // Modal can be dismissed by clicking outside of the modal
	      opacity: .8, // Opacity of modal background
	    });
	};

	$scope.editarLibro = function(libro) {
		$scope.libroselected = angular.copy(libro);
		//$scope.libroselected.index = index;
		$scope.openModalLibro(false);
	};

	$( "#icodigo" ).focusout(function() {
		$scope.libroselected.codigo = $scope.libroselected.codigo.toUpperCase();
	});

	var createTable = function(){
      table = $('#example').dataTable({   "bFilter": true,
                                  "language": {
                                  				"url": "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
                                              },
                                  "pagingType": "full_numbers"
                              });
	};

  $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
  	//createTable();
	$('#loading').closeModal();
  });
  
	function createdatepicker(){
	  input = $('.datepicker').pickadate({
		    monthsFull: [ 'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre' ],
		    monthsShort: [ 'ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic' ],
		    weekdaysFull: [ 'domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado' ],
		    weekdaysShort: [ 'dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb' ],
			weekdaysLetter: [ 'D', 'L', 'M', 'M', 'J', 'V', 'S' ],
		    today: 'hoy',
		    clear: 'borrar',
		    close: 'cerrar',
		    firstDay: 1,
		    format: 'yyyy/mm/dd',
		    formatSubmit: 'yyyy/mm/dd'
	  });
	};
	createdatepicker();

});

