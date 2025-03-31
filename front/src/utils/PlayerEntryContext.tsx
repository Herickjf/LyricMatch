import { createContext, useContext, useState, ReactNode } from "react";

interface SalaState {
    salaCriada: object | null;
    setSalaCriada: (sala: object | null) => void;
    playerEntrando: object | null;
    setPlayerEntrando: (player: object | null) => void;
}

const PlayerEntryContext = createContext<SalaState | undefined>(undefined);

export const PlayerEntryProvider = ({ children }: { children: ReactNode }) => {
  const [salaCriada, setSalaCriada] = useState<object | null>(null);
  const [playerEntrando, setPlayerEntrando] = useState<object | null>(null);

  return (
    <PlayerEntryContext.Provider value={{ salaCriada, setSalaCriada, playerEntrando, setPlayerEntrando }}>
      {children}
    </PlayerEntryContext.Provider>
  );
};

export const usePlayerEntryContext = () => {
  const context = useContext(PlayerEntryContext);
  if (!context) throw new Error("usePlayerEntryContext deve ser usado dentro de PlayerEntryProvider");
  return context;
};
