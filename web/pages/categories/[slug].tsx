import type { NextPage } from "next";
import PostCard from "../../components/postCard";
import { Article } from "../../models";
import { GetServerSideProps } from "next";
import { Button } from "primereact/button";
import { useRouter } from "next/router";
import HeaderMeta from "../../components/headerMeta";
import groq from "groq";
import client from "../../lib/client";

const Category: NextPage<{
  initialCategory: { title: string };
  initialPosts: Article[];
}> = ({ initialCategory, initialPosts }) => {
  const router = useRouter();
  if (!Array.isArray(initialPosts) || !initialPosts.length ) {
    return (
      <>
        <div className="flex align-items-center mb-4">
          <Button
            className="p-button-text mr-2"
            icon="pi pi-chevron-left"
            onClick={() => router.back()}
          />
          <h1>{initialCategory.title}</h1>
        </div>
        <p>Found no Posts.</p>
      </>
    );
  }

  return (
    <>
      <HeaderMeta
        title={`${initialCategory.title} | Lorem News`}
        description={`Browse all Posts in category ${initialCategory.title}`}
      />
      <div className="flex align-items-center mb-4">
        <Button
          className="p-button-text mr-2"
          icon="pi pi-chevron-left"
          onClick={() => router.back()}
        />
        <h1>{initialCategory.title}</h1>
      </div>
      {initialPosts.map((post) => (
        <PostCard key={post.id} postData={post} />
      ))}
    </>
  );
};

export default Category;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const slug = context?.params?.slug;

  if (typeof slug !== "string") {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  let query = groq`*[_type == "category" && slug.current==$slug][0]{
    title,
  }`;
  const initialCategory = await client.fetch(query, { slug });
  if (Object.keys(initialCategory).length === 0) {
    return {
      notFound: true,
    };
  }

  query = groq`*[_type == "post" && *[_type=="category" && slug.current==$slug][0]._id in categories[]._ref] {
    "id": slug.current,
    title,
    mainImage,
    publishedAt,
    "authorName": author->name,
    "categories": categories[]->title,
    "authorImage": author->image,
  }`;

  const initialPosts = await client.fetch(query, { slug });

  return {
    props: {
      initialCategory,
      initialPosts,
    },
  };
};
