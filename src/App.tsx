import { useState } from "react";
import { Sidebar } from "./components";

interface mapsVariantsData {
  maps: string[];
  variants: string[];
}

interface toastState {
  show: boolean;
  message: string;
  color: string;
}

const App = () => {
  const [toastState, setToastState] = useState<toastState>({
    show: false,
    message: "",
    color: "",
  });
  const [mapsVariantsData, setMapsVariantsData] = useState<mapsVariantsData>({
    maps: [],
    variants: [],
  });

  /**
   * Handler function for opening a folder and setting the maps and variants data.
   * Handles the frontend operation of the functions defined in the main process and preload context bridges.
   * If the folderData is not null, set the maps and variants data.
   * If an error occurs, set the toast state with the error message.
   *
   * @async
   * @returns {Promise<void>} - Returns a promise that is void on resolve.
   */
  const handleFolder = async (): Promise<void> => {
    try {
      // open the folder and get the maps and variants data through the ipcRenderer bridge
      const folderData: { maps: string[]; types: string[] } | null =
        await window.ipcRenderer.openFolder();
      // if folderData is not null, set the maps and variants data
      if (folderData) {
        setMapsVariantsData({
          maps: folderData.maps,
          variants: folderData.types,
        });
      }
    } catch (error) {
      // catch errors i.e. if the map_variants and game_variants directories are not found
      // set the toast state with the error message
      setToastState({
        show: true,
        message: (error as Error).message,
        color: "red",
      });
    }
  };

  /**
   * Handler function for saving JSON files.
   * Handles the frontend operation of the functions defined in the main process and preload context bridges.
   * The function passes an array of files to the main process.
   * The main process then saves the JSON files to the selected directory.
   * If an error occurs, set the toast state with the error message.
   *
   * @async
   * @returns {Promise<void>} - Returns a promise that is void on resolve.
   */
  const handleSave = async (): Promise<void> => {
    const files = [
      { filename: "voting.json", data: JSON.stringify({ hello: "world" }) },
      { filename: "mods.json", data: JSON.stringify({ hello: "world" }) },
    ];
    try {
      await window.ipcRenderer.saveFile(files);
    } catch (error) {
      // catch errors if the file write operation fails
      // set the toast state with the error message
      setToastState({
        show: true,
        message: (error as Error).message,
        color: "red",
      });
    }
  };

  return (
    <>
    {/* top bar when frame is removed */}
      <div className="flex flex-row w-full justify-between">
        <div>
          <button
            className="py-1 px-2 hover:bg-[#963E15] active:bg-[#53220C] text-xl"
            onClick={handleFolder}
          >
            Open Folder
          </button>
          <button
            className="py-1 px-2 hover:bg-[#963E15] active:bg-[#53220C] text-xl"
            onClick={handleSave}
          >
            Save JSON
          </button>
        </div>
      </div>
      <div className="flex">
        <Sidebar mapsVariantsData={mapsVariantsData} />
        <div></div>
      </div>
    </>
  );
}

export default App;
