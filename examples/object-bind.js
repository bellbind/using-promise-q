var Q = require("q");

Q.resolve(Math.atan2).bind(null, 1.0)(1.0).then(console.log);
(function (promise, thisp) {
    var args = Array.prototype.slice.call(arguments, 2);
    return function () {
        var all = args.concat(Array.prototype.slice.call(arguments));
        return promise.then(function (obj) {
            return obj.apply(thisp, all);
        });
    };
})(Q.resolve(Math.atan2), null, 1.0)(1.0).then(console.log);
