var Q = require("q");

var deferred = Q.defer();
deferred.promise.then(function (obj) {
    console.log(obj);
});
deferred.resolve("Hello World");
