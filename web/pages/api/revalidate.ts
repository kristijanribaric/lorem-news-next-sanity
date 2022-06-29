import { isValidSignature, SIGNATURE_HEADER_NAME } from "@sanity/webhook";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  message: string;
};

async function readBody(readable: NextApiRequest) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks).toString("utf8");
}

export const config = {
  api: {
    bodyParser: false,
  },
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
  const signature = req.headers[SIGNATURE_HEADER_NAME];
  const body = await readBody(req);
  if (
    typeof signature !== "string" ||
    !secret ||
    !isValidSignature(body, signature, secret)
  ) {
    res.status(401).json({ message: "Invalid signature" });
    return;
  }

  try {
    const { type, slug } = JSON.parse(body);

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
