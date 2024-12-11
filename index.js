const express = require('express');
const { createHandler } = require("graphql-http/lib/use/express");
const mongoose = require("mongoose");
const { ruruHTML } = require("ruru/server");
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { stitchSchemas } = require('@graphql-tools/stitch');
require('dotenv').config();

// Import your individual schemas and resolvers
const userSchema = require('./graphql/User/Schema');
const productSchema = require('./graphql/Product/Schema');
const userResolvers = require('./graphql/User/Resolvers');
const productResolvers = require('./graphql/Product/Resolvers');

// Create executable schemas for both User and Product
const userExecutableSchema = makeExecutableSchema({
  typeDefs: userSchema,
  resolvers: userResolvers
});

const productExecutableSchema = makeExecutableSchema({
  typeDefs: productSchema,
  resolvers: productResolvers
});

// Stitch the schemas
const stitchedSchema = stitchSchemas({
  subschemas: [
    { schema: userExecutableSchema },
    { schema: productExecutableSchema }
  ]
});

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/ecommerce-system");
mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
});

// Set up the Express server
const app = express();

// Use the stitched schema for the /graphql endpoint
app.use('/graphql', createHandler({
  schema: stitchedSchema,
}));

// Serve the GraphiQL IDE at root
app.get("/", (_req, res) => {
  res.type("html");
  res.end(ruruHTML({ endpoint: "/graphql" }));
});

// Start the server
app.listen(4000, () => console.log('Server running at http://localhost:4000/graphql'));
