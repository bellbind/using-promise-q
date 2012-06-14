var Q = require("q");

var deferred = Q.defer();
deferred.promise.then(function (obj) {
    throw new Error("thrown error");
}, console.log);
deferred.resolve({});
