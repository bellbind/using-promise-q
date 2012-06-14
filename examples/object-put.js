var Q = require("q");

Q.resolve([1,2,3]).put(3, 0).then(console.log);
Q.resolve([1,2,3]).then(function (obj) {
    return obj[3] = 0;
}).then(console.log);
