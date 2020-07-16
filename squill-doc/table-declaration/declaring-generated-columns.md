### Declaring generated columns

When performing an INSERT/UPDATE, we **cannot** provide values for generated columns.

The value of generated columns is always set by the database.

-----

### `.addGenerated()`

```ts
import * as sql from "@squill/squill";

const triangle = sql.table("triangle")
    .addColumns({
        a : sql.dtDouble(),
        b : sql.dtDouble(),
        hypSquared : sql.dtDouble(),
    })
    .addGenerated(columns => [columns.hypSquared]);
```

[Code Sample](https://anyhowstep.github.io/tsql-sqlite3-browser/test-playground/public/#pre-ts/CIJQ8gCgBAKgggIQDIFEoEkBiUUA10DKMBUALgE4CWAhgHYDmANgKYDcAUAMIgpwxrxkaCjQYsoACnZQZUalGBgAqkKgA5MDHVKkSADTTZAIwXLVGrWp37DASAC09qAAtSpAA4BnAFwB6X-SUpM4ArkYAdADGAPYAtr5wtACeztEA7gSkzO6+pJ4Ajoz2BYxBzADM9kbk6Z7M5L6Unp4hzJ6+AByGMs5J7gT5IdTkzAAmpiqo6praulBwJFK2ttQAVPIA1FBGq0bstgCU7Acc7O7k1PSx8qTURiwA+gAelLQAZtESInRMzCfs7HQagIKBAWiBMDA+2+YmYkmoem2RwAanAkEoUAR9hIAIyInEHAy2CTlREAVkJ2I6+IATCcgA#ts/PQKgUABFEIIDZwgewGYQC4AsCWBnCeEAhgMYkCmuu2ARnORAOZxI1EICeBAdhjvgAU4RDowBOSAK7cAJgDowkaNgC2AByRj0EEMXy4AjohQSVEAEQABQ5OwJgNu3HMBuJVFUatOvRENxsdHIAZggTJDMrR3t-QJCAWhoJAHdccjFXdwgZchJhMQYSJG5cbQ0kRAAuPwM44LkBJAq3EGAwIpLtdDFsIm5mBgBeGrg5dCI6cgAKc27e-vpzAEosuSIZGQBhCskVEqmAbyzoYghq-zkZdAARKUmppYAaY+gaM5HLm7v6B+eTk8wHDUAGUDJIiAUZO8LldbpJ7k8sgBfFYnNYbADi5G46SIQRkUyKcF2JQggwAfBAANpEkm4OSAkFgiHkGQAXSWbjA5VGpDB2AKUyIuA43BIEEJxRxJHQ2GKSzJlKOJ2AwCEpAY7EQMjxE2FhS1+GwJWwOQgmHS5CyRGSRECGB6fQGcmNaS0AHkcVMXlAOtLZcU-v8oMrg-8iO9ggAmOQARiDYde7yj9QA7AnExBVQBVMURFTY2X9PiEZJOCBqCQySQUU5FdR2BjpCRiH3-VWM0HgyHvACc-YzJyRWU5YBRbiAA#post-ts/MoUQMiDCAqAEBUsBiAlA8gWVgFwE4EsBDAOwHMAbAUwG4g)

-----

### `.removeGenerated()`

You should not have to use this method often, if at all.
