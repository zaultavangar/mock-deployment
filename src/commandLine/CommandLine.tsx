import { useState } from "react";
import "./CommandLine.css";
import { MockDataService } from "../dataservice/MockDataService";

/**
 * Defines the properties (props) for the CommandLine component
 */
interface CommandLineProps {
  setMode: React.Dispatch<React.SetStateAction<ModeString>>;
  loadedFile: LoadedFileMap | null;
  setLoadedFile: React.Dispatch<React.SetStateAction<LoadedFileMap | null>>;
  setHistory: React.Dispatch<React.SetStateAction<OutputMap[]>>;
}

/**
 * CommandLine Component
 *
 * An interactive UI component that acts as a command line interface.
 * Users can execute commands like load_file, view, search, and mode to
 * interact with CSV data. The results of the commands or any errors are
 * then displayed to the user.
 *
 * @param props - The properties passed to this component.
 * @returns - JSX.Element
 */
export const CommandLine = (props: CommandLineProps) => {
  const { setMode, loadedFile, setLoadedFile, setHistory } = props;

  const dataService: DataService = new MockDataService(); // the data service to defines how we get responses

  const [inputCommand, setInputCommand] = useState<string>(""); // holds the user's input command
  const [error, setError] = useState<string>("");

  /**
   * Updates the inputCommand state variable as the user types.
   * @param e the React ChangeEvent
   */
  const handleInputCommandChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputCommand(e.target.value);
  };

  /**
   * Loads a file given the specified file path.
   * @param filePath the file path of the file
   * @param hasHeader true if the csv file has a header, false otherwise
   * @param inputCommand the input command the user typed in
   */
  const loadFile = async (filePath: string, hasHeader: boolean, inputCommand: string) => {
    try {
      let response: LoadResponse = await dataService.loadFile(filePath); // Next sprint: call backend for load, get a response
      if (response.result === 'success'){
        let resFilePath = response.data!; // if success, data will always exist
        let fileMap: LoadedFileMap = {
          file_path: resFilePath,
          hasHeader: hasHeader
        }
        setLoadedFile(fileMap); // save the properties of the loaded file
        setHistory((prev) => [ // update the history 
          ...prev,
          { command: inputCommand, output: resFilePath },
        ]);
        setInputAndError("");
      }
      else {
        setInputAndError(`Backend error: ${response.result}.`);
      }
    } catch (err: any) {
      setInputAndError(err.message); // if the data service throws an error
    }
  };

  /**
   * Views a file.
   * @param inputCommand the command the user typed in 
   */
  const viewFile = async (inputCommand: string) => {
    let response: ViewResponse = await dataService.viewFile(loadedFile!);  // loadedFile not null (already checked)
    if (response){
      if (response.result === 'success'){
        setHistory((prev) => [ // update history
          ...prev,
          { command: inputCommand, hasHeader: loadedFile!.hasHeader, output: response.data},
        ]);
        setInputAndError("");
        
      } else {
        setInputAndError(`Backend error: ${response.result}.`);
      }
    } else {
      setInputAndError(`Could not find mocked view data for ${loadedFile!.file_path}.`)
    }
  };

  /**
   * Searches a file.
   * @param inputCommand the command the user typed in
   */
  // Note: searchQuery, colIndex, colName, target parameters will be needed when sending requests to the backend in the next sprint
  const searchFile = async (inputCommand: string) => {
    let searchMapKey: string = loadedFile!.file_path + " " + inputCommand.split(" ").slice(1).join(" "); // take out "search" from command for map key; loaded file not null (already checked)
    let response: SearchResponse = await dataService.searchFile(searchMapKey);
    if (response){
      if (response.result === 'success'){
        setHistory((prev) => [ // update history
          ...prev,
          { command: inputCommand, hasHeader: loadedFile!.hasHeader , output: response.data },
        ]);
        setInputAndError("");
      } else {
        setError(`Backend error: ${response.result}.`);
      }
    }
    else {
      setError(`Could not find mocked search results for ${inputCommand}.`);
    }
    
  };

  /**
   * Helper function to set error message and reset input command line
   * @param errorMsg the error message do display 
   */
  const setInputAndError = (errorMsg: string) => {
    setError(errorMsg);
    setInputCommand("");
  }


  /**
   * Function that triggers when the user enters their command
   * @param e 
   */
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // prevents page from being reloaded

    let input = inputCommand.trim();
    const [command, ...args] = input.toLowerCase().split(/ +/); // regex removes extra spaces if necessary

    switch (command) {
      case "mode": // mode command
        if (args.length !== 1) {
          setInputAndError('Incorrect usage: proper usage is "mode brief" or "mode verbose".');
          break;
        }
        if (args[0] === "brief" || args[0] === "verbose") {
          setInputAndError("");
          setMode(args[0]); // update the mode state variable
        } else {
          setInputAndError('Incorrect usage: word after "mode" must be either "brief" or "verbose".');
        }
        break;
      case "load_file": // load_file command
        if (args.length !== 2) {
          setInputAndError('Incorrect usage: proper usage is load_file <file_path> h (for files with headers) or load_file <file_path> nh (for files without headers).');
          break;
        }
        let hasHeader = args[1] === 'h' ? true : false;
        if (hasHeader === false && args[1] !== 'nh'){
          setInputAndError('Incorrect usage: proper usage is load_file <file_path> h (for files with headers) or load_file <file_path> nh (for files without headers).');
          break;
        }
        loadFile(args[0], hasHeader, input); // call method to load the file
        break;
      case "view": // view command
        if (args.length > 0) {
          setInputAndError('Incorrect usage: "view" must not be followed by any word or character.');
          break;
        }
        if (loadedFile === null) {
          setInputAndError('Must first load a file with "load_file <file_path>" before viewing.');
          break;
        }
        viewFile(input); // call method to view a file
        break;
      case "search": // search command
        if (loadedFile === null) {
          setInputAndError('Must first load a file with "load_file <file_path>" before searching.');
          break;
        }
        // split string by spaces, preserving quoted substrings
        const segments = args.join(" ").match(/"[^"]+"|\S+/g) || [];
        if (
          args.length > 0 && (
          segments.length <= 2 ||
          args[0].startsWith("and") ||
          args[0].startsWith("or") ||
          args[0].startsWith("not"))
        ) {
          /**
           * For next sprint, we need to determine the following to be able to call the backend smoothly:
           *    Whether we are dealing with a simple query or a complex query
           *    If simple query:
           *      Whether we are searching by column name or index and pass to searchFile
           *      Pass the target value we are searching for to searchFile
           *    If complex query:
           *      Pass the complex query to seachFile and parse/handle in the backend
           *
           */
          searchFile(input); // call method to search the file
        } 
        else {
          console.log("hello");
          setInputAndError('Incorrect usage: must either search with "search <column> <value>" or with "search <complex_query>", where the complex query starts with "and", "or", or "not".');
        }
        break;
      default:
        setInputAndError('Incorrect usage: commands must start with "mode", "load_file", "view", or "search".')
        break;
    }
  };

  return (
    <>
      <div className="command-line-container">
        <form className="command-line-form" onSubmit={handleSubmit}>
          <input
            id="command-line-input"
            placeholder="Enter a command"
            value={inputCommand}
            onChange={handleInputCommandChange}
            autoComplete="off"
          ></input>
        </form>
        {error && <div className="error-container">{error}</div>}
      </div>
    </>
  );
};

// For the next sprint: 

  // interface SearchFileOptions {
  //   inputCommand: string;
  //   searchQuery?: string;
  //   colIndex?: number;
  //   colName?: string;
  //   target?: string | number;
  // }

  //   const searchFile = ({
  //     inputCommand,
  //     searchQuery,
  //     colIndex,
  //     colName,
  //     target
  // }: SearchFileOptions)
