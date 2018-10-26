"use strict";

const indexer = exports.indexer = Symbol.indexer = Symbol("Symbol.indexer");
const handler = {
    get: (obj, prop) => {
        if (typeof prop != "symbol" && !isNaN(prop) && typeof obj[indexer] == "function") {
            prop = parseInt(prop);
            let getter = obj[indexer]().get;

            if (typeof getter == "function") {
                updateLength(obj, prop);
                return getter.call(obj, prop);
            }
        }

        return obj[prop];
    },
    set: (obj, prop, value) => {
        if (typeof prop != "symbol" && !isNaN(prop) && typeof obj[indexer] == "function") {
            prop = parseInt(prop);
            let setter = obj[indexer]().set;

            if (typeof setter == "function") {
                updateLength(obj, prop);
                setter.call(obj, prop, value);
                return true;
            }
        }

        obj[prop] = value;
        return true;
    }
};

function updateLength(target, index) {
    if (target.length === undefined || index >= target.length) {
        target.length = index + 1;
    }
}

function setLength(target) {
    if (!("length" in target) && !Object.getOwnPropertyDescriptor(target, "length")) {
        Object.defineProperty(target, "length", {
            configurable: true,
            writable: true,
            enumerable: false,
            value: 0
        });
    }
}

function setIterator(target) {
    if (target[Symbol.iterator] === undefined) {
        target[Symbol.iterator] = function* iterator() {
            for (let i = 0, len = this.length; i < len; i++) {
                yield this[i];
            }
        };
    }
}

function indexable(arg) {
    if (typeof arg == "function") {
        setIterator(arg.prototype);

        return new Proxy(arg, {
            construct: (target, args, newTarget) => {
                let obj = new target(...args);
                setLength(obj);

                return new Proxy(obj, handler);
            }
        });
    } else if (typeof arg == "object") {
        setIterator(arg);
        setLength(arg);

        return new Proxy(arg, handler);
    } else {
        throw new TypeError("the only argument of indexable() must be a function or an object");
    }
}

exports.indexable = indexable;