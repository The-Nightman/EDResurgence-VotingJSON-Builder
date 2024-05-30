interface DialogFoundationProps {
  child: React.ReactNode;
}

/**
 * Renders a reusable dialog scaffold foundation component.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {React.ReactElement} props.child - The child component to render inside the dialog.
 * @returns {JSX.Element} The rendered dialog foundation component.
 */
export const DialogFoundation = ({ child }: DialogFoundationProps) => {
  return (
    <div className="fixed bottom-0 left-0 h-[calc(100vh-2.25rem)] w-full flex justify-center items-center backdrop-blur-sm">
      <div className="flex flex-col h-[72vh] w-full items-center">
        <div className="h-[10vh] w-full border-y-[1px] border-[#FFFFFF33] bg-[#0a0e14cc]" />
        <div className="flex flex-col h-full w-full bg-gradient-to-b from-[#445e8dbd] to-[#11203bd9] overflow-y-scroll">
          {child}
        </div>
        <div className="h-[10vh] w-full border-y-[1px] border-[#FFFFFF33] bg-[#0a0e14cc]" />
      </div>
    </div>
  );
};
