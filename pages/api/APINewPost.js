import React from 'react'
import Posts from '../../models/posts'
import db from '../../utils/db'

function APINewPost({image, title, description, tagList,posteruserid } ) {
  return (
    <div>APINewPost</div>
  )
}

export default APINewPost



// async function handler(req, res) {
//   if (req.method !== 'POST') {
//     return;
//   }
//   const { image, title, description, tagList,posteruserid } = req.body;

//   if (
//     !description||
//     !tagList||  
//     !postuserid
//   ) {
//     res.status(422).json({
//       message: 'Validation error',
//     });
//     return;
//   }

//   await db.connect();
//           
//   const newPost = new Post({
//     image,
//     title,
//     description,
//     tagList,
//     posteruserid,
//      });

//   const post = await newPost.save();
//    //create new user with .save from mongoose
  
//   await db.disconnect();
//    //disconnect from database then send a successful response

//   res.status(201).send({
//     message: 'Created post!',

//     _id: post._id,
//     image: post.image,
//     title: post.title,
//     description: post.description,
//      tagList: post.tagList,
//    posteruserid: post.posteruserid,
    
//   });

  
// }

// export default handler;
