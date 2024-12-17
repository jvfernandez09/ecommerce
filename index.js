import express from 'express';
import { createHandler } from "graphql-http/lib/use/express";
import mongoose from "mongoose";
import { ruruHTML } from "ruru/server";
import { makeExecutableSchema } from '@graphql-tools/schema';
import { stitchSchemas } from '@graphql-tools/stitch';
import jwt from "jsonwebtoken";
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// CORS Options
const corsOptions = {
  allowedHeaders: ['Authorization'],
};

// Import your individual schemas and resolvers
import userSchema from './graphql/User/Schema.js';
import productSchema from './graphql/Product/Schema.js';
import reviewSchema from './graphql/Review/Schema.js';

import userResolvers from './graphql/User/Resolvers.js';
import productResolvers from './graphql/Product/Resolvers.js';
import reviewResolvers from './graphql/Review/Resolvers.js';

// Create executable schemas for both User and Product

const userExecutableSchema = makeExecutableSchema({
  typeDefs: userSchema,
  resolvers: userResolvers
});

const productExecutableSchema = makeExecutableSchema({
  typeDefs: productSchema,
  resolvers: productResolvers
});

const reviewExecutableSchema = makeExecutableSchema({
  typeDefs: reviewSchema,
  resolvers: reviewResolvers
})

// Stitch the schemas
const stitchedSchema = stitchSchemas({
  subschemas: [
    { schema: userExecutableSchema },
    { schema: productExecutableSchema },
    { schema: reviewExecutableSchema }
  ]
});

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/ecommerce-system");
mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
});

// Set up the Express server
const app = express();
app.use(cors(corsOptions));
app.use(express.json());

app.use(
  '/graphql',
  createHandler({
    schema: stitchedSchema,
    context: async (req) => {
      if (req?.headers?.authorization) {
        const token = req.headers.authorization.replace('Bearer ', '');
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          return { user: decoded };
        } catch (error) {
          console.error('Error verifying token:', error.message);
        }
      }

      return { user: null }
    },
  })
);


// Serve the GraphiQL IDE at root
app.get("/", (_req, res) => {
  res.type("html");
  res.end(ruruHTML({ endpoint: "/graphql" }));
});

// Start the server
app.listen(4000, () => console.log('Server running at http://localhost:4000/graphql'));
