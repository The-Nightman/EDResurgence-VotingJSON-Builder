interface SaveFilesDialogProps {
  onResolve: () => void;
}

/**
 * Renders an informative dialog for saving the json files.
 * Dialog is rendered with a blocking promise before the async function can continue.
 *
 * @component
 * @param {SaveFilesDialogProps} props - The component props.
 * @param {Function} props.onResolve - The callback function to resolve the blocking promise.
 * @returns {JSX.Element} The rendered SaveFilesDialog component.
 */
export const SaveFilesDialog = ({ onResolve }: SaveFilesDialogProps) => {
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
      aria-label="Save Files Dialog"
      className="flex flex-col h-full min-w-[60%] w-min my-4 mx-auto"
    >
      <h2 className="text-5xl">SAVING JSON</h2>
      <p className="text-lg">
        The download links for mods cannot be guaranteed to be up to date
        releases, work or be provided at all. Please check your{" "}
        <code className="bg-gray-700 text-white text-base">mods.json</code>{" "}
        after saving and ensure that URL contained inside{" "}
        <code className="bg-gray-700 text-white text-base">package_url</code> is
        functioning or if a link is not provided, that a direct download link is
        pasted in its place as shown in the example below.
        <br />
        <strong>
          Note: The URL <span className="underline">must</span> be a direct
          download link, if it requires clicking a button or if it will not
          start a download when pasted in your browser it will not work. Discord
          attachment links are <span className="underline">not</span> suitable.
        </strong>
      </p>
      {/* mods.json example codeblock, DO NOT CHANGE INDEXING */}
      <pre className="mb-4 p-3 self-center rounded-md border border-slate-400 bg-gray-700 text-white">
        <code>
          {`{
  "mods": {
    "ED++": {
      "package_url": "http://example.com/ED%2B%2B.pak"
    }
  }
}`}
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
          title="Close Dialog"
          aria-label="Close Dialog"
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
