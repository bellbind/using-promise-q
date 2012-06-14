var Q = require("q");

Q.resolve([1,2,3]).get("length").then(console.log);
Q.resolve([1,2,3]).then(function (obj) {
    return obj["length"];
}).then(console.log);
