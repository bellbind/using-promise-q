var Q = require("q");

var deferred = Q.defer();
deferred.promise.then(null, console.log);
deferred.reject(new Error("failure"));
