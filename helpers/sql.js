const { BadRequestError } = require("../expressError");

// (THIS NEEDS SOME GREAT DOCUMENTATION.)

/**
 * Generates SQL query parameters for a partial update.
 *
 * @param {Object} dataToUpdate - An object containing the data to be updated.
 * 
 * @param {Object} jsToSql - An object mapping JavaScript-style column names to their corresponding SQL-style column names,
 * like { firstName: "first_name", age: "age" }.
 * 
 * @returns {Object} - An object containing the SQL SET clause and corresponding values for the update query.
 * 
 * @throws {BadRequestError} - If no data is provided for update.
 */

function sqlForPartialUpdate(dataToUpdate, jsToSql) {
  const keys = Object.keys(dataToUpdate);
  if (keys.length === 0) throw new BadRequestError("No data");

  // {firstName: 'Aliya', age: 32} => ['"first_name"=$1', '"age"=$2']
  const cols = keys.map((colName, idx) =>
    `"${jsToSql[colName] || colName}"=$${idx + 1}`,
  );

  return {
    setCols: cols.join(", "),
    values: Object.values(dataToUpdate),
  };
}

module.exports = { sqlForPartialUpdate };
