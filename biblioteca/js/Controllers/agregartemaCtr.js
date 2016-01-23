app.controller("agregartemaCtr", function($scope) {

	$scope.libros = [
				{
					codigo:"COM01",
					titulo:"Comfecamaras",
					temas:[
					        {
					        	tema:"Registros publicos",
					        	pagina:"33"
					        },
					        {
					        	tema:"Contabilidad",
					        	pagina:"25"
					        },
					        {
					        	tema:"Sentencias",
					        	pagina:"65"
					        }
					]
				},
				{
					codigo:"COM02",
					titulo:"Comfecamaras 2012",
					temas:[
					        {
					        	tema:"SII",
					        	pagina:"33"
					        },
					        {
					        	tema:"Manuales de procesos",
					        	pagina:"2"
					        },
					        {
					        	tema:"Anexos",
					        	pagina:"44"
					        }
					]
				},
				{
					codigo:"SUP77",
					titulo:"Superintendencia de Industria y comercio",
					temas:[
					        {
					        	tema:"Requisitos",
					        	pagina:"33"
					        },
					        {
					        	tema:"Pruebas de aceptación",
					        	pagina:"29"
					        },
					        {
					        	tema:"Concurrencia",
					        	pagina:"95"
					        }
					]
				},
				{
					codigo:"ALC07",
					titulo:"Alcaldia",
					temas:[
					        {
					        	tema:"Articulo 94",
					        	pagina:"54"
					        },
					        {
					        	tema:"Regimen de cámaras de comercio",
					        	pagina:"46"
					        }
					]
				}
			 ];

	$scope.libroSelected = {};

	$scope.changelibroSelected = function(libro){
		$scope.libroSelected = libro;
	};

	var activeItemMenu = function(){
		for (i = 1; i <= 3; i++) { 
			$( "#m" + i ).removeClass( "active" );           
		}
		$( "#m" + 2 ).addClass( "active" );  
	};
	activeItemMenu();

  $('select').material_select(); 
  $('.modal-trigger').leanModal();

  $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
	 $('select').material_select(); 
  });

});