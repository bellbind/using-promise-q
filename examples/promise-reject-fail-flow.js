var Q = require("q");

var deferred = Q.defer();
deferred.promise.fail(console.log);
deferred.reject(new Error("failure"));
