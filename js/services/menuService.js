app.service("menuService", function ($http) {  
  
    
    this.getAll = function () {
        var req = $http.get(uri+'/api/menu/getAll');
        return req;
    };
        
    
});