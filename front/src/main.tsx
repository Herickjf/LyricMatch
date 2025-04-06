import './css/initialpages/index.css'
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { RoomProvider } from './utils/RoomContext';
import { SocketProvider } from './utils/SocketContext';
import { SongProvider } from "./utils/SongContext";
import { SearchProvider } from './utils/SearchContext';

ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
  <SocketProvider>
  <RoomProvider>
  <SongProvider>
  <SearchProvider>
    <App />
  </SearchProvider>
  </SongProvider>
  </RoomProvider>
  </SocketProvider>
  </BrowserRouter>
);