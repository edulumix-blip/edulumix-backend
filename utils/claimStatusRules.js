export const ALLOWED_CLAIM_STATUS_TRANSITIONS = {
  pending: new Set(['pending', 'processing', 'paid', 'rejected']),
  processing: new Set(['processing', 'paid', 'rejected']),
  paid: new Set(['paid']),
  rejected: new Set(['rejected']),
};

export const isValidClaimStatusTransition = (fromStatus, toStatus) => {
  const allowedNext = ALLOWED_CLAIM_STATUS_TRANSITIONS[fromStatus];
  return Boolean(allowedNext && allowedNext.has(toStatus));
};

export const applyClaimStatusEffects = ({ previousStatus, nextStatus, claim, user }) => {
  if (previousStatus === nextStatus) return;

  if (previousStatus !== 'paid' && nextStatus === 'paid') {
    user.totalEarnings += claim.amount;
  } else if (previousStatus === 'paid' && nextStatus !== 'paid') {
    user.totalEarnings = Math.max(0, user.totalEarnings - claim.amount);
  }

  if (previousStatus !== 'rejected' && nextStatus === 'rejected') {
    user.points += claim.points;
    if (user.claimedMilestones) {
      user.claimedMilestones = user.claimedMilestones.filter((m) => m !== claim.points);
    }
  } else if (previousStatus === 'rejected' && nextStatus !== 'rejected') {
    user.points = Math.max(0, user.points - claim.points);
    if (!user.claimedMilestones) user.claimedMilestones = [];
    if (!user.claimedMilestones.includes(claim.points)) {
      user.claimedMilestones.push(claim.points);
    }
  }
};
