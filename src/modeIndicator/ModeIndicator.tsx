import "./ModeIndicator.css";

// Define the properties (props) expected by the ModeIndicator component
interface ModeIndicatorProps {
  mode: ModeString;
}

/**
 * ModeIndicator Component
 *
 * This component visually displays the current mode of the application - "Brief" or "Verbose".
 * Depending on the active mode, it provides visual emphasis to guide the user's attention.
 *
 * @param props - The properties passed to this component.
 * @returns - JSX.Element
 */
export const ModeIndicator = (props: ModeIndicatorProps) => {
  const { mode } = props;

  return (
    <div className="mode-indicator-container">
      <div
        className={`mode-indicator ${
          mode == "brief" ? "mode-indicator-selected" : ""
        }`}
      >
        Brief
      </div>
      <div
        className={`mode-indicator ${
          mode == "verbose" ? "mode-indicator-selected" : ""
        }`}
      >
        Verbose
      </div>
    </div>
  );
};
