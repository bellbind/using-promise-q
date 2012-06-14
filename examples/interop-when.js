var Q = require("q");
var when = require("when"); // npm install when

var otherDeferred = when.defer();
var otherPromise = otherDeferred.promise;
Q.when(otherPromise).then(console.log);
otherDeferred.resolver.resolve("OK from other");
