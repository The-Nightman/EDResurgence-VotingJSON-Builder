import { useEffect, useState } from "react";
import { SavedJsonData } from "../interfaces";
import { Close, OpenInBrowser } from "@mui/icons-material";

interface OpenSavedJsonDialogProps {
  onResolve: (jsonData?: SavedJsonData) => void;
}

/**
 * Represents a dialog component for opening saved JSON files.
 *
 * @component
 * @param {OpenSavedJsonDialogProps} props - The component props.
 * @param {Function} props.onResolve - The callback function to be called when a JSON file is loaded.
 * @returns {JSX.Element} The rendered component.
 */
export const OpenSavedJsonDialog = ({
  onResolve,
}: OpenSavedJsonDialogProps) => {
  const [jsonFiles, setJsonFiles] = useState<SavedJsonData[]>([]);

  useEffect(() => {
    /**
     * Fetches the JSON files from the electron store and updates the state with the retrieved list.
     */
    const fetchJsonFiles = async () => {
      const savedJsonList = await window.ipcRenderer.invoke(
        "electron-store-get-saved",
        "savedJsons"
      );
      setJsonFiles(savedJsonList);
    };

    fetchJsonFiles();
  }, []);

  /**
   * Handles the loading of a JSON file.
   * Saves the current JSON files list to the electron store and resolves the blocking promise.
   *
   * @param jsonFile - The JSON file to be loaded and elevated.
   */
  const handleLoadJson = async (jsonFile: SavedJsonData) => {
    await window.ipcRenderer.invoke(
      "electron-store-set-saved",
      "savedJsons",
      jsonFiles
    );
    onResolve(jsonFile);
  };

  /**
   * Handles the optimistic deletion of a JSON file.
   * Removes the specified JSON file from the list of files.
   *
   * @param jsonFile - The JSON file to be deleted.
   */
  const handleOptimisticDelete = (jsonFile: SavedJsonData) => {
    const updatedJsonFiles = jsonFiles.filter(
      (file) => file.date !== jsonFile.date
    );
    setJsonFiles(updatedJsonFiles);
  };

  /**
   * Handles the cancel action.
   */
  const handleCancel = () => {
    onResolve();
  };

  return (
    <div
      role="alertdialog"
      aria-label="Save Files Dialog"
      className="flex flex-col h-screen min-w-[60%] w-min my-4 mx-auto"
    >
      <h2 className="text-5xl">OPEN SAVED JSON</h2>
      <div className="mt-4">
        <p className="mb-4 text-lg">
          Please make sure to load your folder containing your maps and game
          variants folders to render the forms correctly.
        </p>
        <strong className="text-lg">
          Loading a JSON will save any changes made, please cancel before
          loading a json to undo deletions.
        </strong>
        <ol className="min-h-8 w-full mb-6 rounded-md bg-gray-500 text-white">
          {jsonFiles.map((jsonFile, index) => {
            let rounded: { open: string; delete: string } = {
              open: "",
              delete: "",
            };
            if (index === 0 && jsonFiles.length === 1) {
              rounded = { open: "rounded-l-md", delete: "rounded-r-md" };
            } else if (index === 0 && jsonFiles.length > 1) {
              rounded = { open: "rounded-tl-md", delete: "rounded-tr-md" };
            } else if (index === jsonFiles.length - 1) {
              rounded = { open: "rounded-bl-md", delete: "rounded-br-md" };
            }
            return (
              <li
                className={`relative flex flex-row h-8 ${
                  index > 0 && "border-t"
                } border-gray-200`}
                key={jsonFile.date}
              >
                <button
                  className={`h-8 w-8 ${rounded.open} hover:bg-lime-600 active:bg-lime-800`}
                  onClick={() => handleLoadJson(jsonFile)}
                >
                  <OpenInBrowser />
                </button>
                <p className="p-2">{jsonFile.name}</p>
                <button
                  className={`absolute top-0 right-0 h-8 w-8 ${rounded.delete} hover:bg-red-600 active:bg-red-400`}
                  onClick={() => handleOptimisticDelete(jsonFile)}
                >
                  <Close />
                </button>
              </li>
            );
          })}
          {jsonFiles.length === 0 && (
            <li className="p-2">No saved json files found.</li>
          )}
        </ol>
      </div>
      <div className="relative flex h-7 mt-auto">
        <button
          className="hover:animate-pulse flex-grow hover:bg-[#963E15] active:bg-[#53220C]"
          title="Cancel changes and close Dialog"
          aria-label="Cancel changes and close Dialog"
          onClick={handleCancel}
        >
          <span className="sr-only">Cancel changes and close Dialog</span>
        </button>
        <span
          aria-hidden
          // pointer-events-none prevents text selection and click events allowing
          // the button to function seamlessly as the only clickable element
          className="absolute left-1/2 text-xl -translate-x-1/2 pointer-events-none"
        >
          Cancel
        </span>
      </div>
    </div>
  );
};
