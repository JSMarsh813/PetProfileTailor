// scrapped since populate will fail when there empty comment arrays

// import db from '../../../../utils/db'
// const mongoose = require('mongoose');
// import Name from "../../../../models/Names"

// export default async function handler(req, res) {
//     const {method} = req;

//     await db.connect();

//     if(method ==="PUT"){

//         console.log(`this is req body ${JSON.stringify(req.body)}`)

//      const {
//       commentid,
//       nameid} =req.body.commentIdToNameDoc

//      console.log(`this is commentid ${commentid}`)

//       try {
//              const toUpdateName = await Name.findOneAndUpdate({"_id":nameid},
//                 {$push: {comments:commentid}})
//              console.log(toUpdateName)

//          await toUpdateName.save();
//          await db.disconnect();

//          res.send({
//               message: 'Comment added to name listing',
//           });

//       }
//       catch(err){
//           res.status(500).json(err)
//           console.log(err)
//       }
//   }

// }
