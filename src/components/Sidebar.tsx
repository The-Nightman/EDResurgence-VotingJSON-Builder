import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import { useState } from "react";
import { MapsVariantsData } from "../interfaces";

interface SidebarProps {
  mapsVariantsData: MapsVariantsData;
}

/**
 * Sidebar component that displays gametypes and maps from the target directories.
 *
 * @param {SidebarProps} props - The props of the Sidebar component.
 * @param {MapsVariantsData} props.mapsVariantsData - The object containing the maps and variants data.
 * @returns {JSX.Element} The rendered Sidebar component.
 */
export const Sidebar = ({ mapsVariantsData }: SidebarProps) => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  return (
    <section
      className={`fixed top-9 ${
        sidebarOpen ? "right-0" : "-right-64"
      } h-[calc(100vh-2.25rem)] w-64 p-2 bg-[#004CB4]/50`}
    >
      <button
        className={`fixed top-1/2 ${sidebarOpen ? "right-[17rem]" : "right-4"}`}
        aria-label={`${sidebarOpen ? "Close" : "Open"} sidebar`}
        title={`${sidebarOpen ? "Close" : "Open"} sidebar`}
        // toggle sidebarOpen state to open and close the sidebar
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? (
          <ArrowForwardIos fontSize="large" />
        ) : (
          <ArrowBackIos fontSize="large" />
        )}
      </button>
      <div
        className={`${!sidebarOpen && "hidden"} flex flex-col gap-y-2 h-full`}
      >
        <article className="flex flex-col grow h-[calc(50%-0.5rem)]">
          <h3 className="text-xl font-bold">GAMETYPES</h3>
          <div className="h-full overflow-y-scroll">
            {/* map and display variants from mapsVariantsData received from parent */}
            {mapsVariantsData.variants.map((variant) => (
              <p key={variant}>{variant}</p>
            ))}
          </div>
        </article>
        <article className="flex flex-col grow h-[calc(50%-0.5rem)]">
          <h3 className="text-xl font-bold">MAPS</h3>
          <div className="h-full overflow-y-scroll">
            {/* map and display maps from mapsVariantsData received from parent */}
            {mapsVariantsData.maps.map((map) => (
              <p key={map}>{map}</p>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
};
