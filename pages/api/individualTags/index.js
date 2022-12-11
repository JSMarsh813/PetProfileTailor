// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import dbConnect from "../../../config/mongo"

import IndividualTags from "../../../models/individualTags"
//wasn't working when everything was lowercase, had to be IndividualNames not individualNames for it to work

export default async function handler(req, res) {
    const {method} = req;

    dbConnect() //from config/mongo.js

    if(method === "GET") {
        try {
            const individualTags = await IndividualTags.find();
            res.status(200).json(individualTags);
            
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


    if(method ==="POST"){    
        try {
               const test= await IndividualTags.create(req.body)
               res.status(201).json(test)
        } 
        catch(err){
            res.status(500).json(err)
        }
    }
  }
  