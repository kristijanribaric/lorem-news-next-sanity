import { isValidRequest } from "@sanity/webhook";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  message: string;
};

const secret = process.env.SANITY_WEBHOOK_SECRET;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== "POST") {
    console.error("Must be a POST request");
    return res.status(401).json({ message: "Must be a POST request" });
  }

  if (!secret || !isValidRequest(req, secret)) {
    res.status(401).json({ message: `Invalid signature: ${secret}` });
    return;
  }

  try {
    const {
      body: { type, slug },
    } = req;

    if (type === "post") {
      await res.unstable_revalidate(`/article/${slug}`);
      return res.json({
        message: `Revalidated "${type}" with slug "${slug}"`,
      });
    }

    return res.json({ message: "No managed type" });
  } catch (err) {
    return res.status(500).send({ message: "Error revalidating" });
  }
}
