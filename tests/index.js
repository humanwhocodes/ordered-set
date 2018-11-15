/**
 * @fileoverview Tests for OrderedWeakSet.
 * @author Nicholas C. Zakas
 */

"use strict";

const OrderedSet = require("../src/index.js");
const assert = require("chai").assert;

/**
 * Asserts that the contents of the OrderedSet exactly match
 * an array of results, backwards and forwards.
 * 
 * @param {OrderedSet} set The set to check.
 * @param {Array} result The expected contents of the set.
 * @throws {AssertionError} If the set contents don't match the result.
 * @returns {void}
 */
function assertOrder(set, result) {
    assert.strictEqual(set.size, result.length);
    assert.strictEqual(set.first(), result[0]);
    assert.strictEqual(set.last(), result[result.length - 1]);
    assert.deepStrictEqual([...set], result);
    assert.deepStrictEqual([...set.reverse()], result.reverse());
}

describe("OrderedSet", () => {

    describe("add()", () => {

        const item ="a";
        const item2 = "b";
        const item3 = "c";

        it("adds a new item when passed one item", () => {
            const set = new OrderedSet();
            const result = [item];

            set.add(item);

            assertOrder(set, result);
        });
        
        it("adds new items when passed multiple items", () => {
            const set = new OrderedSet();
            const result = [item, item2, item3];

            set.add(item);
            set.add(item2);
            set.add(item3);

            assertOrder(set, result);
        });
    });

    describe("insertBefore()", () => {

        const item ="a";
        const item2 = "b";
        const item3 = "c";

        it("inserts an item at the start", () => {
            const set = new OrderedSet();
            const result = [item2, item];

            set.add(item);
            set.insertBefore(item2, item);

            assertOrder(set, result);
        });
        
        it("inserts an item in the middle", () => {
            const set = new OrderedSet();
            const result = [item, item2, item3];

            set.add(item);
            set.add(item3);
            set.insertBefore(item2, item3);
            
            assertOrder(set, result);
        });
    });

    describe("insertAfter()", () => {

        const item ="a";
        const item2 = "b";
        const item3 = "c";

        it("inserts an item in the middle", () => {
            const set = new OrderedSet();
            const result = [item, item2, item3];

            set.add(item);
            set.add(item3);
            set.insertAfter(item2, item);
            
            assertOrder(set, result);
        });

        it("inserts an item at the end", () => {
            const set = new OrderedSet();
            const result = [item, item2];

            set.add(item);
            set.insertAfter(item2, item);
            
            assertOrder(set, result);
        });
        
    });

});