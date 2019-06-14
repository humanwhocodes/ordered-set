/**
 * @fileoverview Tests for OrderedSet.
 * @author Nicholas C. Zakas
 */

"use strict";

//-----------------------------------------------------------------------------
// Requirements
//-----------------------------------------------------------------------------

const { OrderedSet } = require("../src/ordered-set");
const assert = require("chai").assert;

//-----------------------------------------------------------------------------
// Helpers
//-----------------------------------------------------------------------------

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

//-----------------------------------------------------------------------------
// Tests
//-----------------------------------------------------------------------------

describe("OrderedSet", () => {

    const item ="a";
    const item2 = "b";
    const item3 = "c";
    let set;

    beforeEach(() => {
        set = new OrderedSet();
    });

    describe("add()", () => {

        it("adds a new item when passed one item", () => {
            const result = [item];

            set.add(item);

            assertOrder(set, result);
        });
        
        it("adds new items when passed multiple items", () => {
            const result = [item, item2, item3];

            set.add(item);
            set.add(item2);
            set.add(item3);

            assertOrder(set, result);
        });

        it("throws an error when undefined is passed", () => {
            assert.throws(() => {
                set.add(undefined);
            }, /null or undefined/);
        });

        it("throws an error when null is passed", () => {
            assert.throws(() => {
                set.add(null);
            }, /null or undefined/);
        });

        it("throws an error when a duplicate value is passed", () => {
            set.add(1);
            assert.throws(() => {
                set.add(1);
            }, /already exists/);
        });
    });

    describe("has()", () => {
        it("should return false when the set is empty", () => {
            assert.isFalse(set.has(2));
        });

        it("should return false when the value isn't found", () => {
            set.add(1);

            assert.isFalse(set.has(2));
        });

        it("should return true when the value is found", () => {
            set.add(1);

            assert.isTrue(set.has(1));
        });
    });

    describe("delete()", () => {

        it("removes an item from a one-item list", () => {
            const result = [];

            set.add(item);
            set.delete(item);

            assertOrder(set, result);
        });
        
        it("removes an item from the middle of a list", () => {
            const result = [item, item3];

            set.add(item);
            set.add(item2);
            set.add(item3);

            set.delete(item2);

            assertOrder(set, result);
        });

        it("removes an item from the end of a list", () => {
            const result = [item, item2];

            set.add(item);
            set.add(item2);
            set.add(item3);

            set.delete(item3);

            assertOrder(set, result);
        });

        it("throws an error when undefined is passed", () => {
            assert.throws(() => {
                set.delete(undefined);
            }, /null or undefined/);
        });

        it("throws an error when null is passed", () => {
            assert.throws(() => {
                set.delete(null);
            }, /null or undefined/);
        });

        it("throws an error when a value not in the set is passed", () => {
            assert.throws(() => {
                set.delete("a");
            }, /The value 'a' does not exist/);
        });
    });

    describe("insertBefore()", () => {

        it("inserts an item at the start", () => {
            const result = [item2, item];

            set.add(item);
            set.insertBefore(item2, item);

            assertOrder(set, result);
        });
        
        it("inserts an item in the middle", () => {
            const result = [item, item2, item3];

            set.add(item);
            set.add(item3);
            set.insertBefore(item2, item3);
            
            assertOrder(set, result);
        });

        it("throws an error when undefined is passed", () => {
            set.add(item);

            assert.throws(() => {
                set.insertBefore(undefined, item);
            }, /null or undefined/);
        });

        it("throws an error when null is passed", () => {
            set.add(item);

            assert.throws(() => {
                set.insertBefore(null, item);
            }, /null or undefined/);
        });
    });

    describe("insertAfter()", () => {

        it("inserts an item in the middle", () => {
            const result = [item, item2, item3];

            set.add(item);
            set.add(item3);
            set.insertAfter(item2, item);
            
            assertOrder(set, result);
        });

        it("inserts an item at the end", () => {
            const result = [item, item2];

            set.add(item);
            set.insertAfter(item2, item);
            
            assertOrder(set, result);
        });

        it("throws an error when undefined is passed", () => {
            set.add(item);

            assert.throws(() => {
                set.insertAfter(undefined, item);
            }, /null or undefined/);
        });

        it("throws an error when null is passed", () => {
            set.add(item);

            assert.throws(() => {
                set.insertAfter(null, item);
            }, /null or undefined/);
        });
    });

    describe("findNext()", () => {

        beforeEach(() => {
            set.add(1);
            set.add(2);
            set.add(3);
        });

        it("should throw an error when the second argument is missing", () => {
            assert.throws(() => {
                set.findNext(value => value > 1);
            }, /does not exist/);
        });

        it("should throw an error when the second argument is not in the set", () => {
            assert.throws(() => {
                set.findNext(value => value > 1, 5);
            }, /does not exist/);
        });

        it("should find the next matching item when start is set", () => { 
            const result = set.findNext(value => value > 1, 2);

            assert.strictEqual(result, 3);
        });

        it("should return undefined when the value isn't found", () => { 
            const result = set.findNext(value => value > 4, 1);

            assert.isUndefined(result);
        });

    });

    describe("findPrevious()", () => {

        beforeEach(() => {
            set.add(1);
            set.add(2);
            set.add(3);
            set.add(4);
            set.add(5);
        });

        it("should throw an error when the second argument is missing", () => { 
            assert.throws(() => {
                set.findPrevious(value => value > 1);
            }, /does not exist/);
        });

        it("should throw an error when the second argument is not in the set", () => { 
            assert.throws(() => {
                set.findPrevious(value => value > 1, 10);
            }, /does not exist/);
        });

        it("should find the next matching item when start is set", () => { 
            const result = set.findPrevious(value => value < 3, 5);
            assert.strictEqual(result, 2);
        });

        it("should return undefined when the value isn't found", () => { 
            const result = set.findPrevious(value => value > 4, 3);
            assert.isUndefined(result);
        });

    });

});
