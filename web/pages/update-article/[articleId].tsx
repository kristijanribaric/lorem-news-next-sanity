import { NextPage, GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import NewArticleForm from "../../components/newArticleForm";
import { Article } from "../../models";
import prisma from "../../lib/prismaClient";

const UpdateArticle: NextPage<{ initialArticle: Article }> = ({
  initialArticle,
}) => {
  return (
    <>
      <div>
        <NewArticleForm
          id={initialArticle.id}
          initialData={{
            title: initialArticle.title,
            content: initialArticle.content!,
            category: initialArticle.category.id!,
            image: initialArticle.image,
          }}
          update
        />
      </div>
    </>
  );
};

export default UpdateArticle;

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  params,
}) => {
  const session = await getSession({ req });

  if (!session?.user || !(typeof params?.articleId === "string")) {
    res.statusCode = 404;
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const article = await prisma.article.findUnique({
    where: {
      id: params.articleId,
    },
    select: {
      id: true,
      title: true,
      category: {
        select: {
          id: true,
        },
      },
      content: true,
      image: true,
      author: {
        select: {
          email: true,
        },
      },
    },
  });

  if (!article || session.user.email !== article.author.email) {
    res.statusCode = 404;
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return {
    props: {
      initialArticle: JSON.parse(JSON.stringify(article)),
    },
  };
};
