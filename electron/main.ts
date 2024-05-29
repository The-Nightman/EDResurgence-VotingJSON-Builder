import { app, BrowserWindow, dialog, ipcMain } from "electron";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "fs/promises";

// get the current directory when running the application
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, "..");

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
export const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
export const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, "public")
  : RENDERER_DIST;

let win: BrowserWindow | null;

function createWindow() {
  win = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
    },
    autoHideMenuBar: true,
    frame: false,
  });

  // Test active push message to Renderer-process.
  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString());
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.whenReady().then(() => {
  createWindow();

  /**
   * Handle open-file IPC event from renderer process.
   * The function opens a dialog to select a directory.
   * The function reads the contents of the map_variants and game_variants directories and assigns the values to string arrays.
   * The function returns an object containing the maps and types arrays to the renderer process.
   * If the dialog is cancelled, the function returns null.
   *
   * @async
   * @param {Electron.IpcMainInvokeEvent} _event - IPC event object, unused in the function.
   *
   * @returns {Promise<{ maps: string[]; types: string[] } | null>} - Returns an object containing the maps and types arrays to the renderer process or null if cancelled.
   *
   * @throws {Error} - Throws an error if the read directory operation fails.
   *
   * @example
   * /// Opens a dialog to select a directory and returns the maps and types arrays to the renderer process.
   * ipcMain.handle(
   *   "open-folder",
   *   async (_event): Promise<{ maps: string[]; types: string[] } | null> => {
   *     /// function body
   *   }
   * );
   */
  ipcMain.handle(
    "open-folder",
    async (_event): Promise<{ maps: string[]; types: string[] } | null> => {
      const { canceled, filePaths } = await dialog.showOpenDialog({
        // openFile and openDirectory properties required for windows and linux system compatibility
        properties: ["openFile", "openDirectory"],
      });
      // if the dialog is not cancelled
      if (!canceled) {
        const parentDir: string = filePaths[0]; // get the target directory
        try {
          // read the contents of the map_variants and game_variants directories
          // and assign them to the maps and variants variables respectively
          const maps: string[] = await fs.readdir(`${parentDir}/map_variants`);
          const types: string[] = await fs.readdir(
            `${parentDir}/game_variants`
          );
          // return the maps and variants variables to renderer process
          return { maps: maps, types: types };
        } catch (error) {
          throw new Error(error as string); // cast error to string and return if an error occurs during the read operation
        }
      }
      return null; // return null if the dialog is cancelled
    }
  );

  /**
   * Handle save-file IPC event from renderer process.
   * The function takes an array of objects as an argument from the renderer process.
   * The object contains the filename and the data to be saved in the respective keys.
   * The function opens a dialog to select the file path to save the file
   * The function writes the data to the file.
   *
   * @async
   * @param {Electron.IpcMainInvokeEvent} _event - IPC event object, unused in the function.
   * @param {Array<{ filename: string; data: string }>} files - Array of objects containing the filename and data to be saved.
   *
   * @returns {Promise<void>} - Returns a promise that is void on resolve.
   *
   * @throws {Error} - Throws an error if the file write operation fails.
   *
   * @example
   * /// Saves an array of files and returns the filepath location to the renderer process.
   * ipcMain.handle(
   * "save-file",
   * async (_event, files: { filename: string; data: string }[]) => {
   *    /// function body
   *   }
   * );
   */
  ipcMain.handle(
    "save-file",
    async (
      _event,
      files: { filename: string; data: string }[]
    ): Promise<void> => {
      // iterate over the files array to create a dialog for each file
      files.forEach(async ({ filename, data }) => {
        const { canceled, filePath } = await dialog.showSaveDialog({
          title: "Select the File Path to Save",
          defaultPath: path.join(__dirname, filename),
          buttonLabel: "Save",
          // filters to allow only json files
          filters: [
            {
              name: "Files",
              extensions: ["json"],
            },
          ],
          properties: [],
        });
        // if the dialog is not cancelled
        if (!canceled) {
          try {
            fs.writeFile(filePath, data); // write the data to the file
          } catch (error) {
            throw new Error(error as string); // cast error to string and return if an error occurs during the write operation
          }
        }
      });
    }
  );
});
