app.controller("HomeCtr", function($scope) {
	$scope.usuario = {};

	function autenticar(){
		if( sessionStorage.getItem("usuario") ){
			$scope.usuario.usuario = sessionStorage.getItem("usuario");
			$scope.usuario.nombre = sessionStorage.getItem("nombre");
			$scope.usuario.rol = sessionStorage.getItem("rol");

		}else{
			//window.location.href = "index.html";
		};
	};

	function tipoUsuario(){

		$("#m1").css("display", "block");
		$("#m2").css("display", "block");
		$("#m3").css("display", "block");

		if($scope.usuario.rol == "ADMIN"){
			$("#m1").css("display", "none");
			window.location.href = "#/asignarStik";
		}else{
			$("#m2").css("display", "none");
			$("#m3").css("display", "none");
			window.location.href = "#/agregarStik";
		}
	}

	autenticar();
	//tipoUsuario();

    $scope.salir = function(){
      sessionStorage.clear();
      window.location.href = "index.html";
    };

});