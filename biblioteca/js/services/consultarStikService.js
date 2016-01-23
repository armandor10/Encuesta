app.service("consultarStikService", function ($http) {

    this.getLikeMatricula = function (reg) {
        var req = $http.post(uritimeit + '/regAsignacion/getLikeMatricula', reg); 
        return req;
    };

    this.getLikeStiker = function (reg) {
        var req = $http.post(uritimeit + '/regAsignacion/getLikeStiker', reg); 
        return req;
    };

});