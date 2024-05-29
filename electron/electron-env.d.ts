/// <reference types="vite-plugin-electron/electron-env" />

import { IpcRenderer } from 'electron';

declare namespace NodeJS {
  interface ProcessEnv {
    /**
     * The built directory structure
     *
     * ```tree
     * ├─┬─┬ dist
     * │ │ └── index.html
     * │ │
     * │ ├─┬ dist-electron
     * │ │ ├── main.js
     * │ │ └── preload.js
     * │
     * ```
     */
    APP_ROOT: string
    /** /dist/ or /public/ */
    VITE_PUBLIC: string
  }
}

// Used in Renderer process, expose in `preload.ts`
interface Window {
  ipcRenderer: import('electron').IpcRenderer
}

// Used in Main process, expose in `main.ts`
// Used to extend the `ipcRenderer` object
/**
 * Represents the IPC renderer interface for communication between the main and renderer processes.
 */
export interface MyIpcRenderer extends IpcRenderer {
  /**
   * Opens a folder and returns an object with maps and types properties containing an array of strings.
   * @returns A promise that resolves to an object with maps and types properties, or null if the folder cannot be opened.
   */
  openFolder(): Promise<{ maps: string[]; types: string[] } | null>;

  /**
   * Saves files with the provided filenames and data.
   * @param files - An array of objects representing the files to be saved. Each object should have a filename and data property.
   * @returns A promise that resolves when the files are successfully saved.
   */
  saveFile(files: { filename: string; data: string }[]): Promise<void>;

  /**
   * Minimizes the window.
   * @returns A promise that resolves when the window is minimized.
   */
  minimizeWindow(): Promise<void>;

  /**
   * Closes the window.
   * @returns A promise that resolves when the window is closed.
   */
  closeWindow(): Promise<void>;

  /**
   * Opens the help dialog.
   * @returns A promise that resolves when the help dialog is opened.
   */
  openHelp(): Promise<void>;
}

// Add `MyIpcRenderer` to `ipcRenderer` and add to the `window` object
declare global {
  interface Window {
    ipcRenderer: MyIpcRenderer
  }
}