import { createContext, useContext, useState, ReactNode } from "react";

// Definição do tipo do contexto
interface AudioSelectedContextType {
    artist: string;
    song: string;
    cover: string;
    audio: string;
    correct: boolean;
    setArtist: (value: string) => void;
    setSong: (value: string) => void;
    setCover: (value: string) => void;
    setAudio: (value: string) => void;
    setCorrect: (value: boolean) => void;
}

// Criando o contexto
const AudioSelectedContext = createContext<AudioSelectedContextType | undefined>(undefined);

// Criando o Provider
export const AudioSelectedProvider = ({ children }: { children: ReactNode }) => {
    const [artist, setArtist] = useState<string>(""); // Estado global
    const [song, setSong] = useState<string>(""); // Estado global
    const [cover, setCover] = useState<string>(""); // Estado global
    const [audio, setAudio] = useState<string>(""); // Estado global
    const [correct, setCorrect] = useState<boolean>(false); // Estado global

    return (
        <AudioSelectedContext.Provider value={{ artist, song, cover, audio, correct, setArtist, setSong, setCover, setAudio, setCorrect }}>
            {children}
        </AudioSelectedContext.Provider>
    );
};

export const useAudioSelectedContext = () => {
    const context = useContext(AudioSelectedContext);
    
    // Garantindo que o hook só será usado dentro de um AudioSelectedProvider
    if (!context) {
        throw new Error("useAudioSelectedContext deve ser usado dentro de um AudioSelectedProvider");
    }
    
    return context;
}