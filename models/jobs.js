"use strict";

const db = require("../db");
const { NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");


/** Related functions for jobs. */
class Job {

     // Create a new job in the database
     static async create(data) {
          // Execute SQL query to insert job data into the database
          const result = await db.query(
               `INSERT INTO jobs (title, salary, equity, company_handle)
                VALUES ($1, $2, $3, $4)
                RETURNING id, title, salary, equity, company_handle AS "companyHandle"`,
               [data.title, data.salary, data.equity, data.companyHandle],
          );

          // Extract the created job from the query result
          let job = result.rows[0];

          return job;
     }

     // Find all jobs based on provided filters
     static async findAll({ minSalary, hasEquity, title }) {
          // Construct the initial SQL query to retrieve jobs data
          let query = `SELECT j.id,
                              j.title,
                              j.salary,
                              j.equity,
                              j.company_handle AS "companyHandle",
                              c.name AS "companyName"
                       FROM jobs j
                       LEFT JOIN companies AS c ON j.company_handle = c.handle`;

          // Initialize arrays to store WHERE clause expressions and query values
          let whereExpressions = [];
          let queryValues = [];

          // Add WHERE clause expressions based on provided filters

          // Add condition to filter jobs by minimum salary
          if (minSalary !== undefined) {
               queryValues.push(minSalary);
               whereExpressions.push(`salary >= $${queryValues.length}`);
          }

          // Add condition to filter jobs by equity availability
          if (hasEquity === true) {
               whereExpressions.push(`equity > 0`);
          }

          // Add condition to filter jobs by title (case-insensitive, partial match)
          if (title !== undefined) {
               queryValues.push(`%${title}%`);
               whereExpressions.push(`title ILIKE $${queryValues.length}`);
          }

          // Combine WHERE clause expressions if any exist
          if (whereExpressions.length > 0) {
               query += " WHERE " + whereExpressions.join(" AND ");
          }

          // Add ORDER BY clause to sort jobs by title
          query += " ORDER BY title";

          // Execute the SQL query to retrieve jobs data
          const jobsRes = await db.query(query, queryValues);

          return jobsRes.rows;
     }

     // Get job details by ID
     static async get(id) {
          // Retrieve job data from the database by ID
          const jobRes = await db.query(
               `SELECT id,
                       title,
                       salary,
                       equity,
                       company_handle AS "companyHandle"
                FROM jobs
                WHERE id = $1`,
               [id],
          );

          // Extract the job from the query result
          const job = jobRes.rows[0];

          // If job not found, throw a NotFoundError
          if (!job) throw new NotFoundError(`No job: ${id}`);

          // Retrieve company details associated with the job
          const companiesRes = await db.query(
               `SELECT handle, name, description, num_employees AS "numEmployees", logo_url AS "logoUrl"
                FROM companies
                WHERE handle = $1`,
               [job.companyHandle],
          );

          // Remove companyHandle property and replace it with company details
          delete job.companyHandle;
          job.company = companiesRes.rows[0];

          return job;
     }

     // Update job details by ID
     static async update(id, data) {
          // Generate SQL query for partial update of job details
          const { setCols, values } = sqlForPartialUpdate(
               data,
               {
                    companyHandle: "company_handle"
               });
          const idVarIdx = "$" + (values.length + 1);

          const querySql = `UPDATE jobs
                           SET ${setCols}
                           WHERE id = ${idVarIdx}
                           RETURNING id,
                                     title,
                                     salary,
                                     equity,
                                     company_handle AS "companyHandle"`;

          // Execute the SQL query to update job details
          const result = await db.query(querySql, [...values, id]);
          // Extract the updated job from the query result
          const job = result.rows[0];

          // If job not found, throw a NotFoundError
          if (!job) throw new NotFoundError(`No job: ${id}`);

          return job;
     }

     // Remove job by ID
     static async remove(id) {
          // Execute SQL query to delete job by ID
          const result = await db.query(
               `DELETE
                FROM jobs
                WHERE id = $1
                RETURNING id`,
               [id],
          );
          // Extract the deleted job from the query result
          const job = result.rows[0];

          // If job not found, throw a NotFoundError
          if (!job) throw new NotFoundError(`No job: ${id}`);
     }
}


module.exports = Job;
