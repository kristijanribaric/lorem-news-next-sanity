import { NextApiHandler } from "next";
import prisma from "../../../lib/prismaClient";

const handler: NextApiHandler = async (req, res) => {
  if (!(req.method === "GET")) {
    res.setHeader("Allow", "GET");
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }

  try {
    const params = req.query;

    if (!(typeof params.articleId === "string")) {
      res.status(400).json({ message: "Something went wrong" });
      return;
    }

    const article = await prisma.article.delete({
      where: {
        id: params.articleId,
      },
    })
    await res.unstable_revalidate(`/article/${params.articleId}`);
    res.status(200).json(article);
  } catch (error) {
    res.status(500).json({ message: "Querying the database failed!" });
    return;
  }
};

export default handler;
