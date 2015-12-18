app.service("censadorService", function ($http) {

	this.getAll = function () {
        var req = $http.get(uri+'/Censador');
        return req;
    };

    this.save = function (censador) {
        var req = $http.post(uri +'/Censador', censador); 
        return req;
    };

    this.update = function(id, censador) {
        var req = $http.put(uri+'/Censador/'+ id, censador);
        return req;
    };

    this.updateClave = function(id, censador) {
        var req = $http.put(uri+'/Censador/CambiarClave/'+ id, censador);
        return req;
    };

    this.updateEstado = function(id, censador) {
        var req = $http.put(uri+'/Censador/CambiarEstado/'+ id, censador);
        return req;
    };

    this.delete = function(id) {
        var req = $http.delete(uri+'/Censador/'+ id);
        return req;
    };

});