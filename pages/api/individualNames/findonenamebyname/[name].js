    // Next.js API route support: https://nextjs.org/docs/api-routes/introduction
    import dbConnect from "../../../../config/connectmongodb"

    import IndividualNames from "../../../../models/individualNames"
    //wasn't working when everything was lowercase, had to be IndividualNames not individualNames for it to work
    
    export default async function handler(req, res) {
        const name =req.query.name  
        const method= req.method;
    
        dbConnect() //from config/mongo.js
    
        if(method === "GET") {
            try {
                const individualNames = await IndividualNames.find({name:name}).populate({path:"createdby", select:["name","profilename","profileimage"]});          
                res.status(200).json(individualNames);
                
              } catch (err) {
                res.status(500).json(err);
              }
            
    
        }
    
    }