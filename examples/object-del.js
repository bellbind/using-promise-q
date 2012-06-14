var Q = require("q");

Q.resolve({foo: "foo"}).del("foo").then(console.log);
Q.resolve({foo: "foo"}).then(function (obj) {
    return delete obj["foo"];
}).then(console.log);
