import { createContext, useContext, useState, ReactNode } from "react";

// Definição do tipo do contexto
interface SearchContextType {
    count: any;  // Se count for um array de números
    setCount: (value: any) => void;
    timerInit: any;
    setTimerInit: (value: any) => void;
}

// Criando o contexto
const SearchContext = createContext<SearchContextType | undefined>(undefined);

// Criando o Provider
export const SearchProvider = ({ children }: { children: ReactNode }) => {
    const [count, setCount] = useState<any>(); // Estado global
    const [timerInit, setTimerInit] = useState<any>();

    return (
        <SearchContext.Provider value={{ count, setCount, timerInit, setTimerInit }}>
            {children}
        </SearchContext.Provider>
    );
};

// Hook para facilitar o uso do contexto
export const useSearchContext = () => {
    const context = useContext(SearchContext);
    
    // Garantindo que o hook só será usado dentro de um SearchProvider
    if (!context) {
        throw new Error("useSearchContext deve ser usado dentro de um SearchProvider");
    }
    
    return context;
};
