// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import dbConnect from "../../../config/connectmongodb"

import IndividualPosts from "../../../models/posts"
//wasn't working when everything was lowercase, had to be IndividualPosts not individualNames for it to work

export default async function handler(req, res) {
    const {method} = req;
  

    dbConnect() //from config/mongo.js

    if(method === "GET") {
        try {
            const individualPosts = await IndividualPosts.find()
            .populate({path:"createdby", select:["name","profilename","profileimage"]})
            .populate({path:"comments"})
            .sort({_id:-1});
            //this way we get the most recent posts first, we use id since mongoDB's objectID has a 4 byte timestamp naturally built in 
            res.status(200).json(individualPosts);

          
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
             const test= await IndividualPosts.find({postid})
             res.status(201).json(test)
      } 
      catch(err){
          res.status(500).json(err)
          console.log(err)
      }
  }



    if(method ==="POST"){    
        try {
               const test= await IndividualPosts.create(req.body)
               res.status(201).json(test)
        } 
        catch(err){
            res.status(500).json(err)
           
        }
    }
  }
  