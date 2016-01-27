app.controller("consultarCtr", function($scope, agregarlibroService,$filter, NgTableParams) {
  $scope.libros = [];
    var cargo_id_presidencia = "9";
    var cargo_id_digitalizador = "35";

  function loadngtable(){
    //$scope.tableParams = new NgTableParams({}, { dataset: $scope.libros});
    $scope.tableParams =  new NgTableParams({
                  page: 1,
                  count: 5
              }, {
                  total: $scope.libros.length, 
                  getData: function ($defer, params) {
                     $scope.data = params.sorting() ? $filter('orderBy')($scope.libros , params.orderBy()) : $scope.libros;
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
    var promiseGet = agregarlibroService.getTemasLibro(); //The Method Call from service
    promiseGet.then(function (pl) {     
      $scope.libros = pl.data;
      //console.log($scope.libros);
      loadngtable();
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
  }

  function load(callback){
      if( sessionStorage.getItem("cargo_id") == cargo_id_digitalizador ){
        window.location.href = "home.html#/agregarlibro";
        return true;
      }
    callback();   
    loadLibros();  
  };
  load(loading); 

	var activeItemMenu = function(){
		for (i = 1; i <= 3; i++) { 
			$( "#m" + i ).removeClass( "active" );           
		}
		$( "#m" + 3 ).addClass( "active" );  
	};
	activeItemMenu();

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