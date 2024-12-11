const Product = require('../../model/products');

const resolvers = {
  // Query Resolvers
  Query: {
    getProduct: async (_, { id }) => {
      try {
        const product = await Product.findById(id);
        if (!product) throw new Error('Product not found');
        return product;
      } catch (error) {
        throw new Error(error.message);
      }
    },
    getProducts: async () => {
      try {
        return await Product.find();
      } catch (error) {
        throw new Error(error.message);
      }
    },
  },

  // Mutation Resolvers
  Mutation: {
    createProduct: async (_, { input }) => {
      try {
        const newProduct = new Product(input);
        return await newProduct.save();
      } catch (error) {
        throw new Error(error.message);
      }
    },
    updateProduct: async (_, { id, input }) => {
      try {
        const updatedProduct = await Product.findByIdAndUpdate(id, input, { new: true });
        if (!updatedProduct) throw new Error('Product not found');
        return updatedProduct;
      } catch (error) {
        throw new Error(error.message);
      }
    },
    deleteProduct: async (_, { id }) => {
      try {
        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) throw new Error('Product not found');
        return deletedProduct;
      } catch (error) {
        throw new Error(error.message);
      }
    },
  },
};

module.exports = resolvers;
