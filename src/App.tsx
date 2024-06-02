import { useContext, useEffect, useState } from "react";
import {
  OpenFolderDialog,
  Sidebar,
  TypeForm,
  DialogFoundation,
  SaveFilesDialog,
  SettingsDialog,
  OpenSavedJsonDialog,
} from "./components";
import { MapObj, MapsVariantsData, SavedJsonData, TypeObj } from "./interfaces";
import {
  Add,
  CloseOutlined,
  HelpOutline,
  MinimizeOutlined,
  Settings,
} from "@mui/icons-material";
import { forgeBackground } from "./assets";
import { SettingsContext } from "./contexts/SettingsContext";

interface JsonData {
  maps: MapObj[];
  types: TypeObj[];
}

interface DialogState {
  show: boolean;
  content: React.ReactElement;
}

const App = () => {
  const [jsonData, setJsonData] = useState<JsonData>({
    // fallback maps for test build purposes
    maps: [
      { displayName: "High Ground", mapName: "deadlock" },
      { displayName: "High Ground", mapName: "deadlock" },
      { displayName: "High Ground", mapName: "deadlock" },
      { displayName: "High Ground", mapName: "deadlock" },
    ],
    types: [],
  });
  const [openSavedJsonDetails, setOpenSavedJsonDetails] = useState<{
    name: string;
    date: number;
  } | null>(null);
  const [dialogState, setDialogState] = useState<DialogState>({
    show: false,
    content: <></>,
  });
  const [mapsVariantsData, setMapsVariantsData] = useState<MapsVariantsData>({
    maps: [],
    variants: [],
  });
  const [typeForms, setTypeForms] = useState<number[]>([]);
  const [openDropDown, setOpenDropDown] = useState<boolean>(false);
  const { settings } = useContext(SettingsContext);

  const backgroundData: { [key: string]: string } = {
    forgeBackground: forgeBackground,
  };

  // use this to clear the open saved json details when the types array is empty
  useEffect(() => {
    if (jsonData.types.length === 0) {
      setOpenSavedJsonDetails(null);
    }
  }, [jsonData.types]);

  /**
   * Handler function for opening a folder and setting the maps and variants data.
   * Handles the frontend operation of the functions defined in the main process and preload context bridges.
   * Creates a new blocking promise and sets the dialog state with the OpenFolderDialog component.
   * The OpenFolderDialog component resolves the promise when the user performs an action firing the promise resolve.
   * The dialog state is then set to false and the dialog content is set to an empty fragment.
   * If the folderData is not null, set the maps and variants data.
   * If an error occurs, set the toast state with the error message.
   *
   * @async
   * @returns {Promise<void>} - Returns a promise that is void on resolve.
   */
  const handleFolder = async (): Promise<void> => {
    try {
      // create a new blocking promise and set the dialog state with the OpenFolderDialog component
      const newPromise = new Promise<void>((resolve) => {
        setDialogState({
          show: true,
          content: <OpenFolderDialog onResolve={resolve} />,
        });
      });
      // wait for the promise to resolve
      await newPromise;
      // set the dialog state to false and the dialog content to an empty fragment after promise resolved
      setDialogState({ show: false, content: <></> });
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
      // setToastState({
      //   show: true,
      //   message: (error as Error).message,
      //   color: "red",
      // });
    }
  };

  /**
   * Handler function for saving JSON files.
   * Handles the frontend operation of the functions defined in the main process and preload context bridges.
   * Creates a new blocking promise and sets the dialog state with the SaveFilesDialog component.
   * The SaveFilesDialog component resolves the promise when the user performs an action firing the promise resolve.
   * The dialog state is then set to false and the dialog content is set to an empty fragment.
   * The function passes an array of files to the main process.
   * The main process then saves the JSON files to the selected directory.
   * If an error occurs, set the toast state with the error message.
   *
   * @async
   * @returns {Promise<void>} - Returns a promise that is void on resolve.
   */
  const handleSave = async (): Promise<void> => {
    // create a new blocking promise and set the dialog state with the SaveFilesDialog component
    const newPromise = new Promise<void>((resolve) => {
      setDialogState({
        show: true,
        content: <SaveFilesDialog jsonData={jsonData} onResolve={resolve} />,
      });
    });
    // wait for the promise to resolve
    await newPromise;
    // set the dialog state to false and the dialog content to an empty fragment after promise resolved
    setDialogState({ show: false, content: <></> });
    // initialize a new object to store the mods json data with dynamic key names and nested object package_url values
    const modsJson: { [key: string]: { package_url: string } } = {};
    // clone the types array and remove unused or unnecessary property from each type object
    const typesArr: TypeObj[] = JSON.parse(JSON.stringify(jsonData.types));
    typesArr.forEach((type) => {
      delete type.id;
      // if randomchance is set to 0.1 the default value when the propery is absent, remove it
      if (type.randomChance! < 0.2) {
        delete type.randomChance;
      }
      // if modPack is not being used, remove it
      if (type.modPack! === "") {
        delete type.modPack;
      }
      // if commands or endOfMatchCommands are empty arrays, remove them
      if (type.commands!.length === 0) {
        delete type.commands;
      }
      if (type.endOfMatchCommands!.length === 0) {
        delete type.endOfMatchCommands;
      }
    });
    // create an array of modPack values from the types array
    const modsArr: string[] = typesArr
      // filter out types without a modPack property and map the modPack property values
      .filter((type) => type.modPack !== undefined)
      .map((type) => type.modPack!);
    // create a new object to store the mods json data with key names from modsArr and nested object package_url values
    modsArr.forEach((mod) => {
      // e.g. this will create { "modPackName": { package_url: "" } }
      modsJson[mod] = { package_url: "" };
    });
    // create an array of files to be saved
    const files = [
      {
        filename: "voting.json",
        // stringify the jsonData object and prettify with 2 spaces for indentation
        data: JSON.stringify(
          { maps: [...jsonData.maps], types: typesArr },
          null,
          2
        ),
      },
      {
        filename: "mods.json",
        // stringify the modsJson object and prettify with 2 spaces for indentation
        data: JSON.stringify({ mods: modsJson }, null, 2),
      },
    ];
    // pass the files array to the main process to save the files
    try {
      await window.ipcRenderer.saveFile(files);
    } catch (error) {
      // catch errors if the file write operation fails
      // set the toast state with the error message
      // setToastState({
      //   show: true,
      //   message: (error as Error).message,
      //   color: "red",
      // });
    }
  };

  /**
   * Handles the action of opening a saved JSON file.
   * Creates a new blocking promise and sets the dialog state with the OpenSavedJsonDialog component.
   * The OpenSavedJsonDialog component resolves the promise when the user performs an action firing the promise resolve.
   * The dialog state is then set to false and the dialog content is set to an empty fragment.
   * If the jsonData is not void, set the open saved json details with the name and date from the elevated json data.
   * Set the type forms array with the ids from the types array.
   *
   * @async
   * @returns {Promise<void | SavedJsonData>} A promise that resolves with void or a SavedJsonData object.
   */
  const handleOpenSavedJson = async () => {
    // create a new blocking promise and set the dialog state with the SettingsDialog component
    // resolves with void or SavedJsonData object if resolved with the object to elevate
    const newPromise = new Promise<SavedJsonData | void>((resolve) => {
      setDialogState({
        show: true,
        content: <OpenSavedJsonDialog onResolve={resolve} />,
      });
    });
    // wait for the promise to resolve, elevate json data if not void
    const jsonData: SavedJsonData | void = await newPromise;
    // set the dialog state to false and the dialog content to an empty fragment after promise resolved
    setDialogState({ show: false, content: <></> });
    if (jsonData) {
      // set the open saved json details with the name and date from the elevated json data
      setOpenSavedJsonDetails({ name: jsonData.name, date: jsonData.date });
      // set the maps and types data from the elevated json data
      setJsonData(jsonData.data);
      // set the type forms array with the ids from the types array
      setTypeForms(jsonData.data.types.map((type) => type.id!));
    }
  };

  /**
   * Handles the action of opening the settings dialog.
   * Creates a new blocking promise and sets the dialog state with the SettingsDialog component.
   * The SettingsDialog component resolves the promise when the user performs an action firing the promise resolve.
   * The dialog state is then set to false and the dialog content is set to an empty fragment.
   *
   * @async
   * @returns {Promise<void>} A promise that resolves when the settings dialog is closed.
   */
  const handleOpenSettings = async () => {
    // create a new blocking promise and set the dialog state with the SettingsDialog component
    const newPromise = new Promise<void>((resolve) => {
      setDialogState({
        show: true,
        content: <SettingsDialog onResolve={resolve} />,
      });
    });
    // wait for the promise to resolve
    await newPromise;
    // set the dialog state to false and the dialog content to an empty fragment after promise resolved
    setDialogState({ show: false, content: <></> });
  };

  /**
   * Creates a new type form.
   * Adds a new element to the typeForms state rendering a new form.
   * Generates unique element data by means of a millisecond timestamp.
   */
  const createNewType = () => {
    // copy array and add new element using the current
    //! length of the array as value matching the index <-- DO NOT DO THIS, BREAKS RENDER WITH LIST KEYS AND FORM ID'S
    // Generates a unique ID based on milliseconds since Unix epoch
    //* Use this to prevent misalignment of form data ID and array elements
    setTypeForms([...typeForms, Date.now()]);
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
      <video
        autoPlay
        loop
        className="fixed h-screen w-screen object-cover -z-50"
      >
        <source src={backgroundData[settings.background]} type="video/webm" />
      </video>
      {/* titlebar for frameless window, z-2000 guarantees to render above everything */}
      <header
        id="titlebar"
        className="fixed top-0 flex flex-row h-9 w-full justify-between border-b-[1px] border-[#aac0da] backdrop-blur-lg bg-[#0a0e14a4] text-[#aac0da] dark:text-white select-none z-[2000]"
      >
        <h1 className="fixed top-[0.375rem] left-1/2 -translate-x-1/2 text-xl font-bold">
          ElDewrito Resurgence 0.7 JSON Builder
        </h1>
        <div className="flex flex-row">
          <div
            className="flex flex-col w-[6.5rem]"
            onMouseLeave={() => setOpenDropDown(false)}
          >
            <button
              className="py-1 px-2 hover:bg-[#963E15] active:bg-[#53220C] text-xl"
              draggable="false"
              onClick={() => setOpenDropDown(true)}
            >
              Open...
            </button>
            {openDropDown && (
              <>
                <button
                  className="py-1 px-2 bg-[#0a0e14a4] hover:bg-[#963E15] active:bg-[#53220C] text-xl"
                  draggable="false"
                  onClick={handleOpenSavedJson}
                >
                  Open Saved
                </button>
                <button
                  className="py-1 px-2 bg-[#0a0e14a4] hover:bg-[#963E15] active:bg-[#53220C] text-xl"
                  draggable="false"
                  onClick={handleFolder}
                >
                  Open Folder
                </button>
              </>
            )}
          </div>
          <button
            className="py-1 px-2 hover:bg-[#963E15] active:bg-[#53220C] text-xl"
            draggable="false"
            onClick={handleSave}
          >
            Save JSON
          </button>
        </div>
        <div>
          <button
            className="py-1 px-2 hover:bg-[#963E15] active:bg-[#53220C] text-xl text-white"
            draggable="false"
            onClick={handleOpenSettings}
          >
            <Settings />
          </button>
          <button
            className="py-1 px-2 hover:bg-[#963E15] active:bg-[#53220C] text-xl hover:text-white active:text-white"
            draggable="false"
            onClick={window.ipcRenderer.openHelp}
          >
            <HelpOutline />
          </button>
          <button
            className="py-1 px-2 hover:bg-[#963E15] active:bg-[#53220C] text-xl"
            draggable="false"
            onClick={window.ipcRenderer.minimizeWindow}
          >
            <MinimizeOutlined />
          </button>
          <button
            className="py-1 px-2 hover:bg-red-600 active:bg-red-400 text-xl active:text-black"
            draggable="false"
            onClick={window.ipcRenderer.closeWindow}
          >
            <CloseOutlined />
          </button>
        </div>
      </header>
      <main className="flex flex-col mb-16 px-8 text-[#aac0da] dark:text-white select-none">
        {/* dialog component render inside main content for accessibility */}
        {dialogState.show && <DialogFoundation child={dialogState.content} />}
        <ol className="flex flex-col mt-16 mb-6 gap-12">
          {typeForms.map((typeNum, index) => (
            <TypeForm
              key={typeNum}
              mapsVariantsData={mapsVariantsData}
              uid={typeNum}
              handleSaveDelete={handleJsonData}
              // if openSavedJsonDetails is not null, pass the saved type object data from its place in the array
              {...(openSavedJsonDetails?.date && {
                savedTypeForm: jsonData.types[index],
              })}
            />
          ))}
        </ol>
        <button
          className="flex flex-row py-1 justify-center items-center hover:bg-[#963E15] active:bg-[#53220C] text-xl hover:text-white active:text-white"
          draggable="false"
          onClick={createNewType}
        >
          <Add fontSize="large" />
          <span className="text-2xl">add type</span>
        </button>
        <Sidebar mapsVariantsData={mapsVariantsData} />
      </main>
    </>
  );
};

export default App;
