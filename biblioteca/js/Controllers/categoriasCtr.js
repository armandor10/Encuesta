app.controller("categoriasCtr", function( $scope, agregarlibroService) {

	$scope.categorias = [];
	$scope.categoriaSelected = {};
	$scope.categoria = {};

	var activeItemMenu = function(){
		for (i = 1; i <= 4; i++) { 
			$( "#m" + i ).removeClass( "active" );           
		}
		$( "#m" + 4 ).addClass( "active" );  
	};
	activeItemMenu();

	$('#using_json_2').on('changed.jstree', function (e, data) {
	    var i, j, r = [];
	    for(i = 0, j = data.selected.length; i < j; i++) {
	      /*r.push(data.instance.get_node(data.selected[i]).text);*/
	      //console.log( data.instance.get_node(data.selected[i]) );
	      $scope.categoriaSelected = data.instance.get_node(data.selected[i]);
	    }
	    /* $('#event_result').html('Selected: ' + r.join(', ')); */
	});

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
	loadCategoria();


	$scope.openModalCategoria = function(){

		if( isEmpty($scope.categoria.text) ){
			Materialize.toast("Digite la categoría",3000,'rounded'); 
			return true;
		}

	    $('#mCategoria').openModal({
	      dismissible: false, // Modal can be dismissed by clicking outside of the modal
	      opacity: .8, // Opacity of modal background
	    });
	};

	$scope.saveCategoria = function(raiz) { /* raiz = S ,sino no raiz= N */

		if( raiz == "S" ) {
			$scope.categoria.parent = "#";
		} else {
			if( isEmpty( $scope.categoriaSelected ) ) {
				Materialize.toast("Seleccione una categoría o subcategoría",3000,'rounded'); 
				return true;
			} else {
				$scope.categoria.parent = $scope.categoriaSelected.id ;
			}
		}

		var promiseGet = agregarlibroService.addCategoria( $scope.categoria );
		promiseGet.then(function (pl) {			
			$scope.categorias.push(pl.data.request);
			//console.log($scope.categorias);
			$scope.categoria.text = "";
			$('#using_json_2').jstree(true).settings.core.data = $scope.categorias;
			$('#using_json_2').jstree(true).refresh();
			Materialize.toast( pl.data.message,3000,'rounded'); 


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

	$scope.deleteCategoria = function(){
			if( isEmpty( $scope.categoriaSelected ) ) {
				Materialize.toast("Seleccione una categoría o subcategoría",3000,'rounded'); 
				return true;

			} else {
				var promiseGet = agregarlibroService.deleteCategoria( $scope.categoriaSelected.id );
				promiseGet.then( function (pl) {

				if( pl.data.state == "OK" ) {
					var aux = $.grep( $scope.categorias , function( item, index1) {
					if( item.id == $scope.categoriaSelected.id) {
						item.index = index1;
						return true;
						}
					} ) [0];
					deleteCategoriasChild(aux.id);
					$scope.categorias.splice(aux.index, 1);

					console.log($scope.categorias);

					$('#using_json_2').jstree(true).settings.core.data = $scope.categorias;
					$('#using_json_2').jstree(true).refresh();
				}

				Materialize.toast( pl.data.message ,4000,'rounded');

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
	};

	function deleteCategoriasChild (id) {
		var aux = $.grep( $scope.categorias , function( item, index1) {
			return item.parent == id ;
		});

		if( !isEmpty(aux) ) {
			// Hacer un foreach y call deletecategChild
			angular.forEach(aux, function(value, key) {

				deleteCategoriasChild(value.id)
				var aux1 = $.grep( $scope.categorias , function( item, index1) {
					if( item.id == value.id) {
						item.index = index1;
							return true;
						}
					} ) [0];
				$scope.categorias.splice(aux1.index, 1);

			});
		}
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