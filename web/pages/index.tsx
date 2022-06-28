import type { NextPage } from "next";
import type { GetServerSideProps } from "next";
import PostCard from "../components/postCard";
import { Article } from "../models";
import HeaderMeta from "../components/headerMeta";
import client from "../lib/client";
import groq from "groq";
import { DataScroller, DataScrollerLazyLoadParams } from "primereact/datascroller";
import { useState, useRef } from "react";
import { Button } from "primereact/button";

const Home: NextPage<{ initialPosts: Article[] }> = ({ initialPosts }) => {
  const [posts, setPosts] = useState<Article[]>(initialPosts);
  console.log(posts)
  const ds = useRef<DataScroller>(null);
  const itemTemplate = (post: Article) => {
    return <PostCard key={post.id} postData={post} />;
  };
  const fetchPosts = async (first:number, rows:number) => {
    try {
      const response = await fetch(`/api/fetchPosts/${first}/${rows}`);

      if (!response.ok) {
        throw new Error();
      }
      const data = await response.json();
      console.log(data)
      setPosts(prevPosts => [...prevPosts,...data]);
    } catch (error) {
      console.log("Error while fetching Categories.",error);
    }
  };

  const loadData = (event: DataScrollerLazyLoadParams) => {
    console.log(event)
    //event.first = First row offset
    //event.rows = Number of rows per page
    //add more records to the cars array
    fetchPosts(event.first,event.rows);
  };

  const footer = <Button  icon="pi pi-plus" label="Load" onClick={() => ds.current?.load()} />;
  return (
    <>
      <HeaderMeta
        title="Latest | Lorem News"
        description={`All latest news from Culture, Politics, Entertainment and Sport at one place.`}
      />
      <h1>Latest</h1>
      {/* <DataScroller
        value={posts}
        ref={ds}
        itemTemplate={itemTemplate}
        rows={3}
        lazy
        onLazyLoad={loadData}

      /> */}
      {initialPosts.map((post) => (
        <PostCard key={post.id} postData={post} />
      ))}
    </>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async () => {
  const query = groq`*[_type == "post" && publishedAt < now() ]{
    "id": slug.current,
    title,
    mainImage,
    publishedAt,
    "authorName": author->name,
    "categories": categories[]->title,
    "authorImage": author->image
  } | order(publishedAt desc)`;

  const initialPosts = await client.fetch(query);
  return {
    props: {
      initialPosts,
    },
  };
};
