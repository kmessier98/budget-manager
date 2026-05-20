import "./App.scss";
import Navbar from "./components/Navbar.tsx";
import Footer from "./components/Footer.tsx";
import { Outlet } from "react-router";

function App() {
  return (
    <>
      <div className="app">
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
