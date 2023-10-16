import { mockedLoadDataMap, mockedViewDataMap, searchResultsMap } from "../mockedJson";

/**
 * A mock implementation of the DataService interface for testing purposes.
 */
export class MockDataService implements DataService {

  /**
   * Tries to retrieve the mocked data for a specified file; throws an error if the file is not found in the mocked data.
   * @param filePath specifies the file path for the file to be loaded
   * @returns a Promise that resolves to a LoadResponse containing the file path of the specified file
   */
  async loadFile(filePath: string): Promise<LoadResponse> {
    if (!mockedLoadDataMap.hasOwnProperty(filePath)) {
      throw new Error(`Could not find the following path: ${filePath}.`);
    }
    return mockedLoadDataMap[filePath];
  }

  /**
   * Retrieves the mocked view data for a loaded file.
   * @param loadedFile the loaded file map that contains important properties of the file
   * @returns a Promise that resolves to a ViewResponse containing the data of the specified file
   */
  async viewFile(loadedFile: LoadedFileMap): Promise<ViewResponse> {
    return mockedViewDataMap[loadedFile!.file_path];
    
  }

  /**
   * Retrieves the mocked search results for a given search key.
   * @param searchMapKey the key to find the mocked search response
   * @returns a Promise that resolves to a SearchResponse containing the search results 
   */
  async searchFile(searchMapKey: string): Promise<SearchResponse> {
    return searchResultsMap[searchMapKey];
  }
}
