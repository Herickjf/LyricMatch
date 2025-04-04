import { createContext, useContext, useState, ReactNode } from "react";

// Definição do tipo do contexto
interface SongContextType {
    song_selected: any;
    setSongSelected: (song_selected: any) => void;
    guesses: any;
    setGuesses: (guesses: any) => void;
}

// Criando o contexto
const SongContext = createContext<SongContextType | undefined>(undefined);

// Criando o Provider
export const SongProvider = ({ children }: { children: ReactNode }) => {
    const [song_selected, setSongSelected] = useState<any>(null);
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