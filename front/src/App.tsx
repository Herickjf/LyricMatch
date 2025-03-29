import { Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import About from "./pages/about/About";
import NotFound from "./pages/notFound/NotFound";
import Nav from "./pages/nav/nav";
import './css/initialpages/App.css'
import { SocketProvider } from "./utils/SocketContext";

const App = () => {
  return (
    <SocketProvider>
      <div className="App" id="App_Screen">

        <Nav />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/howtoplay" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      

      </div>
    </SocketProvider>
  );
};

export default App