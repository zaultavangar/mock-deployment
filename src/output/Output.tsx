import { CsvTable } from "../csvTable/CsvTable";
import "./Output.css";

/**
 * Defines the properties (props) for the Output component
 */
interface OutputProps {
  mode: ModeString;
  history: OutputMap[];
}

/**
 * Output Component
 *
 * This component serves as a display area for representing the command history
 * and their respective outputs. In 'verbose' mode, it displays both the command
 * and its outcome. If the output is CSV data, a table format is employed using
 * the CsvTable component, otherwise the direct result is displayed.
 *
 * @param props - The properties passed to this component.
 * @returns - JSX.Element
 */
export const Output = (props: OutputProps) => {
  const { mode, history } = props;

  // loops through each result in the history and displays its associated output
  return (
    <div className="output-container">
      {history
        .slice()
        .reverse()
        .map((result, idx) => (
          <div className="results-container" key={`result ${idx}`}>
            {mode === "verbose" && (
              <div>
                <span id="command-header">Command: </span>
                <span id="command-content">{result.command}</span>
              </div>
            )}
            <div id="output-header">Output:</div>
            <div className="result-container">
              {Array.isArray(result.output) ? (
                <CsvTable 
                  historyResultOutput={result.output} 
                  hasHeader={result.hasHeader}
                />
              ) : (
                <>{result.output}</>
              )}
            </div>
          </div>
        ))}
    </div>
  );
};
