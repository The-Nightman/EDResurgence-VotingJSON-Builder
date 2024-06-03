import { HelpOutline } from "@mui/icons-material";

interface ErrorDialogProps {
  errMsg: Error;
  onResolve: () => void;
}

/**
 * Represents an error dialog component.
 *
 * @component
 * @param {ErrorDialogProps} props - The component props.
 * @param {string} props.errMsg - The error object to display in the dialog.
 * @param {Function} props.onResolve - The callback function to resolve the blocking promise.
 * @returns {JSX.Element} The rendered ErrorDialog component.
 */
export const ErrorDialog = ({ errMsg, onResolve }: ErrorDialogProps) => {
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
      aria-label="Error Dialog"
      className="flex flex-col h-full w-[70%] my-4 mx-auto"
      aria-modal="true"
    >
      <h2 className="sr-only">ERROR</h2>
      <div className="flex flex-col gap-y-4 text-xl">
        <p>
          It appears that you have encountered an error, if you encountered this
          error while attempting to open game and map variant data please double
          check to make sure that the folder you are targeting matches the
          content structure example in the Open Folder dialog instructions.
        </p>
        <p>
          If you continue to encounter this error please copy the message below
          and report it to the issue tracker on the GitHub repository that can
          be found by clicking the <span className="sr-only">Help Button</span>
          <HelpOutline className="text-white" aria-hidden /> button on the top
          right of the window.
        </p>
        <code className="mb-4 p-3 rounded-md border border-slate-400 bg-gray-700 text-lg text-white select-text">
          {errMsg.message}
        </code>
      </div>
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
