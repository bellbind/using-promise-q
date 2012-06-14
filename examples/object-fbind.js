var Q = require("q");

Q.resolve(Math.atan2).fbind(1.0)(1.0).then(console.log);
(function (promise) {
    var args = Array.prototype.slice.call(arguments, 1);
    return function () {
        var all = args.concat(Array.prototype.slice.call(arguments));
        return promise.then(function (obj) {
            return obj.apply(undefined, all);
        });
    };
})(Q.resolve(Math.atan2), 1.0)(1.0).then(console.log);
