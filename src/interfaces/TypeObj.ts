import { MapObj } from "./mapObj";

export interface TypeObj {
  displayName: string;
  typeName: string;
  specificMaps: MapObj[];
  modPack?: string;
  randomChance?: number;
  commands?: string[];
  endOfMatchCommands?: string[];
}
