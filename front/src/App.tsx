import { Routes, Route } from "react-router-dom";

import Home from "./pages/home/Home";
import About from "./pages/about/About";
import NotFound from "./pages/notFound/NotFound";
import Nav from "./pages/nav/nav";
import GameScreen from "./pages/game/GameScreen";
import './css/initialpages/App.css'

import { useRoomContext } from "./utils/RoomContext";
import { useSocket } from "./utils/SocketContext";
import { useSongContext } from "./utils/SongContext";
import { useEffect } from "react";


const App = () => {
  const socket = useSocket();
  const { setRoom, setPlayers, in_game, room } = useRoomContext();
  const { song_selected, setSongSelected } = useSongContext();
  const { setGuesses } = useSongContext();
  const { player, setPlayer } = useRoomContext();

  useEffect(() => {
    if(in_game && (room?.status != "finished"))
      socket?.emit("getRoomInfo");
  }, []);

  socket?.on("roomUpdate", (room: any) => {
    setPlayers(room.players);
    setRoom(room);
    setPlayer(room.players.find((p: any) => p.socketId == socket?.id));
  })

  socket?.on("roomAnswers", (data: any) => {
    setSongSelected(data.find((song: any) => song.playerId == player?.id));
    setGuesses(data);
  })

  return (
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
  );
};

export default App