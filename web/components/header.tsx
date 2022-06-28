import { Button } from "primereact/button";
import { SyntheticEvent, useRef } from "react";
import { Menu } from "primereact/menu";
import { useRouter } from "next/router";
import { Avatar } from "primereact/avatar";
import Link from "next/link";
import { Sidebar } from "primereact/sidebar";
import { useState } from "react";
import { Skeleton } from "primereact/skeleton";

const Header: React.FC = () => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const menu = useRef<Menu>(null);
  const router = useRouter();
  let items: any;
  let icon: any;

  
  return (
    <div className="h-6 md:px-6 fixed top-0 left-0  w-full m-0 py-2 flex justify-content-between align-items-center border-bottom-1 border-100 surface-ground z-5">
      <Sidebar
        visible={isSidebarVisible}
        onHide={() => setIsSidebarVisible(false)}
        
      >
        <h3 onClick={() => setIsSidebarVisible(false)}>
          <Link href="/">Latest</Link>
        </h3>
        <h3 onClick={() => setIsSidebarVisible(false)}>
          <Link href="/categories">Categories</Link>
        </h3>
      </Sidebar>
      <Button
        icon="pi pi-bars"
        className="p-button-rounded   p-button-text p-button-secondary md:hidden"
        aria-label="Menu"
        onClick={() => setIsSidebarVisible(true)}
      />
      <ul className="hidden md:flex list-none gap-4 p-0 m-0">
        <li>
        <Link href="/">
        <a className="color-secondary text-lg hover:text-400">
          Latest
        </a>
      </Link>
        </li>
        <li>
        <Link href="/categories">
        <a className="color-secondary text-lg hover:text-400">
          Categories
        </a>
      </Link>
        </li>
      </ul>
      <Link href="/">
        <a className="font-medium uppercase m-0 color-secondary text-xl">
          Lorem News
        </a>
      </Link>
      

      {/* <Button
        icon={icon}
        className="p-button-rounded  p-button-text p-button-secondary"
        aria-label="User"
        onClick={handleClick}
      /> */}

      <Menu model={items} popup ref={menu} id="popup_menu" />
    </div>
  );
};

export default Header;
