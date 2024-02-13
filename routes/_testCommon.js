"use strict";

// Import necessary modules
const db = require("../db.js");
const User = require("../models/user");
const Company = require("../models/company");
const Job = require("../models/job");
const { createToken } = require("../helpers/tokens");

// Array to store test job IDs
const testJobIds = [];

// Function to set up common data before all tests
async function commonBeforeAll() {
  // Clear the users and companies tables
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM users");
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM companies");

  // Create three sample companies
  await Company.create({
    handle: "c1",
    name: "C1",
    numEmployees: 1,
    description: "Desc1",
    logoUrl: "http://c1.img",
  });
  await Company.create({
    handle: "c2",
    name: "C2",
    numEmployees: 2,
    description: "Desc2",
    logoUrl: "http://c2.img",
  });
  await Company.create({
    handle: "c3",
    name: "C3",
    numEmployees: 3,
    description: "Desc3",
    logoUrl: "http://c3.img",
  });

  // Create three sample jobs and store their IDs
  testJobIds[0] = (await Job.create({
    title: "j1",
    salary: 100,
    equity: "0.1",
    companyHandle: "c1",
  })).id;
  testJobIds[1] = (await Job.create({
    title: "j2",
    salary: 200,
    equity: "0.2",
    companyHandle: "c2",
  })).id;
  testJobIds[2] = (await Job.create({
    title: "j3",
    salary: 300,
    // equity is null to test that it is set to 0
    companyHandle: "c3",
  })).id;

  // Register three sample users and apply one of them to a job
  await User.register({
    username: "u1",
    firstName: "U1F",
    lastName: "U1L",
    email: "user1@user.com",
    password: "password1",
    isAdmin: false,
  });
  await User.register({
    username: "u2",
    firstName: "U2F",
    lastName: "U2L",
    email: "user2@user.com",
    password: "password2",
    isAdmin: false,
  });
  await User.register({
    username: "u3",
    firstName: "U3F",
    lastName: "U3L",
    email: "user3@user.com",
    password: "password3",
    isAdmin: false,
  });
  await User.applyToJob("u1", testJobIds[0]);
}

// Function to set up common data before each test
async function commonBeforeEach() {
  await db.query("BEGIN");
}

// Function to clean up data after each test
async function commonAfterEach() {
  await db.query("ROLLBACK");
}

// Function to clean up data after all tests
async function commonAfterAll() {
  await db.end();
}

// Generate tokens for sample users
const u1Token = createToken({ username: "u1", isAdmin: false });
const u2Token = createToken({ username: "u2", isAdmin: false });
const adminToken = createToken({ username: "admin", isAdmin: true });


module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
  u2Token,
  adminToken,
  testJobIds
};
