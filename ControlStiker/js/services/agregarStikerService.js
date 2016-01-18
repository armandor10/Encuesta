app.service("agregarStikerService", function ($http) {

    this.add = function (registro) {
        var req = $http.post(uritimeit + '/regAsignacion', registro); 
        return req;
    };

});