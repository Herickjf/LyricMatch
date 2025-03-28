import { io } from "socket.io-client";
import { useEffect, useMemo, createContext, useContext } from "react";

const SocketContext = createContext(null);

export function SocketProvider({ children:any }) {
    // Criando a conexão com o servidor (MANTENDO UMA ÚNICA INSTÂNCIA)
    const socket = useMemo(() => io("http://localhost:3001"), []);

    useEffect(() => {
        socket.on("connect", () => {
            console.log("Conectado ao servidor com ID:", socket.id);
        });

        return () => {
            socket.disconnect();
        };
    }, [socket]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
}

// Hook para acessar o socket em qualquer componente
export function useSocket() {
    return useContext(SocketContext);
}