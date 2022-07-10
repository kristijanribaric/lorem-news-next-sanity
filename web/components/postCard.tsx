import { Post } from "../models";
import Image from "next/image";
import moment from "moment";
import Link from "next/link";
import imageUrlBuilder from "@sanity/image-url";
import client from "../lib/client";

const PostCard: React.FC<{ postData: Post }> = ({ postData }) => {
  const urlFor = (source: any) => {
    return imageUrlBuilder(client).image(source);
  };

  return (
    <div className="flex gap-2 fadein animation-duration-500 animation-ease-in-out my-3 md:my-4">
      <Link href={`/post/${postData.slug}`} passHref>
        <a className="flex-shrink-0 relative w-6rem h-6rem md:w-8rem md:h-8rem lg:w-10rem lg:h-10rem">
          <Image
            src={urlFor(postData.mainImage).url()}
            alt={postData.title}
            objectFit="cover"
            layout="fill"
            className="border-round-xl"
          />
        </a>
      </Link>
      <Link href={`/post/${postData.slug}`} passHref>
        <a>
          <div className="h-6rem md:h-8rem lg:h-10rem flex flex-column justify-content-start">
            <h3 className="uppercase text-primary m-0 text-xs md:text-base font-normal mr-2">
              {postData.categories.map((category, index) =>
                index === 0 ? `${category} ` : `| ${category} `
              )}
            </h3>

            <h2 className="m-0 text-base md:text-3xl lg:text-5xl">
              {postData.title}
            </h2>
            <h4 className="text-400 m-0 text-sm">
              {postData.authorName} · {moment(postData.publishedAt).fromNow()}
            </h4>
          </div>
        </a>
      </Link>
    </div>
  );
};
export default PostCard;
