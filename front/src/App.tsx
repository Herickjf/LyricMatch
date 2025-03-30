import { Routes, Route } from "react-router-dom";

import Home from "./pages/home/Home";
import About from "./pages/about/About";
import NotFound from "./pages/notFound/NotFound";
import Nav from "./pages/nav/nav";
import GameScreen from "./pages/game/GameScreen";
import './css/initialpages/App.css'
import { SocketProvider } from "./utils/SocketContext";

import { useState } from "react";

const App = () => {
  const [ingame, setInGame] = useState(false);

  return (
    <SocketProvider>
      <div className="App" id="App_Screen">

        { !ingame && <Nav /> }

        { !ingame && 
          <Routes>
            <Route path="/" element={<Home inheritance={setInGame}/>} />
            <Route path="/about" element={<About />} />
            <Route path="/howtoplay" element={<About />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        }

        { ingame && <GameScreen inheritance={setInGame}/>}
      

      </div>
    </SocketProvider>
  );
};

export default App