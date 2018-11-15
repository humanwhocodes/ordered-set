/**
 * Ordered Weak Set object
 * @author Nicholas C. Zakas
 */

"use strict";

// hidden fields on the class
const first = Symbol("first");
const last = Symbol("last");
const nexts = Symbol("nexts");
const prevs = Symbol("prevs");

function assertValidItem(item) {
    if (item == null) {
        throw new TypeError("Key cannot be null or undefined.");
    }
}

function assertNoDuplicates(item, set) {
    if (set.has(item)) {
        throw new Error("Duplicate item.");
    }
}

function assertExists(item, set) {
    if (!set.has(item)) {
        throw new Error(`Item '${item}' does not exist.`);
    }
}



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

        assertValidItem(item);
        assertNoDuplicates(item, this);

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

        assertValidItem(item);
        assertNoDuplicates(item, this);
        assertExists(relatedItem, this);

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

    insertBefore(item, relatedItem) {

        assertValidItem(item);
        assertNoDuplicates(item, this);
        assertExists(relatedItem, this);

        const curPrev = this.previous(relatedItem);
        this[prevs].set(relatedItem, item);
        this[prevs].set(item, curPrev);
        this[nexts].set(item, relatedItem);
        
        // special case: relatedItem is the first item
        if (relatedItem === this[first]) {
            this[first] = item;
        } else {
            this[nexts].set(curPrev, item);
        }
    }

    remove(item) {

        assertValidItem(item);
        assertExists(item, this);

        const curPrev = this.previous(item);
        const curNext = this.next(item);

        if (curPrev !== undefined) {
            this[nexts].set(curPrev, curNext);
        }

        if (curNext !== undefined) {
            this[prevs].set(curNext, curPrev);
        }

        this[prevs].remove(item);
        this[nexts].remove(item);
    }

    get size() {
        return this[nexts].size;
    }

    first() {
        return this[first]; 
    }

    last() {
        return this[last]; 
    }

    *[Symbol.iterator]() {

        let item = this[first];
        
        while (item) {
            yield item;
            item = this.next(item);
        }
    }

    *reverse() {
        let item = this[last];

        while (item) {
            yield item;
            item = this.previous(item);
        }
    }

}

module.exports = OrderedSet;