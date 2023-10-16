const jobsCSV = [
  ["Name", "Age", "Country", "Job"],
  ["Joe", 25, "USA", "Engineer"],
  ["Mary", 30, "Germany", "Chemist"],
  ["Bob", 20, "USA", "Writer"],
  ["Mark", 25, "France", "Professor"],
  ["Kate", 27, "China", "Engineer"],
  ["Jane", 35, "Italy", "Chef"],
];

const jobsCSVNoHeader = [
  ["Joe", 25, "USA", "Engineer"],
  ["Mary", 30, "Germany", "Chemist"],
  ["Bob", 20, "USA", "Writer"],
  ["Mark", 25, "France", "Professor"],
  ["Kate", 27, "China", "Engineer"],
  ["Jane", 35, "Italy", "Chef"],
];

const foodPricesCSV = [
  ["Food", "Price"],
  ["Pasta", "$1.25"],
  ["Apple", "$1.00"],
  ["Apple Juice", "$3.00"],
  ["Banana", "$0.25"],
  ["Eggs", "$6.50"],
  ["Chocolate Cake", "$10.20"],
];

const foodPricesCSVNoHeader = [
  ["Pasta", "$1.25"],
  ["Apple", "$1.00"],
  ["Apple Juice", "$3.00"],
  ["Banana", "$0.25"],
  ["Eggs", "$6.50"],
  ["Chocolate Cake", "$10.20"],
];

const locationsCSV = [
  ["Location","Temperature","Population"],
  ["Rhode Island",60,"1,096,000"],
  ["Ivory Coast",90,"27,048,000"],
  ["Buenos Aires",75,"15,490,000"],
  ["Vatican City",68.5,"825"],
];

const locationsCSVNoHeader = [
  ["Rhode Island",60,"1,096,000"],
  ["Ivory Coast",90,"27,048,000"],
  ["Buenos Aires",75,"15,490,000"],
  ["Vatican City",68.5,"825"],
];

const oneColumnCSV = [
  ["Age"],
  [10],
  [20],
  [15],
  [10],
  [3],
  [21]
];

const oneRowCSV = [
  [0.25, 0.8]
];

export const mockedLoadDataMap: { [key: string]: LoadResponse } = {
  "./data/jobs.csv": {
    result: "success",
    data: "./data/jobs.csv",
  },
  "./data/jobs_nh.csv": {
    result: "success",
    data: "./data/jobs_nh.csv",
  },
  "./data/food_prices.csv": {
    result: "success",
    data: "./data/food_prices.csv",
  },
  "./data/food_prices_nh.csv": {
    result: "success",
    data: "./data/food_prices_nh.csv",
  },
  "./data/locations.csv": {
    result: "success",
    data: "./data/locations.csv",
  },
  "./data/locations_nh.csv": {
    result: "success",
    data: "./data/locations_nh.csv",
  },
  "./data/one_column.csv": {
    result: "success",
    data: "./data/one_column.csv",
  },
  "./data/one_row.csv": {
    result: "success",
    data: "./data/one_row.csv",
  },
  "./data/invalid_file_that_succeeds.csv": {
    result: "success", // for testing view backend errors
    data: "./data/invalid_file_that_succeeds.csv"
  },
  "./data/invalid_file.csv": {
    result: "error_datasource: could not find invalid_file.csv",
    data: null,
  },
  "./data/leads_to_bad_request.csv": {
    result: "error_bad_request: malformed url",
    data: null,
  },
};

export const mockedViewDataMap: { [key: string]: ViewResponse } = {
  "./data/jobs.csv": {
    result: "success",
    data: jobsCSV,
  },
  "./data/jobs_nh.csv": {
    result: "success",
    data: jobsCSVNoHeader,
  },
  "./data/food_prices.csv": {
    result: "success",
    data: foodPricesCSV,
  },
  "./data/food_prices_nh.csv": {
    result: "success",
    data: foodPricesCSVNoHeader,
  },
  "./data/locations.csv": {
    result: "success",
    data: locationsCSV,
  },
  "./data/locations_nh.csv": {
    result: "success",
    data: locationsCSVNoHeader,
  },
  "./data/one_column.csv": {
    result: "success",
    data: oneColumnCSV,
  },
  "./data/one_row.csv": {
    result: "success",
    data: oneRowCSV,
  },
  "./data/invalid_file_that_succeeds.csv": {
    result: "error_datasource: could not find invalid_file_that_succeeds.csv",
    data: null,
  },
  "./data/invalid_file.csv": {
    result: "error_datasource: could not find invalid_file.csv",
    data: null,
  },
  "./data/leads_to_bad_request.csv": {
    result: "error_bad_request: malformed url",
    data: null,
  },
};

export const searchResultsMap: { [key: string]: SearchResponse } = {
  "./data/jobs.csv 1 25": {
    result: "success",
    data: [
      ["Name", "Age", "Country", "Job"],
      ["Joe", 25, "USA", "Engineer"],
      ["Mark", 25, "France", "Professor"],
    ],
  },
  "./data/jobs.csv Country USA": {
    result: "success",
    data: [
      ["Name", "Age", "Country", "Job"],
      ["Joe", 25, "USA", "Engineer"],
      ["Bob", 20, "USA", "Writer"],
    ],
  },
  "./data/jobs_nh.csv 1 20": {
    result: "success",
    data: [["Bob", 20, "USA", "Writer"]],
  },
  "./data/jobs_nh.csv Country USA": {
    result:
      "error_bad_request: cannot search by column name when the csv file has no header",
    data: null,
  },
  "./data/food_prices.csv 0 Eggs": {
    result: "success",
    data: [
      ["Food", "Price"],
      ["Eggs", "$6.50"],
    ],
  },
  "./data/food_prices.csv Price $1.25": {
    result: "success",
    data: [
      ["Food", "Price"],
      ["Pasta", "$1.25"],
    ],
  },
  "./data/food_prices.csv Price $0": {
    result: "success",
    data: [[]],
  },
  "./data/food_prices_nh.csv 0 \"Apple Juice\"": {
    result: "success",
    data: [
      ["Apple Juice", "$3.00"]
    ],
  },
  "./data/locations.csv 1,096,000": {
    result: "success",
    data: [
      ["Location","Temperature","Population"],
      ["Rhode Island",60,"1,096,000"]
    ],
  },
  "./data/locations.csv 75": {
    result: "success",
    data: [
      ["Location", "Temperature", "Population"],
      ["Buenos Aires",75,"15,490,000"]
    ],
  },
  './data/jobs.csv and("Name" has "Bob", 2 has "USA")': {
    result: "success",
    data: [
      ["Name", "Age", "Country", "Job"],
      ["Bob", 20, "USA", "Writer"]
    ],
  },
  './data/jobs.csv or("Name" has "Mary", 2 has "USA")': {
    result: "success",
    data: [
      ["Name", "Age", "Country", "Job"],
      ["Joe", 25, "USA", "Engineer"],
      ["Mary", 30, "Germany", "Chemist"],
      ["Bob", 20, "USA", "Writer"],
    ],
  },
  './data/jobs_nh.csv not(has "Mary")': {
    result: "success",
    data: [
      ["Joe", 25, "USA", "Engineer"],
      ["Bob", 20, "USA", "Writer"],
      ["Mark", 25, "France", "Professor"],
      ["Kate", 27, "China", "Engineer"],
      ["Jane", 35, "Italy", "Chef"],
    ],
  },
  './data/jobs.csv or("Age" has "25", and(2 has "USA", not("Job" has "Engineer")))': {
    result: "success",
    data: [
      ["Name", "Age", "Country", "Job"],
      ["Joe", 25, "USA", "Engineer"],
      ["Mark", 25, "France", "Professor"],
      ["Bob", 20, "USA", "Writer"],
    ],
  },
  "./data/jobs.csv Joe": {
    result: "error_bad_request: malformed url",
    data: null,
  },
  "./data/jobs.csv Joe 10": {
    result: "error_bad_request: malformed column index",
    data: null,
  },
};
