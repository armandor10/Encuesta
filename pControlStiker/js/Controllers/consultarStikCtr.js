app.controller("consultarStikCtr", function($scope) {

	var activeItemMenu = function(){
		for (i = 1; i <= 3; i++) { 
			$( "#m" + i ).removeClass( "active" );           
		}
		$( "#m" + 3 ).addClass( "active" );  
	};
	activeItemMenu();

});