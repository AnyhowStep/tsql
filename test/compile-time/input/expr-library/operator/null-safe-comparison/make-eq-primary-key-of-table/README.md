`EqPrimaryKeyOfTable` was actually not made to handle union types for `SrcT` and `DstT`.

The fact that it seems to work (judging from the tests written here)
is a complete fluke.

There may be cases where this breaks and I just haven't realized it yet.
