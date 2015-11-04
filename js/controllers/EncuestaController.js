app.controller("EncuestaController", function($scope) {

	$scope.censusSelected = {};
	$scope.sectionSelected = {}; 
	$scope.censuses = [
						{
							id:1,
							title:"Censo 2014",
							state: false,
							sections: []
						},
						{
							id:2,
							title:"Censo 2015",
							state: true,
							sections: [
										{
											idSection:1,
											title:"Datos Basicos",
											questions: []

										},
										{
											idSection:2,
											title:"Actividad Economica",
											questions: []

										},
										{
											idSection:3,
											title:"Seguridad",
											questions: []

										}
								      ]
						},
						{
							id:3,
							title:"Censo Elecciones",
							state: true,
							sections: []
						}
					  ];




		$scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
            //you also get the actual event object
            //do stuff, execute functions -- whatever...
            //alert("Hola");
             angular.forEach($scope.censuses , function(value, key) {
		         $('#' + value.id).prop('checked', value.state);
		      });
        });

        $scope.loadSections = function(index){
        	$scope.censusSelected = $scope.censuses[index];
        	$scope.sectionSelected = $scope.censuses[index].sections;
        	$('.collapsible').collapsible();
        	console.log($scope.sectionSelected);
        };

        // Load the first census
        $scope.loadSections(0);

});