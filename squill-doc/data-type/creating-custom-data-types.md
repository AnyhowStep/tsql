### Creating custom data types

Eventually, you will realize that this library doesn't have many default supported data types.

This is where creating custom data types comes in.

-----

To create a custom data type, implement the `IDataType<TypeT>` interface.

A helper function exists to create custom data types,
```ts
declare namespace DataTypeUtil {
    /**
     * A helper function to create an object that implements `IDataType<TypeT>`
     *
     * @param mapper - Deserializes data from SQL to JS
     * @param toBuiltInExpr_NonCorrelated - Serializes a JS value to a squill expression
     * @param isNullSafeEqual - Determines if two JS values are equal
     * @param extraMapper - Optional argument. May be used to restrict the domain of valid values.
     */
    declare function makeDataType<TypeT>(
        mapper : tm.SafeMapper<TypeT>,
        toBuiltInExpr_NonCorrelated : (value : TypeT) => BuiltInExpr_NonCorrelated_NonAggregate<TypeT>,
        isNullSafeEqual : (a : TypeT, b : TypeT) => boolean,
        extraMapper? : tm.Mapper<TypeT, TypeT>
    ) : DataType<TypeT>;
}
```

For usage, see,

[Code Sample](https://anyhowstep.github.io/tsql-sqlite3-browser/test-playground/public/#pre-ts/CIJQ8gCgBAKgggIQDIFEoEkBiUUA10DKMBUAtgJ4wCGARgDYCmA3AFADCIKcMa8yaFavQZQAFCyhQAkINqN0AEwwA5HgHEUIKBBDoAsnBABNKAGkUJuAFUYYdMo4o9KVVGVgYbq0iQAaCdIAtIFQcADGAC4ArlR0dORQAM4RAPYATgxKVIlQVEkRaQCWAHYA5lAlUAQAikiFEQwBUslpcGlpUGwppKRUBAwADlRpVA0KBAUlpW0j5CwAlKwsAyOlvVARcgwA+gAeJQBmKaKywossQA#ts/PQKgUABFEIIDZwgewGYQC4AsCWBnCeEAhgMYkCmuu2ARnORAOZxI1EICeBAdhjvgAU4RDowBOSAK7cAJgDowkaNgC2AByRj0EEMXy4AjohQSVEAEQABQ5OwJgNu3HMBuJVFUatOvRENxsdHIAZggTJDMrR3t-QJCAWhoJAHdccjFXdwgZchJhMQYSJG5cbQ0kRAAuPwM44LkBJAq3EGBFUHAfAGUARQAZOIhkpwgC9EkxXiIIIpUVabS1IjEiIJk-dDFsbkYFHwB1Bkk0ja2duVw1APQACgBKDCQmcm0iKbEVjj3dSF0AEUo6Ww7GwAC9KHwGKUzowwqYIL0BkFHsQIAApLqnbaMADaAF1fm0iiVtLN5l1yEsVmsuptsTAPiIALJENRqdIQAC8EBuWW4RBUDGq0OxABoIFkVNgAB7kdbVaQAa24SGS3DAD2FdJ2+K5AD4IABvLLYNA3dAcdmoCBS2XrTnc8winbmB7G6Ae0YvCa8W1yi5XQI3cyi11uD0AXxNZqyHr9622pTeFGtDM+EAAZBnY9B43JyAA3dIcG7YfUYS3ka1lh0WZ2MV1ZN05qBjH02mVy8PQKNZLApCDccjJCAAUQ+mhuAAMACSG-mCiM247aGhQ7W4vFTu5uCNuYmlbLoADCEXJlOWqzltJhaZEXJqcDkf1WRAAKpWAKroOxZOTzRVyBfdB30rXlPWgMkiApKkrxkG96UZDgWTZdJRRbHkC3YSRyAeTkDXdCDPTbSZH3zaU1DEcCiJowiaPoiBgGAFVuHiIhGHEchGCvCByAogoqGwYoMIYjxcBgDiCm45FqhQdg0nQ0T6KYz80nWdAnhyNIthBcFIQRfoICwuAcPFU0wheEhMAIdARNE+ZULECBqigmDLxpDc72Q1l2TERSlKIpiADknmOOUvTQNcSCIMLB2KeIig+chhDWXj+LshiwpkAAlcg0GFIw5FUuVcpQb87DkcIVFPEyVG4UqbkNCM7n8gKIAjVqAqYt9MAYGAujfMJNH0vjKMoahhLaqB-DkJF0nYAA1bDyBCnJyqfes5pWOBVvIaipugYycLkAArJBtmDUM7gyz1rqUncMI6jCbiIcUaDwgibvMl65HoHYsAgABCbkaF+8h-swZsDpI3g5LgNJuwYqMlJh4h8yLMQSxepa4DM2Q+I+4gca5EGcW2HJpTxB6aOR6AHrAA9tBUDg3yIOgGG5GaQPZ4NmdZ9nGw9OQiBkGQaskOrcEajC+bZ+gAEl5TImR0AAIWwRh5e4dAug1ocZHuTqPRUk4pCckgVwibJXwrdkMOhNNnKPU85mgi9qWvTykM65q-zSdAYEkDStZIApBW1m4ilqkpyyjiWSn-Fm5fIRX6fKJ9SAMWwChe3AOG4EgeWJIcSB-YpCboxjgCEUgGHYRAZFfNgTmihB8ETbAcggXqCiyRmeG0tZstVB8iGSIhAhtJP2bkRN0gD2QADFLMwfbPWL3Iy+4I3oErmiHY+J2cRuj0nQiBggmldAQxP6BzAgegRexPwlgoG+DvMTYJ4CHYX9riwd4MXvo-GQ2J4hfzsM-S4-935TSdBuUUwwsCiiguYG6eJAHtSbIjGYxRcAVHIL9JAjBSwlHniVVU9NmpuCAA#post-ts/MoUQMiDCAqAEBUsBiAlA8gWVgWwJ7QEMAjAGwFMBuIA)

-----

When creating your own custom data types, you should thoroughly test them!
