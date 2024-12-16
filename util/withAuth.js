export const withAuth = (resolver) => {
  return (parent, args, context, info) => {
    if (!context.user) {
      throw new Error('Unauthorized');
    }
    return resolver(parent, args, context, info);
  };
};
