import { createContext, useContext, useState, ReactNode } from "react";

interface RoomContextType {
    room: any;
    in_game: boolean;
    players: any;
    player: any;
    setPlayer: (player: any) => void;
    setPlayers: (players: any) => void;
    setRoom: (room: any) => void;
    setInGame: (inGame: boolean) => void;
}

const RoomContext = createContext<RoomContextType | undefined>(undefined);

export const RoomProvider = ({ children }: { children: ReactNode }) => {
    const [room, setRoom] = useState<any>();
    const [in_game, setInGame] = useState<boolean>(false);
    const [players, setPlayers] = useState<any>([]);
    const [player, setPlayer] = useState<any>(null);

    return (
        <RoomContext.Provider value={{ room, in_game, players, player, setPlayer, setPlayers, setRoom, setInGame }}>
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



