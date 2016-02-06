app.controller("consultarAuxStikCtr", function( $scope, consultarStikService,$filter, NgTableParams ) {

	$scope.regAsignacion = [];

  	var permisos = function(){
    	var rol = sessionStorage.getItem("rol");
    	if (rol == 'ADMIN') {
      	window.location.href = "#/asignarStik";
    	};
  	};
  	permisos();

	var activeItemMenu = function(){
		for (i = 1; i <= 4; i++) { 
			$( "#m" + i ).removeClass( "active" );           
		}
		$( "#m" + 4 ).addClass( "active" );  
	};
	activeItemMenu();

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
	                total: $scope.regAsignacion.length, 
	                getData: function ($defer, params) {
					   $scope.data = params.sorting() ? $filter('orderBy')($scope.regAsignacion, params.orderBy()) : $scope.regAsignacion;
					   $scope.data = params.filter() ? $filter('filter')($scope.data, params.filter()) : $scope.data;
					   $scope.data = $scope.data.slice((params.page() - 1) * params.count(), params.page() * params.count());
					   $defer.resolve($scope.data);
	                }
	            });
	};

	function buscarRegistros() {

		if( $('#fecha').val().length < 1 ){
			$('#loading').closeModal();
			return true;
		}

		var obj = {
				    "noDocumento": sessionStorage.getItem("noDocumento"),
				    "fecha": $('#fecha').val()
				  };
	        var promiseGet = consultarStikService.getRegistroAsignacion( obj ); //The Method Call from service
	        promiseGet.then(function (pl) {
	          $scope.regAsignacion = pl.data;
	          loadngtable();
	          //console.log($scope.stikers);
			    if( isEmpty($scope.regAsignacion) ){
			    	$('#loading').closeModal();
			    	Materialize.toast("Registros no Encontrados ",3000,'rounded'); 
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
	};

	function changeFecha() {
	  loading();
	  $scope.regAsignacion = [];
	  buscarRegistros();
	};

	$( "input[type='date']" ).change(function() {
	  // Check input( $( this ).val() ) for validity here
	  changeFecha();
	});

	function setNowFecha() {
		var now = new Date();

		var day = ("0" + now.getDate()).slice(-2);
		var month = ("0" + (now.getMonth() + 1)).slice(-2);

		var today = now.getFullYear()+"-"+(month)+"-"+(day) ;
		$('#fecha').val( today );
		changeFecha();
	};
	setNowFecha();

	$scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
		$('#loading').closeModal();
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