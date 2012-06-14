var http = require("http");
var url = require("url");
var Q = require("q");

var httpGet = function (opts) {
    var deferred = Q.defer();
    http.get(opts, deferred.resolve);
    return deferred.promise;
};

httpGet(url.parse("http://example.org/"))
    .get("headers").get("location")
    .post("replace", [/^http:/, ""])
    .then(console.log);

