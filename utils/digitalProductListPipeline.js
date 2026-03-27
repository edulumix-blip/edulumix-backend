import User from '../models/User.js';

function usersCollectionName() {
  return User.collection.collectionName || 'users';
}

/** Non-seed products first (user / pre-uploaded), then edulumix-digital-seed-* batch. */
export function digitalProductSortAndPaginateStages(skip, limit) {
  const stages = [
    {
      $addFields: {
        _isSeed: {
          $cond: [
            {
              $regexMatch: {
                input: { $ifNull: ['$externalId', ''] },
                regex: '^edulumix-digital-seed-',
              },
            },
            1,
            0,
          ],
        },
      },
    },
    { $sort: { _isSeed: 1, createdAt: -1 } },
  ];
  if (typeof skip === 'number' && skip > 0) stages.push({ $skip: skip });
  if (typeof limit === 'number' && limit > 0) stages.push({ $limit: limit });
  return stages;
}

export function digitalProductPostedByLookup(userProject) {
  return [
    {
      $lookup: {
        from: usersCollectionName(),
        localField: 'postedBy',
        foreignField: '_id',
        as: '_postedByUser',
        pipeline: [{ $project: userProject }],
      },
    },
    { $set: { postedBy: { $arrayElemAt: ['$_postedByUser', 0] } } },
    { $unset: ['_postedByUser', '_isSeed'] },
  ];
}
