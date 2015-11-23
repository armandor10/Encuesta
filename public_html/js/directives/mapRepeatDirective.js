app.directive('mapRepeatDirective', function() {
  return function(scope, element, attrs) {
    //angular.element(element).css('color','blue');
	    if (scope.$last){
	      //window.alert("im the last!");
	      $('.collapsible').collapsible();
	    }
  };
});