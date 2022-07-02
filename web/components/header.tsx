import { Button } from "primereact/button";
import Link from "next/link";
import { Sidebar } from "primereact/sidebar";
import { useState } from "react";
import { useRouter } from "next/router";

const Header: React.FC = () => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const router = useRouter();

  return (
    <div className="h-4rem md:px-6 fixed top-0 left-0 w-full py-2 flex justify-content-between align-items-center border-bottom-1 border-100 surface-ground z-5">
      <Sidebar
        visible={isSidebarVisible}
        onHide={() => setIsSidebarVisible(false)}
      >
        <h3 onClick={() => setIsSidebarVisible(false)}>
          <Link href="/"><a className={router.pathname === "/" ? "font-bold" : "font-normal"}>Latest</a></Link>
        </h3>
        <h3 onClick={() => setIsSidebarVisible(false)}>
          <Link href="/categories"><a className={router.pathname === "/categories" ? "font-bold" : "font-normal"}>Categories</a></Link>
        </h3>
      </Sidebar>
      <Button
        icon="pi pi-bars"
        className="p-button-rounded p-button-text p-button-secondary md:hidden"
        aria-label="Menu"
        onClick={() => setIsSidebarVisible(true)}
      />
      <ul className="hidden md:flex list-none gap-4 p-0 ">
        <li>
          <Link href="/">
            <a className={router.pathname === "/" ? "color-secondary text-lg hover:text-400 font-bold" : "color-secondary text-lg hover:text-400"}>Latest</a>
          </Link>
        </li>
        <li>
          <Link href="/categories">
            <a className={router.pathname === "/categories" ? "color-secondary text-lg hover:text-400 font-bold" : "color-secondary text-lg hover:text-400"}>Categories</a>
          </Link>
        </li>
      </ul>
      <Link href="/">
        <a className="font-medium uppercase color-secondary text-xl">
          Lorem News
        </a>
      </Link>
      <Button
        icon="pi pi-search"
        className="p-button-rounded p-button-text p-button-secondary"
        aria-label="Menu"
      />
    </div>
  );
};

export default Header;
