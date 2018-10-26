# indexable

**An implementation of indexer on object in JavaScript.**

In C# language, you can set **indexer** in a class, an when you instantiate the 
class, you will get the ability to access some useful information via a number 
index in array style.

But in JavaScript, although you are allowed to access properties using `[]` 
style, however it's just the as using `.`, and have no control when using it as 
an array, it's still object style.

By using this package, you can have the exact ability like in C#, and even more.
You not only can using an object like an array, but also, the **array-like** 
object provide the `length` property out the of box, you can travel the object 
in `for....` and `for...of...` loop just like travel a real array. Even, you 
can call `Array.from()` to generate a real array from the object, it's just that
easy.

## Install

```sh
npm i indexable
```

## Example

```javascript
// indexable standard object
const { indexable } = require("indexable");
const chars = "abcdefghijklmnopqrstuvtwxyz";

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

// now you can do these
console.log(obj[0]); // => hello
console.log(obj[1]); // => world
console.log(obj.length); // => 2

// in a for... loop
for (let i = 0; i < obj.length; i++) {
    console.log(obj[i]);
}

// ... in a for...of... loop
for (let item of obj) {
    console.log(item);
}

// generate an array from the object
var arr = Array.from(obj);
console.log(arr); // => ['hello', 'world']

// you can set more elements in the object
obj[2] = "hi";
console.log(obj[2]); // => hi
console.log(obj["c"]); // => hi
console.log(obj.length); // => 3
```

```javascript
// indexable class
const { indexable } = require("indexable");
const chars = "abcdefghijklmnopqrstuvtwxyz";

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
// examples are just like above
```

```typescript
// you can use indexable() as a decorator in TypeScript or ES6 module
import { indexable } from "indexable";

@indexable
export class MyClass {
    // ...
    [Symbol.indexer]() {
        // ...
    }
}
```

## API

### `Symbol.indexer`

The `Symbol.indexer` symbol specifies the default indexer for an object. Used by
`indexable()` to generate proper indexable object/class.

`[Symbol.indexable]()` must return a handler object that contains a `get`ter and
a `set`ter function, but they are optional, you can omit one of them or both of 
them, if missing, the corresponding functionality will just not work, and will 
not affect common usage.

The `get()` method is a trap for getting a property value.

**signature:**

`get(index: number): any`

You can use `this` in `get()` method, or just define an arrow function.

The `set()` method is a trap for setting a property value.

**signature:**

`set(index: number, value: any): void`

You can use `this` in `set()` method, or just define an arrow function.

### `indexable()`

**signatures:**

- `indexable<T>(obj: T): T & ArrayLike<any>`
- `indexable<T>(Class: new (...args) => T): new (...args) => (T & ArrayLike<any>)`

This function wraps the given object/class in an ES6 `Proxy`, so that when 
access to indexes, the operation will be redirected to the getter and setter 
function.

Also, this function will check if there is a `[Symbol.iterator]()` method in the 
given object/class, if not, it will automatically creates one according to the 
indexed elements, make the object even more array-like, so that you can iterate 
the object in a `for...of...` loop.

### `length`

The `length` property exists in any indexable and array-like object, it 
represents the number of all indexed elements. By using this property, you can 
travel the object in a `for...` loop, just like a real array. Also, you can use
`Array.from()` to generate a real array from the object.

Although in TypeScript, `ArrayLike` interface says that `length` is `readonly`, 
but as usual, in JavaScript, you can update the value of `length` to force 
changing the length of the object, just like you can do with a real array. And 
when you call `Array.from()` to generate the array, the missing elements will be
set `undefined`.