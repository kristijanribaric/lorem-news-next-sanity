import { nanoid } from "nanoid";
import { decode } from "base64-arraybuffer";
import { createClient } from "@supabase/supabase-js";
import { NextApiHandler } from "next";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "4mb",
    },
  },
};

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);

const handler: NextApiHandler = async (req, res) => {
  if (!(req.method === "POST")) {
    res.setHeader("Allow", "POST");
    res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    return;
  }

  if (
    !process.env.SUPABASE_URL ||
    !process.env.SUPABASE_KEY ||
    !process.env.SUPABASE_BUCKET
  ) {
    res.status(500).json({ message: "Something went wrong." });
    return;
  }

  let { image } = req.body;

  if (!image) {
    return res.status(500).json({ message: "No image provided" });
  }

  try {
    const contentType = image.match(/data:(.*);base64/)?.[1];
    const base64FileData = image.split("base64,")?.[1];

    if (!contentType || !base64FileData) {
      return res.status(500).json("Image data not valid");
    }

    // Upload image
    const fileName = nanoid();
    const ext = contentType.split("/")[1];
    const path = `${fileName}.${ext}`;

    const { data, error: uploadError } = await supabase.storage
      .from(process.env.SUPABASE_BUCKET)
      .upload(path, decode(base64FileData), {
        contentType,
        upsert: true,
      });

    if (!data || uploadError) {
      throw new Error();
    }

    // Construct public URL
    const url = `${process.env.SUPABASE_URL.replace(
      ".co",
      ".in"
    )}/storage/v1/object/public/${data.Key}`;

    return res.status(200).json({ url });
  } catch (e) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export default handler;
