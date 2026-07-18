import assert from "node:assert/strict";
import test from "node:test";

import {
  decrementCounterCache,
  incrementCounterCache,
  isLastCounterMutation,
} from "./counter-cache.ts";

test("out-of-order successes preserve every optimistic increment", () => {
  let counter = { count: 41 };

  counter = incrementCounterCache(counter);
  counter = incrementCounterCache(counter);
  counter = incrementCounterCache(counter);

  // Success responses intentionally do not replace the optimistic cache. A
  // response for the first click may arrive after the third click's response.
  assert.deepEqual(counter, { count: 44 });
});

test("a failed concurrent increment rolls back only that increment", () => {
  let counter = { count: 41 };

  counter = incrementCounterCache(counter);
  counter = incrementCounterCache(counter);
  counter = incrementCounterCache(counter);
  counter = decrementCounterCache(counter);

  assert.deepEqual(counter, { count: 43 });
});

test("only the final mutation triggers authoritative reconciliation", () => {
  assert.equal(isLastCounterMutation(3), false);
  assert.equal(isLastCounterMutation(2), false);
  assert.equal(isLastCounterMutation(1), true);
});
