var http = require("http");
var url = require("url");
var Q = require("q");

var httpGet = function (opts) {
    var deferred = Q.defer();
    http.get(opts, deferred.resolve);
    return deferred.promise;
};

httpGet(url.parse("http://example.org/")).then(function (res) {
    return res.headers["location"].replace(/^http:/, "");
}).then(console.log);
