import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { Post } from "../../models";
import HeadMeta from "../../components/headMeta";
import groq from "groq";
import client from "../../lib/client";
import PostDetails from "../../components/postDetails";

const Article: NextPage<{ initialPost: Post }> = ({ initialPost }) => {
  return (
    <>
      <HeadMeta
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

  if (!initialPost) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      initialPost,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = await client.fetch(
    groq`*[_type == "post" && defined(slug.current)][].slug.current`
  );

  return {
    paths: paths.map((slug: string) => ({ params: { slug } })),
    fallback: "blocking",
  };
};
