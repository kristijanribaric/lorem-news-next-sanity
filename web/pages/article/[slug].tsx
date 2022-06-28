import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { Article } from "../../models";
import { ProgressSpinner } from "primereact/progressspinner";
import { useRouter } from "next/router";
import HeaderMeta from "../../components/headerMeta";
import groq from "groq";
import client from "../../lib/client";
import PostDetails from "../../components/postDetails";

const Article: NextPage<{ initialPost: Article }> = ({ initialPost }) => {
  const router = useRouter();

  if (router.isFallback) {
    return (
      <div className="w-6 m-auto pt-8">
        <ProgressSpinner className="w-full" />
      </div>
    );
  }

  return (
    <>
      <HeaderMeta
        title={`${initialPost.title} | Lorem News`}
        description={initialPost.title}
      />
      <PostDetails postData={initialPost} />
    </>
  );
};

export default Article;

export const getStaticProps: GetStaticProps = async (context) => {
  const slug = context?.params?.slug;

  if (typeof slug !== "string") {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const query = groq`*[_type == "post" && slug.current == $slug][0]{
    "id": slug.current,
    title,
    mainImage,
    publishedAt,
    "authorName": author->name,
    "categories": categories[]->title,
    "authorImage": author->image,
    body
  }`;

  const initialPost = await client.fetch(query, { slug });

  if (initialPost) {
    return {
      props: {
        initialPost,
      },
    };
  }

  return {
    notFound: true,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = await client.fetch(
    groq`*[_type == "post" && defined(slug.current)][].slug.current`
  )

  return {
    paths: paths.map((slug: string) => ({params: {slug}})),
    fallback: true,
  }

};
