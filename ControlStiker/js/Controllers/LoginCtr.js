app2.controller("LoginCtr", function($scope, loginService) {

  function autenticar(){
    if( sessionStorage.getItem("usuario") ){
      window.location.href = "home.html";

    }else{
      
    };
  };
  autenticar();

	$scope.loguear =function(){
			  var usuario = {
			  	               username: $("#inputEmail").val(),
			  	               pass: $("#inputPassword").val()
			  	              };

              var promisePost = loginService.login(usuario);
              promisePost.then(function (pl) {

                var ltUsu = JSON.parse(pl.data.request);
                if( pl.data.message == 'OK' ){
                  angular.forEach(ltUsu, function(usu, key) {
                    sessionStorage.setItem("usuario", usu.correo);
                    sessionStorage.setItem("rol", usu.rol);
                    sessionStorage.setItem("nombre", usu.nombres+' '+usu.apellidos);
                    sessionStorage.setItem("noDocumento", usu.noDocumento);
                    sessionStorage.setItem("Empleados_id", usu.Empleados_id);
                    sessionStorage.setItem("cargo_id", usu.cargo_id);
                    sessionStorage.setItem("cargo", usu.cargo);
                  }); 
                  Materialize.toast("Iniciando Sesión",3000,'rounded');
                  window.location.href = "home.html";
                }else{
                  Materialize.toast("Usuario o Contraseña incorrecta",3000,'rounded');
                }
               

                
                //console.log(usu);                

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


});
