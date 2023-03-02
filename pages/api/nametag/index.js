// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import dbConnect from "../../../config/connectmongodb";
import NameTag from "../../../models/NameTag";

export default async function handler(req, res) {
  const { method } = req;

  dbConnect(); //from config/mongo.js

  if (method === "GET") {
    try {
      const nametag = await NameTag.find();

      res.status(200).json(nametag);
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

  if (method === "POST") {
    try {
      const nametag = await NameTag.create(req.body);
      console.log(nametag);
      res.status(201).json(nametag);
    } catch (err) {
      res.status(500).json(err);
    }
  }
}
