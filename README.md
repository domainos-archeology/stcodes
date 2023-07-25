stcodes
=======

While working on decompiling/disassembling apollo executables, one of the biggest aids is recognizing and replacing
status_$t values with their semantic names.  This is often the first thing I do, because it goes a long way toward
giving the broad strokes about what a particular piece of code does.

Usage:

```
# prints out all status codes in 10.2's db:
$ node stcode.js stcode.db.10.2

# and again for 10.4:
$ node stcode.js stcode.db.10.4
```
