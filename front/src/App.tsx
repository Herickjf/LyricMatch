import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/home/Home";
import About from "./pages/about/About";
import NotFound from "./pages/notFound/NotFound";
import Nav from "./pages/nav/nav";
import GameScreen from "./pages/game/GameScreen";
import Dashboard from "./pages/dashboard/Dashboard";
import AboutGame from "./pages/AboutGame/AboutGame";
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

    socket.on("error", (data) => {
      setAlertMessage(data.message);
      setAlert(true);
      setTimeout(() => {
        setAlert(false);
      }, 3000);
    });

    socket.on("disconnected", () => {
      setInGame(false);
      setRoom(null);
      setPlayers([]);
      setPlayer(null);
      setGuesses([]);
      setSongSelected(null);
      setCount(null);
      navigate("/"); // 🔁 redireciona para a tela inicial

      setAlertMessage("You were disconnected from the server.");
      setAlert(true);
      setTimeout(() => {
        setAlert(false);
      }, 5000);
    });

    return () => {
      socket.off("error");
    };
  }, [socket]);

  useEffect(() => {
    if (!socket) return;
  
    socket.on("roomUpdate", (room: any) => {
      setPlayers(room.players);
      setRoom(room);
      setPlayer(room.players.find((p: any) => p.socketId == socket.id) || null);
      
      if(room.status == "analyzing" || room.status == "finished"){
        setCount(null);
      } else if(room.status == "playing"){
        setGuesses(null);
        setSongSelected(null);
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
      setAlertMessage("You were expelled from the room.");
      setAlert(true);
      setTimeout(() => {
        setAlert(false);
      }, 5000);
    });
  
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
            <Route path="/"           element={<Home              closeMenu={closeMenu}/>} />
            <Route path="/about"      element={<About             closeMenu={closeMenu}/>} />
            <Route path="/aboutgame"  element={<AboutGame         closeMenu={closeMenu}/>} />
            <Route path="/dashboard"  element={<Dashboard         closeMenu={closeMenu}/>} />
            <Route path="*"           element={<NotFound          closeMenu={closeMenu}/>} />
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