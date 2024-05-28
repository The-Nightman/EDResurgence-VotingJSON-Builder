import { useState } from "react";
import { Sidebar, TypeForm } from "./components";
import { MapObj, MapsVariantsData, TypeObj } from "./interfaces";

interface toastState {
  show: boolean;
  message: string;
  color: string;
}

const App = () => {
  const [jsonData, setJsonData] = useState<{
    maps: MapObj[];
    types: TypeObj[];
  }>({
    // fallback maps for test build purposes
    maps: [
      { displayName: "High Ground", mapName: "deadlock" },
      { displayName: "High Ground", mapName: "deadlock" },
      { displayName: "High Ground", mapName: "deadlock" },
      { displayName: "High Ground", mapName: "deadlock" },
    ],
    types: [],
  });
  const [toastState, setToastState] = useState<toastState>({
    show: false,
    message: "",
    color: "",
  });
  const [mapsVariantsData, setMapsVariantsData] = useState<MapsVariantsData>({
    maps: [],
    variants: [],
  });
  const [typeForms, setTypeForms] = useState<number[]>([]);

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

  /**
   * Creates a new type form.
   * Adds a new element to the typeForms state rendering a new form.
   */
  const createNewType = () => {
    // copy array and add new element using the current
    // length of the array as value matching the index
    setTypeForms([...typeForms, typeForms.length]);
  };

  /**
   * Handles the JSON data based on the specified type and operation.
   * If the operation is "delete", the type is filtered from the cloned JSON data.
   * If the operation is "save", the JSON data types array is searched for an index.
   * If the index is -1, the type is added to the cloned JSON data types array.
   * If the index is not -1, the type is updated in the cloned JSON data types array.
   * For absolute safety the object is updated via an id property stored in each type object.
   * The cloned JSON data types array is then sorted by the id property.
   * The JSON data is then set with the updated types from the cloned JSON data array.
   *
   * @param {TypeObj} type - The TypeObj representing the type data to be handled.
   * @param {"delete" | "save"} operation - The operation to be performed ("delete" or "save").
   */
  const handleJsonData = (type: TypeObj, operation: "delete" | "save") => {
    // if operation is delete, filter the type from the types array
    if (operation === "delete") {
      // filter out the type from the types array by id property value
      const updatedTypes: TypeObj[] = jsonData.types.filter(
        (t) => t.id !== type.id
      );
      // set the updated types array in the jsonData object
      setJsonData({ ...jsonData, types: updatedTypes });
      // remove the type form from the typeForms array unrendering the form
      setTypeForms(typeForms.filter((t) => t !== type.id));
    }
    // if operation is save, search for the type in the types array
    if (operation === "save") {
      // find the index of the type in the types array
      const index: number = jsonData.types.findIndex((t) => t.id === type.id);
      // if the index is -1, add the type to the types array
      if (index === -1) {
        // clone the types array, add the type to the array and sort by id property value
        const updatedTypes: TypeObj[] = [...jsonData.types, type].sort(
          (a, b) => a.id! - b.id!
        );
        // set the updated types array in the jsonData object
        setJsonData({ ...jsonData, types: updatedTypes });
      }
      // if the index is not -1, update the type in the types array
      else {
        // clone the types array, replace the type in the array and sort by id property value
        const updatedTypes: TypeObj[] = jsonData.types
          .map((t) => (t.id === type.id ? type : t))
          .sort((a, b) => a.id! - b.id!);
        // set the updated types array in the jsonData object
        setJsonData({ ...jsonData, types: updatedTypes });
      }
    }
  };

  return (
    <>
      {/* top bar when frame is removed */}
      <div className="fixed top-0 flex flex-row w-full justify-between bg-white">
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
      <Sidebar mapsVariantsData={mapsVariantsData} />
      <div className="flex flex-col gap-12 mt-16 px-8">
        {typeForms.map((_type, index) => (
          <TypeForm
            key={index}
            mapsVariantsData={mapsVariantsData}
            index={index}
            handleSaveDelete={handleJsonData}
          />
        ))}
        <button onClick={createNewType}>add type</button>
        <div></div>
      </div>
    </>
  );
};

export default App;
