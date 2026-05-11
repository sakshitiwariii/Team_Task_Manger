import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { motion } from "framer-motion";

const AppLayout = ({ children, pageTitle }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-white md:flex">
      <Sidebar />
      <main className="relative flex-1 pb-16">
        <div className="mx-auto w-full max-w-7xl px-4 pt-3 md:px-6">
          <Header pageTitle={pageTitle} />
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            {children}
          </motion.div>
        </div>
        <Footer />
      </main>
    </div>
  );
};

export default AppLayout;
