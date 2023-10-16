# Mock-zsun32-xzhengy1-ztavanga

## Project Details:

### Project Name:

Mcok Project (Front-end for CSV Project)

### Contributor:

Zaul Tavangar(ztavanga) && Sun Zhenhao(zsun32)

### Time Spent:

25 Hours

### Link to Project Repository:

[GitHub Repository](https://github.com/cs0320-f23/mock-zsun32-xzhengy1-ztavanga)

## Proper Commands:

1. 'mode verbose' or 'mode brief'
2. 'load_file <csv_file_name> h / load_file <csv_file_name> nh'
3. 'view'
4. 'search <column_index/column_name> <target_value>'

## How to Run Projects/Tests

1. you need to first use command '**npm install**' to get all dependencies
2. use command **npm install --save-dev playwright** to download test package'
3. use command **npm install --save-dev playwright @playwright/test**
   to download test runner
4. use '**npm run dev**' to run the program
5. use '**npm test**' to run all the tests

## Design Choices:

### Implemented Components:

1. **csvTable:**

   - The CsvTable component serves as a dynamic visualizer for CSV data. It's designed to accept a two-dimensional array, representing rows of CSV data, and displays this data in an organized table format. The first row of the input data is interpreted as the header, defining the columns of the table.

2. **modelndicator:**

   - The ModeIndicator component provides a visual indication of the current mode setting in the application, whether it's in "Brief" or "Verbose" mode. Designed with a straightforward layout, this component showcases the two possible modes side by side. Depending on the currently active mode passed in as a prop, the component visually emphasizes the selected mode using styling cues.

3. **output:**

   - The Output component serves as a display panel to represent the history of commands and their results. Depending on the specified mode (verbose or otherwise), it can showcase the exact command issued, followed by its outcome. If the output is in the form of CSV data, it utilizes the CsvTable component for a structured tabular presentation; otherwise, it presents the direct output. The component processes the history in reverse order, ensuring the most recent actions are displayed first for easy access and comprehension.

4. **commandLine:**

   - The CommandLine component acts as an interactive command line interface where users can input various commands to interact with CSV data. It offers functionalities like loading a CSV file, viewing its content, searching within the loaded file, and toggling between "Brief" and "Verbose" display modes. Upon command execution, results or appropriate error messages are rendered based on the provided input. The component uses mock data and is designed for future integration with backend services.

5. **DataService:**

   - it defines a contract for data services within the application. This interface outlines three essential methods that any implementing data service (whether interacting with an actual backend or utilizing mock data) must furnish: loadFile, viewFile, and searchFile. These methods respectively manage the retrieval of data from a specified file path, obtaining a representation of a loaded file, and executing a search, delivering results corresponding to a particular key or criteria. Each method is designed to return a Promise that resolves with different response types (LoadResponse, ViewResponse, and SearchResponse), thereby ensuring that asynchronous operations, likely involving data fetching or processing, are handled appropriately. Consequently, DataService provides a structured blueprint that assists in ensuring consistency and reliability in the development and testing of data retrieval and manipulation functionalities across the application.

6. **MockDataService:**

   - a mock implementation of a DataService interface, intended for testing purposes within the application. It consists of three methods: loadFile, viewFile, and searchFile, each leveraging mocked data sourced from imported JSON maps (mockedLoadDataMap, mockedViewDataMap, and searchResultsMap). These methods manage the simulated loading, viewing, and searching of file data, respectively, facilitating controlled testing scenarios by returning predefined responses based on the input parameters. This mock service enables testing of application logic without actual data service interaction, ensuring that components and functionalities dependent on data retrieval can be verified under defined conditions and responses.

### Error && Bugs:

No errors/bugs that we are aware of. We made sure to rigorously test our frontend with playwright to eliminate errors.

### Tests:

1. **Test: load_file with wrong format raises an error**

   - Description: Evaluates the application's response when the load_file command is used with various incorrect formats. This includes:Not providing a file path.Providing just a file path without specifying if it has a header.Supplying a file path along with an unrecognized format indicator.In each of these scenarios, the test ensures that the appropriate error message is displayed, guiding the user to the correct usage of the load_file command with respect to headers.

2. **Test: error displayed for load_file that raises an error on the backend**

   - Description: Focuses on the application's behavior when a load_file command encounters backend issues. Scenarios include: The backend not finding the specified file. Encountering a malformed URL that results in a bad request.Ensures that relevant backend errors are suitably relayed to the user interface.

3. **Test: view command without previous load_file command raises an error**

   - Description: Evaluates the application's response when a view command is used without a preceding load_file command. Ensures that users are guided to load a file first before attempting to use the view command.

4. **Test: view command with wrong format raises an error**

   - Description: Investigates how the application handles incorrect view command formats after a file is successfully loaded using load_file. Specifically:Using view followed by additional characters/words.The test ensures that error messages are displayed accordingly, guiding users toward the correct usage.

5. **Test: error displayed for view command that raises an error on the backend**

   - Description: This test checks the application's error handling mechanism for the 'view' command, especially when an error is raised from the backend due to an attempt to view an invalid file. The expected outcome is that a specific error message about not finding the file will be displayed to the user.

6. **Test: view command works correctly with proper usage**

   - Description: The test explores the proper functioning of the 'view' command, ensuring that it accurately displays the correct data from single-row and single-column CSV files. It performs subsequent file loads and view commands to check that the displayed output changes as expected and verifies the output against predefined expected results.

7. **Test: search command without previous load_file command raises an error**

   - Description: This scenario tests the application’s response when a 'search' command is executed without prior file loading through the 'load_file' command. The test expects an error message to guide the user to use 'load_file' before attempting to perform a search.

8. **Test: search command with wrong format raises error**

   - Description: It aims to validate the application’s error handling and messaging when the 'search' command is executed with various incorrect formats, post a 'load_file' command. The test expects specific error messages that guide the user towards using the 'search' command correctly.

9. **Test: error displayed for search command that raises an error on the backend**

   - Description: This test examines the error handling when the 'search' command triggers a backend error due to attempting to search by column name in a file without headers. The desired outcome is that the error message accurately conveys the issue to the user regarding the backend error and the inability to search by column name without headers.

10. **Test: arbitrary commands raise errors**

- Description: This test ensures that the application properly handles and returns informative error messages when encountering arbitrary or unsupported commands. It aims to check whether any command that doesn’t start with "mode", "load_file", "view", or "search" is regarded as invalid and prompts an accurate error message.

11. **Test: mode command with wrong format raises an error**

- Description: This test evaluates the application's error handling when the 'mode' command is executed with various incorrect formats. Initially, it tests the use of an invalid word as a second argument, and later, it examines scenarios where too many arguments or an incorrect sequence of arguments are provided. The test ensures that precise error messages are displayed, guiding the user toward the correct usage of the 'mode' command.

12. **Test: file with 'h' tag renders table with header**

- Description: This test validates whether loading a file with an 'h' tag accurately renders a table with headers. After navigating to the designated page and issuing a 'load_file' command with an 'h' tag (indicating headers), and subsequently executing a 'view' command, the test checks for the presence of table headers in the output.

13. **Test: file with 'nh' tag renders table without header**

- Description: The objective here is to confirm that using the 'nh' tag during a file load operation results in rendering a table that lacks headers. After the 'load_file' command with an 'nh' tag is executed and the contents are viewed, the test ensures that no table header is present in the output.

14. **Test: search command displays results correctly in table**

- Description: This test involves a series of 'load_file' and 'search' command executions, ensuring that the search functionality accurately affects the displayed table results. The application should demonstrate the capacity to perform simple searches, affecting the rendered table accordingly. After a series of command executions, the test asserts that the headers and data in the resultant tables match the expected output, validating the accuracy of the searches.

15. **Test: complex search command displays results correctly in table**

- Description: This test ensures that the application can handle complex search queries involving logical operators like and, or, and not, even with nested conditions. The test performs a series of 'load_file' and 'search' commands, involving simple and complex logical conditions in the searches. Subsequent assertions check whether the resultant table headers and data align with expected outputs, affirming the efficacy and accuracy of the complex search functionality.

16. **Test: search command that yields empty result is displayed properly**

- Description: This test focuses on validating the application's behavior when a search command yields no results. After loading a file and executing a search that is expected to return no results, the application should display a suitable message indicating the absence of results. The test asserts that the appropriate message is displayed, verifying that the application handles empty search results gracefully.

17. **Test: mode command changes output shape**

- Description: This test case verifies that executing the 'mode' command alters the verbosity of the output generated by subsequent commands. It checks that after setting the mode to 'verbose', detailed outputs are produced (including "Command" and its actual content) and that upon switching to 'brief', these specifics are omitted. It performs several commands and checks the output content under both verbose and brief modes, ensuring the application adheres to the designated output verbosity.

18. **Test: mode command (executed after multiple other commands) changes output shape**

- Description: This test ensures that when the 'mode' command is executed after a sequence of various commands, it accurately alters the displayed output shape. Initially, the test validates that without explicitly setting the mode, the output does not display detailed command information. Subsequently, when the mode is set to 'verbose' after executing multiple commands, it confirms that the application displays all executed commands in the output and verifies the authenticity of the displayed commands.

19. **Test: load file changes current file status**

- Description: The test checks the functionality of the 'load_file' command to confirm that it accurately updates the current file status and affects the output of subsequent commands, such as 'view'. It checks the content of the displayed data to ensure it corresponds to the most recently loaded file. It switches between different datasets ('jobs.csv' and 'food_prices.csv') and validates that the data tables displayed reflect the expected content (in this case, it verifies that "Food" appears in the data table when 'food_prices.csv' is the last file loaded). This ensures the application correctly updates and displays the content corresponding to the most recently loaded data file.
