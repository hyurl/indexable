"use strict";

const assert = require("assert");
const { indexable } = require(".");

const chars = "abcdefghijklmnopqrstuvtwxyz";

describe("make an object indexable and array-like", () => {
    var obj = indexable({
        a: "hello",
        b: "world",
        [Symbol.indexer]() {
            return {
                get: (index) => {
                    for (let i = 0; i < chars.length; i++) {
                        if (i === index) {
                            return this[chars[i]];
                        }
                    }
                },
                set: (index, value) => {
                    for (let i = 0; i < chars.length; i++) {
                        if (i === index) {
                            this[chars[i]] = value;
                        }
                    }
                }
            }
        }
    });

    it("sohuld get values via indexes and generate an array by Array.from()", () => {
        assert.strictEqual(obj[0], obj.a);
        assert.strictEqual(obj[1], obj.b);
        assert.strictEqual(obj.length, 2);
        assert.deepStrictEqual(Array.from(obj), [obj.a, obj.b]);
    });

    it("should travel the object by using for...of... loop", () => {
        let i = 0;
        for (let item of obj) {
            assert.strictEqual(item, i === 0 ? obj.a : obj.b);
            i++;
        }
        assert.strictEqual(i, 2);
    });

    it("should set values via indexes and append the object automatically", () => {
        obj[0] = "hi";
        obj[4] = "hello";

        assert.strictEqual(obj[0], "hi");
        assert.strictEqual(obj[4], "hello");
        assert.strictEqual(obj[5], undefined);
        assert.strictEqual(obj.length, 6);
        assert.deepStrictEqual(Array.from(obj), ["hi", obj.b, void 0, void 0, "hello", void 0]);
    });
});

describe("make a class instance indexable and array-like", () => {
    let MyClass = indexable(class MyClass {
        constructor() {
            this.a = "hello";
            this.b = "world";
        }

        [Symbol.indexer]() {
            return {
                get: (index) => {
                    for (let i = 0; i < chars.length; i++) {
                        if (i === index) {
                            return this[chars[i]];
                        }
                    }
                },
                set: (index, value) => {
                    for (let i = 0; i < chars.length; i++) {
                        if (i === index) {
                            this[chars[i]] = value;
                        }
                    }
                }
            }
        }
    });

    var obj = new MyClass();

    it("sohuld get values via indexes and generate an array by Array.from()", () => {
        assert.strictEqual(obj[0], obj.a);
        assert.strictEqual(obj[1], obj.b);
        assert.strictEqual(obj.length, 2);
        assert.deepStrictEqual(Array.from(obj), [obj.a, obj.b]);
    });

    it("should travel the object by using for...of... loop", () => {
        let i = 0;
        for (let item of obj) {
            assert.strictEqual(item, i === 0 ? obj.a : obj.b);
            i++;
        }
        assert.strictEqual(i, 2);
    });

    it("should set values via indexes and append the object automatically", () => {
        obj[0] = "hi";
        obj[4] = "hello";

        assert.strictEqual(obj[0], "hi");
        assert.strictEqual(obj[4], "hello");
        assert.strictEqual(obj[5], undefined);
        assert.strictEqual(obj.length, 6);
        assert.deepStrictEqual(Array.from(obj), ["hi", obj.b, void 0, void 0, "hello", void 0]);
    });
});