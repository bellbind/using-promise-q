var Q = require("q");

Q.resolve(Math.sqrt).call(null, 5).then(console.log);
Q.resolve(Math.sqrt).then(function (obj) {
    return obj.call(null, 5);
}).then(console.log);
