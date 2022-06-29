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
    let page = 0;

    if (typeof req.query.page === "string") {
      page = Number(req.query.page);
    }

    
    const query = groq`*[_type == "post" && publishedAt < now() ]{
        "id": slug.current,
        title,
        mainImage,
        publishedAt,
        "authorName": author->name,
        "categories": categories[]->title,
        "authorImage": author->image
      } | order(publishedAt desc)[$page*5...$page*5+5]`;

    const initialPosts = await client.fetch(query,{page});
    res.status(200).json(initialPosts);
  } catch (error) {
    res.status(500).json({ message: "Connecting to the database failed!" });
    return;
  }
};

export default handler;
