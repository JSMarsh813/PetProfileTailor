import Individualname from '../../../models/individualNames'
import db from '../../../utils/db'
import {useRouter} from 'next/router'

const handler = async (req, res) => {


    if (req.method === 'GET') {
        return getHandler(req, res);

      } else if (req.method === 'PUT') {
        return putHandler(req, res);

      } else if (req.method === 'DELETE') {
        return deleteHandler(req, res);
        
      } else {
        return res.status(400).send({ message: 'Method not allowed' });
      }
    };
    const getHandler = async (req, res) => {
      await db.connect();
      console.log(req.params)
      const individualname = await Individualname.findOne({"id":req.query._id});
      
      await db.disconnect();
      console.log(individualname)
      res.status(200).json(individualname);
     
    };

    //

// I also had the same problem. It was simply solved by using findOne method instead of findById method of mongoose.
// https://stackoverflow.com/questions/52147649/mongoose-findbyid-return-null
    const putHandler = async (req, res) => {
      await db.connect();
      const individualname = await Individualname.findById(req.query.id);
      if (individualname) {
        individualname.name = req.body.name;
        individualname.description = req.body.description;
        individualname.tags = req.body.tags;
        individualname.likedby = req.body.likedby;
       
        await Individualname.save();
        await db.disconnect();
        res.send({ message: 'Name updated successfully' });
      } else {
        await db.disconnect();
        res.status(404).send({ message: 'name not found' });
      }


}

export default handler;


//like / dislike a post

// https://github.com/safak/youtube/blob/mern-social-app/api/routes/posts.js
// router.put("/:id/likedby", async (req, res) => {
//     try {
//       const post = await name.findById(req.params.id);
//       if (!name.likedby.includes(req.body.userId)) {
//         await post.updateOne({ $push: { likes: req.body.userId } });
//         res.status(200).json("The post has been liked");
//       } else {
//         await post.updateOne({ $pull: { likedby: req.body.userId } });
//         res.status(200).json("The post has been disliked");
//       }
//     } catch (err) {
//       res.status(500).json(err);
//     }
//   });