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
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


const App = () => {
  const socket = useSocket();
  const { setRoom, setPlayers, setInGame, in_game, room } = useRoomContext();
  const { setSongSelected } = useSongContext();
  const { setGuesses } = useSongContext();
  const { player, setPlayer } = useRoomContext();
  const [alert, setAlert] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if(in_game && room && (room?.status != "finished")){
      socket?.emit("getRoomInfo");
    }
  }, []);

  useEffect(() => {
    if (in_game && room && room?.status != "finished") {
      socket?.emit("getRoomInfo");
    }
  }, [in_game]);

  useEffect(() => {
    if (!socket) return;
  
    socket.on("roomUpdate", (room: any) => {
      setPlayers(room.players);
      setRoom(room);
      setPlayer(room.players.find((p: any) => p.socketId == socket.id));
    });
  
    socket.on("roomAnswers", (data: any) => {
      setSongSelected(data.find((song: any) => song.playerId == player?.id));
      setGuesses(data);
    });
  
    socket.on("expelled", () => {
      setInGame(false);
      setRoom(null);
      setPlayers([]);
      setPlayer(null);
      setGuesses([]);
      setSongSelected(null);
      setAlert(true);
      navigate("/"); // 🔁 redireciona para a tela inicial
  
      setTimeout(() => {
        setAlert(false);
      }, 5000);
    });
  
    // limpeza dos eventos para evitar múltiplas chamadas
    return () => {
      socket.off("roomUpdate");
      socket.off("roomAnswers");
      socket.off("expelled");
    };
  }, [socket, navigate, player?.id]);

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

        {
          alert &&
          <div className="custom-alert">
            You were expelled from the room.
          </div>
        }
      </div>
  );
};

export default App