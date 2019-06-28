# Ordered Set

by [Nicholas C. Zakas](https://humanwhocodes.com)

If you find this useful, please consider supporting my work with a [donation](https://humanwhocodes.com/donate).

## Description

A JavaScript data structure that allows random access and traversal of a set's items. This is implemented as a doubly-linked list behinds the scenes.

## Installation

You can install using npm or Yarn:

```bash
npm install @humanwhocodes/ordered-set --save

# or

yarn add @humanwhocodes/ordered-set
```

## Usage

Retrieve the `OrderedSet` constructor and use the methods:

```js
const { OrderedSet } = require("@humanwhocodes/ordered-set");

// create a new instance
const set = new OrderedSet();

// add in data
set.add(1);
set.add(2);
set.add(3);

// get the value before 2
const prev = set.previous(2);

// get the value after 1
const next = set.next(1);

// check if a value exists in the set
const exists = set.has(2);

// how many values are in the set?
const size = set.size;

// get the first value in the set
const first = set.first();

// get the last value in the set
const last = set.last();

// find the next value matching this function
const value1 = set.findNext(value => value > 1, 1);

// find the previous value matching this function
const value2 = set.findPrevious(value => value > 1, 3);

// remove a value
set.delete(1);

// get all values
let values1 = [...set.values()];
let values2 = [...set];

// get all values in reverse order
let values3 = [...set.reverse()];
```

## License

Apache 2.0
