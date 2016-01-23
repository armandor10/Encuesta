app.service("matriculadoService", function ($http) {  
  
    
    this.getAll = function () {
        var req = $http.get(uri+'/api/matriculado/getAll');
        return req;
    };

    this.getAll2 = function () {
        var req = $http.get(uri+'/Matriculado');
        return req;
    };

    this.postMatriculado = function (matriculado) {
        //console.log(matriculado)
        var req = $http.post(uri + '/Matriculado/save', matriculado); 
        return req;
    };

    this.postMatriculados = function (matriculados) {
        //console.log(matriculado)
        var req = $http.post(uri + '/Matriculado/upMatriculados', matriculados); 
        return req;
    };

    this.upload = function (matriculados) {
        //console.log(matriculado)
        var req = $http.post(uri + '/Matriculado/upload', matriculados); 
        return req;
    };

    this.put = function (id, matriculado) {       
        var req = $http.put(uri + '/Matriculado/' + id, matriculado);
        return req;        
    };
      
    this.getAllActividad = function(){
        var req = $http.get(uri+'/Actividad');
        return req;
    };  
    
});