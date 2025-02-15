import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { SettingsProvider } from "./contexts/SettingsContext.tsx";
import { ModsProvider } from "./contexts/ModsContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <SettingsProvider>
      <ModsProvider>
        <App />
      </ModsProvider>
    </SettingsProvider>
  </React.StrictMode>
);

// Use contextBridge
window.ipcRenderer.on("main-process-message", (_event, message) => {
  console.log(message);
});
