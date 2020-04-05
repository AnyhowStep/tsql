### BigInt polyfills

This library requires `BigInt` support.

If your environment does not have them, you must polyfill them before this library is loaded.

For example, old versions of node, and Safari do not have `BigInt` support.

-----

The simplest `BigInt` polyfill that should work is,
```ts
class MyBigInt {
    value : string;
    constructor (mixed : unknown) {
        this.value = String(mixed);
    }

    toString () {
        return this.value;
    }
}
if (typeof BigInt === "undefined") {
    //window/self/globalThis/etc.
    window.BigInt = (x : unknown) => new MyBigInt(x);
}
```

The polyfill must also satisfy the following properties,
```ts
BigInt(0) instanceof MyBigInt
> true
Object.getPrototypeOf(BigInt(0)).constructor === MyBigInt
> true
```
