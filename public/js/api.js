
var api = {
    _q: function(url, method, data, callback) 
    {
        callback = callback || function(){};
        var xhr = new XMLHttpRequest();

        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && [200,201].indexOf(this.status) != -1) {
                if (this.responseText) {

                    // // Get the raw header string
                    var headers = xhr.getAllResponseHeaders();

                    // Convert the header string into an array
                    // of individual headers
                    var arr = headers.trim().split(/[\r\n]+/);

                    // Create a map of header names to values
                    var headerMap = {};
                    arr.forEach(function (line) {
                        var parts = line.split(': ');
                        var header = parts.shift();
                        var value = parts.join(': ');
                        headerMap[header] = value;
                    });

                    // returns result
                    callback(JSON.parse(this.responseText), headerMap);
                }
            }
        };

        xhr.open(method, url, true);
        xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
        xhr.withCredentials = true;
        xhr.send(data||'');
    },
    get: function(url, cb) {
        return this._q(url, 'GET', [], cb);
    },
    post: function(url, data, cb) {
        return this._q(url, 'POST', data, cb);
    },
    put: function(url, data, cb) {
        return this._q(url, 'PUT', data, cb);
    },
    delete: function(url, cb) {
        return this._q(url, 'DELETE', null, cb);
    },
}