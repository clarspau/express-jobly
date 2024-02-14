// Import the function to be tested from the specified file
const { sqlForPartialUpdate } = require("./sql");

// Describe block for the sqlForPartialUpdate function
describe("sqlForPartialUpdate", function () {
     // Test case for when there is only 1 item to update
     test("works: 1 item", function () {
          // Call the sqlForPartialUpdate function with sample data
          const result = sqlForPartialUpdate(
               { f1: "v1" },
               { f1: "f1", fF2: "f2" });
          // Assert the result matches the expected output
          expect(result).toEqual({
               setCols: "\"f1\"=$1",
               values: ["v1"],
          });
     });

     // Test case for when there are 2 items to update
     test("works: 2 items", function () {
          // Call the sqlForPartialUpdate function with sample data
          const result = sqlForPartialUpdate(
               { f1: "v1", jsF2: "v2" },
               { jsF2: "f2" });
          // Assert the result matches the expected output
          expect(result).toEqual({
               setCols: "\"f1\"=$1, \"f2\"=$2",
               values: ["v1", "v2"],
          });
     });
});
