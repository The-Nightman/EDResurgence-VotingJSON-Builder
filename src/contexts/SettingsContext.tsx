import { createContext, useEffect, useState } from "react";

interface Settings {
  background: string;
  volume: number;
  highContrastText: string;
  advancedMapOptions: boolean;
}

const defaultSettings: Settings = {
  background: "forgeBackground",
  volume: 0.5,
  highContrastText: "text-[#aac0da]",
  advancedMapOptions: false,
};

interface SettingsProviderProps {
  children: React.ReactElement;
}

interface SettingsContextProps {
  settings: Settings;
  setSettings: React.Dispatch<React.SetStateAction<Settings>>;
}

export const SettingsContext = createContext<SettingsContextProps>({
  settings: defaultSettings,
  setSettings: () => {},
});

export const SettingsProvider = ({ children }: SettingsProviderProps) => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  useEffect(() => {
    const fetchSettings = async () => {
      const savedSettings = await window.ipcRenderer.invoke(
        "electron-store-get-cfg"
      );
      setSettings(savedSettings);
    };
    fetchSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, setSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};
