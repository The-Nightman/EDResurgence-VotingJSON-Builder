// import the ModData typescript interface
import { ModData } from "../interfaces";

// declare the variable with the mod name in pascalCase and alphanumerics ONLY with the ModData interface declared as the type
// use 2 space indexing only
const modVarName: ModData = {
  // declare the modName value as the name for the mod .pak file that is present in \ElDewrito\mods\mod_db.json
  modName: "mod_name",
  // declare the modMaps as an array of objects with displayName and mapName as the key values
  modMaps: [{ displayName: "replace this with the name as seen in-game", mapName: "internal_map_filename" }],
};

// export the declared mod variable and import into mods/index.ts
export default modVarName;
