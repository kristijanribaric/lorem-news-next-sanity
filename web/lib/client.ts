import sanityClient from "@sanity/client";
export default sanityClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET_NAME,
  apiVersion: "2022-06-27",
  useCdn: process.env.NODE_ENV === "production",
  // useCdn === true, fast response - cached data
  // useCdn === false, slower response = latest data
});
