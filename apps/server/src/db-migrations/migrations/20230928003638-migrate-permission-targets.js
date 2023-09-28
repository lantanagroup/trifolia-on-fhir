module.exports = {
  async up(db, client) {

    // updates permissions on projects
    // targetId is converted to ObjectId
    // type is converted to 'User' or 'Group' if it is 'user' or 'group'
    // grant is left as is

    let res = await db.collection('project').updateMany(
      {
        'permissions.0': { $exists: true },
      },
      [
        {
          $set: {
            permissions: {
              $map: {
                input: '$permissions',
                as: 'permission',
                in: {
                  target: {
                    $toObjectId: '$$permission.targetId',
                  },
                  type: {
                    $switch: {
                      branches: [
                        {
                          case: {
                            $in: ['$$permission.type', ['user']],
                          },
                          then: 'User',
                        },
                        {
                          case: {
                            $in: ['$$permission.type', ['group']],
                          },
                          then: 'Group',
                        },
                      ],
                      default: '$$permission.type',
                    },
                  },
                  grant: '$$permission.grant',
                },
              },
            },
          },
        },
      ]
    );

    console.log(`Modified permissions for ${res.modifiedCount} projects.`);

  },

  async down(db, client) {
    
    let res = await db.collection('project').updateMany(
      {
        "permissions.0": { $exists: true }
      },
      [
        {
          $set: {
            permissions: {
              $map: {
                input: "$permissions",
                as: "permission",
                in: {
                  targetId: {
                    $toString:
                      "$$permission.target",
                  },
                  type: {
                    $switch: {
                      branches: [
                        {
                          case: {
                            $in: [
                              "$$permission.type",
                              ["User"],
                            ],
                          },
                          then: "user",
                        },
                        {
                          case: {
                            $in: [
                              "$$permission.type",
                              ["Group"],
                            ],
                          },
                          then: "group",
                        },
                      ],
                      default: "$$permission.type",
                    },
                  },
                  grant: "$$permission.grant",
                },
              },
            },
          },
        }
      ]
      );

      console.log(`Modified permissions for ${res.modifiedCount} projects.`);
  },
};
