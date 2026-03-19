import test from 'node:test';
import assert from 'node:assert/strict';
import {
  applyClaimStatusEffects,
  isValidClaimStatusTransition,
} from '../utils/claimStatusRules.js';

test('valid claim status transitions', () => {
  assert.equal(isValidClaimStatusTransition('pending', 'processing'), true);
  assert.equal(isValidClaimStatusTransition('processing', 'paid'), true);
  assert.equal(isValidClaimStatusTransition('pending', 'rejected'), true);
});

test('invalid claim status transitions', () => {
  assert.equal(isValidClaimStatusTransition('paid', 'processing'), false);
  assert.equal(isValidClaimStatusTransition('rejected', 'paid'), false);
  assert.equal(isValidClaimStatusTransition('unknown', 'pending'), false);
});

test('apply status effects for paid transition', () => {
  const claim = { amount: 30, points: 25 };
  const user = { totalEarnings: 70, points: 120, claimedMilestones: [25] };

  applyClaimStatusEffects({
    previousStatus: 'processing',
    nextStatus: 'paid',
    claim,
    user,
  });

  assert.equal(user.totalEarnings, 100);
  assert.equal(user.points, 120);
  assert.deepEqual(user.claimedMilestones, [25]);
});

test('apply status effects for rejected transition', () => {
  const claim = { amount: 30, points: 25 };
  const user = { totalEarnings: 100, points: 95, claimedMilestones: [10, 25] };

  applyClaimStatusEffects({
    previousStatus: 'processing',
    nextStatus: 'rejected',
    claim,
    user,
  });

  assert.equal(user.totalEarnings, 100);
  assert.equal(user.points, 120);
  assert.deepEqual(user.claimedMilestones, [10]);
});
