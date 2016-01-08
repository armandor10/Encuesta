app.service("auxVentanillaService", function ($http) {

    this.getAll = function () {
        var req = $http.get(uritimeit + '/Empleado/AuxVentanilla'); 
        return req;
    };

    this.getRangoStiker = function (detailsStikers) {
        var req = $http.post(uritimeit + '/Empleado/AuxVentanilla/getRangoStiker', detailsStikers); 
        return req;
    };

    this.saveRango = function (rango) {
        var req = $http.post(uritimeit + '/Empleado/AuxVentanilla/saveRango', rango); 
        return req;
    };

    this.getRegistroAsignacion = function (noDocumento) {
        var req = $http.post(uritimeit + '/Empleado/AuxVentanilla/getRegistroAsignacion', noDocumento); 
        return req;
    };

});