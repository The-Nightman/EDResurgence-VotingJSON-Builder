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
    <aside
      className={`fixed top-9 ${
        sidebarOpen ? "right-0" : "-right-64"
      } h-[calc(100vh-2.25rem)] w-64 bg-gradient-to-b from-[#0d254ad9] to-[#061023d9] z-30`}
    >
      <button
        // due to nature of tailwind and component libraries an arbitrary value is used to target the svg element
        // [&] represents the parent and [&_p] represents a p tag child of the element that the style is applied to
        // this equates to .element > p in raw css
        // [&_svg] svg element of the icon that is child to the button
        // [&_svg>path] path child of the svg element
        // [&_svg>path]:origin-[40%_50%] sets origin 40% from the left and 50% from the top when open
        // [&_svg>path]:origin-[0%_50%] sets origin 0% from the left and 50% from the top when closed
        // top-[49%] is used because for some reason top-1/2 doesn't center the button vertically
        className={`fixed top-[49%] w-10 ${
          sidebarOpen
            ? "right-[16.2rem] [&_svg>path]:origin-[40%_50%]"
            : "-right-1 [&_svg>path]:origin-[0%_50%]"
        } [&_svg]:h-14 [&_svg>path]:scale-[1.75] text-[#5d616cea] dark:text-white hover:text-[#963E15] active:text-[#53220C]`}
        aria-label={`${sidebarOpen ? "Close" : "Open"} sidebar`}
        title={`${sidebarOpen ? "Close" : "Open"} sidebar`}
        draggable="false"
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
        className={`${!sidebarOpen && "hidden"} flex flex-col gap-y-2 h-full p-2 backdrop-blur-sm`}
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
    </aside>
  );
};
