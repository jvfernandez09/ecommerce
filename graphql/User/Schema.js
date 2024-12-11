const { buildSchema } = require("graphql");

const userSchema = buildSchema(`
  type Address {
    houseNumber: String
    street: String!
    barangay: String!
    municipality: String!
    province: String!
    postalCode: String!
    country: String! # Default to "Philippines" should be handled in resolvers
  }

  type User {
    id: ID!
    firstName: String!
    middleName: String
    lastName: String!
    email: String!
    password: String!
    address: Address
    role: String!
    createdAt: String!
    updatedAt: String!
  }
  
  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    getUser(id: ID!): User
    getUsers: [User]
  }
    
  type Mutation {
    signup(
      firstName: String!, 
      middleName: String, 
      lastName: String!, 
      email: String!, 
      password: String!, 
      role: String!,
      address: AddressInput
    ): AuthPayload!
    loginUser(email: String!, password: String!): AuthPayload!
    createUser(
      firstName: String!, 
      middleName: String, 
      lastName: String!, 
      email: String!, 
      password: String!, 
      role: String!,
      address: AddressInput
    ): User
    updateUser(
      id: ID!, 
      firstName: String, 
      middleName: String, 
      lastName: String, 
      email: String, 
      password: String, 
      role: String,
      address: AddressInput
    ): User
    deleteUser(id: ID!): User
  }

  input AddressInput {
    houseNumber: String
    street: String!
    barangay: String!
    municipality: String!
    province: String!
    postalCode: String!
    country: String! # Default to "Philippines" should be handled in resolvers
  }
`);

module.exports = userSchema;
