var Q = require("q");

Q.resolve(Math.sqrt).fcall(5).then(console.log);
Q.resolve(Math.sqrt).then(function (obj) {
    return obj.call(undefined, 5);
}).then(console.log);
