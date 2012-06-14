var Q = require("q");

var action = function (arg1, arg2, callback) {
    if (typeof arg1 !== "number" || typeof arg2 !== "number") {
        throw Error("arg1 and arg2 should be number");
    }
    callback(arg1 + arg2);
};

var promiseAction = function (arg1, arg2) {
    var deferred = Q.defer();
    try {
        action(arg1, arg2, deferred.resolve);
    } catch (error) {deferred.reject(error);}
    return deferred.promise;
};

var arg1 = 10;
var arg2 = "20";
var doSomething = console.log;
var doErrorHandle = console.log;

promiseAction(arg1, arg2).then(function (result) {
    doSomething(result);
}, function (error) {
    doErrorHandle(error);
});
