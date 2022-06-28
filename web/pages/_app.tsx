import "../styles/globals.css";
import "primereact/resources/themes/lara-dark-teal/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import PrimeReact from "primereact/api";
import type { AppProps } from "next/app";
import Layout from "../components/layout";
import Head from "next/head";

PrimeReact.ripple = true;

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <title>Lorem News</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta
          name="description"
          content="Lorem News - Your daily source of news"
        />
      </Head>
        <Layout>
          <Component {...pageProps} />
        </Layout>
    </>
  );
}

export default MyApp;
