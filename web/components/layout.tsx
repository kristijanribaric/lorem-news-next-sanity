import Header from "./header";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
    <Header/>
      <main className="w-11 m-auto md:w-8 mt-8">{children}</main>
    </>
  );
};

export default Layout;
