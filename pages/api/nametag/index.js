// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import dbConnect from "@utils/db";
import NameTag from "@models/NameTag";
import { checkIfAdmin } from "@/utils/api/CheckIfAdmin";

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect.connect();

  if (method === "GET") {
    try {
      const nametag = await NameTag.find();

      res.status(200).json(nametag);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  if (method === "POST") {
    try {
      const { ok, session } = await checkIfAdmin({
        req,
        res,
      });
      if (!ok) {
        return;
      }
      const nametag = await NameTag.create({
        ...req.body,
        createdby: session.user.id,
      });
      res.status(201).json(nametag);
    } catch (err) {
      res.status(500).json(err);
    }
  }
}
