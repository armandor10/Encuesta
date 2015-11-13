app.controller("EncuestadorController", function($scope) {

     $scope.PollsterSelected = {};

	$scope.pollsters = [ /* add la password */
                         {
                         	noDocumendo:"1234",
                         	name:"Lisugey Melo Vital",
                         	user:"lmelo",
                         	cellphone:"301 708 2244",
                         	email: "llll@gmail.com",
                         	state:true,
                              address:"Cll 42 No 20- 67"
                         },
                         {
                         	noDocumendo:"5678",
                         	name:"Armando Reyes Torres",
                         	user:"areyes",
                         	cellphone:"301 908 6511",
                         	email: "aaaa@gmail.com",
                         	state:true,
                              address:" Cr 32 No 4a-33"
                         },
                         {
                         	noDocumendo:"4321",
                         	name:"Jose Perkerman Bautista",
                         	user:"jpekerman",
                         	cellphone:"301 701 8743",
                         	email: "jjjj@gmail.com",
                         	state:true,
                              address:"Cr 23a No 29-66"

                         },
                         {
                         	noDocumendo:"8765",
                         	name:"Selena Gomez Soto",
                         	user:"sgomez",
                         	cellphone:"301 458 6530",
                         	email: "ssss@gmail.com",
                         	state: false,
                              address:"Cll 45 No 12-56"

                         }
			         ];
     
     var initialize = function(){
          $scope.PollsterSelected = {};
          $scope.PollsterSelected.noDocumendo = "";
          $scope.PollsterSelected.name = "";
          $scope.PollsterSelected.user = "";
          $scope.PollsterSelected.cellphone = "";
          $scope.PollsterSelected.email = "";
          $scope.PollsterSelected.state = false;
          $scope.PollsterSelected.address = "";

     };

     $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
        //you also get the actual event object
        //do stuff, execute functions -- whatever...
        //alert("Hola");
        angular.forEach($scope.pollsters, function(value, key) {
             $('#' + value.noDocumendo).prop('checked', value.state);
          });
     });

     $scope.addPollster = function(index , str){
          $( "label" ).addClass( "active" );

          if (str == 'A') {
               initialize();

          }else{
               $scope.PollsterSelected = $scope.pollsters[index];
          };


          $('#mPollster').openModal();
     };

     $scope.newPassword = function(index){
        $( "label" ).addClass( "active" );
        $scope.PollsterSelected = $scope.pollsters[index];
        $('#password').val('');
        $('#password2').val('');
        $('#mPassword').openModal();

     };

});