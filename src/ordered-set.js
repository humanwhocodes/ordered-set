/**
 * Ordered Set object
 * @author Nicholas C. Zakas
 */

"use strict";

// hidden fields on the class
const first = Symbol("first");
const last = Symbol("last");
const nexts = Symbol("nexts");
const prevs = Symbol("prevs");

/**
 * Determines if the given value is valid for the set.
 * @param {*} value The value to check.
 * @returns {void}
 * @throws {Error} If the value is `null` or `undefined`. 
 */
function assertValidValue(value) {
    if (value == null) {
        throw new TypeError("Key cannot be null or undefined.");
    }
}

/**
 * Checks to see if a value already exists in the given map.
 * @param {*} value The value to check. 
 * @param {OrderedSet} set The set to check inside of.
 * @returns {void}
 * @throws {Error} If the value is a duplicate.
 */
function assertNoDuplicates(value, set) {
    if (set.has(value)) {
        throw new Error(`The value '${ value }' already exists in the set.`);
    }
}

/**
 * Determines if the given value already exists in the set.
 * @param {*} value The value to check for. 
 * @param {OrderedSet} set The map to check inside of.
 * @returns {void}
 * @throws {Error} If the value doesn't exist.
 */
function assertExists(value, set) {
    if (!set.has(value)) {
        throw new Error(`The value '${value}' does not exist.`);
    }
}


/**
 * Represents a list of unique values that can be accessed in order.
 */
class OrderedSet {

    /**
     * Creates a new instance.
     */
    constructor() {

        /**
         * Tracks the values that come after any given value.
         * @property nexts
         * @type Map
         * @private
         */
        this[nexts] = new Map();

        /**
         * Tracks the values that come before any given value.
         * @property prevs
         * @type Map
         * @private
         */
        this[prevs] = new Map();

        /**
         * Pointer to the first value in the set.
         * @property first
         * @type Map
         * @private
         */
        this[first] = undefined;

        /**
         * Pointer to the last value in the set.
         * @property last
         * @type Map
         * @private
         */
        this[last] = undefined;
    }

    /**
     * Returns the value that comes after the given value in the set.
     * @param {*} value The item to get the next value for.
     * @returns {*} The value that comes immediately after the given value or
     *      `undefined` if no such value exists. 
     */
    next(value) {
        return this[nexts].get(value);
    }

    /**
     * Searches forward in the set to find the first value that matches.
     * @param {Function} matcher The function to run on each value. The
     *      function must return `true` when the value matches. 
     * @param {*} start The value to start searching from.
     * @returns {*} The first matching value or `undefined` if no matches
     *      are found. 
     */
    findNext(matcher, start) {

        assertExists(start, this);

        let current = this.next(start);

        while (current) {
            if (matcher(current)) {
                return current;
            }

            current = this.next(current);
        }

        return undefined;
    }

    /**
     * Searches backward in the set to find the first value that matches.
     * @param {Function} matcher The function to run on each value. The
     *      function must return `true` when the value matches. 
     * @param {*} start The value to start searching from.
     * @returns {*} The first matching value or `undefined` if no matches
     *      are found. 
     */
    findPrevious(matcher, start) {

        assertExists(start, this);

        let current = this.previous(start);

        while (current) {
            if (matcher(current)) {
                return current;
            }

            current = this.previous(current);
        }

        return undefined;
    }

    /**
     * Returns the value that comes before the given value in the set.
     * @param {*} value The item to get the previous value for.
     * @returns {*} The value that comes immediately before the given value or
     *      `undefined` if no such value exists.
     */
    previous(value) {
        return this[prevs].get(value);
    }

    /**
     * Determines if the given value exists in the set.
     * @param {*} value The value to check for.
     * @returns {boolean} True if the value is found in the set, false if not. 
     */
    has(value) {
        return this[nexts].has(value);
    }

    /**
     * Adds a new value to the end of the set.
     * @param {*} value The value to add into the set.
     * @returns {void} 
     */
    add(value) {

        assertValidValue(value);
        assertNoDuplicates(value, this);

        // special case for first item
        if (this[first] === undefined) {
            this[first] = value;
            this[last] = value;
            this[nexts].set(value, undefined);
            this[prevs].set(value, undefined);
        } else {
            this[nexts].set(this[last], value);
            this[nexts].set(value, undefined);
            this[prevs].set(value, this[last]);
            this[last] = value;
        }

    }

    /**
     * Inserts a value after a given value that already exists in the set.
     * @param {*} value The value to insert.
     * @param {*} relatedValue The value after which to insert the new value.
     * @returns {void}
     * @throws {Error} If `value` is an invalid value for the set.
     * @throws {Error} If `value` already exists in the set.
     * @throws {Error} If `relatedValue` does not exist in the set.
     */
    insertAfter(value, relatedValue) {

        assertValidValue(value);
        assertNoDuplicates(value, this);
        assertExists(relatedValue, this);

        const curNext = this.next(relatedValue);
        this[nexts].set(relatedValue, value);
        this[nexts].set(value, curNext);
        this[prevs].set(curNext, value);
        this[prevs].set(value, relatedValue);

        // special case: relatedItem is the last item
        if (relatedValue === this[last]) {
            this[last] = value;
        }
    }

    /**
     * Inserts a value before a given value that already exists in the set.
     * @param {*} value The value to insert.
     * @param {*} relatedValue The value before which to insert the new value.
     * @returns {void}
     * @throws {Error} If `value` is an invalid value for the set.
     * @throws {Error} If `value` already exists in the set.
     * @throws {Error} If `relatedValue` does not exist in the set.
     */
    insertBefore(value, relatedValue) {

        assertValidValue(value);
        assertNoDuplicates(value, this);
        assertExists(relatedValue, this);

        const curPrev = this.previous(relatedValue);
        this[prevs].set(relatedValue, value);
        this[prevs].set(value, curPrev);
        this[nexts].set(value, relatedValue);
        
        // special case: relatedItem is the first item
        if (relatedValue === this[first]) {
            this[first] = value;
        } else {
            this[nexts].set(curPrev, value);
        }
    }

    /**
     * Removes a value from the set while ensuring the order remains correct.
     * @param {*} value The value to remove from the set.
     * @returns {void}
     * @throws {Error} If `value` is an invalid value for the set.
     * @throws {Error} If `value` already exists in the set.
     */
    delete(value) {

        assertValidValue(value);
        assertExists(value, this);

        // get the items currently before and after
        const curPrev = this.previous(value);
        const curNext = this.next(value);

        // check the list first and last pointers
        if (this[first] === value) {
            this[first] = curNext;
        }

        if (this[last] === value) {
            this[last] = curPrev;
        }

        // arrange pointers to skip over the item to remove
        if (curPrev !== undefined) {
            this[nexts].set(curPrev, curNext);
        }

        if (curNext !== undefined) {
            this[prevs].set(curNext, curPrev);
        }

        // officially remove the item
        this[prevs].delete(value);
        this[nexts].delete(value);
    }

    /**
     * Returns the number of values in the set.
     * @returns {int} The numbet of values in the set.
     */
    get size() {
        return this[nexts].size;
    }

    /**
     * Returns the first value in the set.
     * @returns {*} The first value in the set or `undefined` for an empty set.
     */
    first() {
        return this[first]; 
    }

    /**
     * Returns the last value in the set.
     * @returns {*} The last value in the set or `undefined` for an empty set.
     */
    last() {
        return this[last]; 
    }

    /**
     * Returns the default iterator for the set.
     * @returns {Iterator} The default iterator for the set.
     */
    [Symbol.iterator]() {
        return this.values();
    }

    /**
     * Returns an iterator over all of the values in the set.
     * @returns {Iterator} An iterator for the set.
     */
    *values() {

        let item = this[first];
        
        while (item) {
            yield item;
            item = this.next(item);
        }
    }

    /**
     * Returns an iterator over all of the values in the set going in reverse.
     * @returns {Iterator} An iterator for the set.
     */
    *reverse() {
        let item = this[last];

        while (item) {
            yield item;
            item = this.previous(item);
        }
    }

}

exports.OrderedSet = OrderedSet;
