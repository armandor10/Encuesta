app.controller('MainController', ['$scope','menuService', function($scope, menuService) { 
  
  $scope.mainselected = "";
  
    function loadMain() {
        var promiseGet = menuService.getAll(); //The Method Call from service
        promiseGet.then(function (pl) {
          $scope.main = pl.data;
          $scope.mainselected = $scope.main[0].nombre;
          //console.log($scope.main[0].nombre);
        },
        function (errorPl) { 
          $log.error('Error cargando el menu', errorPl);
        });
    };

    loadMain();

  //$scope.mainselected = $scope.main[0].nombre;

  $scope.mainDisplay = function(index){
    //console.log($scope.main[index]);
    //alert($scope.main[index].display);
    //$('#mainselected').val($scope.main[index].display);
    $scope.mainselected = $scope.main[index].nombre;
    alert(mainselected);
    //$scope.$apply();
  }

}]);
