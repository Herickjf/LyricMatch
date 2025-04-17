import React from "react";
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
import { useSearchContext } from "./utils/SearchContext";


const App = () => {
  const socket = useSocket();
  const { setRoom, setPlayers, setInGame, in_game, room } = useRoomContext();
  const { setSongSelected } = useSongContext();
  const { setGuesses } = useSongContext();
  const { player, setPlayer } = useRoomContext();
  const { setCount } = useSearchContext();
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

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
      if(room.status == "analyzing" || room.status == "finished"){
        setCount(null);
      }
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
      navigate("/"); // 🔁 redireciona para a tela inicial
      setAlert(true);
      setAlertMessage("You were expelled from the room.");
      setTimeout(() => {
        setAlert(false);
      }, 5000);
    });

    socket.on("errorOnSearch", () => {
      setAlert(true);
      setAlertMessage("Error on search song, please try other source/site.");
      setTimeout(() => {
        setAlert(false);
      }, 5000);
    })
  
    // limpeza dos eventos para evitar múltiplas chamadas
    return () => {
      socket.off("roomUpdate");
      socket.off("roomAnswers");
      socket.off("expelled");
      socket.off("errorOnSearch");
    };
  }, [socket, navigate, player?.id]);

  const closeMenu = () => {
    setMenuOpen(false);
  }

  return (
      <div className="App" id="App_Screen">

        { !in_game && <Nav menuOpen={menuOpen} setMenuOpen={setMenuOpen}/> }

        { !in_game && 
          <Routes>
            <Route path="/" element={!in_game && <Home closeMenu={closeMenu}/>} />
            <Route path="/about" element={<About />} /> {/*  Adicionar  onClick={closeMenu} depois */}
            <Route path="/howtoplay" element={<About />} /> {/*  Adicionar  onClick={closeMenu} depois */}
            <Route path="/dashboard" element={<About />} /> {/*  Adicionar o <Dashboard /> */} {/*  Adicionar  onClick={closeMenu} depois */}
            <Route path="*" element={<NotFound />} /> {/*  Adicionar  onClick={closeMenu} depois */}
          </Routes>
        }

        { in_game && <GameScreen />}

        {
          alert &&
          <div className="custom-alert">
            {alertMessage}
          </div>
        }

      </div>
  );
};

export default App