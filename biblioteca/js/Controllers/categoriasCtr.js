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

				var aux = $.grep( $scope.categorias , function( item, index1) {
					if( item.id == $scope.categoriaSelected.id) {
						item.index = index1;
						return true;
					}
				})[0];
				$scope.categorias.splice(aux.index, 1);

				$('#using_json_2').jstree(true).settings.core.data = $scope.categorias;
				$('#using_json_2').jstree(true).refresh();
				
				Materialize.toast( pl.data.message ,3000,'rounded');

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

			/*$('#using_json_2').jstree({ 'core' : {
			    'data' : [
			       { "id" : "ajson1", "parent" : "#", "text" : "Conceptos" },
			       { "id" : "ajson5", "parent" : "ajson1", "text" : "Confecamaras" },
			       { "id" : "ajson6", "parent" : "ajson1", "text" : "Superintendencia" },	       	       
			       { "id" : "ajson7", "parent" : "ajson1", "text" : "Contraloría" },	       	       
			       { "id" : "ajson2", "parent" : "#", "text" : "Auditorias" },
			       { "id" : "ajson3", "parent" : "ajson2", "text" : "Informe de Auditoria" },
			       { "id" : "ajson4", "parent" : "ajson2", "text" : "Informe final de auditoria gubernamental" },
			       { "id" : "ajson8", "parent" : "ajson2", "text" : "Programa de desarrollo y paz del cesar" },
			       { "id" : "ajson9", "parent" : "ajson2", "text" : "Plan operativo anual 2013" },
			       { "id" : "ajson10", "parent" : "ajson2", "text" : "Observaciones proceso auditorio" },
			       { "id" : "ajson11", "parent" : "#", "text" : "Consejo de estado (sala contencioso administrativo)" },
			       { "id" : "ajson12", "parent" : "ajson11", "text" : "Recursos de apelación" },
			       { "id" : "ajson13", "parent" : "ajson11", "text" : "Acto administrativo" },
			       { "id" : "ajson14", "parent" : "ajson11", "text" : "Acción popular" },
			    ]
			} });*/

});