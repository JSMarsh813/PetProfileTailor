//get request
 //filter names so it only includes names which have the userid
    //names.filter(name=>name.likedby.includes(userId))

    // Next.js API route support: https://nextjs.org/docs/api-routes/introduction
    import dbConnect from "../../../../config/connectmongodb"
    // const ObjectId = require('mongoose').Types.ObjectId; 
    import Users from "../../../../models/User"
    //wasn't working when everything was lowercase, had to be IndividualNames not individualNames for it to work
    
    export default async function handler(req, res) {
        // const userId =ObjectId(req.query.id) 
        const method= req.method;
      console.log(req.method)
      //{ id: '63a90c2e83e6366b179ffc40' }
      console.log(req.query.id)
      //63a90c2e83e6366b179ffc40
    //   console.log(userId)
      //new ObjectId("63a90c2e83e6366b179ffc40")

        dbConnect() //from config/mongo.js
    
        if(method === "GET") {
            try {
                const user = await Users.findById(new ObjectId(req.query.id))  
                res.status(200).json(user);
                
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
    
    }