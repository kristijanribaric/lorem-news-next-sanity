import { NextApiHandler } from "next";
import prisma from "../../lib/prismaClient";

const handler: NextApiHandler = async (req, res) => {
  if (!(req.method === "GET")) {
    res.setHeader("Allow", "GET");
    res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    return;
  }

  try {
    const foodType = await prisma.category.findMany();
    res.status(200).json(foodType);
  } catch (error) {
    res.status(500).json({ message: "Connecting to the database failed!" });
    return;
  }
};

export default handler;
