var Q = require("q");

Q.resolve(Math.sqrt).fapply([5]).then(console.log);
Q.resolve(Math.sqrt).then(function (obj) {
    return obj.apply(undefined, [5]);
}).then(console.log);
