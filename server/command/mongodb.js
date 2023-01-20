/* HERE IS LIST OF MONGODB COMMANDS

Script to check duplicate post on different post type

db.posts.aggregate([
  { $lookup: {
      from: "posttypes",
      localField: "postType",
      foreignField: "_id",
      as: "post_status" },
  }, 
  { $group: {
    _id: "$postType",
    post_status: {$first: '$post_status'},
    count: { $count: { } }
  }}
])

*/