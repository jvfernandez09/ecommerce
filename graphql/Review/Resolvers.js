import Review from '../../model/review.js';
import { withAuth } from '../../util/withAuth.js';

const resolvers = {
  Query: {
    // Get all reviews for a specific product
    getProductReviews: withAuth(async (_, { productId }) => {
      return await Review.find({ productId }); // Database query
    }),

    // Get all reviews by a specific user
    getUserReviews: withAuth(async (_, { userId }) => {
      return await Review.find({ userId }); // Database query
    }),
  },

  Mutation: {
    // Add a new review
    addReview: withAuth(async (_, { input }, context) => {
      const { productId, rating, comment } = input;
      const newReview = new Review({
        productId,
        userId: context?.user?.userId,
        rating,
        comment,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      await newReview.save();
      return newReview;
    }),

    // Update an existing review
    updateReview: withAuth(async (_, { id, input }) => {
      const review = await Review.findById(id);
      if (!review) throw new Error("Review not found");

      // Update review
      Object.assign(review, input, { updatedAt: new Date().toISOString() });
      await review.save();
      return review;
    }),

    // Delete a review
    deleteReview: withAuth(async (_, { id }) => {
      const review = await Review.findByIdAndDelete(id);
      if (!review) throw new Error("Review not found");
      return review;
    }),
  },
};

export default resolvers;