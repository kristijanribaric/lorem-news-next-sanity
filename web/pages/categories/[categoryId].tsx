import type { NextPage } from "next";
import ArticleCard from "../../components/articleCard";
import { Article } from "../../models";
import { GetServerSideProps } from "next";
import { Button } from "primereact/button";
import { useRouter } from "next/router";
import HeaderMeta from "../../components/headerMeta";

const Category: NextPage<{
  initialArticles: Article[];
}> = ({  initialArticles }) => {
  const router = useRouter();
  if (initialArticles.length === 0) {
    return (
      <>
        {/* <div className="flex align-items-center mb-4">
          <Button
            className="p-button-text mr-2"
            icon="pi pi-chevron-left"
            onClick={() => router.back()}
          />
          <h1>{category.name}</h1>
        </div>
        <p>Found no Articles.</p> */}
      </>
    );
  }

  return (
    <>
      {/* <HeaderMeta
        title={`${category.name} | Lorem News`}
        description={`Browse all Articles in category ${category.name}`}
      />
      <div className="flex align-items-center mb-4">
        <Button
          className="p-button-text mr-2"
          icon="pi pi-chevron-left"
          onClick={() => router.back()}
        />
        <h1>{category.name}</h1>
      </div>
      {initialArticles.map((article) => (
        <ArticleCard key={article.id} articleData={article} />
      ))} */}
    </>
  );
};

export default Category;

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   const params = context.params;

//   if (!params || typeof params.categoryId !== "string") {
//     return {
//       redirect: {
//         destination: "/",
//         permanent: false,
//       },
//     };
//   }
//   const [category, articles] = await prisma.$transaction([
//     prisma.category.findUnique({
//       where: {
//         id: params.categoryId,
//       },
//     }),
//     prisma.article.findMany({
//       where: {
//         category: {
//           id: params.categoryId,
//         },
//       },
//       orderBy: {
//         publishedDate: "desc",
//       },
//       select: {
//         id: true,
//         title: true,
//         category: {
//           select: {
//             name: true,
//           },
//         },
//         image: true,
//         author: {
//           select: {
//             name: true,
//           },
//         },
//         publishedDate: true,
//       },
//     }),
//   ]);

//   if (category) {
//     console.log(category);
//     return {
//       props: {
//         category: category,
//         initialArticles: JSON.parse(JSON.stringify(articles)),
//       },
//     };
//   }

//   return {
//     notFound: true,
//   };
// };
