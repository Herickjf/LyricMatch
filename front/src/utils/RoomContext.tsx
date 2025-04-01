import { createContext, useContext, useState, ReactNode } from "react";

interface RoomContextType {
    room: object;
    in_game: boolean;
    players: object[];
    setPlayers: (players: object[]) => void;
    setRoom: (room: object) => void;
    setInGame: (inGame: boolean) => void;
}

const RoomContext = createContext<RoomContextType | undefined>(undefined);

export const RoomProvider = ({ children }: { children: ReactNode }) => {
    const [room, setRoom] = useState<object>({});
    const [in_game, setInGame] = useState<boolean>(false);
    const [players, setPlayers] = useState<object[]>([]);

    return (
        <RoomContext.Provider value={{ room, in_game, players, setPlayers, setRoom, setInGame }}>
            {children}
        </RoomContext.Provider>
    );
};

export const useRoomContext = () => {
    const context = useContext(RoomContext);
    if (!context) {
        throw new Error("useRoomContext must be used within a RoomProvider");
    }
    return context;
}



