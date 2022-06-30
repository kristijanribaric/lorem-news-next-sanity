import Head from "next/head";

const HeadMeta: React.FC<{ title: string; description: string }> = ({
  title,
  description,
}) => {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
    </Head>
  );
};

export default HeadMeta;
