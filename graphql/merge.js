// Merging typeDefs and resolvers
const { mergeTypeDefs, mergeResolvers } = require('@graphql-tools/merge');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const userSchema = require('./User/Schema');
const userResolvers = require('./User/Resolvers');
const productSchema = require('./Product/Schema');
const productResolvers = require('./Product/Resolvers');

// Merge typeDefs and resolvers
const typeDefs = mergeTypeDefs([userSchema, productSchema]);
const resolvers = mergeResolvers([userResolvers, productResolvers]);

// Create executable schema
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

module.exports = { schema };
