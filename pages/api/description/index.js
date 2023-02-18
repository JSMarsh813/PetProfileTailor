// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import dbConnect from "../../../config/connectmongodb"
const mongoose = require('mongoose');
import Description from "../../../models/description"
//wasn't working when everything was lowercase, had to be IndividualNames not individualNames for it to work

export default async function handler(req, res) {
    const {method} = req;

    dbConnect() //from config/mongo.js

    if(method === "GET") {
        try {
            const descriptions = await Description.find()
            .populate({path:"createdby", select:["name","profilename","profileimage"]});

            res.status(200).json(descriptions);
            
          } catch (err) {
            res.status(500).json(err);
          }
        
      
    }


    if(method ==="PUT"){    
         const {description,
          notes,
          tags,
          descriptionId
        } =req.body.descriptionSubmission
    
               
      const toUpdateDescription = await Description.findById(descriptionId);
     console.log(toUpdateDescription)
      try {
     
        if (notes){
          toUpdateDescription.notes =notes;  
        }
      toUpdateDescription.description =description
     
      toUpdateDescription.tags=tags;
  
      await toUpdateDescription.save();
      // await db.disconnect();
      res.send({
        message: 'Description Updated',
      });
          } 
        
      catch(err){
              res.status(500).json(err)
             
          }
      
  }



    if(method ==="POST"){    
        try {

          
               const test= await Description.create(req.body)
               res.status(201).json(test)
        } 
        catch(err){
            res.status(500).json(err)
           
        }
    }

    
  if(method ==="DELETE"){    
    try {
      console.log(`request body is ${JSON.stringify(req.body.itemId)}`)

      let idToObjectId = mongoose.Types.ObjectId(req.body.itemId)
      
           const test= await Description.deleteOne(
            {_id:idToObjectId}
            )

           res.status(200).json({
             success: true,
              msg: `Description Deleted ${test}` })
    } 
    catch(err){
        res.status(500).json(err)
       
    }
}

  }
  