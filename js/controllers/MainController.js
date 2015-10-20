app.controller('MainController', ['$scope', function($scope) { 
  
  $scope.main = [
                  {
                    display:'Gestión de Establecimiento',
                    path:'#'
                  },
                  {
                    display:'Gestión de Encuesta',
                    path:'#'
                  },
                  {
                    display:'Encuestador',
                    path:'#'
                  }
                ];

  $scope.mainDisplay = function(m){
    console.log(m);
    //$('#mainselected').val(m.display);
  }

}]);
