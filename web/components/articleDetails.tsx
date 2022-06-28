import { Article, RecievedImage } from "../models";
import Image from "next/image";
import moment from "moment";
import React from "react";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { useRouter } from "next/router";
import imageUrlBuilder from "@sanity/image-url";
import client from "../lib/client";
import {PortableText} from '@portabletext/react'

const ArticleDetails: React.FC<{ articleData: Article }> = ({
  articleData,
}) => {
  const urlFor = (source: any) => {
    return imageUrlBuilder(client).image(source);
  };

  const ptComponents = {
    types: {
      image: ({ value }: { value: RecievedImage }) => {
        if (!value?.asset?._ref) {
          return null;
        }
        return (
          <Image
            src={urlFor(articleData.mainImage).url()}
            alt={articleData.title}
            objectFit="cover"
            layout="fill"
            className="border-round-xl"
          />
        );
      },
    },
  };

  const router = useRouter();
  return (
    <div className="fadein animation-duration-500 animation-ease-in-out mt-4">
      <h3 className="uppercase text-primary m-0 mb-2 text-sm md:text-2xl">
        {articleData.category}
      </h3>
      <div className="flex align-items-center mb-2 md:mb-6 md:mt-4">
        <Button
          className="p-button-text mr-2"
          icon="pi pi-chevron-left"
          onClick={() => router.back()}
        />
        <h2 className="text-6xl m-0">{articleData.title}</h2>
      </div>

      <div>
        <Image
          src={urlFor(articleData.mainImage).url()}
          alt={articleData.title}
          layout="responsive"
          width={240}
          height={135}
        />
      </div>
      <div className="border-top-1 border-100 mt-4 md:mt-6">
        <div className="flex align-items-center gap-2">
          <Avatar
            image={urlFor(articleData.authorImage).width(50).url()}
            shape="circle"
          />
          <h4>
            <span className="font-light">By</span> {articleData.authorName}
          </h4>
        </div>
        <p className="text-400 m-0 font-light">
          Published {moment(articleData.publishedAt).fromNow()}
        </p>
        <div
          className="mt-4 md:mt-6"
        >
          <PortableText
        value={articleData.body}
        components={ptComponents}
      />
        </div>
      </div>
    </div>
  );
};
export default ArticleDetails;
