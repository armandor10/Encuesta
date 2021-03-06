app.service("agregarlibroService", function ($http) {

    this.add = function (libro) {
        var req = $http.post(uritimeit + '/Biblioteca', libro); 
        return req;
    };

    this.update = function (libro) {
        var req = $http.put(uritimeit + '/Biblioteca/' + libro.id, libro); 
        return req;
    };

    this.getAll = function() {
        var req = $http.get(uritimeit + '/Biblioteca'); 
        return req;
    };

    this.delete = function(id) {
        var req = $http.delete(uritimeit + '/Biblioteca/'+ id);
        return req;
    };

    this.addTema = function (tema) {
        var req = $http.post(uritimeit + '/Biblioteca/Temas', tema); 
        return req;
    };

    this.updateTema = function (tema) {
        var req = $http.put(uritimeit + '/Biblioteca/Temas/' + tema.id, tema); 
        return req;
    };

    this.getLibroTemas = function() {
        var req = $http.get(uritimeit + '/Biblioteca/Temas'); 
        return req;
    };

    this.getTemasLibro = function() {
        var req = $http.get(uritimeit + '/Biblioteca/TemasLibro'); 
        return req;
    };

    this.deleteTema = function(id) {
        var req = $http.delete(uritimeit + '/Biblioteca/Temas/'+ id);
        return req;
    };

    this.getCategorias = function() {
        var req = $http.get( uritimeit + '/Biblioteca/Categoria' ); 
        return req;
    };

    this.getTemasxCategoria = function(id) {
        var req = $http.get( uritimeit + '/Biblioteca/Categoria/' + id ); 
        return req;
    };

    this.getTemasxCategoria2 = function(obj) {
        var req = $http.post( uritimeit + '/Biblioteca/bCategoria', obj ); 
        return req;
    };

    this.addCategoria = function(categoria) {
        var req = $http.post(uritimeit + '/Biblioteca/Categoria', categoria); 
        return req;
    };

    this.deleteCategoria= function(id) {
        var req = $http.delete(uritimeit + '/Biblioteca/Categoria/'+ id);
        return req;
    };

});