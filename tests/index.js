/**
 * @fileoverview Tests for OrderedWeakSet.
 * @author Nicholas C. Zakas
 */

"use strict";

const OrderedSet = require("../src/index.js");
const assert = require("chai").assert;


describe("OrderedSet", () => {

    describe("add()", () => {

        const item ="a";
        const item2 = "b";
        const item3 = "c";

        it("adds a new item when passed one item", () => {
            const set = new OrderedSet();
            set.add(item);
            assert.strictEqual(set.size, 1);
            assert.strictEqual([...set][0], item);
        });
        
        it("adds new items when passed multiple items", () => {
            const set = new OrderedSet();
            set.add(item);
            set.add(item2);
            set.add(item3);
            assert.strictEqual(set.size, 3);
            assert.deepStrictEqual([...set], [ item, item2, item3 ]);

        });
    });

    describe("insertAfter()", () => {

        const item ="a";
        const item2 = "b";
        const item3 = "c";

        it("inserts an item at the end", () => {
            const set = new OrderedSet();
            set.add(item);
            set.insertAfter(item2, item);
            assert.strictEqual(set.size, 2);
            assert.strictEqual([...set][0], item);
            assert.strictEqual([...set][1], item2);
        });
        
        it("inserts an item in the middle", () => {
            const set = new OrderedSet();
            set.add(item);
            set.add(item3);
            set.insertAfter(item2, item);
            assert.strictEqual(set.size, 3);
            assert.deepStrictEqual([...set], [ item, item2, item3 ]);

        });
    });

});