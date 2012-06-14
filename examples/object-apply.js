var Q = require("q");

Q.resolve(Math.sqrt).apply(null, [5]).then(console.log);
Q.resolve(Math.sqrt).then(function (obj) {
    return obj.apply(null, [5]);
}).then(console.log);
