import { ipcRenderer, contextBridge } from 'electron'

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld('ipcRenderer', {
  on(...args: Parameters<typeof ipcRenderer.on>) {
    const [channel, listener] = args
    return ipcRenderer.on(channel, (event, ...args) => listener(event, ...args))
  },
  off(...args: Parameters<typeof ipcRenderer.off>) {
    const [channel, ...omit] = args
    return ipcRenderer.off(channel, ...omit)
  },
  send(...args: Parameters<typeof ipcRenderer.send>) {
    const [channel, ...omit] = args
    return ipcRenderer.send(channel, ...omit)
  },
  invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
    const [channel, ...omit] = args
    return ipcRenderer.invoke(channel, ...omit)
  },
  // Expose openFolder dialog function to renderer process
  openFolder: async () => {
    return await ipcRenderer.invoke('open-folder')
  },
  // Expose saveFile dialog function to renderer process
  saveFile: async (files: {filename: string, data: string}[]) => {
    return await ipcRenderer.invoke('save-file', files)
  },
  // Expose minimizeWindow function to renderer process
  minimizeWindow: async () => {
    return await ipcRenderer.invoke('minimize-window')
  },
  // Expose closeWindow function to renderer process
  closeWindow: async () => {
    return await ipcRenderer.invoke('close-window')
  },
  // Expose openHelp function to renderer process
  openHelp: async () => {
    return await ipcRenderer.invoke('open-help')
  }

  // You can expose other APTs you need here.
  // ...
})
