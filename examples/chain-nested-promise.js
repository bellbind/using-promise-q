var http = require("http");
var url = require("url");
var Q = require("q");

var httpGet = function (opts) {
    var deferred = Q.defer();
    http.get(opts, deferred.resolve);
    return deferred.promise;
};


httpGet(url.parse("http://example.org")).then(function (res) {
    httpGet(url.parse(res.headers["location"])).then(function (res) {
        var body = "";
        res.on("data", function (chunk) {
            body += chunk;
        });
        res.on("end", function () {
            console.log(body);
        });
    });
});
