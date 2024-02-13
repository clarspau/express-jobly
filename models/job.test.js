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
 * Test the findAll method of the Job class with different filters.
 */
describe("findAll", function () {
     // Test to ensure findAll works without any filters
     test("works: no filter", async function () {
          // Call findAll method without any filters
          let jobs = await Job.findAll();
          // Expect the returned jobs to match the expected array of jobs
          expect(jobs).toEqual([
               {
                    id: testJobIds[0],
                    title: "Job1",
                    salary: 100,
                    equity: "0.1",
                    companyHandle: "c1",
                    companyName: "C1",
               },
               {
                    id: testJobIds[1],
                    title: "Job2",
                    salary: 200,
                    equity: "0.2",
                    companyHandle: "c1",
                    companyName: "C1",
               },
               {
                    id: testJobIds[2],
                    title: "Job3",
                    salary: 300,
                    equity: "0",
                    companyHandle: "c1",
                    companyName: "C1",
               },
               {
                    id: testJobIds[3],
                    title: "Job4",
                    salary: null,
                    equity: null,
                    companyHandle: "c1",
                    companyName: "C1",
               },
          ]);
     });

     // Test to ensure findAll works with a minimum salary filter
     test("works: by min salary", async function () {
          // Call findAll method with a minimum salary filter of 250
          let jobs = await Job.findAll({ minSalary: 250 });
          // Expect the returned jobs to match the expected array of jobs
          expect(jobs).toEqual([
               {
                    id: testJobIds[2],
                    title: "Job3",
                    salary: 300,
                    equity: "0",
                    companyHandle: "c1",
                    companyName: "C1",
               },
          ]);
     });

     // Test to ensure findAll works with an equity filter
     test("works: by equity", async function () {
          // Call findAll method with an equity filter set to true
          let jobs = await Job.findAll({ hasEquity: true });
          // Expect the returned jobs to match the expected array of jobs
          expect(jobs).toEqual([
               {
                    id: testJobIds[0],
                    title: "Job1",
                    salary: 100,
                    equity: "0.1",
                    companyHandle: "c1",
                    companyName: "C1",
               },
               {
                    id: testJobIds[1],
                    title: "Job2",
                    salary: 200,
                    equity: "0.2",
                    companyHandle: "c1",
                    companyName: "C1",
               },
          ]);
     });

     // Test to ensure findAll works with both a minimum salary and equity filter
     test("works: by min salary & equity", async function () {
          // Call findAll method with both a minimum salary filter of 150 and an equity filter set to true
          let jobs = await Job.findAll({ minSalary: 150, hasEquity: true });
          // Expect the returned jobs to match the expected array of jobs
          expect(jobs).toEqual([
               {
                    id: testJobIds[1],
                    title: "Job2",
                    salary: 200,
                    equity: "0.2",
                    companyHandle: "c1",
                    companyName: "C1",
               },
          ]);
     });

     // Test to ensure findAll works with a title filter
     test("works: by name", async function () {
          // Call findAll method with a title filter set to "ob1"
          let jobs = await Job.findAll({ title: "ob1" });
          // Expect the returned jobs to match the expected array of jobs
          expect(jobs).toEqual([
               {
                    id: testJobIds[0],
                    title: "Job1",
                    salary: 100,
                    equity: "0.1",
                    companyHandle: "c1",
                    companyName: "C1",
               },
          ]);
     });
});



/** 
 * Test the get method of the Job class 
 */

describe("get", function () {
     test("works", async function () {
          // Call get method with the ID of the first test job
          let job = await Job.get(testJobIds[0]);

          expect(job).toEqual({
               id: testJobIds[0],
               title: "Job1",
               salary: 100,
               equity: "0.1",
               // Expect the company details to be included in the job object
               company: {
                    handle: "c1",
                    name: "C1",
                    description: "Desc1",
                    numEmployees: 1,
                    logoUrl: "http://c1.img",
               },
          });
     });

     test("not found if no such job", async function () {
          try {
               // Call get method with an invalid job ID (0)
               await Job.get(0);
               // If get method doesn't throw an error, fail the test
               fail();
          } catch (err) {
               expect(err instanceof NotFoundError).toBeTruthy();
          }
     });
});



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
               id: testJobIds[0],
               companyHandle: "c1",
               ...updateData,
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
