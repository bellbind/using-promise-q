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


var redirectGet = function (uri) {
    return httpGet(url.parse(uri)).then(function (res) {
       if (res.statusCode.toString()[0] === "3") {
           return redirectGet(res.headers["location"]);
       } else {
           return res;
       }
    });
};
var getBody = function (uri) {
    return redirectGet(uri).then(loadBody);
};

getBody("http://example.org").then(console.log);
