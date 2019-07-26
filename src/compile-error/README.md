
This type is a workaround for TypeScript's lack of a native "compile error" type.

For motivation behind this,
https://github.com/microsoft/TypeScript/issues/23689#issuecomment-512114782

-----

Below is a copy+paste of the linked comment.

-----

So, I've been playing around with compile-time errors some more and I've had the following requirements,

+ Compile errors must be assignable to each other.

  `CompileError<["errorA"]>` must be assignable to `CompileError<["errorB"]>`

  This is important because it lets us change the error message between versions of our packages
  and not break backwards compatibility.

+ It should not be possible to "legitimately" create a value of type `CompileError<>`

-----

With the above requirements, my hacks using tuples `["errorA"]` or union types `["errorA"]|void` don't work out.

+ `["errorA"]` is not assignable to `["errorB"]`

+ You can easily create a value of type `["errorA"]`

-----

I've revised my hack for compile-time errors but it still has the limitation that you should not use `ReturnType<>` inside of function parameter lists.

So, do not use `function foo<F extends () => number> (f : F)`.
Instead, use `function foo<N extends number> (f : () => N)`.

-----

Below is a revised version of the hack and examples of how it works,

```ts
/**
 * We should never be able to create a value of this type legitimately.
 *
 * `ErrorMessageT` is our error message
 */
interface CompileError<ErrorMessageT extends any[]> {
  /**
   * There should never be a value of this type
   */
  readonly __compileError : never;
}
type ErrorA = CompileError<["I am error A"]>;
type ErrorB = CompileError<["I am error B"]>;

declare const errorA : ErrorA;
/**
 * Different compile errors are assignable to each other.
 */
const errorB : ErrorB = errorA;

/**
 * Pretend this is `v1.0.0` of your library.
 */
declare function foo <N extends number> (
  /**
   * This is how we use `CompileError<>` to prevent `3` from being
   * a parameter
   */
  n : (
    Extract<3, N> extends never ?
    N :
    CompileError<[3, "is not allowed; received", N]>
  )
) : void;

/**
 * Argument of type '3' is not assignable to parameter of type
 * 'CompileError<[3, "is not allowed; received", 3]>'.
 */
foo(3);
/**
 * OK!
 */
foo(5);
/**
 * Argument of type '3 | 5' is not assignable to parameter of type
 * 'CompileError<[3, "is not allowed; received", 3 | 5]>'.
 */
foo(5 as 3|5);
/**
 * Argument of type 'number' is not assignable to parameter of type
 * 'CompileError<[3, "is not allowed; received", number]>'.
 */
foo(5 as number);

///////////////////////////////////////////////////////////////////

/**
 * The same as `foo<>()` but with a different error message.
 *
 * Pretend this is `v1.1.0` of your library.
 */
declare function bar <N extends number> (
  n : (
    Extract<3, N> extends never ?
    N :
    //Different error message
    CompileError<[3, "is not allowed; received", N, "please try again"]>
  )
) : void;

/**
 * Assignable to each other.
 *
 * This means we can change the error message across different
 * package versions and it will not be considered a breaking change!
 *
 * Users can pass types using `CompileError<>`
 * of `v1.0.0` of your library to `v1.1.0`
 * of your library without worrying!
 */
const fooIsAssignableToBar : typeof bar = foo;
const barIsAssignableToFoo : typeof foo = bar;

///////////////////////////////////////////////////////////////////

/**
 * If a different library defines their own `CompileError<>` type,
 * it's okay!
 *
 * As long as it has the same "shape" as our own `CompileError<>` type.
 */
interface OtherCompileError<ErrorMessageT extends any[]> {
  /**
   * There should never be a value of this type
   */
  readonly __compileError : never;
}
type ErrorC = OtherCompileError<["I am error C"]>;
/**
 * Different compile errors are assignable to each other.
 */
const errorC : ErrorC = errorA;

///////////////////////////////////////////////////////////////////

declare function doNotReturn3 <N extends number> (
  /**
   * This is how we use `CompileError<>` to prevent `3` from being
   * a return value
   */
  n : (
    Extract<3, N> extends never ?
    () => N :
    CompileError<[3, "is not allowed; received", N]>
  )
) : void;


/**
 * Argument of type '3' is not assignable to parameter of type
 * 'CompileError<[3, "is not allowed; received", 3]>'.
 */
doNotReturn3(() => 3);
/**
 * OK!
 */
doNotReturn3(() => 5);
/**
 * Argument of type '3 | 5' is not assignable to parameter of type
 * 'CompileError<[3, "is not allowed; received", 3 | 5]>'.
 */
doNotReturn3(() => (5 as 3|5));
/**
 * Argument of type 'number' is not assignable to parameter of type
 * 'CompileError<[3, "is not allowed; received", number]>'.
 */
doNotReturn3(() => (5 as number));

///////////////////////////////////////////////////////////////////
//Below is a more complicated example of using `CompileError<>`

interface Column {
  name : string,
  dataType : string|number|boolean,
}

type ColumnNameExcludeIndex<ArrT extends Column[], IndexT extends keyof ArrT> = (
  {
    [k in Exclude<keyof ArrT, IndexT>] : (
      number extends k ?
      never :
      ArrT[k] extends Column ?
      ArrT[k]["name"] :
      never
    )
  }[Exclude<keyof ArrT, IndexT>]
);

//type columnAliasTest = "a" | "c"
type columnAliasTest = ColumnNameExcludeIndex<
  [
    { name : "a", dataType : string },
    { name : "b", dataType : string },
    { name : "c", dataType : string },
  ],
  "1"
>;

type DuplicateColumnNames<ArrT extends readonly Column[]> = (
  {
    [k in keyof ArrT] : (
      ArrT[k] extends Column ?
      (
        ArrT[k]["name"] extends ColumnNameExcludeIndex<ArrT, k> ?
        ArrT[k]["name"] :
        never
      ) :
      never
    )
  }[number]
);

//type duplicateColumnNamesTest = "a"
type duplicateColumnNamesTest = DuplicateColumnNames<[
  { name : "a", dataType : string },
  { name : "b", dataType : string },
  { name : "c", dataType : string },
  { name : "a", dataType : number },
]>;

type NonEmptyTuple<T> = (
  readonly T[] & { readonly "0" : T }
);

declare function selector<ColumnsT extends Column[]> (
  ...columns : ColumnsT
) : (
  {
    select : <ArrT extends (ColumnsT[number])[]> (
      callback : (
        DuplicateColumnNames<ArrT> extends never ?
        (columns : ColumnsT) => ArrT & NonEmptyTuple<Column> :
        CompileError<[
          "Duplicate column names not allowed in select",
          DuplicateColumnNames<ArrT>
        ]>
      )
    ) => ArrT
  }
)

const s = selector(
  { name : "a", dataType : "blah" } as const,
  { name : "b", dataType : "blah" } as const,
  { name : "c", dataType : "blah" } as const,
);
/*
  const arr : [
    {
        readonly name: "a";
        readonly dataType: "blah";
    },
    {
        readonly name: "b";
        readonly dataType: "blah";
    }
  ]
*/
const arr = s.select(columns => [
  columns[0],
  columns[1],
]);

/**
 * Argument of type
 * '(columns: [
 *    { readonly name: "a"; readonly dataType: "blah"; },
 *    { readonly name: "b"; readonly dataType: "blah"; },
 *    { readonly name: "c"; readonly dataType: "blah"; }
 * ]) => [
 *    { readonly name: "a"; readonly dataType: "blah"; },
 *    { ...; }
 * ]'
 * is not assignable to parameter of type
 * 'CompileError<["Duplicate column names not allowed in select", "a"]>'.
*/
s.select(columns => [
  columns[0],
  columns[0],
]);
```

[Playground](http://www.typescriptlang.org/play/#code/PQKhFgCgAIWh1AptAzgCwPYFcA2ATaAO0QDdEAnaAI2QEMqdkAXDaAY3MVqbuhNpxZkGAGbQmaAJYpxATwAOyRgHNJTSQFtuiHLIB0UWNENwABgFFy5DOQCyiFClrLEAFVPRp0bJQrXKGg5OLibAUJKEPOQitGzIAMIYGvKSjJb+ADzpNvaOzm7QiAAePIR4MrSEsgDaALoAfNAA3obQoBAw0EauaBTI6Nj4RKQU1Lz8gsJiEl5MCoitsGGdnLR4GIS60AD622xJKWlWNtAAXMNk5ADcUAC+UHOK0NnkAILQALzQicmpiC8ZaoAIgAktBaBpCsdKK8gQ0bpBHsgXgAhT7fA5-AHAsEQqH+aAouH1BFQPCINg4WicdgbFBMfE2d7nF6vBHtEzQAAikhEIj6kVpv0YjPIFRptEckmUhHoIpYhViaG8EgoBhgIGW+0I9NFaJZ0LRXz8TNJkA5GugAAVOKUCDMZF5TCQAIx6AAMHo8omgsh80Bwkio5Gp+lCZIpVJpIiwhDY6g20BEGFYGQAcoUSogyjJCFgNDRyI0ABStC1dbpSR0yTAAd2gteQWBQyFMP0O-2hGXqHgV8k4ZEFpgAzB4RNZITQIspFnBaNB5NSIYgorPll1CGdoKXOl1zCUQ-GMsOADTQNONYp23MjSgAfkW57Oj-bWK71VP0CBXkIGAZAhwDBGzwK5oE4OJJDIPAgTPNMGlaABKKAEK3EgMEkECoCgcs4FechlHzbMGR9JFoAAcmHMjPFzP9wSlGU5WYVhFxDQIom8aZ5k5MjXyOTIPzPb8aP-HBAOA0DwMQSDEGgs9hwaMj1SWKBkwwYthwQ9kwE5AB5ABpABCcNIFU4sAFZNOw7TLTwgjAkFEj5nI4doAAH2gMyqJ-WjJRQaVZQYJiFyXNjRkcxRuN4zt+M-ISiB80SgJkiSKSkqCYOgFz3LMhSlM1FSU3MujMtciytI6IxbMIhzOKeMi8wLCgvOEui-IYwLxGYkKVzC2qFktHjMT4mxAVi7yRLE5KwNS6TZKIfNC1y4zTLM4qGsLSzIGw4Adt2vb9oOw6juOk7Tqw81rMrfpl2K0xVO7YsEI8KgsAZWs1GVec8F5flOEFE0AiCfI8uMS0bR6spxCrajoGdN03Xdb0xD9LBKEDYNQzy5ZyUpalkBjOME03KhqWgdNM2vebGqLbdWk3c4dwrZ4D1iJhj1gy8sxzC5RgfXcn1OR8dp5PkBQZAHoECPIQn5qLsTGlqAKSkDpog9LYME+RGElZhyFkcFlFoCJiUQ5DUPQzCtouircPogL5VYLg2GVP9enIEHOR6LxAkqGRG3YSp2DQSoXCh5AJal4I6A4DBHGgb7Rb+phOUXNgAGt8j4Cg-LpcFIbUBtUhweKGRoWkdQwvoCHnYMuDT6cg5DxAjMtTkAFUWzFAPN0XOOkRkZsG7bIbopGntOR9OGPS9DjfX9dGQz1zrYddPQEdMCfkfnoNF-196JGwN6bD16cW+UyBtV1VSQRQV47cY1wMBRUnziRH0ScoL5VIRS-S+pG+75tXtm4DAAAxFMW435iFUuiD+ZpToIMQUg5BO1zo4WgCCMQX0fpiwDDvUM8dEAiAiA4MOkhKBAU3MPYUo9yDdl7PME8nI1BkRkBgDOsgz5wE5HfAMGxlDFQLsHGQqpUA3SBOgWgiggTFX9JQ2Gcsuw9jkIoLG4RIgUBiHEaAOlVTkEUZkF4uQo6uAptmcoecagNGaGWS6XQ4A9D6KgTAuACDEEuGMcEfABBCFng6FR-UKz5RWFwdYmx9a7H2DQl4W53EUARPcRETkXjxHRLot2BiRo4nBJCCW8RiTlU5CLX6REhQdlFOKOg98OoKidi7PRaiL50nFtCVJBp-CpONNCNkaCUF9P6cg86OMoz41jPGSQiZ1hpj-AAJRXKjQgLlyZXnMbmBaFASy2IqvY6AXtqzQDrA2JsLYFEjwBMovsA5SkjjHBOMY05ZxeNtAs7xkw1x0y3IzCs+4mCHjZp+C8ZjuZxPvI+R6nxGgZkFrLM574FYl3BIlcSqs0oyQynBeoptIAoXOGhDCZorI22gFVeyxE+rOWagi3y-lGLLxYsudi4VAlwEGtEuFglxqIsmirSSs0MryXqIpYyUzZnzPIIs4s4KPiNA0oUy0+kuHYwwNMpgcymALOHJKlC0qPKbXQSS0pTLnJuQ8pS38-5qkO2CqxHqFC+qRVhTFDliskVTV5erTKJqcqCsaSK1VYqJVSpLKtSUJULJ6surhfC1UyUBPIutJqMNzWtRpTUrqNrGX2oGpkuhAkvycqVsi91aKzwJvIEtDUSqVVqo1VqiF24Q1rOpghTa20Bnto7ftbaKIdBARhvODQNhkBRK1pINg2gCDFAhFrKY0BB6EAEdQjs5yN5WwiFELRCQMCCA0JuFonRZSBC3PScg04mGdDwNwWgrgnLnBPdOVyZbXJUBTNrQg57EkPCcokHdhA0zLn3JSLA5IQRlGKBkPC5BTErO5j+-MhA6hnlA+SIo0GuYWLTogP0YhIOuEaF8L5+6mbVDTp4TcgHBDkgyJh7DxKrCuCQ2B1D9RaifMfBudZvh0MyFI3zJmG5bzPn5l0XDJHWMwYsXB3d0A+P8dE2nWowJD2IDhEJ-jPNyCPiQp0W41QKPAcQNRrDPpcOMZQ3h2oyF4HAFIvsX9-7AiuAcAyL4QJaAyPckCNgQIv1PDs-BhzbhnPoik3+gDRQgMgaYxkVo1RHxNCIDdc4bmMqXqYNe29qBfkN1uOepmCXlNbiBFQVLV6b1PDvdlhd0BcvxcS0e5L3mzxpYyxVrLp7qu1c6LUPLX4XQ+cgCSc6pEuRYFHeOngoXAsoAg-RoFFjVhhK2KFuo+HaadCIxWEjZHoA0ZM-R1jDN2N0ag2J+bMhQsyeO189T8nFNAmU6piTF3t0BfC5FxAyHwOmd240WTt36NiaU8uVT0L1MCcuMdnFx2QVadaLpstlnsXWdIngMbgYJuICm8uFATndSufc755AaPxvaGx1LPHLnuTo7HWT17u7puAlaAVpLX53PNbK5l+9nXess4a1+ErHP0vleQJVjrAiutdD56Lr8TX46c7a9ziXvP6sy5S0L1rMuy01fPfCYbTlpmEHMMkOYrh0eGbw+iL5i2NhbFcHUaAAAyZo001i2-1kCd0MjzimMSa2yAwy8ZJjGUTVAOgKQsDoaF3H52MS-tW+troehk-+d3TIc40fXBmyOxtx8LZGDxi3LNqDsfiyZ+qIjhCCebsVnHaJEm6c2PCYrKN0nk36dhalsXy3z2NNXeb10YsqedRbkz9qxouGnfng2Mb+QpvzcZFC40MH4Oc1M4HxWIEreMfaFpL+1XLruU7fzxHmCx2mbb9p+3+zOPu+Yo3-BZv2mmbj5O1nnTyFzq-1QOiE-8YbCEaq5Fbs7y7C6ZbFZUhoAyK3DFS-wq6FbJaC6gGa5FYMC0BQE1awHNLwGs5ealZgFtYQHoHQFYE6hMDnoRqtDf7UiUDnBxb8ybbqY27hKq7JbuYIjg6u5Lb6wtYi6IGQFAgcEViS4ViMH8bMFbDKaIGCHn5cHu7IF8EC4CFCFdCJJdBI7BLUFWC-56B-5MBD4d4yA6r0FdDD4oDVDug9ZUGGHVAuhWGQC1D+76rRqkp+JcQDQGG-ooB0GciiFyEsFSFs6CH+FbC8HzD8HEGgSS5wB+ESH6yBHFbBFxEKHhFKGRE66+FS4hHxHLiNZJGhLyFhGKARFQFRGciOH1omExFZHJEJHsHZEpHFFpGlEZGWh+HJ56BlGWi1BkTMKKyWpBT0qhR2oBIOpsr8Rb406Y577wYH5UquoEARBh4F5MAZQpYVrBIoC6Hh7xieHwZGGNAmEzFp4WH2GmE2GWG66aRAA)

-----

The `s.select()` example is the most complex code snippet but it shows that we can have pretty complex compile-time checks if we are creative enough.

-----

Also note that `typeof foo` and `typeof bar` are assignable to each other, even though they have different error messages. This is useful so we can change error messages between versions of packages and not break backwards compatibility.

A user may use both `v1.0.0` and `v1.1.0` of your library and pass types from `v1.0.0` to `v1.1.0` and vice versa. If we just use regular tuples, changing the error message means the error message types are no longer compatible.

-----

Native support for this would be cool.

In particular, notice that the `s.select()` example has a **crazzzyyyyy** long error message!
What we are **really** interested in is the `'CompileError<["Duplicate column names not allowed in select", "a"]>'` part.
However, we have to scroll pretty far down to see it.

When types start becoming thousands of lines long (it happens to me), this is a PITA

-----

In my opinion, the `CompileError<>` type only really makes sense in the context of function parameter lists, at the moment.

If you could somehow make it so that a resolved return type of a generic function containing `CompileError<>` **really** causes a compile error, then it would make sense to have it there, too.

But such a thing would require native support for this type.

Otherwise, it would be easy for the following to happen,
```ts
declare function neverCompile<T> (t : T) : T extends any ? CompileError<["I will never compile"]> : never;
//Expected: Compile error
//Actual: Compiles fine
neverCompile("please explode");
```
-----

If you're getting `'ErrorMessageT' is declared but its value is never read.ts(6133)`,
 just change it to `_ErrorMessageT`