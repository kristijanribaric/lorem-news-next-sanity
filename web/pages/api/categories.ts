import groq from "groq";
import { NextApiHandler } from "next";
import client from "../../lib/client";

const handler: NextApiHandler = async (req, res) => {
  if (!(req.method === "GET")) {
    res.setHeader("Allow", "GET");
    res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    return;
  }

  try {
    const query = groq`*[_type == "category"]{title}`;

    const categories = await client.fetch(query);
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Connecting to the database failed!" });
    return;
  }
};

export default handler;
