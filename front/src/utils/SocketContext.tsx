import { io } from "socket.io-client";
import { useMemo, createContext, useContext } from "react";
import { Socket } from "socket.io-client";

type SocketContextType = Socket | null;

const SocketContext = createContext<SocketContextType>(null);

export function SocketProvider({ children }: { children: React.ReactNode }) {
  // Criando a conexão com o servidor (MANTENDO UMA ÚNICA INSTÂNCIA)
  const socket = useMemo(() => io(`${window.location.origin}/api`), []);
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}

// Hook para acessar o socket em qualquer componente
export function useSocket(): Socket | null {
  return useContext(SocketContext);
}
