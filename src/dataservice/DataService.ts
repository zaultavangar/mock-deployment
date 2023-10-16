/**
 * Defines the methods that any data service (mock or actual backend) should implement.
 */
interface DataService {
  /**
   * Retrieves the data associated with the specified file path.
   * @param filePath the path of the file to be loaded.
   */
  loadFile(filePath: string): Promise<LoadResponse>;
  /**
   * Retrieves a view or representation of the specified loaded file.
   * @param loadedFile an object representing the important properties of the loaded file
   */
  viewFile(loadedFile: LoadedFileMap): Promise<ViewResponse>;
  /**
   * Searches and retrieves results based on a specific key or criteria.
   * @param searchMapKey the key or criteria used for the search 
   */
  searchFile(searchMapKey: string): Promise<SearchResponse>;
}