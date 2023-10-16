import { test, expect } from "@playwright/test";

test("mode command with wrong format raises an error", async ({ page }) => {
  await page.goto("http://localhost:5173");

  // Command with word != brief,verbose as 2nd argument
  await page.fill("#command-line-input", "mode word");
  await page.press("#command-line-input", "Enter");

  // Wait for the error message to appear (assuming it appears within 0.5 seconds)
  const hasError = await page.waitForSelector(".error-container", {
    timeout: 500,
  });

  // Assert that an error is displayed
  expect(hasError).toBeTruthy();

  // Check that an error is displayed
  const errorText = await page.textContent(".error-container");
  expect(errorText).toBe(
    'Incorrect usage: word after "mode" must be either "brief" or "verbose".'
  );

  await page.fill("#command-line-input", "");

  // Commands with too many arguments
  const commands = ["mode verbose hello", "mode brief verbose"];
  for (const command of commands) {
    // Input the arbitrary command
    await page.fill("#command-line-input", command);
    await page.press("#command-line-input", "Enter");

    const hasError = await page.waitForSelector(".error-container", {
      timeout: 500,
    });
    expect(hasError).toBeTruthy(); // Assert that an error is displayed

    // Get the error text
    const errorText = await page.textContent(".error-container");
    expect(errorText).toBe(
      'Incorrect usage: proper usage is "mode brief" or "mode verbose".'
    );

    // Clear the input for the next command (if your app doesn't clear it automatically)
    await page.fill("#command-line-input", "");
  }

  await page.fill("#command-line-input", "mode ")
})

test("load_file with wrong format raises an error", async ({ page }) => {
  // Assuming your app is hosted locally on this URL
  await page.goto("http://localhost:5173");

  // Input a load_file command with an empty file name
  await page.fill("#command-line-input", "load_file ");
  await page.press("#command-line-input", "Enter");

  const hasError = await page.waitForSelector(".error-container", {
    timeout: 500,
  });
  expect(hasError).toBeTruthy(); // Assert that an error is displayed

  const errorMessage =  "Incorrect usage: proper usage is load_file <file_path> h (for files with headers) or load_file <file_path> nh (for files without headers).";

  // Check that an error is displayed
  const error = await page.textContent(".error-container");
  expect(error).toBe(errorMessage);

  // Input a load_file command without indicating whether there is a header or not
  await page.fill("#command-line-input", "load_file ./data/jobs.csv");
  await page.press("#command-line-input", "Enter");

  const hasError2 = await page.waitForSelector(".error-container", {
    timeout: 500,
  });
  expect(hasError2).toBeTruthy(); // Assert that an error is displayed

  // Check that an error is displayed
  const error2 = await page.textContent(".error-container");
  expect(error2).toBe(errorMessage);

  // Input a load_file command with an invalid value for the header indicator
  await page.fill("#command-line-input", "load_file ./data/jobs.csv z");
  await page.press("#command-line-input", "Enter");

  const hasError3 = await page.waitForSelector(".error-container", {
    timeout: 500,
  });
  expect(hasError3).toBeTruthy(); // Assert that an error is displayed

  // Check that an error is displayed
  const error3 = await page.textContent(".error-container");
  expect(error3).toBe(errorMessage);

  // Input a load_file command with file that is not found on frontend
  await page.fill("#command-line-input", "load_file ./data/jobsz.csv h");
  await page.press("#command-line-input", "Enter");

  const hasError4 = await page.waitForSelector(".error-container", {
    timeout: 500,
  });
  expect(hasError4).toBeTruthy(); // Assert that an error is displayed

  // Check that an error is displayed
  const error4 = await page.textContent(".error-container");
  expect(error4).toBe('Could not find the following path: ./data/jobsz.csv.');
});

test("error displayed for load_file that raises an error on the backend", async ({ page }) => {
  await page.goto("http://localhost:5173");

  await page.fill("#command-line-input", "load_file ./data/invalid_file.csv h");
  await page.press("#command-line-input", "Enter");

  const hasError = await page.waitForSelector(".error-container", {
    timeout: 500,
  });
  expect(hasError).toBeTruthy(); 

  const errorText = await page.textContent(".error-container");
  expect(errorText).toBe('Backend error: error_datasource: could not find invalid_file.csv.');

  await page.fill("#command-line-input", "load_file ./data/leads_to_bad_request.csv h");
  await page.press("#command-line-input", "Enter");

  const hasError2 = await page.waitForSelector(".error-container", {
    timeout: 500,
  });
  expect(hasError2).toBeTruthy(); 

  const errorText2 = await page.textContent(".error-container");
  expect(errorText2).toBe('Backend error: error_bad_request: malformed url.');

});

test("view command without previous load_file command raises an error", async ({page}) => {
  await page.goto("http://localhost:5173");

  await page.fill("#command-line-input", "view");
  await page.press("#command-line-input", "Enter");

  const hasError = await page.waitForSelector(".error-container", {
    timeout: 500,
  });
  expect(hasError).toBeTruthy(); // Assert that an error is displayed

  const errorText = await page.textContent(".error-container");
  expect(errorText).toBe('Must first load a file with "load_file <file_path>" before viewing.');
})

test("view command with wrong format raises error", async ({ page }) => {
  await page.goto("http://localhost:5173");

  // Load file first
  await page.fill("#command-line-input", "load_file ./data/jobs.csv h");
  await page.press("#command-line-input", "Enter");

  await page.fill("#command-line-input", "view jobs.csv");
  await page.press("#command-line-input", "Enter");

  const hasError = await page.waitForSelector(".error-container", {
    timeout: 500,
  });
  expect(hasError).toBeTruthy(); 

  const errorText = await page.textContent(".error-container");
  expect(errorText).toBe('Incorrect usage: "view" must not be followed by any word or character.');
});

test("error displayed for view command that raises an error on the backend", async ({ page }) => {
  await page.goto("http://localhost:5173");

  await page.fill("#command-line-input", "load_file ./data/invalid_file_that_succeeds.csv h");
  await page.press("#command-line-input", "Enter");

  await page.fill("#command-line-input", "view");
  await page.press("#command-line-input", "Enter");

  const hasError = await page.waitForSelector(".error-container", {
    timeout: 500,
  });
  expect(hasError).toBeTruthy(); 

  const errorText = await page.textContent(".error-container");
  expect(errorText).toBe('Backend error: error_datasource: could not find invalid_file_that_succeeds.csv.');
});

test("view command works correctly with proper usage", async ({ page }) => {
  await page.goto("http://localhost:5173");

  await page.fill("#command-line-input", "load_file ./data/one_row.csv nh");
  await page.press("#command-line-input", "Enter");

  await page.fill("#command-line-input", "view");
  await page.press("#command-line-input", "Enter");

  await page.waitForSelector('table');

  await page.fill("#command-line-input", "load_file ./data/one_column.csv h");
  await page.press("#command-line-input", "Enter");

  await page.fill("#command-line-input", "view");
  await page.press("#command-line-input", "Enter");

  await page.waitForSelector('table');
  
  // Test for correct output for one column data
  const headerContent = await page.textContent('thead th');
  expect(headerContent).toBe("Age");

  const rowsData = await page.$$eval('table tbody tr', rows => 
  rows.map(row => 
    Array.from(row.querySelectorAll('td'), cell => cell.textContent)
  )
  );
  const oneColumnDataExpectedRows = [["10"], ["20"], ["15"], ["10"], ["3"], ["21"]];
  const oneRowDataExpectedRows = [["0.25", "0.8"]];
  expect(rowsData).toEqual(oneColumnDataExpectedRows.concat(oneRowDataExpectedRows));
})

test("search command without previous load_file command raises an error", async ({page}) => {
  await page.goto("http://localhost:5173");

  await page.fill("#command-line-input", "search Country USA");
  await page.press("#command-line-input", "Enter");

  const hasError = await page.waitForSelector(".error-container", {
    timeout: 500,
  });
  expect(hasError).toBeTruthy(); 

  const errorText = await page.textContent(".error-container");
  expect(errorText).toBe('Must first load a file with "load_file <file_path>" before searching.');
});

test("search command with wrong format raises error", async ({ page}) => {
  await page.goto("http://localhost:5173");

  // Load file first
  await page.fill("#command-line-input", "load_file ./data/jobs.csv h");
  await page.press("#command-line-input", "Enter");

  // List of invalid search commands to test
  const commands = ["search", "search Country USA 2", 'search "Country" "USA and France" more'];

  for (const command of commands) {
    // Input the arbitrary command
    await page.fill("#command-line-input", command);
    await page.press("#command-line-input", "Enter");

    const hasError = await page.waitForSelector(".error-container", {
      timeout: 500,
    });
    expect(hasError).toBeTruthy(); 

    await page.waitForSelector(".error-container");

    // Get the error text
    const errorText = await page.textContent(".error-container");
    expect(errorText).toBe(
      'Incorrect usage: must either search with "search <column> <value>" or with "search <complex_query>", where the complex query starts with "and", "or", or "not".'
    );

  }
});

test("error displayed for search command that raises an error on the backend", async ({ page }) => {
  await page.goto("http://localhost:5173");

  await page.fill("#command-line-input", "load_file ./data/jobs_nh.csv nh");
  await page.press("#command-line-input", "Enter");

  // searching by column name when the csv has no header
  await page.fill("#command-line-input", "search Country USA");
  await page.press("#command-line-input", "Enter");

  const hasError = await page.waitForSelector(".error-container", {
    timeout: 500,
  });
  expect(hasError).toBeTruthy(); 

  const errorText = await page.textContent(".error-container");
  expect(errorText).toBe('Backend error: error_bad_request: cannot search by column name when the csv file has no header.');
})

test("arbitrary commands raise errors", async ({ page }) => {
  await page.goto("http://localhost:5173");

  // List of arbitrary commands to test
  const commands = ["modes", "load file test.csv", "view_csv", "arbitrary"];

  for (const command of commands) {
    await page.fill("#command-line-input", command);
    await page.press("#command-line-input", "Enter");

    const hasError = await page.waitForSelector(".error-container", {
      timeout: 500,
    });
    expect(hasError).toBeTruthy();

    const errorText = await page.textContent(".error-container");
    expect(errorText).toBe(
      'Incorrect usage: commands must start with "mode", "load_file", "view", or "search".'
    );

    // Clear the input for the next command (if your app doesn't clear it automatically)
    await page.fill("#command-line-input", "");
  }
});

test("mode command changes output shape", async ({ page }) => {
  await page.goto("http://localhost:5173");

  // Set mode to verbose
  await page.fill("#command-line-input", "mode verbose");
  await page.press("#command-line-input", "Enter");

  // Perform a command and expect a verbose output
  await page.fill("#command-line-input", "load_file ./data/jobs.csv h");
  await page.press("#command-line-input", "Enter");

  // Add assertions to check the verbose output in history
  const output = await page.textContent(".output-container");
  expect(output).toContain("Command");

  // check content of command
  const commandContents = await page.$$("#command-content");
  const latestCommandContent = await commandContents[commandContents.length - 1].textContent();
  expect(latestCommandContent).toBe("load_file ./data/jobs.csv h");

  // Set mode to brief
  await page.fill("#command-line-input", "mode brief");
  await page.press("#command-line-input", "Enter");

  // Perform a command (like 'view') and expect a verbose output
  await page.fill("#command-line-input", "load_file ./data/jobs.csv h");
  await page.press("#command-line-input", "Enter");

  const output2 = await page.textContent(".output-container");
  expect(output2).not.toContain("Command");
});

test("mode command (executed after multiple other commands) changes output shape", async ({ page }) => {
  await page.goto("http://localhost:5173");

  // Perform multiple commands and expect brief output
  await page.fill("#command-line-input", "load_file ./data/jobs.csv h");
  await page.press("#command-line-input", "Enter");

  await page.fill("#command-line-input", "view");
  await page.press("#command-line-input", "Enter");

  await page.fill("#command-line-input", "load_file ./data/food_prices_nh.csv nh");
  await page.press("#command-line-input", "Enter");

  await page.fill("#command-line-input", "view");
  await page.press("#command-line-input", "Enter");

  await page.fill("#command-line-input", "search 0 \"Apple Juice\"");
  await page.press("#command-line-input", "Enter");

  const output = await page.textContent(".output-container");
  expect(output).not.toContain("Command");

  // Set mode to verbose
  await page.fill("#command-line-input", "mode verbose");
  await page.press("#command-line-input", "Enter");

  // ensure that all commands are displayed 
  const commandContents = await page.$$("#command-content");
  expect(commandContents.length).toBe(5);
  const commandTexts = await Promise.all(commandContents.map(c => c.textContent()));
  expect(commandTexts).toEqual(["search 0 \"Apple Juice\"", "view", "load_file ./data/food_prices_nh.csv nh", "view", "load_file ./data/jobs.csv h"]);

  // change back to brief
  await page.fill("#command-line-input", "mode brief");
  await page.press("#command-line-input", "Enter");

  const output2 = await page.textContent(".output-container");
  expect(output2).not.toContain("Command");

})

test("load file changes current file status", async ({ page }) => {
  await page.goto("http://localhost:5173");

  // Set mode to verbose
  await page.fill("#command-line-input", "load_file ./data/jobs.csv h");
  await page.press("#command-line-input", "Enter");

  // view
  await page.fill("#command-line-input", "view");
  await page.press("#command-line-input", "Enter");

  // Perform a command (like 'view') and expect a verbose output
  await page.fill("#command-line-input", "load_file ./data/food_prices.csv h");
  await page.press("#command-line-input", "Enter");

  // view
  await page.fill("#command-line-input", "view");
  await page.press("#command-line-input", "Enter");

  const tables = await page.$$(".csv-table-container");
  const latestTable = await tables[0].textContent();
  const secondTable = await tables[1].textContent();

   // Latest CSV table loaded has food data 
  expect(latestTable).toContain("Food");

  // First CSV table does not have food data
  expect(secondTable).not.toContain("Food");

});

test("file with 'h' tag renders table with header", async ({ page }) => {
  await page.goto("http://localhost:5173");

  // Input command without 'h' tag
  await page.fill(
    "#command-line-input",
    "load_file ./data/locations.csv h"
  );
  await page.press("#command-line-input", "Enter");

  // View command to display the table
  await page.fill("#command-line-input", "view");
  await page.press("#command-line-input", "Enter");

  const theadElement = await page.$(
    ".csv-table-container .csv-data-table-head"
  );
  // const theadElement = await page.$(
  //   ".csv-table-container table thead.csv-data-table-head"
  // );
  expect(theadElement).toBeTruthy();
})

test("file with 'nh' tag renders table without header", async ({ page }) => {
  await page.goto("http://localhost:5173");

  // Input command without 'h' tag
  await page.fill(
    "#command-line-input",
    "load_file ./data/locations_nh.csv nh"
  );
  await page.press("#command-line-input", "Enter");

  // View command to display the table
  await page.fill("#command-line-input", "view");
  await page.press("#command-line-input", "Enter");

  const theadElement = await page.$(
    ".csv-table-container .csv-data-table-head"
  );
  expect(theadElement).toBeNull();
});

test("search command displays results correctly in table", async ({ page }) => {
  await page.goto("http://localhost:5173");

  await page.fill("#command-line-input", "load_file ./data/jobs.csv h");
  await page.press("#command-line-input", "Enter");

  await page.fill("#command-line-input", "search 1 25");
  await page.press("#command-line-input", "Enter");

  await page.fill("#command-line-input", "search Country USA");
  await page.press("#command-line-input", "Enter");

  await page.fill("#command-line-input", "load_file ./data/jobs_nh.csv nh");
  await page.press("#command-line-input", "Enter");

  await page.fill("#command-line-input", "search 1 20");
  await page.press("#command-line-input", "Enter");

  await page.fill("#command-line-input", "load_file ./data/food_prices.csv h");
  await page.press("#command-line-input", "Enter");

  await page.fill("#command-line-input", "search 0 Eggs");
  await page.press("#command-line-input", "Enter");

  await page.fill("#command-line-input", "search Price $1.25");
  await page.press("#command-line-input", "Enter");

  await page.fill("#command-line-input", "load_file ./data/food_prices_nh.csv nh");
  await page.press("#command-line-input", "Enter");

  await page.fill("#command-line-input", 'search 0 "Apple Juice"');
  await page.press("#command-line-input", "Enter");

  await page.fill("#command-line-input", "load_file ./data/locations.csv h");
  await page.press("#command-line-input", "Enter");

  await page.fill("#command-line-input", "search 1,096,000");
  await page.press("#command-line-input", "Enter");

  await page.fill("#command-line-input", "search 75");
  await page.press("#command-line-input", "Enter");

  const headerData = await page.$$eval('table thead tr', rows => 
    rows.map(row => 
    Array.from(row.querySelectorAll('th'), cell => cell.textContent)
    )
  );

  const rowsData = await page.$$eval('table tbody tr', rows => 
    rows.map(row => 
    Array.from(row.querySelectorAll('td'), cell => cell.textContent)
    )
  );
  const expectedHeaders = [
    ["Location", "Temperature", "Population"],
    ["Location", "Temperature", "Population"],
    ["Food", "Price"],
    ["Food", "Price"],
    ["Name", "Age", "Country", "Job"],
    ["Name", "Age", "Country", "Job"]
  ]
  const expectedData = [
    ["Buenos Aires", "75", "15,490,000"], // locations 'search 75'
    ["Rhode Island", "60", "1,096,000"], // locations 'search 1,096,000'
    ["Apple Juice", "$3.00"], // food prices nh 'search 0 "Apple Juice"'
    ["Pasta", "$1.25"], // food prices 'search Price $1.25'
    ["Eggs", "$6.50"], // food prices 'search 0 Eggs'
    ["Bob", "20", "USA", "Writer"], // jobs_nh 'search 1 20'
    ["Joe", "25", "USA", "Engineer"], // jobs 'search Country USA'
    ["Bob", "20", "USA", "Writer"],
    ["Joe", "25", "USA", "Engineer"], // jobs 'search 1 25'
    ["Mark", "25", "France", "Professor"],
  ]

  expect(headerData).toEqual(expectedHeaders);
  expect(rowsData).toEqual(expectedData);
})

test("complex search command displays results correctly in table", async ({ page }) => {
  await page.goto("http://localhost:5173");

  await page.fill("#command-line-input", "load_file ./data/jobs_nh.csv nh");
  await page.press("#command-line-input", "Enter");

  // not
  await page.fill("#command-line-input", 'search not(has "Mary")');
  await page.press("#command-line-input", "Enter");

  await page.fill("#command-line-input", "load_file ./data/jobs.csv h");
  await page.press("#command-line-input", "Enter");

  // and
  await page.fill("#command-line-input", 'search and("Name" has "Bob", 2 has "USA")');
  await page.press("#command-line-input", "Enter");

  // or
  await page.fill("#command-line-input", 'search or("Name" has "Mary", 2 has "USA")');
  await page.press("#command-line-input", "Enter");

  // nested
  await page.fill("#command-line-input", 'search or("Age" has "25", and(2 has "USA", not("Job" has "Engineer")))');
  await page.press("#command-line-input", "Enter");

  const headerData = await page.$$eval('table thead tr', rows => 
    rows.map(row => 
    Array.from(row.querySelectorAll('th'), cell => cell.textContent)
    )
  );

  const rowsData = await page.$$eval('table tbody tr', rows => 
    rows.map(row => 
    Array.from(row.querySelectorAll('td'), cell => cell.textContent)
    )
  );

  const expectedHeaders = [
    ["Name", "Age", "Country", "Job"],
    ["Name", "Age", "Country", "Job"],
    ["Name", "Age", "Country", "Job"]
  ]
  const expectedData = [
    ["Joe", "25", "USA", "Engineer"], // nested
    ["Mark", "25", "France", "Professor"],
    ["Bob", "20", "USA", "Writer"],
    ["Joe", "25", "USA", "Engineer"], // or
    ["Mary", "30", "Germany", "Chemist"],
    ["Bob", "20", "USA", "Writer"],
    ["Bob", "20", "USA", "Writer"], // and
    ["Joe", "25", "USA", "Engineer"],
    ["Bob", "20", "USA", "Writer"], // not
    ["Mark", "25", "France", "Professor"],
    ["Kate", "27", "China", "Engineer"],
    ["Jane", "35", "Italy", "Chef"],
  ]

  expect(headerData).toEqual(expectedHeaders);
  expect(rowsData).toEqual(expectedData);
});

test("search command that yields empty result is displayed properly", async ({ page }) => {
  await page.goto("http://localhost:5173");

  await page.fill("#command-line-input", "load_file ./data/food_prices.csv h");
  await page.press("#command-line-input", "Enter");

  await page.fill("#command-line-input", 'search Price $0');
  await page.press("#command-line-input", "Enter");

  const noResults = await page.waitForSelector("#no-results", {
    timeout: 500,
  });
  expect(noResults).toBeTruthy(); 

  const noResultsText = await page.textContent("#no-results");
  expect(noResultsText).toBe('No results found.');
})

// search complex queries

// search empty ouput

// test search output


