// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import db from '../../../utils/db'

import BatSignalComment from "../../../models/BatSignalComment"
//wasn't working when everything was lowercase, had to be IndividualPosts not individualNames for it to work

export default async function handler(req, res) {
    const {method} = req;

    await db.connect();

    if(method === "GET") {
        try {
            const batSignalComment = await BatSignalComment.find()
            .populate({path:"createdby", select:["name","profilename","profileimage"]})
          
            // .sort({_id:-1});
            //this way we get the most recent posts first, we use id since mongoDB's objectID has a 4 byte timestamp naturally built in 
            res.status(200).json(batSignalComment);

          
          } catch (err) {
            res.status(500).json(err);
          }
        
          // try {
          //   const names = await individualNames.find();
          //   res.status(200).json(individualNames);
            
          // } catch (err) {
          //   res.status(500).json(err);
          // }

    }


    if(method ==="PUT"){    
      try {
             const batSignalComment= await BatSignalComment.find()
             res.status(201).json(batSignalComment)
      } 
      catch(err){
          res.status(500).json(err)
          console.log(err)
      }
  }



    if(method ==="POST"){    
      const { image, parentcommentid, description, createdby, postid } = req.body;
    
      if (
        !description||
        !postid||  
        !createdby
      ) {
        res.status(422).json({
          message: 'Validation error',
        });
        return;
      }
    
                 
      const newComment = new BatSignalComment({
        image,
        parentcommentid,
        description,
        postid,
        createdby,
         });
    
      const comment = await newComment.save();
       //create new user with .save from mongoose
      
      await db.disconnect();
       //disconnect from database then send a successful response
    
      res.status(201).send({
        message: 'Created post!',
    
        _id: comment._id,
        image: comment.image,
        parentcommentid: comment.parentcommentid,
        description: comment.description,
        postid: comment.postid,
       createdby: comment.createdby,
        
      });
      
    
  }
}