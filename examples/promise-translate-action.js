var Q = require("q");

var action = function (arg1, arg2, callback) {
    callback(arg1 + arg2);
};

var promiseAction = function (arg1, arg2) {
    var deferred = Q.defer();
    action(arg1, arg2, deferred.resolve);
    return deferred.promise;
};

var arg1 = 10;
var arg2 = 20;
var doSomething = console.log;

promiseAction(arg1, arg2).then(function (result) {
    doSomething(result);
});
