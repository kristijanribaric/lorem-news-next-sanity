import type { NextPage } from "next";
import PostCard from "../../components/postCard";
import { Article } from "../../models";
import { GetServerSideProps } from "next";
import { Button } from "primereact/button";
import { useRouter } from "next/router";
import HeadMeta from "../../components/headMeta";
import groq from "groq";
import client from "../../lib/client";
import { Paginator, PaginatorPageState } from "primereact/paginator";

const Category: NextPage<{
  first: number;
  rows: number;
  totalPosts: number;
  initialCategory: { slug: string; title: string };
  initialPosts: Article[];
}> = ({ first, rows, totalPosts, initialCategory, initialPosts }) => {
  const router = useRouter();
  const onPageChange = (e: PaginatorPageState) => {
    router.replace(
      `/categories/${initialCategory.slug}/?first=${e.first}&rows=${e.rows}`
    );
  };

  return (
    <>
      <HeadMeta
        title={`${initialCategory.title} | Lorem News`}
        description={`Browse all Posts in category ${initialCategory.title}`}
      />

      <div className="m-0 min-h-screen flex flex-column">
        <div className="flex align-items-center mb-4">
          <Button
            className="p-button-text mr-2"
            icon="pi pi-chevron-left"
            onClick={() => router.back()}
          />
          <h1>{initialCategory.title}</h1>
        </div>
        <div className="mb-6">
          {Array.isArray(initialPosts) && initialPosts.length ? (
            initialPosts.map((post) => (
              <PostCard key={post.slug} postData={post} />
            ))
          ) : (
            <p>Found no Posts.</p>
          )}
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

  if (
    typeof context.query.first !== "string" ||
    typeof context.query.rows !== "string" ||
    parseInt(context.query.first) < 0
  ) {
    return {
      redirect: {
        destination: `/categories/${slug}?first=0&rows=5`,
        permanent: false,
      },
    };
  }

  const first = parseInt(context.query.first);
  const rows = parseInt(context.query.rows);

  let query = groq`*[_type == "category" && slug.current==$slug][0]{
    "slug": slug.current,
    title,
  }`;
  const initialCategory = await client.fetch(query, { slug });
  if (!initialCategory) {
    return {
      notFound: true,
    };
  }

  query = groq`{
    "initialPosts": *[_type == "post" && publishedAt < now() && *[_type=="category" && slug.current==$slug][0]._id in categories[]._ref]{
        "slug": slug.current,
        title,
        mainImage,
        publishedAt,
        "authorName": author->name,
        "categories": categories[]->title,
        "authorImage": author->image
      } | order(publishedAt desc)[$first...$first+$rows],
    "totalPosts": count(*[_type == "post" && publishedAt < now() && *[_type=="category" && slug.current==$slug][0]._id in categories[]._ref])
  }`;

  const data = await client.fetch(query, { slug, first, rows });
  return {
    props: {
      first,
      rows,
      totalPosts: data.totalPosts,
      initialCategory: initialCategory,
      initialPosts: data.initialPosts,
    },
  };
};
