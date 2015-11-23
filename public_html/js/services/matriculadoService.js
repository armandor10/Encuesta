app.service("matriculadoService", function ($http) {  
  
    
    this.getAll = function () {
        var req = $http.get(uri+'/api/matriculado/getAll');
        return req;
    };

    this.getAll2 = function () {
        var req = $http.get(uri+'/api/matriculado/getAll2');
        return req;
    };

    this.postMatriculado = function (matriculado) {
        console.log(matriculado)
        var req = $http.post(uri+'/api/matriculado/post', matriculado); 
        return req;
        
    };
        
    
});