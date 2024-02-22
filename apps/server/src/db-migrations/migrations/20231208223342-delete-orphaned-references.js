module.exports = {
  async up(db, client) {
    
    // remove any references in the fhirResource collection that point to a resource that doesn't exist
    let agg = [
      {
        $lookup: {
          from: 'fhirResource',
          localField: 'references.value',
          foreignField: '_id',
          as: 'result_fhir'
        }
      },
      {
        $lookup: {
          from: 'nonFhirResource',
          localField: 'references.value',
          foreignField: '_id',
          as: 'result_nonfhir'
        }
      },
      {
        $addFields: {
          referencesCount: { $cond: { if: { $isArray: "$references" }, then: { $size: "$references" }, else: 0} },
          resultFhirCount: { $cond: { if: { $isArray: "$result_fhir" }, then: { $size: "$result_fhir" }, else: 0} },
          resultNonFhirCount: { $cond: { if: { $isArray: "$result_nonfhir" }, then: { $size: "$result_nonfhir" }, else: 0} },
          result_all: {$concatArrays: ['$result_fhir', '$result_nonfhir']},
        }
      },
      {
        $addFields: {
          resultCount: {$add: ["$resultFhirCount", "$resultNonFhirCount"]},
          references_ids: {
            $map: {
              input: '$references',
              as: 'reference',
              in: '$$reference.value'
            }
          },
          result_all_ids: {
            $map: {
              input: '$result_all',
              as: 'reference',
              in: '$$reference._id'
            }
          }
        }
      },
      {
        $match: {
          $expr: {
            $ne: ['$referencesCount', '$resultCount']
          }
        }
      },
      {
        $addFields: {
          refs_in_both: {
            $setIntersection: ['$references_ids','$result_all_ids']
          }
        }
      },
      {
        $set: {
          references: {
            $filter: {
              input: '$references',
              as: 'reference',
              cond: {
                $in: ['$$reference.value', '$refs_in_both']
              },
            }
          }
        }
      },
      {
        $project: {
          _id: 1,
          references: 1
        }
      }
    ];
    
    let res = await db.collection('fhirResource').aggregate(agg).toArray();
    
    for (const item of res) {
      await db.collection('fhirResource').updateOne({_id: item._id}, {$set: {references: item.references}});
    }

    console.log(`Updated ${res.length} fhirResource documents`);

  },

  async down(db, client) {
    // no reversing needed for this
  }
};
