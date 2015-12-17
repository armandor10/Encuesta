app.service("censoService", function ($http) {

	this.getAll = function () {
        var req = $http.get(uri+'/Censo');
        return req;
    };

    this.save = function (censo) {
        var req = $http.post(uri +'/Censo', censo); 
        return req;
    };

    this.saveSection = function (seccion) {
        var req = $http.post(uri +'/Seccion', seccion); 
        return req;
    };

    this.savePregunta = function (pregunta) {
        var req = $http.post(uri +'/Pregunta', pregunta); 
        return req;
    };

    this.update = function(id, censo) {
        var req = $http.put(uri+'/Censo/'+ id, censo);
        return req;
    };

    this.updatePregunta = function(id, pregunta) {
        var req = $http.put(uri+'/Pregunta/'+ id, pregunta);
        return req;
    };

    this.updateCensoConfig = function(id, config) {
        var req = $http.put(uri+'/Censo/Config/'+ id, config);
        return req;
    };

    this.delete = function(id) {
        var req = $http.delete(uri+'/Censo/'+ id);
        return req;
    };

    this.deleteSection = function(id) {
        var req = $http.delete(uri+'/Seccion/'+ id);
        return req;
    };

    this.deletePregunta = function(id) {
        var req = $http.delete(uri+'/Pregunta/'+ id);
        return req;
    };

    this.getSeccion = function(id) {
        var req = $http.get(uri+'/Censo/'+ id);
        return req;
    };

   this.getQuestions = function(idCenso, idSection) {
        var req = $http.get(uri+'/Censo/'+ idCenso + '/'+ idSection);
        return req;
    };

});