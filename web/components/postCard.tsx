import { Article } from "../models";
import Image from "next/image";
import moment from "moment";
import Link from "next/link";
import {  useRef } from "react";
import { useRouter } from "next/router";
import { Toast } from "primereact/toast";
import imageUrlBuilder from '@sanity/image-url'
import client from "../lib/client";

const PostCard: React.FC<{ postData: Article}> = ({
  postData
}) => {
  const router = useRouter();
  const toast = useRef<Toast>(null);
  const urlFor = (source:any) => {
    return imageUrlBuilder(client).image(source)
  }

  return (
    <div className="flex gap-2 align-items-end fadein animation-duration-500 animation-ease-in-out my-3 md:my-4">
      <Toast ref={toast} />
      <Link href={`/article/${postData.id}`} passHref>
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

      <div>
        <div className="flex align-items-center">
          <h3 className="uppercase text-primary text-sm md:text-base font-normal mr-2">
            {postData.category}
          </h3>
        </div>
        <Link href={`/article/${postData.id}`} passHref>
          <a>
            <h2 className="m-0 text-xl  md:text-4xl lg:text-6xl">
              {postData.title}
            </h2>
            <h4 className="text-400 m-0 text-sm ">
              {postData.authorName} ·{" "}
              {moment(postData.publishedAt).fromNow()}
            </h4>
          </a>
        </Link>
      </div>
    </div>
  );
};
export default PostCard;
