app.controller('MainController', ['$scope', function($scope) { 
  
  $scope.mainselected = "";

  $scope.main = [
                  {
                    display:'Gestión de Establecimiento',
                    path:'#/'
                  },
                  {
                    display:'Gestión de Encuesta',
                    path:'#/encuesta'
                  },
                  {
                    display:'Encuestador',
                    path:'#'
                  }
                ];

  $scope.mainselected = $scope.main[0].display;

  $scope.mainDisplay = function(index){
    //console.log($scope.main[index]);
    //alert($scope.main[index].display);
    //$('#mainselected').val($scope.main[index].display);
    $scope.mainselected = $scope.main[index].display;
    //alert(mainselected);
    //$scope.$apply();
  }

}]);
