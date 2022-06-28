import Footer from "./footer";
import Header from "./header";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="m-0 min-h-screen flex flex-column">
    <Header/>
      <main className="w-11 m-auto md:w-8 mt-8 pb-6">{children}</main>
      <Footer/>
    </div>
  );
};

export default Layout;
