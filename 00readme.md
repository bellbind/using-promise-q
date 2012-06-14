# Using promises with "Q"

JavaScript platform heavily uses asyncronous actions that requires
continuation callbacks. 
Codes using them easily become complex for nested callbacks.

One of profit of using promises is 
changing the callback nesting style to more clean.

The promises may be integrated to 
[ES6 (harmony)](http://wiki.ecmascript.org/doku.php?id=strawman:concurrency).
[Q](https://github.com/kriskowal/q) is an implementation of the promises.

## What is "Q"

[Q](https://github.com/kriskowal/q) is a module for 
[promises](http://en.wikipedia.org/wiki/Futures_and_promises) in JavaScript.

In node.js or JS on HTML, using asynchronous actions is usually 
coded as the function callback style. e.g.:

```javascript
// using-callback.js
http.get(url.parse("http://example.org/"), function (res) {
   console.log(res.statusCode);  // maybe 302
});
```

If you want to chain contimuous asynchronous actions,
following callbacks are *nested* in the callback of the former action;
e.g.:

```javascript
// using-nested-callback.js
http.get(url.parse("http://example.org/"), function (res) {
    console.log(res.statusCode);  // maybe 302
    http.get(url.parse(res.headers["location"]), function (res) {
        console.log(res.statusCode);  // maybe 200
    });
});
```

Using promises with ``Q`` *transform*s 
the nested style to *flatten manner*, as:

```javascript
// using-promise.js
httpGet(url.parse("http://example.org/")).then(function (res) {
    console.log(res.statusCode);  // maybe 302
    return httpGet(url.parse(res.headers["location"]));
}).then(function (res) {
    console.log(res.statusCode);  // maybe 200
});
```

From the flatten style, promises introduce many ways of clearer coding 
to JavaScript programmings.

At last, the promised action ``httpGet`` can be just defined as:

```javascript
// using-promise.js
var httpGet = function (opts) {
     var deferred = Q.defer();
     http.get(opts, deferred.resolve);
     return deferred.promise;
};
```

Making promise actions is also *transforming* from callback style actions.

## Setup Q module

If you use in node.js, simply install with npm:

```bash
npm install q
```

then using in js file as an usual module:
```javascript
var Q = require("q");
...
```

If you use in browsers, loading ``q.min.js`` in former of your JavaScript code:

```html
<!-- using-q.html -->
<script src="q.min.js"></script>
<script>
var loadText = function (url) {
    var deferred = Q.defer();
    var req = new XMLHttpRequest();
    req.onreadystatechange = function () {
        if (req.readyState !== 4) return;
        if (/^[^2]\d\d$/.exec(req.status)) return deferred.reject(req.status);
        deferred.resolve(req.responseText);
    };
    req.open("GET", url, true);
    req.send();
    return deferred.promise;
};
</script>
```

``q.min.js`` is in 
[the source repository of q](https://github.com/kriskowal/q).


## Making promise based action

At first using ``Q``, you make actions return "promise".
For example, make node.js action ``http.get`` as  promised action:

```javascript
// using-promise.js
var httpGet = function (opts) {
     var deferred = Q.defer();
     http.get(opts, deferred.resolve);
     return deferred.promise;
};
```

then you can use as:

```javascript
httpGet(...).then(function (res) {...});
```

It is important that functions returns promise.

The first ``Q.defer()`` returns set of an empty promise and operations for it.
``deferred.promise`` is the empty promise and ``deferred.resolve(value)``
makes the promise resolved as the ``value``.

The simplest example of them is:

```javascript
// promise-resolve-then-flow.js
var deferred = Q.defer();
deferred.promise.then(function (obj) {
    console.log(obj);
});
deferred.resolve("Hello World");
```

It prints ``"Hello World"`` to the console.

In generally, you can transform usual callback actions:

```javascript
// promise-translate-action.js
action(arg1, arg2, function (result) {
    doSomething(result);
});
```

to promise actions:

```javascript
// promise-translate-action.js
var promiseAction = function (arg1, arg2) {
    var deferred = Q.defer();
    action(arg1, arg2, deferred.resolve);
    return deferred.promise;
}

promiseAction(arg1, arg2).then(function (result) {
    doSomething(result);
});
```

## Action chain

Using continuous actions is call next action in the former callback. e.g.:

```javascript
// chain-nested-callback.js
http.get(url.parse("http://example.org"), function (res) {
    http.get(url.parse(res.headers["location"]), function (res) {
        var body = "";
        res.on("data", function (chunk) {
            body += chunk;
        });
        res.on("end", function () {
            console.log(body);
        });
    });
});
```

You can simply transform it to promise actions and ``then`` callback style:

```javascript
// chain-nested-promise.js
httpGet(url.parse("http://example.org")).then(function (res) {
    httpGet(url.parse(res.headers["location"])).then(function (res) {
        var body = "";
        res.on("data", function (chunk) {
            body += chunk;
        });
        res.on("end", function () {
            console.log(body);
        });
    });
});
```

If you can "return" any value in ``then`` callback, you can catch the value to
a next``then`` callback:

```javascript
// chain-by-value.js
httpGet(url.parse("http://example.org")).then(function (res) {
    return res.headers["location"];
}).then(function (location) {
    httpGet(url.parse(location)).then(function (res) {
        var body = "";
        res.on("data", function (chunk) {
            body += chunk;
        });
        res.on("end", function () {
            console.log(body);
        });
    });
});
```

If you return a "promise" in ``then`` callback, 
you can catch a resolved value of the promise to the next ``then`` callback:

```javascript
// chain-by-promise.js
httpGet(url.parse("http://example.org")).then(function (res) {
    return httpGet(url.parse(res.headers["location"]));
}).then(function (res) {
    var body = "";
    res.on("data", function (chunk) {
        body += chunk;
    });
    res.on("end", function () {
        console.log(body);
    });
});
```

You can transforn the ``body`` loading action to promise action as:

```javascript
// chain-to-action.js
var loadBody = function (res) {
    var deferred = Q.defer();
    var body = "";
    res.on("data", function (chunk) {
        body += chunk;
    });
    res.on("end", function () {
        deferred.resolve(body);
    });
    return deferred.promise;
};
```

Apply it:

```javascript
// chain-to-action.js
httpGet(url.parse("http://example.org")).then(function (res) {
    return httpGet(url.parse(res.headers["location"]));
}).then(function (res) {
    loadBody(res).then(function (body) {
        console.log(body);
    });
});
```

It can also go outside of ``then`` callback as:

```javascript
// chain-to-action-flatten.js
httpGet(url.parse("http://example.org")).then(function (res) {
    return httpGet(url.parse(res.headers["location"]));
}).then(function (res) {
    return loadBody(res);
}).then(function (body) {
    console.log(body);
});
```

Make it more simple as:

```javascript
// chain-to-action-simplify.js
httpGet(url.parse("http://example.org")).then(function (res) {
    return httpGet(url.parse(res.headers["location"]));
}).then(loadBody).then(console.log);
```

### Condition branch in promise action

You can use ``if`` branch in promise as:

```javascript
// chain-branch.js
var getBody = function (uri) {
    return httpGet(url.parse(uri)).then(function (res) {
       if (res.statusCode.toString()[0] === "3") {
           return httpGet(url.parse(res.headers["location"]));
       } else {
           return res;
       }
    }).then(loadBody);
};

getBody("http://example.org").then(console.log);
```

The first returns promise of ``res``(http.ClientResponse) 
that returns ``res``.
The second returns just ``res``.
every ``return`` of branch should finnaly resolve same type object.

Branch in promise action is with this manner.

### Loop in promise action

You can use loop in promise with recursive call:

```javascript
// chain-loop.js
var redirectGet = function (uri) {
    return httpGet(url.parse(uri)).then(function (res) {
       if (res.statusCode.toString()[0] === "3") {
           return redirectGet(res.headers["location"]);
       } else {
           return res;
       }
    });
};
var getBody = function (uri) {
    return redirectGet(uri).then(loadBody);
};

getBody("http://example.org").then(console.log);
```

## Uniform error handling

Q includes standard error handling ways.

The ``then`` method accept two callback args;
the first callback catches successful result,
and the second catches error as failure.

```javascript
// promise-failure-action.js
promisedAction(arg1, arg2).then(function (value) {
    doSomething(value);
}, function (error) {
    doErrorHandle(error);
});
```

``Q.defer()`` set has ``reject(error)`` function for passing error handler.
A simple example is:

```javascript
// promise-reject-then-flow.js
var deferred = Q.defer();
deferred.promise.then(null, console.log);
deferred.reject(new Error("failure"));
```

It prints ``[Error: failure]``.

If you can pass only error handing callback, use 'fail(handler)':

```javascript
// promise-reject-fail-flow.js
var deferred = Q.defer();
deferred.promise.fail(console.log);
deferred.reject(new Error("failure"));
```

The real example ``httpGet`` with error handling becomes as:

```javascript
// using-promise-with-error.js
var httpGet = function (opts) {
     var deferred = Q.defer();
     try {
         http.get(opts, deferred.resolve).on("error", deferred.reject);
     } catch (error) {deferred.reject(error);}
     return deferred.promise;
};
```

## Promise chain with error handling

In a promise chain, when error occured in middle promise action,
following actions not executed,
the error is passed through to the latter promises that has an error handler.
If all latter promises have not error handler, error is ignored.


For example:

```javascript
// chain-with-error.js
httpGet(url.parse("http://example.biz")).then(function (res) {
    return httpGet(url.parse(res.headers["location"]));
}).then(loadBody).then(console.log).fail(function (error) {
    console.log("error occured: " + error);
});
```

The last error handler catches an error occured at any point in 
``httpGet``, ``loadBody``, or ``console.log`` of ``then``.

### Error thrown from callback

An error thrown in the ``then`` callback also becomes failure flow. e.g.: 

```javascript
// promise-throw-fail-flow.js
var deferred = Q.defer();
deferred.promise.then(function (obj) {
    throw new Error("thrown error");
}).fail(console.log);
deferred.resolve({});
```

It prints ``[Error: thrown error]``.

Notice that a thrown error can be catched in the "following" promise.

So, the code:

```javascript
// promise-throw-uncaught-flow.js
var deferred = Q.defer();
deferred.promise.then(function (obj) {
    throw new Error("thrown error");
}, console.log);
deferred.resolve({});
```

It prints nothing.

### Retrieve flow from errors

The error flow is also a part of promise.
Retrieving from error is just return a value in error callback. as:

```javascript
// chain-with-error-recover.js
httpGet(url.parse("http://example.biz")).then(function (res) {
    return httpGet(url.parse(res.headers["location"]));
}).then(loadBody).fail(function (error) {
    return "Not Found";
}).then(console.log);
```

If error occured in ``httpGet`` or ``loadBody``,
it prints "Not Found" as successful flow.

## A promise of multiple values and ``spread``

``then`` callback always accepts just one argument.
So you want to pass multiple values as a array form like ''[value1, value2]``.
In callback, extract with array access like: ``var value1 = result[0];``.

If you want to use multiple arguments directly, 
you can use ``spread`` instead of ``then``:

'''javascript
// promise-multiple-resolve-spread-flow.js
var deferred = O.defer();
deferred.promise.spread(function (value1, value2) {
    return value1 + value2;
}).then(console.log);
deferred.resolve([10, 30]);
'''

## A promise of immidiate values

### Resolved promise

Not only async action, usual value transform as a promise.
``Q.resolve`` transforms value to promise:

```javascript
// promise-resolve.js
Q.resolve("Hello").then(console.log);
```

Not only a returned value of ``then`` callback,
other types of value is handled with same manner of promises.

### ``when``

`Q.when(value, success, failure)` is same as
``Q.resolve(value).then(success, failure)``
(but ``then`` is implemented with ``when`` in really)

```javascript
// promise-when.js
Q.when("Hello", console.log);
```

### Rejected promise

``Q.reject(obj)`` is "rejected" promise.
it spawn only error handler. e.g.:

```javascript
// promise-reject.js
Q.reject("abc").then(function (value) {
    console.log("OK");
}, function (error) {
    console.log("FAIL");
});
```
It just prints ``"FAIL"``.

If you return rejected promises in ``then`` callback,
It spawn error handler. e.g.:

```javascript
// promise-return-reject-flow.js
Q.resolve("abc").then(function (value) {
    return Q.reject("FAIL");
}).then(null, function (error) {
    console.log(error);
});
```

It also prints ``"FAIL"``.

Returning a reject promise is same effect of ``throw error`` on flows.

## Object handling promises

The ``then`` callback can use the result anyway.
Each handling is decomposed primitives of
property accesses or function calls.

For example:

```javascript
// object-unsued.js
httpGet(url.parse("http://example.org")).then(function (res) {
    return res.headers["location"].resplace(/^http:/, "");
}).then(console.log);
```

It can decompose continuous actions of each primitive access as:

```javascript
// object-decomposed.js
httpGet(url.parse("http://example.org")).then(function (res) {
    return res.headers;
}).then(function (handlers) {
    return handlers["location"];
}).then(function (location) {
    return location.replace(/^http:/, "");
}).then(console.log);
```

Promises of ``Q`` have support methods of primitive access
as a promise.

By them, the decomposed actions also translate to:

```javascript
// object.primitive.js
httpGet(url.parse("http://example.org"))
    .get("handlers").get("location").post("replace", [/^http:/, ""])
    .then(console.log);
```

### Promise methods of object handling promises

``promise.get(name)``:
```javascript
promise.then(function (value) {
    return value[name];
})
```

``promise.put(name, value)``:
```javascript
promise.then(function (value) {
    return value[name] = value;
})
```

``promise.del(name)``:
```javascript
promise.then(function (value) {
    return delete value[name];
})
```

``promise.post(name, arglist)``
```javascript
promise.then(function (value) {
    return value[name].apply(value, arglist);
})
```

``promise.innvoke(name, arg1, arg2,...)``:
```javascript
promise.then(function (value) {
    return value[name].call(value, arg1, arg2, ...);
})
```

``promise.fapply(arglist)``:
```javascript
promise.then(function (value) {
    return value.apply(undefined, arglist);
})
```

``promise.fcall(arg1, arg2, ...)``:
```javascript
promise.then(function (value) {
    return value.call(undefined, arg1, arg2, ...);
})
```

``promise.fbind(arg1, arg2, ...)``:
```javascript
(function (promise) {
    var args = Array.prototype.slice.call(arguments, 1);
    return function () {
        var all = args.concat(Array.prototype.slice.call(arguments));
        return promise.then(function (value) {
            return value.apply(undefined, all);
        });
    };
})
```

(note: result of fbind is a function, not a promise)

``promise.apply(thisp, arglist)``:
```javascript
promise.then(function (value) {
    return value.apply(thisp, arglist);
})
```

``promise.call(thisp, arg1, arg2, ...)``:
```javascript
promise.then(function (value) {
    return value.call(thisp, arg1, arg2, ...);
})
```

``promise.bind(thisp, arg1, arg2, ...)``:
```javascript
(function (promise, thisp) {
    var args = Array.prototype.slice.call(arguments, 2);
    return function () {
        var all = args.concat(Array.prototype.slice.call(arguments));
        return promise.then(function (value) {
            return value.apply(thisp, all);
        });
    };
})
```

(note: result of bind is a function, not a promise)


``promise.keys()``:
```javascript
promise.then(function (value) {
    return Object.keys(value);
})
```

## Flow composing

The former promise chains are just only single flow style.
``Q`` supports flow graph for complex flows.

### Concurrent flow from a promise

Not only single flow of promise in chain, 
you can use a promise for multiple flows.

For example, at processing a result text, 
one flow is to print to log, other flows are to converting.

```javascript
// chain-concurrent.js
var text = httpGet(url.parse("http://example.biz")).then(function (res) {
    return httpGet(url.parse(res.headers["location"]));
}).then(loadBody);.fail(function (error) {
    return "Not Found";
});

text.then(console.log);
text.post("toUpperCase").then(console.log);
text.post("toLowerCase").then(console.log);
```

In the code, printing order is not stable 
beacuse of the end of three flows are independent each other.

### Joined promise of multiple promises

Joining multiple flows also supported with ``Q.all(promiselist)`` 

For example, the former code of print out at the ordered.

```javascript
// chain-concurrent-join.js
var text = httpGet(url.parse("http://example.biz")).then(function (res) {
    return httpGet(url.parse(res.headers["location"]));
}).then(loadBody).fail(function (error) {
    return "Not Found";
});

var texts = Q.all([
    text,
    text.post("toUpperCase"),
    text.post("toLowerCase"),
]);

texts.spread(function (normal, upper, lower) {
    console.log(normal);
    console.log(upper);
    console.log(lower);
});
```

When all of ``promiselist`` are resolved, ``Q.all(promiselist)`` is resolved.
When one of ``promiselist`` is rejected, ``Q.all(promiselist)`` is rejected.

Other case is join multiple accesses:
```javascript
Q.all([
    httpGet("fragment.glsl"),
    httpGet("vertex.glsl"),
]).spread(function (fragmentCode, vertexCode) {
    return makeShaderProgram(fragmentCode, vertexCode);
});
```

``Q.allResolved(promiselist)`` is similar ``Q.all``.
``Q.all(ps)`` is a promise of values of ps,
but ``Q.allResolved(ps)`` is a promise of resolved(success of failure) 
promise list. The ``then`` callback args is an array of promise.
(It is for just timing sync?)


### `end` for abort

``promise.end()`` is for abort the program entirely.

If the ``promise`` is rejected (and not catched error before),
`end()` forcely spawn uncaughtable error (e.g. 
``setTimeout(function () {throw ex;}, 0)``).

On node.js REPL, run ``Q.reject("uncaught").end()``, then exit with an error.

If error reached to the ``end()``, you could think it just a *programming bug*
(not exception state).

### ``fin`` for common processing success or fail handlers

``fin`` is for invoking common process for ``then`` handelrs. e.g.

```javascript
// promise-fin-flow.js
promise.fin(function () {
    console.log("resolved");
}).then(function (value) {
   console.log("success " + value);
}, function (error) {
   console.log("failure " + error);
});
```

If ``promise = Q.resolve("OK")``, prints ``"resolved\nsuccess OK"``.
If ``promise = Q.reject("FAIL")``, prints ``"resolved\nfailure FAIL"``.

``fin`` callback has no arguments.


## Timing control promise

promise has two time control methods:

- ``promise.delay(ms)``
- ``promise.timeout(ms)``

``promise.delay(ms)`` is a promise that
spawns ``then`` callback after ``ms`` milliseconds. e.g.

```javascript
// promise-delay.js
Q.resolve("OK").delay(5000).then(console.log)
```

It prints ``"OK"`` when 5-sec after.

``promise.timeout(ms)`` is a promise that
spawns reject callback after ``ms`` seconds when not yet resolved.

For example, 

```javascript
// promise-timeout.js
Q.resolve("OK").timeout(5000).then(console.log)
```

It prints ``"OK"`` just now. But:

```javascript
// promise-timeout.js
Q.resolve("OK").delay(10000).timeout(5000).then(null, console.log)
```

It prints ``[Error: Timed out after 5000ms]`` when 5-sec after.

## node.js utilities

``Q`` has simple utility for node.js modules.

- ``Q.napply(func, thisp, args)``
- ``Q.ncall(func, thisp, arg1, arg2, ...)``
- ``Q.nbind(func, thisp, arg1, arg2,...)``
- ``Q.npost(obj, name, args)``
- ``Q.ninvoke(obj, name, arg1, arg2, ...)``

It is just for node.js standard IO module callback style, e.g.:

```javascript
fs.readFile(filename, encoding, function (error, result) {
   if (!error) console.log(result);
});
```

- the callback arg of actions is at the last argument
- the first argument of callback functions is for error
- the second argument is a result of action

(You can not use them for http module because its style is different)

The transformed examples are:

```javascript
Q.napply(fs.readFile, fs, [filename, encoding]).then(console.log);
```

```javascript
Q.ncall(fs.readFile, fs, filename, encoding).then(console.log);
```

```javascript
Q.nbind(fs.readFile, fs)(filename, encoding).then(console.log);
```

```javascript
Q.npost(fs, "readFile", [filename, encoding]).then(console.log);
```

```javascript
Q.ninvoke(fs, "readFile", filename, encoding).then(console.log);
```
