import Footer from "./footer";
import Header from "./header";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-column">
    <Header/>
      <main className="w-11 mt-6 md:w-8 md:mt-8 m-auto">{children}</main>
      <Footer/>
    </div>
  );
};

export default Layout;
