import type { NextPage } from "next";
import { Button } from "primereact/button";
import { useRouter } from "next/router";

const NotFound: NextPage = () => {
  const router = useRouter();
  return (
    <div className="mt-8 w-full md:w-8 lg:w-6 m-auto ">
      <div className="text-center my-50">
        <h2 className="text-5xl">404</h2>
        <h1 className="text-6xl">Page not Found</h1>
        <p className="text-2xl">Sorry, we couldn&apos;t find the page.</p>
        <div className="flex justify-content-center gap-6 lg:gap-8 mt-6">
          <Button
            className="p-button-text"
            icon="pi pi-arrow-left"
            label="Go Back"
            onClick={() => router.back()}
          />
          <Button
            icon="pi pi-home"
            label="Go to Homepage"
            onClick={() => router.replace("/")}
          />
        </div>
      </div>
    </div>
  );
};

export default NotFound;
