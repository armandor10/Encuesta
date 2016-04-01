app.controller("agregartemaCtr", function($scope, agregarlibroService,$filter, NgTableParams) {

	$scope.libros = [];

	$scope.libroSelected = {};
	$scope.temaSelected = {};
	$scope.categoriaSelected = {};
    var cargo_id_presidencia = "9";
    var cargo_id_digitalizador = "35";

	function initialize(){
		$scope.temaSelected = {};
		$scope.temaSelected.id = "";
		$scope.temaSelected.tema = "";
		$scope.temaSelected.pagina = "";
	};

    function autenticar(){
    	if( sessionStorage.getItem("cargo_id") == cargo_id_presidencia ){
    		window.location.href = "home.html#/consultar";
    	}

    };
    autenticar();

	function makeTree() {
		$('#using_json_2').jstree({ 'core' : {
			'data' : $scope.categorias
		} });
	};

	function loadCategoria(){
		var promiseGet = agregarlibroService.getCategorias();
		promiseGet.then( function (pl) {
			$scope.categorias = pl.data;
			makeTree();

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

	function loadngtable(){
		//$scope.tableParams = new NgTableParams({}, { dataset: $scope.libros});
		$scope.tableParams =  new NgTableParams({
	                page: 1,
	                count: 5
	            }, {
	                total: $scope.libroSelected.temas.length, 
	                getData: function ($defer, params) {
					   $scope.data = params.sorting() ? $filter('orderBy')($scope.libroSelected.temas, params.orderBy()) : $scope.libroSelected.temas;
					   $scope.data = params.filter() ? $filter('filter')($scope.data, params.filter()) : $scope.data;
					   $scope.data = $scope.data.slice((params.page() - 1) * params.count(), params.page() * params.count());
					   $defer.resolve($scope.data);
	                }
	            });
	};

	function loading(){
	    $('#loading').openModal({
	      dismissible: false, // Modal can be dismissed by clicking outside of the modal
	      opacity: .8, // Opacity of modal background
	    });
	};

	function loadLibros(){
		var promiseGet = agregarlibroService.getLibroTemas(); //The Method Call from service
		promiseGet.then(function (pl) {			
			$scope.libros = pl.data;
			//console.log($scope.libros );
			$('#loading').closeModal();

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
	function load(callback){
    	if( sessionStorage.getItem("cargo_id") == cargo_id_presidencia ){
    		window.location.href = "#/consultar";
    		return true;
    	}
		callback();		
		loadLibros();
		loadCategoria();	
	};
	load(loading);

	$scope.guardarTema = function(){
		var promiseGet;

		/* Validación de seleccion de categoria */
		if( isEmpty($scope.categoriaSelected) ){
			Materialize.toast( 'Seleccione una Categoría!!!' ,3000,'rounded');
			return true;
		}

		$scope.temaSelected.categoria = parseInt($scope.categoriaSelected.id);

		if($scope.temaSelected.nuevo){			
			$scope.temaSelected.libro = $scope.libroSelected.id;
			promiseGet = agregarlibroService.addTema($scope.temaSelected);
			//console.log($scope.temaSelected);
		}else{
			promiseGet = agregarlibroService.updateTema($scope.temaSelected);
		}

		promiseGet.then(function (pl) {
			if( $scope.temaSelected.nuevo ){
				/* $scope.temaSelected.id = pl.data.request.id; */
				$scope.libroSelected.temas.push(pl.data.request);

			}else{

				var aux = $.grep( $scope.libroSelected.temas , function( item, index1) {
					if( item.id == $scope.temaSelected.id) {
						item.index = index1;
						item.categoria = $scope.temaSelected.categoria;
						return true;
					} 
				})[0];
				$scope.libroSelected.temas[aux.index] = $scope.temaSelected;

			}

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

	$scope.eliminarTema = function(){
		var promiseGet = agregarlibroService.deleteTema($scope.temaSelected.id);
		promiseGet.then(function (pl) {
			// Elimino el item de temas
				var aux = $.grep( $scope.libroSelected.temas , function( item, index1) {
					if( item.id == $scope.temaSelected.id) {
						item.index = index1;
						return true;
					} 
				})[0];

			$scope.libroSelected.temas.splice(aux.index, 1);

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

	$scope.openModalEliminar = function(tema){
		$scope.temaSelected = tema ;
		$scope.temaSelected.pagina = parseInt($scope.temaSelected.pagina);
	    $('#mEliminar').openModal({
	      dismissible: false, // Modal can be dismissed by clicking outside of the modal
	      opacity: .8, // Opacity of modal background
	    });

	};

	$scope.changelibroSelected = function(libro){
		$scope.libroSelected = libro;
		$("#add").removeClass("disabled");
		loadngtable();
	};

	$scope.editTema = function(tema){
		$scope.temaSelected = angular.copy(tema);
		$scope.temaSelected.pagina = parseInt($scope.temaSelected.pagina);
		//console.log($scope.temaSelected);
		$scope.openModalTema(false);
	};

	$scope.openModalTema = function(nuevo){
		if( nuevo ) {
			initialize();
		}

		$('#using_json_2').jstree("deselect_all");

		console.log($scope.temaSelected.categoria);

		$scope.temaSelected.nuevo = nuevo;
		if( !isEmpty( $scope.temaSelected.categoria ) ) {
			$('#using_json_2').jstree(true)
			  .select_node($scope.temaSelected.categoria);
		}

		/* console.log($scope.temaSelected); */

	    $('#modal1').openModal({
	      dismissible: false, // Modal can be dismissed by clicking outside of the modal
	      opacity: .8, // Opacity of modal background
	    });

	};

	var activeItemMenu = function(){
		for (i = 1; i <= 4; i++) { 
			$( "#m" + i ).removeClass( "active" );           
		}
		$( "#m" + 2 ).addClass( "active" );  
	};
	activeItemMenu();

  $('select').material_select(); 
  /*$('.modal-trigger').leanModal();*/

  $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
	 $('select').material_select(); 
  });

	$('#using_json_2').on('changed.jstree', function (e, data) {
	    var i, j, r = [];
	    for(i = 0, j = data.selected.length; i < j; i++) {
	      /*r.push(data.instance.get_node(data.selected[i]).text);*/
	      //console.log( data.instance.get_node(data.selected[i]) );
	      $scope.categoriaSelected = data.instance.get_node(data.selected[i]);
	    }
	    /* $('#event_result').html('Selected: ' + r.join(', ')); */
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