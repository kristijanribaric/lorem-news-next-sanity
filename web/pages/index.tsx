import type { NextPage } from "next";
import type { GetServerSideProps } from "next";
import PostCard from "../components/postCard";
import { Article } from "../models";
import HeaderMeta from "../components/headerMeta";
import client from "../lib/client";
import groq from "groq";
import { Paginator, PaginatorPageState } from "primereact/paginator";
import { useRouter } from "next/router";

const Home: NextPage<{
  first: number;
  rows: number;
  totalPosts: number;
  initialPosts: Article[];
}> = ({ first, rows, totalPosts, initialPosts }) => {
  const router = useRouter();

  const onPageChange = (e: PaginatorPageState) => {
      router.replace(`/?first=${e.first}&rows=${e.rows}`);
    };
  

  return (
    <>
      <HeaderMeta
        title="Latest | Lorem News"
        description={`All latest news from Culture, Politics, Entertainment and Sport at one place.`}
      />
      <div className="m-0 min-h-screen flex flex-column">
        <h1>Latest</h1>
        <div className="mb-6">
          {initialPosts.map((post) => (
            <PostCard key={post.slug} postData={post} />
          ))}
        </div>
        <Paginator
          className="mt-auto"
          first={first}
          rows={rows}
          totalRecords={totalPosts}
          onPageChange={onPageChange}
          rowsPerPageOptions={[5, 10, 15]}
        ></Paginator>
      </div>
    </>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async (context) => {
  if (
    typeof context.query.first !== "string" ||
    typeof context.query.rows !== "string" ||
    parseInt(context.query.first) < 0
  ) {
    return {
      redirect: {
        destination: "/?first=0&rows=5",
        permanent: false,
      },
    };
  }
  const first = parseInt(context.query.first);
  const rows = parseInt(context.query.rows);

  let query = groq`{
    "initialPosts": *[_type == "post" && publishedAt < now() ]{
        "slug": slug.current,
        title,
        mainImage,
        publishedAt,
        "authorName": author->name,
        "categories": categories[]->title,
        "authorImage": author->image
      } | order(publishedAt desc)[$first...$first+$rows],
    "totalPosts": count(*[_type == "post" && publishedAt < now()])
  }`;

  const data = await client.fetch(query, { first, rows });

  return {
    props: {
      first,
      rows,
      totalPosts: data.totalPosts,
      initialPosts: data.initialPosts,
    },
  };
};
