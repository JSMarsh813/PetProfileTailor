// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import dbConnect from "../../../config/connectmongodb"
import DescriptionTag from "../../../models/descriptiontag"

export default async function handler(req, res) {
    const {method} = req;
  
    dbConnect() //from config/mongo.js

    if(method === "GET") {
        try {
            const descriptiontag= await DescriptionTag.find()
       
            res.status(200).json(descriptiontag);
            
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

  //   if(method === "PUT") {
  //     try {
  //         const category = await Category.find();
  //         res.status(200).json(category);
          
  //       } catch (err) {
  //         res.status(500).json(err);
  //       }
      
  //       // try {
  //       //   const names = await individualNames.find();
  //       //   res.status(200).json(individualNames);
          
  //       // } catch (err) {
  //       //   res.status(500).json(err);
  //       // }

  // }


    if(method ==="POST"){    
        try {
               const descriptiontag= await DescriptionTag.create(req.body)
               console.log(descriptiontag)
               res.status(201).json(descriptiontag)
        } 
        catch(err){
            res.status(500).json(err)
        }
    }
  }
  