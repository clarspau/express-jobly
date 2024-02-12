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

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/** Test the create method of the Job class */

describe("create", function () {
     const newJob = {
          title: "New Test",
          companyHandle: "c1",
          salary: 150,
          equity: "0.1",
     };

     test("works", async function () {
          let job = await Job.create(newJob);
          expect(job).toEqual({
               id: expect.any(Number),
               title: "New Test",
               companyHandle: "c1",
               salary: 150,
               equity: "0.1",
          });
     })
});