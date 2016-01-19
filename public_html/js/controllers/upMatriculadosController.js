app.controller("upMatriculadosController", function($scope, matriculadoService) {

          var started, finished,countLines;
          var matriculas = [];

          function InitDemo(title) {
              $('#meta').html('');
              $('#output').html('');        
              
              if ( $('#file-select')[0].files.length == 0 || $('#file-select')[0].files[0] == null) {
                  $('#meta').html('Please, choose file!');
                  return null;
              }
              
              var file = $('#file-select')[0].files[0];
              
              $('#meta').append(title + '<br>');
              $('#meta').append($('#file-select')[0].files[0].name + ' ' + ( Math.round((file.size / 1024 / 1024)*100)/100 ) + ' MB<br>');
              
              started = new Date();
              finished = null;
              
              return file;
          }

          function DemoFinished(metaInfo, results) {
              //console.log(metaInfo);    
              $('#meta').append('Time spent: ' + (finished - started) + 'ms.' + (metaInfo ? '<br>' + metaInfo : ''));
              $('#output').html(results ? results : 'NO RESULTS');
          }

          function Read() {
              var file = InitDemo('Read all lines');
              if (!file) return;
              
              var navigator = new FileNavigator(file);
              var header;
              
              var indexToStartWith = 0;
              
              countLines = 0;
              var j = 0;
              
              navigator.readSomeLines(indexToStartWith, function linesReadHandler(err, index, lines, eof, progress) {
                  if (err) { 
                      finished = new Date();
                      DemoFinished('Error: ' + err);
                      return;
                  }
                  
                  countLines += lines.length;
                  
                  if (eof)  {
                      finished = new Date();
                      DemoFinished('Total ' + countLines + ' lines readed');
                      return;
                  }

                  for (var i = 0; i < lines.length; i++) {
                      var lineIndex = index + i;
                      var line = lines[i];
                      // Do something with line
                      if(i == 0){
                        //header = line.split(";");
                        //console.log(i +" " + JSON.stringify(header));

                      }else{
                        //console.log(i);
                      }

                  }
                  
                  
                  navigator.readSomeLines(index + lines.length, linesReadHandler);
              });
          }
          $('#read').click(Read);

          var nextIndex = 0;

          function FindNext() {    
              var pattern = $('#find-first-pattern').val();
              
              var file = InitDemo('Find of "' + pattern + '" pattern starting from ' + nextIndex);
              if (!file) return;

              var navigator = new FileNavigator(file);
              
              navigator.find(new RegExp(pattern), nextIndex, function (err, index, match) {
                  finished = new Date();
                  nextIndex = index + 1; // search next after this one
                  
                  if (err) { 
                      DemoFinished('Error: ' + err);
                      return;
                  }
                  if (!match) {            
                      DemoFinished('No matching lines found');
                      return;
                  }
                  
                  var token = match.line.substr(match.offset, match.length);
                  
                  DemoFinished('Found matching token on ' + index + ' line', index + ': ' + match.line.replace(token, '<mark>' + token + '</mark>'));
                    console.log(match.line);
              });
          }
          $('#search-beginning').click(function() {
              nextIndex = 0;
              FindNext();
          });
          $('#search-next').click(function() {
              FindNext();
          });

          function FindAll() {        
              var pattern = $('#find-all-pattern').val();
              
              var file = InitDemo('Find all lines matching "' + pattern + '" pattern');
              if (!file) return;
              
              var navigator = new FileNavigator(file);
              
              var indexToStartWith = 0;
              var limitOfMatches = 200;
              
              navigator.findAll(new RegExp(pattern), indexToStartWith, countLines, function (err, index, limitHit, results) {
                  finished = new Date();
                  
                  if (err) { 
                      DemoFinished('Error: ' + err);
                      return;
                  }        
                  if (results.length == 0) {            
                      DemoFinished('No matching lines found');
                      return;
                  }    

                  var resultsAsLine = '';
                  var ban = true;
                  var k = 0;
                  for (var i = 0; i < results.length; i++) {
                      var token = results[i].line.substr(results[i].offset, results[i].length);
                      resultsAsLine += results[i].index + ': ' + results[i].line.replace(token, '<mark>' + token + '</mark>') + '<br>';

                      if(i == 0){
                        header = results[i].line.split(";");
                        //console.log(i +" " + JSON.stringify(header));

                      }else{
                          var line = results[i].line.split(";");
                          var matricula = {};
                          for (var j = 0; j < header.length; j++) {                            
                            matricula[header[j]] = line[j];
                          }

                          if(matricula["OJ2"] == "ESTABLECIMIENTO"){
                            matriculas.push(matricula);
                            if( k == 1000 ){
                              doSomething(saveMatriculado);
                              matriculas = [];
                              k = 0;
                            }else {
                              k++;
                            }
                          }

                          if( results.length - 1 == i && ! isEmpty(matriculas) ){
                            doSomething(saveMatriculado);
                          } 

                      }
                  }

                  /* Guardo los establecimientos */
                  //saveEstablecimientos();
                  //console.log(matriculas);
                  //saveMatriculado(matriculas);
                  //doSomething(saveMatriculado);

                  DemoFinished('Found ' + results.length + ' lines, matching pattern.' + (limitHit ? ' Limit of ' + limitOfMatches + ' is hit, so there can be more lines.' : ''), resultsAsLine);
              });
          }
          $('#searchAll').click(FindAll);

          function saveEstablecimientos(){
                $.ajax({
                    type: "POST",
                    url: "../public/Matriculado/upMatriculados",
                    data: JSON.stringify(matriculas),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    async: false,
                    success: function (result) {
                        alert("aqui");                        
                        alert(JSON.stringify(result.d));
                    },
                    error: function (jqXHR, status, error) {
                        alert(error + "-" + jqXHR.responseText);
                    }
                  });
          };

          var saveMatriculado = function(mats){
          	      var promiseGet = matriculadoService.postMatriculados(mats);
                  promiseGet.then(function (pl) {
                    Materialize.toast(pl.data.message ,3000,'rounded');
                  },
                  function (errorPl) {
                   //console.log('Error al guardar las matriculas', errorPl);
                   if(navigator.onLine){
                    saveMatriculado(mats);
                   }                   
                 });

          };

		function doSomething(callback) {
		    // ...

		    // Call the callback
		    callback(matriculas);
		}

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