interface MapObj {
    displayName: string;
    mapName: string;
  }
  
  interface TypeObj {
    id?: number;
    displayName: string;
    typeName: string;
    specificMaps: MapObj[];
    modPack?: string;
    randomChance?: number;
    commands?: string[];
    endOfMatchCommands?: string[];
  }
  
  export interface SavedJsonData {
    name: string;
    date: number;
    data: {
      maps: MapObj[];
      types: TypeObj[];
    };
  }
  