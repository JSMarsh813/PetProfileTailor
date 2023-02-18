import dbConnect from "../../../config/connectmongodb"
import Category from "../../../models/nameCategory" 
import NameTag from '../../../models/NameTag'

export default async function handler(req, res) {
    const {method} = req;

    dbConnect()

    if(method === "GET") {
        try {
            const category = 
            await Category.find()
            .populate(
              "tags"
              )
            res.status(200).json(category);
            
          } catch (err) {
            res.status(500).json(err);
          }
      }



    if(method ==="POST"){    
        try {
               const test= await Category.create(req.body)
               res.status(201).json(test)
        } 
        catch(err){
            res.status(500).json(err)
        }
    }
  }
  