app.controller("agregarStikCtr", function($scope) {

	var activeItemMenu = function(){
		for (i = 1; i <= 3; i++) { 
			$( "#m" + i ).removeClass( "active" );           
		}
		$( "#m" + 1 ).addClass( "active" );  
	};
	activeItemMenu();

});