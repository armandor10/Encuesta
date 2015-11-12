app.controller("EncuestaController", function($scope) {



	$scope.censusSelected = {};
	$scope.sectionSelected = {};
	$scope.questionSelected = {}; 
	$scope.lAnswerdSelected = "";
	$scope.typeSelected = "";
	$scope.titleModalCE_SE = "";

	 function initialize() {
	        $scope.questionSelected = {};
	        $scope.questionSelected.id = "";
	        $scope.questionSelected.question = "";
	        $scope.questionSelected.required = false;
	        $scope.questionSelected.type = 'T';
	        $scope.questionSelected.answers = [];

	 }

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
											questions: [
											            {
											            	id: "1",
											            	question: "¿Cuantos años tiene de funcionamiento el establecimiento?",
											            	type: "C" ,/* this can be text, logic (yes or not), combobox, radio
											            	           estas son: NS, SN, T, C, R*/ 
											            	required: true,
											            	answers: [
											            	          {
											            	          	id: "1",
											            	          	answer: "1-2"
											            	          },
											            	          {
											            	          	id: "2",
											            	          	answer: "3-4"
											            	          },
											            	          {
											            	          	id: "3",
											            	          	answer: "5-6"
											            	          }
											            	         ]
											            },
											            {
											            	id: "2",
											            	question: "¿Como considera la gestión llevada por el actual gerente de la CCV?",
											            	type: "R" ,// this can be text, logic (yes or not), combobox, radio
											            	required: false,
											            	answers: [
											            	          {
											            	          	id: "1",
											            	          	answer: "Excelente"
											            	          },
											            	          {
											            	          	id: "2",
											            	          	answer: "Buena"
											            	          },
											            	          {
											            	          	id: "3",
											            	          	answer: "Regular"
											            	          }
											            	         ]

											            },
											            {
											            	id: "3",
											            	question: "Nombre del encuestado",
											            	type: "T" ,// this can be text, logic (yes or not), combobox, radio
											            	required: true,
											            	answers: [
											            	         ]
											            },
											            {
											            	id: "4",
											            	question: "¿Ha denunciado un hecho delictivo en su vida ?",
											            	type: "SN" ,// this can be text, logic (yes or not), combobox, radio
											            	required: false,
											            	answers: [ /* Esto deberia agregarlo actomaticamente en la logica del negocio*/
											            	          {
											            	          	id: "1",
											            	          	answer: "Si"
											            	          },
											            	          {
											            	          	id: "2",
											            	          	answer: "No"
											            	          }
											            	         ]
											            }
											           ]

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
        	//$scope.sectionSelected = $scope.censuses[index].sections;
        	$('.collapsible').collapsible();
        	//console.log($scope.sectionSelected);
        };

        $scope.loadSection = function(index){
        	$scope.sectionSelected = $scope.censusSelected.sections[index];
        	//console.log($scope.sectionSelected);
        };

        $scope.saveQuestion = function(){

        	//console.log($scope.questionSelected);

        	if($scope.questionSelected.id.length < 1){
        		var qtn = createQuestion();
	        	/*Save the question*/
	        	qtn.id = "5"; // remove this and Set REST service 
	        	$scope.sectionSelected.questions.push(qtn);

        	}else{
        		var qtn = createQuestion();
        		/* Update the question */
        		$scope.sectionSelected.questions.push(qtn); // remove this and Set REST service 

        	}
        	
        	//console.log($scope.sectionSelected);
        	$('#mP').closeModal();
        };

        var createQuestion = function() {
        	var qtn = {};
        	qtn.question = $scope.questionSelected.question;
        	qtn.type = $scope.typeSelected;
        	qtn.required = $scope.questionSelected.required;
        	qtn.answers = createListAnswers();       	
        	//console.log(qtn);
        	return qtn;
        };

        var createListAnswers = function(){
        	var list = [];
        	var obj = {};
        	if($scope.typeSelected != "T" ){
        		var array = $('#textarea1').val().split('\n');
	        	if(array.length >= 1){ 
		        	for (i = 0; i < array.length; i++) {
		        		obj = {};
		        		obj.answer = array[i]; 
			        	list.push(obj); 
			        }
			    }
			    //console.log(list);
        	}
        	
		    return list;
        };

        $scope.typeQuestion = function(type){
        	$scope.typeSelected = type;
        	if(type == "SN"){
        		$('#textarea1').val('Si' + "\n" + "No");
        		$('#NS').prop('checked', false);

        	}else{
        		if(type == "NS"){
        			$('#textarea1').val('Si' + "\n" + "No" + "\n" + "No sabe. No responde");
        			$('#textarea1').trigger('autoresize');
        			$('#SN').prop('checked', true);

        		}else{
        			$('#textarea1').val('');

        		}        		
        	}
        };

        $scope.addQuestion = function(){
        	initialize();
        	$('#NS').prop('checked', false);
        	$('#T').prop('checked', true);
        	$('#textarea1').val('');
        	$('#aux').val(''); 
        	$('#mP').openModal();
        };

        $scope.addAnswer = function() {
        	//console.log($scope.typeSelected);
        	if($scope.typeSelected != "SN" && $scope.typeSelected != "T" && $('#aux').val().length > 0 ) {
        		$('#textarea1').val( $('#textarea1').val() + $('#aux').val() + "\n");
        		$('#textarea1').trigger('autoresize');
        		$('#aux').val('');
        	}
        };

        $scope.removeAnswer = function() {
        	if($scope.typeSelected != "SN" && $scope.typeSelected != "T") {
        		var str = "";
        		var array = $('#textarea1').val().split('\n');
        		//console.log(array);
        		if(array.length <= 1) {
        			str = "";

        		}else{
        			for (i = 0; i < array.length - 2; i++) {
	        		   str = str + array[i] + '\n'; 
	        		}	        		
        		}

        		$('#textarea1').val(str);
        		
        	}
        };

        /* Open Modal of Questions. Here I can edit a question*/
        $scope.openModal = function(qs){
          //console.log(qs);
          $scope.questionSelected = qs;
          $('#' + $scope.questionSelected.type).prop('checked', true);
          //$('#required').prop('checked', $scope.questionSelected.required);
          $('#NS').prop('checked', false);
          $('#aux').val(''); 
          $scope.typeSelected = $scope.questionSelected.type;

          /*add the list of answers*/
          
          $scope.lAnswerdSelected = "";
          //$('#textarea1').trigger('autoresize');
          angular.forEach($scope.questionSelected.answers, function(value, key) {
			  $scope.lAnswerdSelected = $scope.lAnswerdSelected + value.answer + "\n";
			});
          $('#textarea1').val($scope.lAnswerdSelected);
          $('#textarea1').trigger('autoresize');

          $('#mP').openModal();
        };

        $scope.openMCensus = function(str){
        	if(str == "CE"){
        		$scope.titleModalCE_SE = "Censo";
        	}else{
        		$scope.titleModalCE_SE = "Sección";
        	}
        	$('#mC').openModal();
        };

        $scope.openMConfig = function(){
        	$('#mConfig').openModal();
        };

        // Load the first census
        $scope.loadSections(0);

});