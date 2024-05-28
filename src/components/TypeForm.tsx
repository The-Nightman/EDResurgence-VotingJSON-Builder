import { useEffect, useState } from "react";
import { MapObj, MapsVariantsData, ModData, TypeObj } from "../interfaces";
import { mods } from "../mods";
import { Tooltip } from "@mui/material";

interface TypeFormProps {
  mapsVariantsData: MapsVariantsData;
  index: number;
  handleSaveDelete: (type: TypeObj, operation: "delete" | "save") => void;
}

/**
 * Represents a form component for creating a new variant type.
 *
 * @component
 * @param {TypeFormProps} props - The component props.
 * @param {MapsVariantsData} props.mapsVariantsData - The data for maps and variants.
 * @param {number} props.index - The index of the variant in the parent state array.
 * @param {(type: TypeObj, operation: "delete" | "save") => void} props.handleSaveDelete - The callback function to save or delete the variant.
 * @returns {JSX.Element} The rendered component.
 */
export const TypeForm = ({
  mapsVariantsData,
  index,
  handleSaveDelete,
}: TypeFormProps) => {
  const [typeFormData, setTypeFormData] = useState<TypeObj>({
    id: index,
    displayName: "",
    typeName: "",
    modPack: "",
    randomChance: 0.1,
    specificMaps: [],
    commands: [],
    endOfMatchCommands: [],
  });
  const [selectedMod, setSelectedMod] = useState<ModData>({
    modName: "",
    modMaps: [],
  });

  // useEffect runs when the component mounts and when the modPack value changes
  useEffect(() => {
    // fetch the selected mod pack data from the mods array
    const modPackData: ModData | undefined = mods.find(
      (mod) => mod.modName === typeFormData.modPack
    );
    // if found, set the selected mod pack data, else set an empty object
    if (modPackData) {
      setSelectedMod(modPackData);
    } else {
      setSelectedMod({ modName: "", modMaps: [] });
    }
  }, [typeFormData.modPack]);

  // Vanilla base-game maps
  const vanillaMaps: MapObj[] = [
    { displayName: "Diamondback", mapName: "s3d_avalanche" },
    { displayName: "Edge", mapName: "s3d_edge" },
    { displayName: "Guardian", mapName: "guardian" },
    { displayName: "High Ground", mapName: "deadlock" },
    { displayName: "Icebox", mapName: "s3d_turf" },
    { displayName: "Last Resort", mapName: "zanzibar" },
    { displayName: "Narrows", mapName: "chill" },
    { displayName: "Reactor", mapName: "s3d_reactor" },
    { displayName: "Sandtrap", mapName: "shrine" },
    { displayName: "Standoff", mapName: "bunkerworld" },
    { displayName: "The Pit", mapName: "cyberdyne" },
    { displayName: "Valhalla", mapName: "riverworld" },
  ];

  /**
   * Handles the form submission.
   * Calls the handleSaveDelete callback function with the typeFormData and "save" operation.
   *
   * @param {React.FormEvent} e - The form event.
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSaveDelete(typeFormData, "save");
  };

  /**
   * Handles the server commands options for the given command type.
   * Explicitly written for the "commands" and "endOfMatchCommands" arrays.
   * Clones the chosen array and searches for the index of the command.
   * Command passed through input id in event.target.
   * Adds the command to the chosen commands array in typeFormData if index -1.
   * Removes the command from the chosen commands array in typeFormData if value -1.
   * Updates the command in the chosen commands array in typeFormData if failed both previous checks.
   * Sets the updated array in state.
   * Used in onChange events.
   *
   * @param {React.ChangeEvent<HTMLSelectElement>} e - The change event triggered by the select element.
   * @param {"commands" | "endOfMatchCommands"} commandType - The specific arrays in typeFormData to access.
   * Explicitly written array property names for DRY and error safety ("commands" or "endOfMatchCommands").
   *
   * @example
   * /// Modifies cloned array of commands in typeFormData and sets array in state.
   * handleServerCommands(e, "commands") => {
   * /// function body
   *   /// if the command is not found in the array, add it to the array
   *   if (index === -1) {
   *     setTypeFormData({
   *       /// copy the current state object via spread
   *       ...typeFormData,
   *       /// set the chosen array and append the command to the array
   *       [commandType]: [...typeFormData[commandType]!, `${id} ${value}`],
   *     });
   *   }
   * }
   */
  const handleServerCommands = (
    e: React.ChangeEvent<HTMLSelectElement>,
    commandType: "commands" | "endOfMatchCommands"
  ) => {
    // Destruction of value and id from event.target
    const { value, id }: { value: string; id: string } = e.target;
    // Clone the chosen array
    const arr: string[] = [...typeFormData[commandType]!];
    // Find the index of the command in the array or return -1 if not found
    const index: number = arr.findIndex((item) => item.includes(id));
    // If index not found
    if (index === -1) {
      setTypeFormData({
        ...typeFormData,
        // Append the new string value directly to the chosen array in state
        [commandType]: [...typeFormData[commandType]!, `${id} ${value}`],
      });
    }
    // If value is -1
    else if (value === "-1") {
      // Remove from disposable cloned array
      arr.splice(index, 1);
      setTypeFormData({
        ...typeFormData,
        // Replace chosen array with updated cloned array
        [commandType]: arr,
      });
    }
    // If index found and value not -1
    else {
      // Set the element in the cloned array at index to the new string value
      arr[index] = `${id} ${value}`;
      setTypeFormData({
        ...typeFormData,
        // Replace chosen array with updated cloned array
        [commandType]: arr,
      });
    }
  };

  return (
    <article>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-row justify-between">
          <h2 className="text-2xl">
            {typeFormData.typeName === ""
              ? "New Variant"
              : typeFormData.typeName}
          </h2>
          {/* Delete button */}
          <button
            title="Delete Type"
            aria-label="Delete Type"
            aria-description="Remove the Game Type from the JSON data"
            className="text-2xl"
            // type="button" to prevent form submission behaviour
            type="button"
            // onClick event to handle the deletion of the type
            // calls the handleSaveDelete callback fn with the typeFormData and "delete" operation
            onClick={() => handleSaveDelete(typeFormData, "delete")}
          >
            Delete
          </button>
          {/* Save button */}
          <button
            title="Save Type"
            aria-label="Save Type"
            aria-description="Save or Update Game Types to be written to the JSON"
            className="text-2xl"
            // uses form submission behaviour to call the form onSubmit event
            type="submit"
          >
            Save
          </button>
        </div>
        {/* Main form content */}
        <div>
          {/* Variant Settings */}
          <fieldset className="flex flex-row justify-between px-2 border-2 border-slate-900">
            <legend>Variant Settings</legend>
            <span className="sr-only">
              Select the Variant, Modpack and chance of appearing as a voting
              option
            </span>
            <Tooltip title="Select a Game Variant to play">
              <label className="flex flex-col min-w-48">
                Variant Select
                <select
                  className="font-sans rounded bg-[#a3bbd8]"
                  name="Variant select"
                  aria-description="Select a Game Variant to play"
                  id="typeName"
                  onChange={(e) => {
                    setTypeFormData({
                      ...typeFormData,
                      typeName: e.target.value,
                      displayName: e.target.value,
                    });
                  }}
                  defaultValue={""}
                  required
                >
                  <option value="" disabled>
                    Select a Variant
                  </option>
                  {mapsVariantsData.variants.map((variant) => (
                    <option key={variant} value={variant}>
                      {variant}
                    </option>
                  ))}
                </select>
              </label>
            </Tooltip>
            <Tooltip title="Select a Modpack to play with the Variant">
              <label className="flex flex-col min-w-48">
                Modpack Select
                <select
                  className="font-sans rounded bg-[#a3bbd8]"
                  name="Modpack select"
                  aria-description="Select a Modpack to play with the Variant"
                  id="modPack"
                  onChange={(e) => {
                    setTypeFormData({
                      ...typeFormData,
                      modPack: e.target.value,
                    });
                  }}
                  defaultValue={""}
                >
                  <option value="">None</option>
                  {mods.map((modPack) => (
                    <option key={modPack.modName} value={modPack.modName}>
                      {modPack.modName}
                    </option>
                  ))}
                </select>
              </label>
            </Tooltip>
            <Tooltip
              title="Set the Random Chance Weight for the Variant ranging from 0.1 (default) to 100. 
              Can be set to a custom value above 100 by typing or manually in the voting.json file"
            >
              <label className="flex flex-col min-w-48">
                Random Chance Weight
                <input
                  type="number"
                  className="font-sans pl-1 rounded bg-[#a3bbd8]"
                  name="Random Chance Weight"
                  aria-description="Set the Random Chance Weight for the Variant ranging from 0.1 (default) to 100. 
                  Can be set to a custom value above 100 by typing or manually in the voting.json file"
                  id="randomChance"
                  onChange={(e) => {
                    setTypeFormData({
                      ...typeFormData,
                      randomChance: parseFloat(e.target.value),
                    });
                  }}
                  defaultValue={0.1}
                  min={0.1}
                  max={100}
                  step={0.1}
                />
              </label>
            </Tooltip>
          </fieldset>
          {/* Server Override command options */}
          <fieldset className="flex flex-row flex-wrap gap-4 px-2 border-2 border-slate-900">
            <legend>Server Overrides</legend>
            <span className="sr-only">
              Select the Server commands to use when the game starts
            </span>
            <Tooltip title="Set the Sprint option for the Server">
              <label className="flex flex-col min-w-24">
                Sprint
                <select
                  className="font-sans rounded bg-[#a3bbd8]"
                  name="Sprint"
                  aria-description="Set the Sprint option for the Server"
                  id="Server.Sprint"
                  defaultValue={-1}
                  onChange={(e) => handleServerCommands(e, "commands")}
                >
                  <option value={-1}>None</option>
                  <option value={2}>Inherit</option>
                  <option value={0}>Disable</option>
                  <option value={1}>Enable</option>
                </select>
              </label>
            </Tooltip>
            <Tooltip title="Set the Unlimited Sprint option for the Server">
              <label className="flex flex-col min-w-24">
                Unlimited Sprint
                <select
                  className="font-sans rounded bg-[#a3bbd8]"
                  name="Unlimited Sprint"
                  aria-description="Set the Unlimited Sprint option for the Server"
                  id="Server.UnlimitedSprint"
                  defaultValue={-1}
                  onChange={(e) => handleServerCommands(e, "commands")}
                >
                  <option value={-1}>None</option>
                  <option value={0}>Disable</option>
                  <option value={1}>Enable</option>
                </select>
              </label>
            </Tooltip>
            <Tooltip title="Set the Assassinations option for the Server">
              <label className="flex flex-col min-w-24">
                Assassinations
                <select
                  className="font-sans rounded bg-[#a3bbd8]"
                  name="Assassinations"
                  aria-description="Set the Assassinations option for the Server"
                  id="Server.AssassinationEnabled"
                  defaultValue={-1}
                  onChange={(e) => handleServerCommands(e, "commands")}
                >
                  <option value={-1}>None</option>
                  <option value={0}>Disable</option>
                  <option value={1}>Enable</option>
                </select>
              </label>
            </Tooltip>
            <Tooltip title="Set the Number of Teams for the Server">
              <label className="flex flex-col min-w-24">
                Team Count
                <select
                  className="font-sans rounded bg-[#a3bbd8]"
                  name="Number Of Teams"
                  aria-description="Set the Number of Teams for the Server"
                  id="Server.NumberOfTeams"
                  defaultValue={-1}
                  onChange={(e) => handleServerCommands(e, "commands")}
                >
                  <option value={-1}>None</option>
                  {Array.from({ length: 9 }, (_, index) => index).map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </label>
            </Tooltip>
            <Tooltip
              title="Set the Team Size for the Server, this is the number of players 
                  assigned to a team before being assigned to the next team in the list. This is 
                  recommended to be set to 1 to distribute players evenly across teams."
            >
              <label className="flex flex-col min-w-24">
                Team Size
                <select
                  className="font-sans rounded bg-[#a3bbd8]"
                  name="Team Size"
                  aria-description="Set the Team Size for the Server, this is the number of players 
                  assigned to a team before being assigned to the next team in the list. This is 
                  recommended to be set to 1 to distribute players evenly across teams."
                  id="Server.TeamSize"
                  defaultValue={-1}
                  onChange={(e) => handleServerCommands(e, "commands")}
                >
                  <option value={-1}>None</option>
                  {Array.from({ length: 8 }, (_, index) => index + 1).map(
                    (num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    )
                  )}
                </select>
              </label>
            </Tooltip>
            <Tooltip title="Set the Podium option for the Server">
              <label className="flex flex-col min-w-24">
                Podium
                <select
                  className="font-sans rounded bg-[#a3bbd8]"
                  name="Podium"
                  aria-description="Set the Podium option for the Server"
                  id="Server.PodiumEnabled"
                  defaultValue={-1}
                  onChange={(e) => handleServerCommands(e, "commands")}
                >
                  <option value={-1}>None</option>
                  <option value={0}>Disable</option>
                  <option value={1}>Enable</option>
                </select>
              </label>
            </Tooltip>
            <Tooltip title="Set the Emotes option for the Server">
              <label className="flex flex-col min-w-24">
                Emotes
                <select
                  className="font-sans rounded bg-[#a3bbd8]"
                  name="Emotes"
                  aria-description="Set the Emotes option for the Server"
                  id="Server.EmotesEnabled"
                  defaultValue={-1}
                  onChange={(e) => handleServerCommands(e, "commands")}
                >
                  <option value={-1}>None</option>
                  <option value={0}>Disable</option>
                  <option value={1}>Enable</option>
                </select>
              </label>
            </Tooltip>
            <Tooltip title="Set the Podium Emotes option for the Server">
              <label className="flex flex-col min-w-24">
                Podium Emotes
                <select
                  className="font-sans rounded bg-[#a3bbd8]"
                  name="Podium Emotes"
                  aria-description="Set the Podium Emotes option for the Server"
                  id="Server.EmotesDuringPodiumEnabled"
                  defaultValue={-1}
                  onChange={(e) => handleServerCommands(e, "commands")}
                >
                  <option value={-1}>None</option>
                  <option value={0}>Disable</option>
                  <option value={1}>Enable</option>
                </select>
              </label>
            </Tooltip>
            <Tooltip title="Set the Kill Command option for the Server">
              <label className="flex flex-col min-w-24">
                Kill Command
                <select
                  className="font-sans rounded bg-[#a3bbd8]"
                  name="Kill Command"
                  aria-description="Set the Kill Command option for the Server"
                  id="Server.KillCommandEnabled"
                  defaultValue={-1}
                  onChange={(e) => handleServerCommands(e, "commands")}
                >
                  <option value={-1}>None</option>
                  <option value={0}>Disable</option>
                  <option value={1}>Enable</option>
                </select>
              </label>
            </Tooltip>
            <Tooltip title="Set the Kill Command During Podium option for the Server">
              <label className="flex flex-col min-w-24">
                Podium Kill Command
                <select
                  className="font-sans rounded bg-[#a3bbd8]"
                  name="Kill Command During Podium"
                  aria-description="Set the Kill Command During Podium option for the Server"
                  id="Server.KillCommandDuringPodiumEnabled"
                  defaultValue={-1}
                  onChange={(e) => handleServerCommands(e, "commands")}
                >
                  <option value={-1}>None</option>
                  <option value={0}>Disable</option>
                  <option value={1}>Enable</option>
                </select>
              </label>
            </Tooltip>
            <Tooltip title="Set the Near Victory Music option for the Server">
              <label className="flex flex-col min-w-24">
                Near Victory Music
                <select
                  className="font-sans rounded bg-[#a3bbd8]"
                  name="Near Victory Music"
                  aria-description="Set the Near Victory Music option for the Server"
                  id="Server.NearVictoryMusicEnabled"
                  defaultValue={-1}
                  onChange={(e) => handleServerCommands(e, "commands")}
                >
                  <option value={-1}>None</option>
                  <option value={0}>Disable</option>
                  <option value={1}>Enable</option>
                </select>
              </label>
            </Tooltip>
            <Tooltip title="Set the Post Match Music option for the Server">
              <label className="flex flex-col min-w-24">
                Post Match Music
                <select
                  className="font-sans rounded bg-[#a3bbd8]"
                  name="Post Match Music"
                  aria-description="Set the Post Match Music option for the Server"
                  id="Server.PostMatchMusicEnabled"
                  defaultValue={-1}
                  onChange={(e) => handleServerCommands(e, "commands")}
                >
                  <option value={-1}>None</option>
                  <option value={0}>Disable</option>
                  <option value={1}>Enable</option>
                </select>
              </label>
            </Tooltip>
          </fieldset>
          {/* End of MatchServer Override command options */}
          <fieldset className="flex flex-row flex-wrap gap-4 px-2 border-2 border-slate-900">
            <legend>End of Match Server Overrides</legend>
            <span className="sr-only">
              Select the Server commands to use when the game ends, usually used
              to reset commands before the next match
            </span>
            <Tooltip title="Set the Sprint option for the Server after the match ends">
              <label className="flex flex-col min-w-24">
                Sprint
                <select
                  className="font-sans rounded bg-[#a3bbd8]"
                  name="Sprint"
                  aria-description="Set the Sprint option for the Server after the match ends"
                  id="Server.Sprint"
                  defaultValue={-1}
                  onChange={(e) =>
                    handleServerCommands(e, "endOfMatchCommands")
                  }
                >
                  <option value={-1}>None</option>
                  <option value={2}>Inherit</option>
                  <option value={0}>Disable</option>
                  <option value={1}>Enable</option>
                </select>
              </label>
            </Tooltip>
            <Tooltip title="Set the Unlimited Sprint option for the Server after the match ends">
              <label className="flex flex-col min-w-24">
                Unlimited Sprint
                <select
                  className="font-sans rounded bg-[#a3bbd8]"
                  name="Unlimited Sprint"
                  aria-description="Set the Unlimited Sprint option for the Server after the match ends"
                  id="Server.UnlimitedSprint"
                  defaultValue={-1}
                  onChange={(e) =>
                    handleServerCommands(e, "endOfMatchCommands")
                  }
                >
                  <option value={-1}>None</option>
                  <option value={0}>Disable</option>
                  <option value={1}>Enable</option>
                </select>
              </label>
            </Tooltip>
            <Tooltip title="Set the Assassinations option for the Server after the match ends">
              <label className="flex flex-col min-w-24">
                Assassinations
                <select
                  className="font-sans rounded bg-[#a3bbd8]"
                  name="Assassinations"
                  aria-description="Set the Assassinations option for the Server after the match ends"
                  id="Server.AssassinationEnabled"
                  defaultValue={-1}
                  onChange={(e) =>
                    handleServerCommands(e, "endOfMatchCommands")
                  }
                >
                  <option value={-1}>None</option>
                  <option value={0}>Disable</option>
                  <option value={1}>Enable</option>
                </select>
              </label>
            </Tooltip>
            <Tooltip title="Set the Number of Teams for the Server after the match ends">
              <label className="flex flex-col min-w-24">
                Team Count
                <select
                  className="font-sans rounded bg-[#a3bbd8]"
                  name="Number Of Teams"
                  aria-description="Set the Number of Teams for the Server after the match ends"
                  id="Server.NumberOfTeams"
                  defaultValue={-1}
                  onChange={(e) =>
                    handleServerCommands(e, "endOfMatchCommands")
                  }
                >
                  <option value={-1}>None</option>
                  {Array.from({ length: 9 }, (_, index) => index).map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </label>
            </Tooltip>
            <Tooltip
              title="Set the Team Size for the Server after the match ends, this is the number of 
              players assigned to a team before being assigned to the next team in the list. 
              This is recommended to be set to 1 to distribute players evenly across teams."
            >
              <label className="flex flex-col min-w-24">
                Team Size
                <select
                  className="font-sans rounded bg-[#a3bbd8]"
                  name="Team Size"
                  aria-description="Set the Team Size for the Server after the match ends, this is the 
                  number of players assigned to a team before being assigned to the next team in the list. 
                  This is recommended to be set to 1 to distribute players evenly across teams."
                  id="Server.TeamSize"
                  defaultValue={-1}
                  onChange={(e) =>
                    handleServerCommands(e, "endOfMatchCommands")
                  }
                >
                  <option value={-1}>None</option>
                  {Array.from({ length: 8 }, (_, index) => index + 1).map(
                    (num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    )
                  )}
                </select>
              </label>
            </Tooltip>
            <Tooltip title="Set the Podium option for the Server after the match ends">
              <label className="flex flex-col min-w-24">
                Podium
                <select
                  className="font-sans rounded bg-[#a3bbd8]"
                  name="Podium"
                  aria-description="Set the Podium option for the Server after the match ends"
                  id="Server.PodiumEnabled"
                  defaultValue={-1}
                  onChange={(e) =>
                    handleServerCommands(e, "endOfMatchCommands")
                  }
                >
                  <option value={-1}>None</option>
                  <option value={0}>Disable</option>
                  <option value={1}>Enable</option>
                </select>
              </label>
            </Tooltip>
            <Tooltip title="Set the Emotes option for the Server after the match ends">
              <label className="flex flex-col min-w-24">
                Emotes
                <select
                  className="font-sans rounded bg-[#a3bbd8]"
                  name="Emotes"
                  aria-description="Set the Emotes option for the Server after the match ends"
                  id="Server.EmotesEnabled"
                  defaultValue={-1}
                  onChange={(e) =>
                    handleServerCommands(e, "endOfMatchCommands")
                  }
                >
                  <option value={-1}>None</option>
                  <option value={0}>Disable</option>
                  <option value={1}>Enable</option>
                </select>
              </label>
            </Tooltip>
            <Tooltip title="Set the Podium Emotes option for the Server after the match ends">
              <label className="flex flex-col min-w-24">
                Podium Emotes
                <select
                  className="font-sans rounded bg-[#a3bbd8]"
                  name="Podium Emotes"
                  aria-description="Set the Podium Emotes option for the Server after the match ends"
                  id="Server.EmotesDuringPodiumEnabled"
                  defaultValue={-1}
                  onChange={(e) =>
                    handleServerCommands(e, "endOfMatchCommands")
                  }
                >
                  <option value={-1}>None</option>
                  <option value={0}>Disable</option>
                  <option value={1}>Enable</option>
                </select>
              </label>
            </Tooltip>
            <Tooltip title="Set the Kill Command option for the Server after the match ends">
              <label className="flex flex-col min-w-24">
                Kill Command
                <select
                  className="font-sans rounded bg-[#a3bbd8]"
                  name="Kill Command"
                  aria-description="Set the Kill Command option for the Server after the match ends"
                  id="Server.KillCommandEnabled"
                  defaultValue={-1}
                  onChange={(e) =>
                    handleServerCommands(e, "endOfMatchCommands")
                  }
                >
                  <option value={-1}>None</option>
                  <option value={0}>Disable</option>
                  <option value={1}>Enable</option>
                </select>
              </label>
            </Tooltip>
            <Tooltip title="Set the Kill Command During Podium option for the Server after the match ends">
              <label className="flex flex-col min-w-24">
                Podium Kill Command
                <select
                  className="font-sans rounded bg-[#a3bbd8]"
                  name="Kill Command During Podium"
                  aria-description="Set the Kill Command During Podium option for the Server after the match ends"
                  id="Server.KillCommandDuringPodiumEnabled"
                  defaultValue={-1}
                  onChange={(e) =>
                    handleServerCommands(e, "endOfMatchCommands")
                  }
                >
                  <option value={-1}>None</option>
                  <option value={0}>Disable</option>
                  <option value={1}>Enable</option>
                </select>
              </label>
            </Tooltip>
            <Tooltip title="Set the Near Victory Music option for the Server after the match ends">
              <label className="flex flex-col min-w-24">
                Near Victory Music
                <select
                  className="font-sans rounded bg-[#a3bbd8]"
                  name="Near Victory Music"
                  aria-description="Set the Near Victory Music option for the Server after the match ends"
                  id="Server.NearVictoryMusicEnabled"
                  defaultValue={-1}
                  onChange={(e) =>
                    handleServerCommands(e, "endOfMatchCommands")
                  }
                >
                  <option value={-1}>None</option>
                  <option value={0}>Disable</option>
                  <option value={1}>Enable</option>
                </select>
              </label>
            </Tooltip>
            <Tooltip title="Set the Post Match Music option for the Server after the match ends">
              <label className="flex flex-col min-w-24">
                Post Match Music
                <select
                  className="font-sans rounded bg-[#a3bbd8]"
                  name="Post Match Music"
                  aria-description="Set the Post Match Music option for the Server after the match ends"
                  id="Server.PostMatchMusicEnabled"
                  defaultValue={-1}
                  onChange={(e) =>
                    handleServerCommands(e, "endOfMatchCommands")
                  }
                >
                  <option value={-1}>None</option>
                  <option value={0}>Disable</option>
                  <option value={1}>Enable</option>
                </select>
              </label>
            </Tooltip>
          </fieldset>
          {/* Maps select */}
          <fieldset className="flex flex-col gap-4 border-2 border-slate-900">
            <legend>Maps</legend>
            <span className="sr-only">
              Select the Maps to play with the Variant
            </span>
            {/* Vanilla Base-Game Maps */}
            <fieldset className="flex flex-row flex-wrap gap-4 px-2 border-2 border-slate-900">
              <legend>Vanilla Maps</legend>
              {vanillaMaps.map((map) => (
                <label className="w-32" key={map.mapName}>
                  <input
                    className="mr-1"
                    type="checkbox"
                    name={map.displayName}
                    id={map.displayName}
                    onChange={(e) => {
                      // store boolean and check if the input is checked
                      const checked = e.target.checked;
                      if (checked) {
                        // update the typeFormData state with the new map
                        setTypeFormData({
                          // clone typeFormData
                          ...typeFormData,
                          // clone the specificMaps array and append the map to the array
                          specificMaps: [
                            ...typeFormData.specificMaps,
                            {
                              displayName: map.displayName,
                              mapName: map.mapName,
                            },
                          ],
                        });
                      }
                      // if the input is not checked
                      else {
                        // update the typeFormData state with the map removed
                        setTypeFormData({
                          // clone typeFormData
                          ...typeFormData,
                          // filter the specificMaps array to remove the map
                          specificMaps: typeFormData.specificMaps.filter(
                            (item) =>
                              // check if the input map value is not the same as the map in the array
                              // this will only return maps that are not the same as the input map
                              item.mapName !== map.mapName
                          ),
                        });
                      }
                    }}
                  />
                  {map.displayName}
                </label>
              ))}
            </fieldset>
            {/* Mod Base Maps */}
            <fieldset className="flex flex-row flex-wrap gap-4 px-2 border-2 border-slate-900">
              <legend>Mod Base Maps</legend>
              {selectedMod.modMaps.map((map) => (
                <label className="w-32" key={map.mapName}>
                  <input
                    className="mr-1"
                    type="checkbox"
                    name={map.displayName}
                    id={map.displayName}
                    onChange={(e) => {
                      // store boolean and check if the input is checked
                      const checked = e.target.checked;
                      if (checked) {
                        // update the typeFormData state with the new map
                        setTypeFormData({
                          // clone typeFormData
                          ...typeFormData,
                          // clone the specificMaps array and append the map to the array
                          specificMaps: [
                            ...typeFormData.specificMaps,
                            {
                              displayName: map.displayName,
                              mapName: map.mapName,
                            },
                          ],
                        });
                      }
                      // if the input is not checked
                      else {
                        // update the typeFormData state with the map removed
                        setTypeFormData({
                          // clone typeFormData
                          ...typeFormData,
                          // filter the specificMaps array to remove the map
                          specificMaps: typeFormData.specificMaps.filter(
                            (item) =>
                              // check if the input map value is not the same as the map in the array
                              // this will only return maps that are not the same as the input map
                              item.mapName !== map.mapName
                          ),
                        });
                      }
                    }}
                  />
                  {map.displayName}
                </label>
              ))}
            </fieldset>
            {/* Custom Maps */}
            <fieldset className="flex flex-row flex-wrap gap-4 px-2 border-2 border-slate-900">
              <legend>Your Maps</legend>
              {mapsVariantsData.maps.map((map) => (
                <label className="w-32" key={map}>
                  <input
                    className="mr-1"
                    type="checkbox"
                    name={map}
                    id={map}
                    onChange={(e) => {
                      // store boolean and check if the input is checked
                      const checked = e.target.checked;
                      if (checked) {
                        // update the typeFormData state with the new map
                        setTypeFormData({
                          // clone typeFormData
                          ...typeFormData,
                          // clone the specificMaps array and append the map to the array
                          specificMaps: [
                            ...typeFormData.specificMaps,
                            { displayName: map, mapName: map },
                          ],
                        });
                      }
                      // if the input is not checked
                      else {
                        // update the typeFormData state with the map removed
                        setTypeFormData({
                          // clone typeFormData
                          ...typeFormData,
                          // filter the specificMaps array to remove the map
                          specificMaps: typeFormData.specificMaps.filter(
                            (item) =>
                              // check if the input map value is not the same as the map in the array
                              // this will only return maps that are not the same as the input map
                              item.displayName !== map || item.mapName !== map
                          ),
                        });
                      }
                    }}
                  />
                  {map}
                </label>
              ))}
            </fieldset>
          </fieldset>
        </div>
      </form>
    </article>
  );
};