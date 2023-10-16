import "./CsvTable.css";

/**
 * Defines the properties (props) for the CSVTable component
 */
interface CsvTableProps {
  // Two-dimensional array containing CSV data. Each inner array represents a row.
  // The first inner array is treated as the table's column headers.
  historyResultOutput: string[][];
  hasHeader: boolean | undefined;
}

/**
 * CsvTable Component
 *
 * This component is used to render CSV data as an HTML table.
 * The first row of the data is considered the header of the table, while
 * the subsequent rows are rendered as table rows.
 *
 * If the data is empty, a message "No results found for this search." is displayed.
 *
 * @param props - The properties passed to this component.
 * @returns - JSX.Element
 */
export const CsvTable = (props: CsvTableProps) => {
  const { historyResultOutput, hasHeader } = props;
  
  // will help us display the data in the correct format depending on the presence of a
  const copyIndex: number = hasHeader === true ? 1 : 0; 

  return (
    <div className='csv-table-container'>
      {historyResultOutput.length > 0 && historyResultOutput[0].length > 0 ? (
        <table>
          {(hasHeader !== undefined && hasHeader === true) && 
            <thead className="csv-data-table-head">
              <tr>
              {historyResultOutput[0].map((colHeader, colIndex) => (
                <th key={colIndex}>{colHeader}</th>
              ))}
              </tr>
            </thead>
          }
          {historyResultOutput.slice(copyIndex).length > 0 && (
            <tbody>
              {historyResultOutput.slice(copyIndex).map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          )}
        </table>
      ) : (
        <div id='no-results'>No results found.</div>
      )}
    </div>
  );
};
