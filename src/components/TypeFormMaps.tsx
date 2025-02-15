import {
  KeyboardArrowDownOutlined,
  KeyboardArrowUpOutlined,
} from "@mui/icons-material";
import DebouncedSearch from "./DebouncedSearch";
import { MapObj, MapsVariantsData, ModData, TypeObj } from "../interfaces";
import { useContext, useState } from "react";
import { SettingsContext } from "../contexts/SettingsContext";

interface FormState {
  formCollapsed: boolean;
  vanillaMapsCollapsed: boolean;
  modMapsCollapsed: boolean;
}

interface TypeFormMaps {
  formState: FormState;
  setFormState: React.Dispatch<React.SetStateAction<FormState>>;
  typeFormData: TypeObj;
  setTypeFormData: React.Dispatch<React.SetStateAction<TypeObj>>;
  selectedMod: ModData;
  mapsVariantsData: MapsVariantsData;
}

/**
 * TypeFormMaps component renders a form section for selecting maps.
 * It includes vanilla base-game maps, mod base maps, and custom maps.
 * The component also provides a search functionality to filter maps.
 *
 * @param {Object} props - The component props.
 * @param {Object} props.formState - The current state of the form.
 * @param {Function} props.setFormState - Function to update the form state.
 * @param {Object} props.typeFormData - The current state of the type form data.
 * @param {Function} props.setTypeFormData - Function to update the type form data.
 * @param {Object} props.selectedMod - The selected mod containing mod maps.
 * @param {Object} props.mapsVariantsData - Data containing maps and variants.
 *
 * @returns {JSX.Element} The rendered TypeFormMaps component.
 */
const TypeFormMaps = ({
  formState,
  setFormState,
  typeFormData,
  setTypeFormData,
  selectedMod,
  mapsVariantsData,
}: TypeFormMaps) => {
  const [mapSearch, setMapSearch] = useState<string>("");
  const { settings } = useContext(SettingsContext);

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

  return (
    <fieldset className="flex flex-col mt-4 gap-4">
      <legend>Maps</legend>
      <span className="sr-only">Select the Maps to play with the Variant</span>
      {mapsVariantsData.maps.length > settings.searchBarThreshold && (
        <DebouncedSearch
          defaultValue={mapSearch}
          updateParentState={setMapSearch}
        />
      )}
      {mapSearch ? (
        <fieldset>
          <div className="flex flex-row justify-between">
            <span className="self-center text-lg" aria-hidden>
              Results
            </span>
          </div>
          <div className={"flex flex-row flex-wrap gap-4 px-2"}>
            {[
              ...vanillaMaps,
              ...mapsVariantsData.maps.map((map) => ({
                displayName: map,
                mapName: map,
              })),
              ...selectedMod.modMaps,
            ]
              .filter((map) => {
                return map.displayName
                  .toLowerCase()
                  .includes(mapSearch.toLowerCase());
              })
              .map((map) => (
                <label className="w-32" key={map.mapName}>
                  <input
                    className="mr-1"
                    type="checkbox"
                    name={map.displayName}
                    id={map.displayName}
                    // check if the map is already in the specificMaps array
                    // this check is used for loading jsondata instead of making fresh json
                    checked={typeFormData.specificMaps.some(
                      (specificMap) => specificMap.mapName === map.mapName
                    )}
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
          </div>
        </fieldset>
      ) : (
        //  Vanilla Base-Game Maps
        <>
          <fieldset className="flex flex-col">
            <legend className="sr-only">Vanilla Maps</legend>
            <div className="flex flex-row justify-between">
              <span className="self-center text-lg" aria-hidden>
                Vanilla Maps
              </span>
              <button
                className="hover:text-[#963E15] active:text-[#53220C]"
                type="button"
                draggable="false"
                title={
                  formState.vanillaMapsCollapsed
                    ? "Open Vanilla Maps"
                    : "Close Vanilla Maps"
                }
                aria-label={
                  formState.vanillaMapsCollapsed
                    ? "Open Vanilla Maps"
                    : "Close Vanilla Maps"
                }
                aria-expanded={!formState.vanillaMapsCollapsed}
                onClick={() =>
                  setFormState({
                    ...formState,
                    vanillaMapsCollapsed: !formState.vanillaMapsCollapsed,
                  })
                }
              >
                {formState.vanillaMapsCollapsed ? (
                  <KeyboardArrowUpOutlined fontSize="large" />
                ) : (
                  <KeyboardArrowDownOutlined fontSize="large" />
                )}
              </button>
            </div>
            <div
              className={`${
                formState.vanillaMapsCollapsed ? "hidden" : "flex"
              } flex-row flex-wrap gap-4 px-2`}
            >
              {vanillaMaps.map((map) => (
                <label className="w-32" key={map.mapName}>
                  <input
                    className="mr-1"
                    type="checkbox"
                    name={map.displayName}
                    id={map.displayName}
                    // check if the map is already in the specificMaps array
                    // this check is used for loading jsondata instead of making fresh json
                    checked={typeFormData.specificMaps.some(
                      (specificMap) => specificMap.mapName === map.mapName
                    )}
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
            </div>
          </fieldset>
          {/* Mod Base Maps */}
          {selectedMod.modMaps.length > 0 && (
            <fieldset className="flex flex-col">
              <legend className="sr-only">Mod Base Maps</legend>
              <div className="flex flex-row justify-between">
                <span className="self-center text-lg" aria-hidden>
                  Mod Base Maps
                </span>
                <button
                  className="hover:text-[#963E15] active:text-[#53220C]"
                  type="button"
                  draggable="false"
                  title={
                    formState.modMapsCollapsed
                      ? "Open Mod Base Maps"
                      : "Close Mod Base Maps"
                  }
                  aria-label={
                    formState.modMapsCollapsed
                      ? "Open Mod Base Maps"
                      : "Close Mod Base Maps"
                  }
                  aria-expanded={!formState.modMapsCollapsed}
                  onClick={() =>
                    setFormState({
                      ...formState,
                      modMapsCollapsed: !formState.modMapsCollapsed,
                    })
                  }
                >
                  {formState.modMapsCollapsed ? (
                    <KeyboardArrowUpOutlined fontSize="large" />
                  ) : (
                    <KeyboardArrowDownOutlined fontSize="large" />
                  )}
                </button>
              </div>
              <div
                className={`${
                  formState.modMapsCollapsed ? "hidden" : "flex"
                } flex-row flex-wrap gap-4 px-2`}
              >
                {selectedMod.modMaps.map((map) => (
                  <label className="w-32" key={map.mapName}>
                    <input
                      className="mr-1"
                      type="checkbox"
                      name={map.displayName}
                      id={map.displayName}
                      // check if the map is already in the specificMaps array
                      // this check is used for loading jsondata instead of making fresh json
                      checked={typeFormData.specificMaps.some(
                        (specificMap) => specificMap.mapName === map.mapName
                      )}
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
              </div>
            </fieldset>
          )}
          {/* Custom Maps */}
          <fieldset className="flex flex-row flex-wrap gap-4 px-2">
            <legend className="text-lg -ml-[0.375rem]">Your Maps</legend>
            {mapsVariantsData.maps.map((map) => (
              <label className="w-32" key={map}>
                <input
                  className="mr-1"
                  type="checkbox"
                  name={map}
                  id={map}
                  // check if the map is already in the specificMaps array
                  // this check is used for loading jsondata instead of making fresh json
                  checked={typeFormData.specificMaps.some(
                    (specificMap) => specificMap.mapName === map
                  )}
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
        </>
      )}
    </fieldset>
  );
};

export default TypeFormMaps;
