import { NextApiHandler } from "next";
import client from "../../../lib/client";
import groq from "groq";

const handler: NextApiHandler = async (req, res) => {
  if (!(req.method === "GET")) {
    res.setHeader("Allow", "GET");
    res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    return;
  }

  try {
    if (!(typeof req.query.slug === "object") || req.query.slug.length !== 2) {
      res.status(400).json({ message: "Something went wrong" });
      return;
    }

    const paramsNum = req.query.slug.map((str) => {
      return Number(str);
    });
    const [first, rows] = paramsNum;
    console.log(paramsNum)
    const query = groq`*[_type == "post" && publishedAt < now() ]{
        "id": slug.current,
        title,
        mainImage,
        publishedAt,
        "authorName": author->name,
        "categories": categories[]->title,
        "authorImage": author->image
      } | order(publishedAt desc)[$first...$first+$rows]`;

    const initialPosts = await client.fetch(query,{first,rows});
    res.status(200).json(initialPosts);
  } catch (error) {
    res.status(500).json({ message: "Connecting to the database failed!" });
    return;
  }
};

export default handler;
