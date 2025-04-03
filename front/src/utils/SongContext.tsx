import { createContext, useContext, useState, ReactNode } from "react";

interface SongSelected{
    song: string;
    artist: string;
    cover: string;
    audio: string;
    correct: boolean;
}

// Definição do tipo do contexto
interface SongContextType {
    song_selected: SongSelected;
    setSongSelected: (song_selected: SongSelected) => void;
    guesses: any;
    setGuesses: (guesses: any) => void;
}

// Criando o contexto
const SongContext = createContext<SongContextType | undefined>(undefined);

// Criando o Provider
export const SongProvider = ({ children }: { children: ReactNode }) => {
    const [song_selected, setSongSelected] = useState<SongSelected>({
        song: "",
        artist: "",
        cover: "",
        audio: "",
        correct: false,
    });
    const [guesses, setGuesses] = useState<any>([]);

    return (
        <SongContext.Provider value={{song_selected, setSongSelected, guesses, setGuesses}}>
            {children}
        </SongContext.Provider>
    );
};

export const useSongContext = () => {
    const context = useContext(SongContext);
    
    // Garantindo que o hook só será usado dentro de um SongProvider
    if (!context) {
        throw new Error("useSongContext deve ser usado dentro de um SongProvider");
    }
    
    return context;
}