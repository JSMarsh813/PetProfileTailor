// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import db from '../../../utils/db'
const mongoose = require('mongoose');
import NameComment from "../../../models/namecomment"
//wasn't working when everything was lowercase, had to be IndividualPosts not individualNames for it to work

export default async function handler(req, res) {
    const {method} = req;

    await db.connect();

    if(method === "GET") {
        try {
            const nameComment = await NameComment.find()
            .populate({path:"createdby", select:["name","profilename","profileimage"]})
          
            // .sort({_id:-1});
            //this way we get the most recent posts first, we use id since mongoDB's objectID has a 4 byte timestamp naturally built in 
            res.status(200).json(nameComment);

          
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
      
     const {
      description,
      commentId} =req.body.commentSubmission

 console.log(req.body.commentSubmission)

      try {
             const toUpdateNameComment= await NameComment.findById(commentId)
            

             toUpdateNameComment.description=description

             
         await toUpdateNameComment.save();
         await db.disconnect();
        //  res.status(201).json(toUpdateNameComment)
         res.send({
              message: 'Comment updated',
          });

      } 
      catch(err){
          res.status(500).json(err)
          console.log(err)
      }
  }



    if(method ==="POST"){    
      const { image, description, createdby, nameid } = req.body;
       console.log(req.body)
      if (
        !description||
        !nameid||  
        !createdby
      ) {
        res.status(422).json({
          message: 'Validation error',
        });
        return;
      }
    
                 
      const newComment = new NameComment({
        image,
        description,
        nameid,
        createdby,
         });
    
      const comment = await newComment.save();
       //create new user with .save from mongoose
      
      await db.disconnect();
       //disconnect from database then send a successful response
    
      res.status(201).send({
        message: 'Created comment!',
    
        _id: comment._id,
        image: comment.image,   
        description: comment.description,
        nameid: comment.nameid,
       createdby: comment.createdby,
        
      });
      
    
  }

  if(method ==="DELETE"){    
    try {
      console.log(`request body is ${JSON.stringify(req.body.commentId)}`)

      let idToObjectId = mongoose.Types.ObjectId(req.body.commentId)
           const test= await NameComment.deleteOne({_id:idToObjectId})
           res.status(200).json({ success: true, msg: `Comment Deleted ${test}` })
    } 
    catch(err){
        res.status(500).json(err)
       
    }
}


}