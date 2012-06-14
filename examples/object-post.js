var Q = require("q");

Q.resolve("Hello").post("substring", [2, 4]).then(console.log);
Q.resolve("Hello").then(function (obj) {
    return obj.substring.apply(obj, [2, 4]);
}).then(console.log);
