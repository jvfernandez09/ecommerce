const { buildSchema } = require('graphql');

const schema = buildSchema(`
  type Product {
    id: ID!
    name: String!
    description: String
    price: Float!
    stock: Int!
    category: String!
    attributes: ProductAttributes
    images: [String]
    createdAt: String
    updatedAt: String
  }

  input ProductAttributesInput {
    color: String
    size: String
  }

  input CreateProductInput {
    name: String!
    description: String
    price: Float!
    stock: Int!
    category: String!
    attributes: ProductAttributesInput
    images: [String]
  }

  input UpdateProductInput {
    name: String
    description: String
    price: Float
    stock: Int
    category: String
    attributes: ProductAttributesInput
    images: [String]
  }

  type ProductAttributes {
    color: String
    size: String
  }

  type Query {
    getProduct(id: ID!): Product
    getProducts: [Product]
  }

  type Mutation {
    createProduct(input: CreateProductInput!): Product
    updateProduct(id: ID!, input: UpdateProductInput!): Product
    deleteProduct(id: ID!): Product
  }
`);

module.exports = schema;
