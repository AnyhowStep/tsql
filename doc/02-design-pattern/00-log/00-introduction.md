### `Log`

The log design pattern is used to store time-series data.

-----

### Time-Series Data

Time-series data models how values change over time.

Examples,
+ Your mobile data usage over time
+ Money spent over time
+ Your location over time
+ etc.

Time-series data is usually stored in a log.
Each new change in data is added as a new row to the log (with some kind of timestamp).

-----

### Motivation

You may be storing **a lot** of different kinds of time-series data in a relational database (as opposed to a time-series database).
The patterns for querying, and inserting rows to a table with time-series data are mostly the same.
Being able to abstract the idea of a log, and remove as much (complicated) boilerplate as possible would be nice.
