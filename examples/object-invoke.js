var Q = require("q");

Q.resolve("Hello").invoke("substring", 2, 4).then(console.log);
Q.resolve("Hello").then(function (obj) {
    return obj.substring.call(obj, 2, 4);
}).then(console.log);
