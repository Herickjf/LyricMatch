import './css/initialpages/index.css'
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { RoomProvider } from './utils/RoomContext';

ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
  <RoomProvider>
    <App />
  </RoomProvider>
  </BrowserRouter>
);