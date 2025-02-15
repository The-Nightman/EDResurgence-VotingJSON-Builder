import Store from "electron-store";
import { mods } from "../mods";

/**
 * Initializes the electron-store instances for persistent storage.
 *
 * @returns An object containing the electron-store instances for user configuration data and saved JSON data.
 * Listen i didnt specify a return type because wtf is it even supposed to be
 * Making interfaces of the stores expected structure sure didnt work and using ElectronStore interfaces didnt work either
 * It has a schema so it should be fine
 */
export const initStores = () => {
  // Schema for user configuration data
  const userConfigSchema = {
    highContrastText: {
      type: "string",
      default: "text-[#aac0da]",
    },
    volume: {
      type: "number",
      maximum: 1.0,
      minimum: 0.0,
      default: 0.5,
    },
    background: {
      type: "string",
      default: "forge",
    },
    advancedMapOptions: {
      type: "boolean",
      default: false,
    },
    searchBarThreshold: {
      type: "number",
      minimum: 0,
      default: 30,
    },
  };

  // Schema for saved JSON data
  const savedJsonsSchema = {
    savedJsons: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: {
            type: "string",
          },
          date: {
            type: "integer",
          },
          data: {
            type: "object",
            properties: {
              maps: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    displayName: {
                      type: "string",
                    },
                    mapName: {
                      type: "string",
                    },
                  },
                },
              },
              types: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: {
                      type: "number",
                    },
                    displayName: {
                      type: "string",
                    },
                    typeName: {
                      type: "string",
                    },
                    specificMaps: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          displayName: {
                            type: "string",
                          },
                          mapName: {
                            type: "string",
                          },
                        },
                      },
                    },
                    modPack: {
                      type: "string",
                    },
                    randomChance: {
                      type: "number",
                    },
                    commands: {
                      type: "array",
                      items: {
                        type: "string",
                      },
                    },
                    endOfMatchCommands: {
                      type: "array",
                      items: {
                        type: "string",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      default: [],
    },
  };

  // Schema for saved mods
  const SavedModsSchema = {
    mods: {
      type: "array",
      items: {
        type: "object",
        properties: {
          modName: {
            type: "string",
          },
          version: {
            type: "string",
          },
          modMaps: {
            type: "array",
            items: {
              type: "object",
              properties: {
                displayName: {
                  type: "string",
                },
                mapName: {
                  type: "string",
                },
              },
            },
          },
        },
      },
    },
  };

  // Create the electron-store instances for persistent storage
  // userConfig is used to store user configuration data
  const userConfig = new Store({
    name: "userConfig",
    schema: userConfigSchema,
    migrations: {
      "1.0.0": (store) => {
        // Check if the value is a boolean
        const highContrastText = store.get("highContrastText");
        if (typeof highContrastText === "boolean") {
          // If it is, convert it to a string
          store.set("highContrastText", "text-[#aac0da]");
        }
      },
      "1.0.1": (store) => {
        // Add a setting to set search bar threshold
        store.set("searchBarThreshold", 30);
      },
    },
  });
  // savedJsons is used to store saved JSON data
  const savedJsons = new Store({
    name: "savedJsons",
    schema: savedJsonsSchema,
  });

  const savedMods = new Store({
    name: "savedMods",
    schema: SavedModsSchema,
    defaults: {
      mods: mods
    }
  });

  return { userConfig, savedJsons, savedMods };
};
