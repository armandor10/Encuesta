app.controller("EncuestaController", function($scope, censoService) {

	$scope.censusSelected = {};
	$scope.sectionSelected = {};
	$scope.questionSelected = {}; 
	$scope.lAnswerdSelected = "";
	$scope.typeSelected = "T";
	$scope.titleModalCE_SE = "";
  $scope.CE_SE = {
                  id: 0,
                  nombre : '',
                  ban : ''
                 };
  var myInterval;

	 function initialize() {
	        $scope.questionSelected = {};
	        $scope.questionSelected.id = "";
	        $scope.questionSelected.question = "";
	        $scope.questionSelected.required = false;
	        $scope.questionSelected.type = 'T';
	        $scope.questionSelected.answers = [];
          $scope.questionSelected.ban = 'S'; /* Nueva Pregunta: S->Si y N-> No*/
	 };

	 function loadCensuses(){
	 	    var promiseGet = censoService.getAll(); //The Method Call from service
        promiseGet.then(function (pl) {
        	var list = [];
          angular.forEach(pl.data, function(value, key) {
          	var censo = {};
          	censo.id = value.id;
          	censo.title = value.nombre;
          	censo.state = value.estado;
            censo.gps = value.gps;
            censo.foto = value.foto;
            censo.grabacion = value.grabacion

            list.push(censo);          	
          });

          $scope.censuses = list;
          clearInterval(myInterval);
      	});
	 };

	 loadCensuses();

		  $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
            //you also get the actual event object
            //do stuff, execute functions -- whatever...
            //alert("Hola");
            //$('.collapsible').collapsible();
             angular.forEach($scope.censuses , function(value, key) {
             	if(value.state == 'A'){
             		$('#' + value.id).prop('checked', true);
             	}
             	else{
             		$('#' + value.id).prop('checked', false);
             	}
		         
		         });
        });

        $scope.loadSections = function(sec){
        	//console.log(sec);
		    	var promiseGet = censoService.getSeccion(sec.id); //The Method Call from service
	        promiseGet.then(function (pl) {
	          var list = [];
	          angular.forEach(pl.data, function(value, key) {
	          	var seccion = {};
	          	seccion.idSection = value.id;
	          	seccion.title = value.nombre;

              seccion.questions = loadQuestion(value.censo, value.id);

	            list.push(seccion);          	
	          });

	          sec.sections = list;
	      	},
            function (errorPl) {
             console.log('Error al cargar las Secciones', errorPl);
           });


        	$scope.censusSelected = sec;
        	//$scope.sectionSelected = $scope.censuses[index].sections;
        	$('.collapsible').collapsible();
        	//console.log($scope.sectionSelected);
        };

        $scope.loadSection = function(index){
          //$('.collapsible').collapsible();
        	$scope.sectionSelected = $scope.censusSelected.sections[index];
          $('.collapsible').collapsible();
        	//console.log($scope.sectionSelected);
        };

        $scope.saveCensus = function(){
          if($scope.CE_SE.nombre.length > 0){
            var c = {};
            c.nombre = $scope.CE_SE.nombre;
              var promiseGet = {} ; //The Method Call from service

              if($scope.CE_SE.ban == 'C'){
                promiseGet = censoService.save(c);
              }else{

                //console.log($scope.censusSelected);
                if( ! isEmpty($scope.censusSelected) ){
                  c.censo = $scope.censusSelected.id;
                  promiseGet = censoService.saveSection(c);
                }else{
                  Materialize.toast('Seleccione un Censo para agregar una Sección' ,3000,'rounded');
                }

              }

              if( ! isEmpty(promiseGet) ){

                  promiseGet.then(function (pl) {
                    Materialize.toast(pl.data.message ,3000,'rounded');
                      $scope.censusSelected = {};
                      $scope.CE_SE.nombre = "";
                      myInterval = setInterval(function () {
                          loadCensuses();
                      },1000);
                  },
                  function (errorPl) {
                   console.log('Error al guardar el Censo', errorPl);
                 });

                }

          } else{
            Materialize.toast("Error al digitar el Censo",3000,'rounded');     
          }
        };

        $scope.openDecision = function(cen){
          $scope.censusSelected = cen;
          $('#mD').openModal();
        };

        $scope.deleteCensus = function(){
          cen = $scope.censusSelected;
          $scope.censusSelected = {};

           var promiseGet = censoService.delete(cen.id); //The Method Call from service
           promiseGet.then(function (pl) {
                Materialize.toast(pl.data.message ,3000,'rounded');
                  myInterval = setInterval(function () {
                      loadCensuses();
                  },1000);
           },
              function (errorPl) {
               console.log('Error al borrar el Censo', errorPl);
           });
        };

        $scope.deleteSection = function(){
           //console.log($('#mDsectionId').val());
           var promiseGet = censoService.deleteSection($('#mDsectionId').val()); //The Method Call from service
           promiseGet.then(function (pl) {
                Materialize.toast(pl.data.message ,3000,'rounded');
                $scope.censusSelected = {};
                  myInterval = setInterval(function () {
                      loadCensuses();
                  },1000);
           },
              function (errorPl) {
               console.log('Error al borrar la sección', errorPl);
           });
        };

        $scope.updateCensus = function(id){
          var c = {};
          if($('#' + id).prop('checked')){
            c.estado = "A";
          }else{
            c.estado = "I";
          }
          //console.log(value);
           var promiseGet = censoService.update(id, c); //The Method Call from service
           promiseGet.then(function (pl) {
                Materialize.toast(pl.data.message ,3000,'rounded');
                  myInterval = setInterval(function () {
                      loadCensuses();
                  },1000);
           },
              function (errorPl) {
               console.log('Error al Actualizar el Censo', errorPl);
           });

        };

        function loadQuestion(idCenso, idSection){
          var questions = [];
          var promiseGet = censoService.getQuestions( idCenso, idSection); //The Method Call from service
          promiseGet.then(function (pl) {
            angular.forEach(pl.data.preguntas, function(value, key) {
              var q = {};
              q.id = value.id;
              q.question = value.pregunta;
              q.type = value.tipo;

              q.required = false;
              if(value.requerido == 'S'){
                q.required = true;
              }

              var l = [];
              angular.forEach(value.respuestas, function(val, k) {
                var a = {};
                a.id= val.id;
                a.answer = val.respuesta;
                l.push(a);
              });

              q.answers = l;
              questions.push(q);            

            });
          },
          function (errorPl) {
           $log.error('Error al cargar las preguntas', errorPl);
         });
          //console.log(questions);
          return questions;
        };

        $scope.saveQuestion = function(){
          var promiseGet = {} ; //The Method Call from service
          var qtn = createQuestion();

        	if($scope.questionSelected.ban == 'S'){  
	        	/*Save the question*/
            promiseGet = censoService.savePregunta(qtn);
            //console.log(promiseGet);
        	}else{
        		/* Update the question */
        		promiseGet = censoService.updatePregunta( qtn.id, qtn);

        	}

              if( ! isEmpty(promiseGet) ){

                  promiseGet.then(function (pl) {
                    //console.log($scope.sectionSelected);
                    $('#mP').closeModal();
                    Materialize.toast(pl.data.message ,3000,'rounded');
                    $scope.sectionSelected.questions = loadQuestion($scope.censusSelected.id, $scope.sectionSelected.idSection); 
                  },
                  function (errorPl) {
                   console.log('Error al guardar la pregunta', errorPl);
                 });
              }
        };

        $scope.deletePregunta = function(){
          //console.log(id);
           var promiseGet = censoService.deletePregunta($scope.questionSelected.id); //The Method Call from service
           promiseGet.then(function (pl) {
                Materialize.toast(pl.data.message ,3000,'rounded');
                $scope.sectionSelected.questions = loadQuestion($scope.censusSelected.id, $scope.sectionSelected.idSection); 
           },
              function (errorPl) {
               console.log('Error al borrar la Pregunta', errorPl);
           });
        };

        var createQuestion = function() {
        	var qtn = {};
          qtn.id = $scope.questionSelected.id;
        	qtn.pregunta = $scope.questionSelected.question;
        	qtn.tipo = $scope.typeSelected;
          qtn.seccion = $scope.sectionSelected.idSection ;

          qtn.requerido = 'N';          
          if($scope.questionSelected.required){
            qtn.requerido = 'S';
          }
        	qtn.respuestas = createListAnswers();       	
        	//console.log(qtn);
        	return qtn;
        };

        var createListAnswers = function(){
        	var list = [];
        	var obj = {};
        	if($scope.typeSelected != "T" ){
        		var array = $('#textarea1').val().split('\n');
	        	if(array.length >= 1){ 
		        	for (i = 0; i < array.length - 1; i++) {
		        		//obj = {};
		        		//obj.respuesta = array[i]; 
			        	list.push(array[i]); 
			        }
			    }
			    //console.log(list);
        	}        	
		      return list;
        };

        $scope.typeQuestion = function(type){
        	$scope.typeSelected = type;
        	if(type == "SN"){
        		$('#textarea1').val('Si' + "\n" + "No"+ "\n");
        		$('#NS').prop('checked', false);

        	}else{
        		if(type == "NS"){
        			$('#textarea1').val('Si' + "\n" + "No" + "\n" + "No sabe. No responde"+ "\n");
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
          $scope.questionSelected.ban = 'N';
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
            $scope.CE_SE.ban = 'C';
        	}else{
        		$scope.titleModalCE_SE = "Sección";
            $scope.CE_SE.ban = 'S';
        	}
        	$('#mC').openModal();
        };

        $scope.openDS = function(){
          if( !isEmpty($scope.censusSelected.sections) ){
            $('select').material_select();
            $('#mDS').openModal();
          }else{
            Materialize.toast('Seleccione un Censo' ,3000,'rounded');
          }          
          //console.log($scope.censusSelected );
        };

        $scope.openDp = function(qs){
          $scope.questionSelected = qs;
          $('#mDp').openModal();
        };

        $scope.openMConfig = function(){
          if( ! isEmpty($scope.censusSelected) ){
            checkedSwitch();
            $('#mConfig').openModal();
          }else{
            Materialize.toast("Seleccione un censo" ,3000,'rounded');
          }        	
        };

        function checkedSwitch(){
           if($scope.censusSelected.gps == 'S'){
            $('#gps').prop('checked', true)
           }else{
            $('#gps').prop('checked', false)
           }

           if($scope.censusSelected.foto == 'S'){
            $('#foto').prop('checked', true)
           }else{
            $('#foto').prop('checked', false)
           }

           if($scope.censusSelected.grabacion == 'S'){
            $('#grabacion').prop('checked', true)
           }else{
            $('#grabacion').prop('checked', false)
           }
        };

        $scope.setSwitch = function(id){
           var config = {};
           config.campo = id;
           config.value = "N";
           if($('#' + id).prop('checked')){
             config.value = "S";
           }

           var promiseGet = censoService.updateCensoConfig($scope.censusSelected.id, config); //The Method Call from service
           promiseGet.then(function (pl) {
                Materialize.toast(pl.data.message ,3000,'rounded');
                  myInterval = setInterval(function () {
                      $scope.censusSelected = {};
                      loadCensuses();
                  },1000);
           },
              function (errorPl) {
               console.log('Error al Actualizar la configulación', errorPl);
           });
        };
        // Load the first census
        //$scope.loadSections(0);

        function isEmpty(obj) {

            // null and undefined are "empty"
            if (obj == null) return true;

            // Assume if it has a length property with a non-zero value
            // that that property is correct.
            if (obj.length > 0)    return false;
            if (obj.length === 0)  return true;

            // Otherwise, does it have any properties of its own?
            // Note that this doesn't handle
            // toString and valueOf enumeration bugs in IE < 9
            for (var key in obj) {
                if (hasOwnProperty.call(obj, key)) return false;
            }

            return true;
        };

});