import { NextApiHandler } from "next";
import prisma from "../../lib/prismaClient";

const handler: NextApiHandler = async (req, res) => {
  if (!(req.method === "POST" || req.method === "PATCH")) {
    res.setHeader("Allow", "POST");
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }

  if (req.method === "POST") {
    const { id, title, content, category, image } = req.body;

    try {
      const article = await prisma.article.create({
        data: {
          title: title,
          content: content,
          author: {
            connect: {
              email: id,
            },
          },
          category: {
            connect: {
              id: category,
            },
          },
          image: image,
        },
      });
      res.status(200).json(article);
    } catch (error) {
      res.status(500).json({ message: "Connecting to the database failed!" });
      return;
    }
  }

  if (req.method === "PATCH") {
    const { id, title, content, category, image } = req.body;

    try {
      const article = await prisma.article.update({
        where: {
          id: id,
        },
        data: {
          title: title,
          content: content,
          category: {
            connect: {
              id: category,
            },
          },
          image: image,
        },
      });
      await res.unstable_revalidate(`/article/${id}`);
      res.status(200).json(article);
    } catch (error) {
      res.status(500).json({ message: "Connecting to the database failed!" });
      return;
    }
  }
};

export default handler;
