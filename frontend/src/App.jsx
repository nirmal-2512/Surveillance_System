import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import About from "./components/About";
import Login from "./components/Login";

function App() {
  return (
    <>
      <div className="mainContainer flex flex-col bg-deepnavy min-h-screen justify-center align-middle">
        <Navbar />
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
