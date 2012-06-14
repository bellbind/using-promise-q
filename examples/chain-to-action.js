var http = require("http");
var url = require("url");
var Q = require("q");

var httpGet = function (opts) {
    var deferred = Q.defer();
    http.get(opts, deferred.resolve);
    return deferred.promise;
};

var loadBody = function (res) {
    var deferred = Q.defer();
    var body = "";
    res.on("data", function (chunk) {
        body += chunk;
    });
    res.on("end", function () {
        deferred.resolve(body);
    });
    return deferred.promise;
};


httpGet(url.parse("http://example.org")).then(function (res) {
    return httpGet(url.parse(res.headers["location"]));
}).then(function (res) {
    loadBody(res).then(function (body) {
        console.log(body);
    });
});
