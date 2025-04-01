import { Routes, Route } from "react-router-dom";

import Home from "./pages/home/Home";
import About from "./pages/about/About";
import NotFound from "./pages/notFound/NotFound";
import Nav from "./pages/nav/nav";
import GameScreen from "./pages/game/GameScreen";
import './css/initialpages/App.css'
import { SocketProvider } from "./utils/SocketContext";
import { useRoomContext } from "./utils/RoomContext";

const App = () => {
  const { in_game } = useRoomContext();

  return (
    <SocketProvider>
      <div className="App" id="App_Screen">

        { !in_game && <Nav /> }

        { !in_game && 
          <Routes>
            <Route path="/" element={!in_game && <Home/>} />
            <Route path="/about" element={<About />} />
            <Route path="/howtoplay" element={<About />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        }

        { in_game && <GameScreen />}

      </div>
    </SocketProvider>
  );
};

export default App