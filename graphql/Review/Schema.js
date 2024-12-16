import { buildSchema } from "graphql";

// Define the GraphQL schema for product reviews using buildSchema
const schema = buildSchema(`
  type Review {
    id: ID!
    productId: ID!
    userId: ID!
    rating: Int!
    comment: String!
    createdAt: String
    updatedAt: String
  }

  input ReviewInput {
    productId: ID!
    rating: Int!
    comment: String!
  }

  type Mutation {
    addReview(input: ReviewInput!): Review!
    updateReview(id: ID!, input: ReviewInput!): Review!
    deleteReview(id: ID!): Review!
  }

  type Query {
    getProductReviews(productId: ID!): [Review]
    getUserReviews(userId: ID!): [Review]
  }
`);

export default schema;