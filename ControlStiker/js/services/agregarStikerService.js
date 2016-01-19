app.service("agregarStikerService", function ($http) {

    this.add = function (registro) {
        var req = $http.post(uritimeit + '/regAsignacion', registro); 
        return req;
    };

    this.getMatriculado = function(noMatricula){
        var req = $http.post(uritimeit + '/Matriculado/getMatriculado', noMatricula); 
        return req;
    };

});