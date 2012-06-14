var Q = require("q");

Q.resolve([1,2,3]).keys().then(console.log);
Q.resolve([1,2,3]).then(function (obj) {
    return Object.keys(obj);
}).then(console.log);
