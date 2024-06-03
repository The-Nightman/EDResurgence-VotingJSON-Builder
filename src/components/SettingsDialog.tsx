import { useContext } from "react";
import { SettingsContext } from "../contexts/SettingsContext";

interface SettingsDialogProps {
  onResolve: () => void;
}

/**
 * Renders a settings dialog component.
 *
 * @param {SettingsDialogProps} props - The component props.
 * @param {Function} props.onResolve - The callback function to resolve the blocking promise.
 * @returns {JSX.Element} The rendered settings dialog component.
 */
export const SettingsDialog = ({ onResolve }: SettingsDialogProps) => {
  const { settings, setSettings } = useContext(SettingsContext);

  /**
   * Handles the click event for the button.
   * Invokes the "electron-store-set-cfg" method of the window.ipcRenderer object
   * to set the settings in the electron store, and then calls the onResolve function.
   */
  const handleClick = async () => {
    await window.ipcRenderer.invoke("electron-store-set-cfg", settings);
    onResolve();
  };

  return (
    <div
      role="alertdialog"
      aria-label="Settings Dialog"
      className="flex flex-col h-full w-[70%] my-4 mx-auto"
    >
      <h2 className="sr-only">SETTINGS</h2>
      <div className="flex flex-col gap-6 text-xl text-white [&_select]:text-black [&_input]:text-black [&_select]:bg-[#a3bbd8] [&_input]:bg-[#a3bbd8] [&_select]:font-sans [&_input]:font-sans [&_select]:rounded [&_input]:rounded">
        <label className="flex flex-col">
          Background
          <select
            name="Background select"
            id="background"
            defaultValue={settings.background}
            onChange={(e) =>
              setSettings({ ...settings, background: e.target.value })
            }
          >
            <option value="forge">Forge</option>
            <option value="c322">C-322</option>
            <option value="highcharity">High Charity</option>
          </select>
        </label>
        <label className="flex flex-col">
          Volume: {Math.round(settings.volume * 100)}%
          <input
            type="range"
            name="Volume"
            id="volume"
            min={0}
            max={1}
            defaultValue={settings.volume}
            step={0.01}
            onChange={(e) =>
              setSettings({
                ...settings,
                volume: parseFloat(e.target.value),
              })
            }
          />
        </label>
        <div className="flex flex-col">
          <label>
            <input
              className="mr-1"
              type="checkbox"
              name="High contrast text"
              id="highContrastText"
              defaultChecked={settings.highContrastText}
              onChange={(e) =>
                setSettings({ ...settings, highContrastText: e.target.checked })
              }
            />
            High contrast text
            {settings.highContrastText ? " (Enabled)" : " (Disabled)"}
          </label>
          <span className="text-4xl text-[#aac0da]">
            aAbBcC/<span className="text-white">aAbBcC</span>
          </span>
        </div>
        <label>
          <input
            className="mr-1"
            type="checkbox"
            name="High contrast text"
            id="highContrastText"
            disabled
          />
          Advanced map options (Coming soon)
        </label>
      </div>
      <div className="relative flex h-7 mt-auto">
        <button
          className="hover:animate-pulse flex-grow hover:bg-[#963E15] active:bg-[#53220C]"
          title="Close Dialog"
          aria-label="Close Dialog"
          onClick={handleClick}
        >
          <span className="sr-only">OK</span>
        </button>
        <span
          aria-hidden
          // pointer-events-none prevents text selection and click events allowing
          // the button to function seamlessly as the only clickable element
          className="absolute left-1/2 text-xl -translate-x-1/2 pointer-events-none"
        >
          OK
        </span>
      </div>
    </div>
  );
};
