app.controller("consultarStikCtr", function($scope, consultarStikService) {

	$scope.filtro = "";
	$scope.stikers = [];
	var table;

  	var permisos = function(){
   	 var rol = sessionStorage.getItem("rol");
    	if (rol != 'ADMIN') {
     	 window.location.href = "#/agregarStik";
    	};
 	 };
  	permisos();

	var activeItemMenu = function(){
		for (i = 1; i <= 3; i++) { 
			$( "#m" + i ).removeClass( "active" );           
		}
		$( "#m" + 3 ).addClass( "active" );  
	};
	activeItemMenu();

  var createTable = function(){
      table = $('#example').dataTable({ "bFilter": false,
                                "language": {
                                  "url": "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
                                }
                              });
      //table.destroy();
  };
  //createTable();


	$scope.Buscar = function(){
		
		$scope.stikers = [];

	   if( $('#test3').prop('checked') ){

	        var promiseGet = consultarStikService.getLikeStiker({stiker:$scope.filtro}); //The Method Call from service
	        promiseGet.then(function (pl) {
	          $scope.stikers = pl.data;
	          //console.log($scope.stikers);
			    if( isEmpty($scope.stikers) ){
			    	Materialize.toast("No encontrado ",3000,'rounded'); 
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

	        var promiseGet = consultarStikService.getLikeMatricula ({matricula:$scope.filtro}); //The Method Call from service
	        promiseGet.then(function (pl) {
	          $scope.stikers = pl.data;	          
			    if( isEmpty($scope.stikers) ){
			    	Materialize.toast("No encontrado ",3000,'rounded'); 
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
	    }
	};

	$(".snumero").keypress(function (e) {//if the letter is not digit then display error and don't type anything
		if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
			return false; 
		}
	});  

  $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
  	  //d.destroy();
  	  //createTable();
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