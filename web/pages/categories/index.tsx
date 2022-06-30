import type { NextPage } from "next";
import type { GetServerSideProps } from "next";
import Link from "next/link";
import { Button } from "primereact/button";
import { useRouter } from "next/router";
import HeadMeta from "../../components/headMeta";
import groq from "groq";
import client from "../../lib/client";

const Categories: NextPage<{
  initialCategories: { slug: string; title: string }[];
}> = ({ initialCategories }) => {
  const router = useRouter();
  return (
    <>
      <HeadMeta
        title="Categories | Lorem News"
        description={"All categories on Lorem News"}
      />
      <div className="flex align-items-center mb-4">
        <Button
          className="p-button-text mr-2"
          icon="pi pi-chevron-left"
          onClick={() => router.back()}
        />
        <h1>Categories</h1>
      </div>
      {initialCategories.map((category) => (
        <Link key={category.slug} href={`/categories/${category.slug}`} passHref>
          <a className="my-2 md:my-4 p-3 text-xl surface-card hover:text-primary hover:surface-ground block">
            <h3 className="m-0">{category.title}</h3>
          </a>
        </Link>
      ))}
    </>
  );
};

export default Categories;

export const getServerSideProps: GetServerSideProps = async () => {
  const query = groq`*[_type == "category"]{"slug": slug.current, title}`;

  const initialCategories = await client.fetch(query);

  return {
    props: {
      initialCategories,
    },
  };
};
