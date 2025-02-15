import React, { useEffect, useState } from "react";
import useDebounce from "../hooks/useDebounce";

interface DebouncedSearchProps {
  defaultValue?: string;
  updateParentState: React.Dispatch<React.SetStateAction<string>>;
}

/**
 * DebouncedSearch component provides a search input field with a debounced effect.
 * It updates the parent component's state after a specified delay when the user types in the search field.
 *
 * @param {Object} props - The properties object.
 * @param {string} props.defaultValue - The default value for the search input.
 * @param {Function} props.updateParentState - The function to update the parent component's state with the search input value.
 *
 * @returns {JSX.Element} The rendered DebouncedSearch component.
 */
const DebouncedSearch = ({
  defaultValue,
  updateParentState,
}: DebouncedSearchProps) => {
  const [search, setSearch] = useState<string>(defaultValue ?? "");
  const debouncedSearch = useDebounce<string>(search);

  useEffect(() => {
    updateParentState(search);
  }, [debouncedSearch]);

  return (
    <div>
      <input
        className="pl-6 placeholder:text-gray-700 bg-search-icon bg-no-repeat bg-left"
        type="search"
        name="Map Search"
        id="mapSearchbar"
        placeholder="Search Maps..."
        onChange={(e) => {
          setSearch(e.target.value);
        }}
      />
    </div>
  );
};

export default DebouncedSearch;
