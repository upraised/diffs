'use strict';
/*eslint-disable no-shadow, handle-callback-err */

var chai = require('chai');
var assert = chai.assert;

import { applyDiff, applyDiffMutate, computeDiff } from '../dist';

describe('diff', () => {

  it('should compute simple diffs', () => {
    assert.equal(computeDiff(4, 4), undefined);
    assert.equal(computeDiff(4, 5), 5);
    assert.equal(computeDiff([4], 5), 5);
    assert.deepEqual(computeDiff(4, [5]), [5]);
    assert.equal(computeDiff(4, undefined), null);
    assert.deepEqual(computeDiff(4, {x: 1}), {x: 1});
    assert.equal(computeDiff({x: 1}, 5), 5);
    assert.equal(computeDiff({x: 1}, undefined), null);
    assert.equal(computeDiff([1], [1]), undefined);
    assert.deepEqual(computeDiff([1], [2]), [2]);
  });

  it('should compute object diffs', () => {
    assert.deepEqual(computeDiff({x: 1}, {x: 1}), undefined);
    assert.deepEqual(computeDiff({x: 1}, {x: 2}), {x: 2});
    assert.deepEqual(computeDiff({x: 1, y: 2}, {x: 2}), {x: 2, y: null});
  });

  it('should apply diffs', () => {
    assert.equal(applyDiff(4, undefined), 4);
    assert.equal(applyDiff(undefined, undefined), undefined);
    assert.equal(applyDiff(undefined, 5), 5);
    assert.equal(applyDiff(6, 5), 5);
    assert.equal(applyDiff({x: 1}, 5), 5);
    assert.deepEqual(applyDiff(undefined, {x: 1}), {x: 1});
    assert.deepEqual(applyDiff(undefined, {x: {y: 1}}), {x: {y: 1}});
    assert.deepEqual(applyDiff({a: 2}, {x: {y: 1}}), {a: 2, x: {y: 1}});
  });

  function testDiff(val0, val1) {
    var desc = JSON.stringify(val0) + ' => ' + JSON.stringify(val1);
    var diff = computeDiff(val0, val1);
    assert.deepEqual(applyDiff(val0, diff), val1, desc);

    [val1, val0] = [val0, val1];
    var desc = JSON.stringify(val0) + ' => ' + JSON.stringify(val1);
    var diff = computeDiff(val0, val1);
    assert.deepEqual(applyDiff(val0, diff), val1, desc);

    applyDiffMutate(val0, diff);
    assert.deepEqual(val0, val1, "mutated in place");
  }

  it('should compute and reply diffs', () => {

    // from object to object

    testDiff({y: 2}, {x: 5});
    testDiff({y: 2, x: 5}, {x: 5});
    testDiff({y: 2}, {y: 2, x: 5});

    // from object to object with nulls

    testDiff({y: 2}, {x: null});
    testDiff({y: 2, x: 5}, {y: null, x: 5});
    testDiff({y: null}, {y: null, x: 5});

    // from object to nested object

    testDiff({y: 2}, {x: {a: 1}});
    testDiff({y: 2, x: 5}, {x: {a: 1}});
    testDiff({y: 2}, {y: {a: 1}, x: 5});

    // from nested object to object

    testDiff({y: {a: 1}}, {x: 5});
    testDiff({y: {a: 1}, x: 5}, {x: 5});
    testDiff({y: {a: 1}}, {y: 2, x: 5});

    // from nested object to nested object

    testDiff({y: {a: 2, b: 3}}, {y: {a: 2, b: 4}, x: 5});
    testDiff({y: {a: 2, b: 3}}, {y: {a: 2}, x: 5});
    testDiff({y: {a: 2, b: 3}}, {y: {}, x: 5});


  });
});


