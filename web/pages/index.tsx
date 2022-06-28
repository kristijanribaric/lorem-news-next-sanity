import type { NextPage } from "next";
import type { GetServerSideProps } from "next";
import ArticleCard from "../components/articleCard";
import { Article } from "../models";
import HeaderMeta from "../components/headerMeta";
import client from "../lib/client";
import groq from "groq";

const Home: NextPage<{ initialPosts: Article[] }> = ({ initialPosts }) => {
  console.log(initialPosts);
  return (
    <>
      <HeaderMeta
        title="Latest | Lorem News"
        description={`All latest news from Culture, Politics, Entertainment and Sport at one place.`}
      />
      <h1>Latest</h1>
      {initialPosts.map((post) => (
        <ArticleCard key={post.id} articleData={post} />
      ))}
    </>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async () => {
  const query = groq`*[_type == "post"]{
    "id": slug.current,
    title,
    mainImage,
    publishedAt,
    "authorName": author->name,
    "categories": categories[]->title,
    "authorImage": author->image
  }`;

  const initialPosts = await client.fetch(query);
  return {
    props: {
      initialPosts,
    },
  };
};
