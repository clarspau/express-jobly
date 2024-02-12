"use strict";

const db = require("../db.js");
const Job = require("./job.js");
const { NotFoundError, BadRequestError } = require("../expressError");
const {
     commonBeforeAll,
     commonBeforeEach,
     commonAfterEach,
     commonAfterAll,
     testJobIds
} = require("./_testCommon");

// Setup before and after functions to run for all tests
beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);


/** 
 * Test the create method of the Job class 
 */

describe("create", function () {
     const newJob = {
          title: "New Test",
          companyHandle: "c1",
          salary: 150,
          equity: "0.1",
     };

     // Test creating a new job
     test("works", async function () {
          let job = await Job.create(newJob);
          expect(job).toEqual({
               id: expect.any(Number),
               title: "New Test",
               companyHandle: "c1",
               salary: 150,
               equity: "0.1",
          });
     });
});


/** 
 * Test the findAll method of the Job class 
 */

describe("findAll", function () {
     // Test finding all jobs without any filters
     test("works: no filter", async function () {
          let jobs = await Job.findAll({});
          expect(jobs).toEqual([
               // Array of expected job objects
          ]);
     });

     // Additional tests for filtering by title, minSalary, hasEquity, and combinations
});


/** 
 * Test the get method of the Job class 
 */

describe("get", function () {
     // Test getting a job by ID
     test("works", async function () {
          let job = await Job.get(testJobIds[0]);
          expect(job).toEqual({
               // Expected job object
          });
     });

     // Test for case when no job is found
     test("not found if no such job", async function () {
          try {
               await Job.get(-1);
               fail();
          } catch (err) {
               expect(err instanceof NotFoundError).toBeTruthy();
          }
     });
})


/** 
 * Test the update method of the Job class 
 */

describe("update", function () {
     const updateData = {
          title: "New",
          salary: 200,
          equity: "0.2",
     };

     // Test updating a job
     test("works", async function () {
          let job = await Job.update(testJobIds[0], updateData);
          expect(job).toEqual({
               // Expected updated job object
          });
     });

     // Test for case when no job is found for updating
     test("not found if there is no such job", async function () {
          try {
               await Job.update(0, {
                    title: "test",
               });
               fail();
          } catch (err) {
               expect(err instanceof NotFoundError).toBeTruthy();
          }
     });

     // Test for case when update data is empty
     test("bad request with no data", async function () {
          try {
               await Job.update(testJobIds[0], {});
               fail();
          } catch (err) {
               expect(err instanceof BadRequestError).toBeTruthy();
          }
     });
});


/** 
 * Test the remove method of the Job class 
 */

describe("remove", function () {
     // Test removing a job
     test("works", async function () {
          await Job.remove(testJobIds[0]);
          const res = await db.query(
               "SELECT id FROM jobs WHERE id=$1", [testJobIds[0]]);
          expect(res.rows.length).toEqual(0);
     });

     // Test for case when no job is found for removing
     test("not found if there is no such job", async function () {
          try {
               await Job.remove(0);
               fail();
          } catch (err) {
               expect(err instanceof NotFoundError).toBeTruthy();
          }
     });
});
