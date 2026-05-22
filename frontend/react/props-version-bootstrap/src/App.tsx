import "./App.scss";
import Navbar from "./components/Navbar.tsx";
import Footer from "./components/Footer.tsx";
import { Outlet } from "react-router";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <div className="app">
        <Toaster position="top-right" />
        <Navbar />
        <main className="main-content">
          <Outlet />
        </main>
        <Footer></Footer>
      </div>
    </>
  );
}

export default App;
