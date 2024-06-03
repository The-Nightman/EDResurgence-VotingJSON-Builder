import Store from "electron-store";

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
      type: "boolean",
      default: false,
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

  // Create the electron-store instances for persistent storage
  // userConfig is used to store user configuration data
const userConfig = new Store({
    name: "userConfig",
    schema: userConfigSchema,
});
// savedJsons is used to store saved JSON data
const savedJsons = new Store({
    name: "savedJsons",
    schema: savedJsonsSchema,
});

return { userConfig, savedJsons };
};
