var Q = require("q");

var deferred = Q.defer();
deferred.promise.then(function (result) {
    var value1 = result[0];
    var value2 = result[1];
    return value1 + value2;
}).then(console.log);
deferred.resolve([10, 30]);


var deferred = Q.defer();
deferred.promise.spread(function (value1, value2) {
    return value1 + value2;
}).then(console.log);
deferred.resolve([10, 30]);
