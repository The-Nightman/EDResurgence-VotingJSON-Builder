import { createContext, useEffect, useState } from "react";
import { ModData } from "../interfaces";

interface ModsContextProviderProps {
  children: React.ReactElement;
}

interface ModsContextProps {
  mods: ModData[];
}

export const ModsContext = createContext<ModsContextProps>({
  mods: [],
});

export const ModsProvider = ({ children }: ModsContextProviderProps) => {
  const [mods, setMods] = useState<ModData[]>([]);

  useEffect(() => {
    const fetchMods = async () => {
      const { mods } = await window.ipcRenderer.invoke(
        "electron-store-get-mods"
      );
      setMods(mods);
    };
    fetchMods();
  }, []);

  return (
    <ModsContext.Provider value={{ mods }}>{children}</ModsContext.Provider>
  );
};
