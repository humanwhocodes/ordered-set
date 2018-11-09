/**
 * Ordered Weak Set object
 * @author Nicholas C. Zakas
 */

"use strict";

const FIRST = { toString() { return "FIRST" } };
const LAST = { toString() { return "LAST" } };

const first = Symbol("first");
const last = Symbol("last");
const nexts = Symbol("nexts");
const prevs = Symbol("prevs");

class OrderedSet {

    constructor() {
        this[nexts] = new Map();
        this[prevs] = new Map();

        this[first] = undefined;
        this[last] = undefined;
    }


    next(item) {
        return this[nexts].get(item);
    }

    previous(item) {
        return this[prevs].get(item);
    }

    has(item) {
        return this[nexts].has(item);
    }

    add(item) {

        // ensure no duplicates
        if (this.has(item)) {
            throw new Error("Duplicate item.");
        }

        // undefined is used as a special value, so can't be a key
        if (item === undefined) {
            throw new Error("Item must not be undefined.");
        }

        // special case for first item
        if (this[first] === undefined) {
            this[first] = item;
            this[last] = item;
            this[nexts].set(item, undefined);
            this[prevs].set(item, undefined);
        } else {
            this[nexts].set(this[last], item);
            this[nexts].set(item, undefined);
            this[prevs].set(item, this[last]);
            this[last] = item;
        }

    }

    insertAfter(item, relatedItem) {

        // ensure no duplicates
        if (this.has(item)) {
            throw new Error("Duplicate item.");
        }

        // check for missing data
        if (!this[nexts].has(relatedItem)) {
            throw new Error("Second argument not found in set.");
        }

        const curNext = this.next(relatedItem);
        this[nexts].set(relatedItem, item);
        this[nexts].set(item, curNext);
        this[prevs].set(curNext, item);
        this[prevs].set(item, relatedItem);

        // special case: relatedItem is the last item
        if (relatedItem === this[last]) {
            this[last] = item;
        }
    }

    get size() {
        return this[nexts].size;
    }

    *[Symbol.iterator]() {

        let item = this[first];
        while (item) {
            yield item;
            item = this.next(item);
        }
    }

}

module.exports = OrderedSet;