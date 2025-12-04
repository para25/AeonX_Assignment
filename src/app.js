// src/app.js
const express = require("express");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const app = express();

app.use(express.json());

// Temporary route to test server is running




module.exports = app;
