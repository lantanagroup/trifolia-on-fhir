module.exports = {
  async up(db, client) {
    // Rename the "targetId" property to "current" in the history collection
    let results = await db.collection('history').updateMany(
      { targetId: { $exists: true, $ne : null } },
      {
        $rename: { targetId: 'current' },
      }
    );

    console.log(
      `Renamed "targetId" to "current" for ${results.modifiedCount} resources in the "history" collection`
    );

    // Sets "current" ObjectId  to an ProjectResourceReference object
    results = await db
      .collection('history')
      .updateMany({ 'current': { $exists: true,  $ne : null} }, [
        {
          $set: {
            current: {
              value: '$current',
              valueType: {
                $switch: {
                  branches: [
                    {
                      case: {
                        $eq: ["$type", "conformance"],
                      },
                      then: "FhirResource",
                    },
                    {
                      case: {
                        $eq: ["$type", "example"],
                      },
                      then: "NonFhirResource",
                    },
                  ],
                  default: "BadData",
                },
              },
              _id: '$_id',
            }
          }
        },
      ]);


    console.log(
      `Updated "current" ObjectId to ProjectResourceReference object for ${results.modifiedCount} Resources  in the "history" collection`
    );

    // unset type
    results = await db
      .collection('history')
      .updateMany({ 'current': { $exists: true }},
        {
          $unset: {
            type: '',
          },
        }
      );


    console.log(
      `Removed type for ${results.modifiedCount} resources in the "history" collection`
    );
  },

  async down(db, client) {
    // Sets "referencedBy" array of ProjectResourceReference objects to an ObjectId array
    let results = await db
      .collection('history')
      .updateMany({ 'current.value': { $exists: true }, 'current.valueType' : 'FhirResource' }, [
        {
          $set: {
            current: '$current.value',
            type: 'conformance'
          },
        },
      ]);

    console.log(
      `Updated "type" for FhirResource objects to conformance for ${results.modifiedCount} resources in the "history" collection.`
    );

    results = await db
      .collection('history')
      .updateMany({ 'current.value': { $exists: true }, 'current.valueType' : 'NonFhirResource' }, [
        {
          $set: {
            current: '$current.value',
            type: 'example'
          },
        },
      ]);

    console.log(
      `Updated "type" for NonFhirResource objects to example for ${results.modifiedCount} resources in the "history" collection.`
    );

    // Rename the "current" property to "targetId" in the fhirResource collection
    results = await db.collection('history').updateMany(
      { current: { $exists: true } },
      {
        $rename: { current: 'targetId' },
      }
    );

    console.log(
      `Renamed "current" to "targetId" for ${results.modifiedCount} resources in the "history" collection`
    );
  },
};
