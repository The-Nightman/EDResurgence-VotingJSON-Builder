interface OpenDialogProps {
  onResolve: () => void;
}

/**
 * Renders an informative dialog for opening a folder.
 * Dialog is rendered with a blocking promise before the async function can continue.
 *
 * @component
 * @param {OpenDialogProps} props - The component props.
 * @param {Function} props.onResolve - The callback function to resolve the blocking promise.
 * @returns {JSX.Element} The rendered OpenFolderDialog component.
 */
export const OpenFolderDialog = ({ onResolve }: OpenDialogProps) => {
  /**
   * Handles the click event for the button.
   * Fires the onResolve callback fn to resolve the blocking promise allowing the async fn to continue.
   */
  const handleClick = () => {
    onResolve();
  };

  return (
    <div
      role="alertdialog"
      aria-label="Open Folder Dialog"
      className="flex flex-col h-full min-w-[60%] w-min my-4 mx-auto"
    >
      <h2 className="text-5xl">OPEN FOLDER</h2>
      <p className="text-lg">
        You should select either the{" "}
        <strong className="font-normal underline">data</strong> folder inside
        your ElDewrito 0.7 install located at{" "}
        <code className="bg-gray-700 text-white">..\..\ElDewrito\data</code>{" "}
        <strong className="font-normal">OR</strong> a folder that matches the
        following filepath structure containing the folders{" "}
        <code className="bg-gray-700 text-white">map_variants</code> and{" "}
        <code className="bg-gray-700 text-white">game_variants</code>.
      </p>
      {/* filepath codeblock, DO NOT CHANGE INDEXING */}
      <pre className="mb-4 p-3 rounded-md border border-slate-400 bg-gray-700 text-white">
        <code>
          {`/folderName/
           |
           |__/map_variants/
           |
           |__/game_variants/`}
        </code>
      </pre>
      {/* 
        button container
        relative and absolute positioning approach to give the button 
        visual text without having the animation apply to the text, button
        otherwise has text but only visible to screen-reader users.
        text for visual users is hidden to assistive tech
      */}
      <div className="relative flex h-7 mt-auto">
        <button
          className="hover:animate-pulse flex-grow hover:bg-[#963E15] active:bg-[#53220C]"
          onClick={handleClick}
        >
          <span className="sr-only">OK</span>
        </button>
        <span
          aria-hidden
          // pointer-events-none prevents text selection and click events allowing
          // the button to function seamlessly as the only clickable element
          className="absolute left-1/2 text-xl -translate-x-1/2 pointer-events-none"
        >
          OK
        </span>
      </div>
    </div>
  );
};
