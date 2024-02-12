const { sqlForPartialUpdate } = require("./sql");
const { BadRequestError } = require("../expressError");

// Test suite for the sqlForPartialUpdate function
describe("sqlForPartialUpdate", () => {
     // Test case 1: generates SQL query parameters for a partial update
     test("generates SQL query parameters for a partial update", () => {
          // Arrange: Define test data
          const dataToUpdate = {
               firstName: "Brenda",
               lastName: "Song",
          };

          // Define JavaScript to SQL mapping
          const jsToSql = {
               firstName: "first_name",
               lastName: "last_name",
          };

          // Act: Call the function under test
          const result = sqlForPartialUpdate(dataToUpdate, jsToSql);

          // Assert: Check if the function returns the expected result
          expect(result).toEqual({
               setCols: '"first_name"=$1, "last_name"=$2', // Expected SQL SET clause
               values: ["Brenda", "Song"], // Expected values for SQL query
          });
     });

     // Test case 2: throws BadRequestError if no data is provided for update
     test("throws BadRequestError if no data is provided for update", () => {
          // Arrange: Define test data (empty dataToUpdate)
          const dataToUpdate = {};
          const jsToSql = {}; // JavaScript to SQL mapping is not relevant here

          // Act & Assert: Ensure that the function throws BadRequestError
          expect(() => {
               sqlForPartialUpdate(dataToUpdate, jsToSql);
          }).toThrow(BadRequestError);
     });
});
