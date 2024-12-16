import User from '../../model/users.js';
import { withAuth } from '../../util/withAuth.js';
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const resolvers = {
  Mutation: {
    signup: async (
      _,
      { firstName, middleName, lastName, email, password, role, address }
    ) => {
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error("User already exists with this email.");
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user
      const user = new User({
        firstName,
        middleName,
        lastName,
        email,
        password: hashedPassword,
        role,
        address,
      });

      await user.save();

      // Generate a token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET,
        {
          expiresIn: "24h",
        }
      );

      return {
        token,
        user,
      };
    },

    loginUser: async (_, { email, password }) => {
      try {
        const user = await User.findOne({ email });
        if (!user) throw new Error("User not found");

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new Error("Invalid credentials");

        // Generate a JWT token
        const token = jwt.sign(
          { userId: user._id, email: user.email },
          process.env.JWT_SECRET,
          { expiresIn: "24h" }
        );

        return {
          token,
          user: {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
          },
        };
      } catch (error) {
        throw new Error(error.message);
      }
    },

    createUser: withAuth(async (
      _,
      { firstName, middleName, lastName, email, password, address, role }
    ) => {
      try {
        // Ensure all required fields are provided
        if (!email || !password)
          throw new Error("Email and password are required");

        const existingUser = await User.findOne({ email });
        if (existingUser) throw new Error("Email already in use");

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
          firstName,
          middleName,
          lastName,
          email,
          password: hashedPassword,
          role,
          address: {
            houseNumber: address?.houseNumber,
            street: address.street,
            barangay: address.barangay,
            municipality: address.municipality,
            province: address.province,
            postalCode: address.postalCode,
            country: address.country || "Philippines", // Default to Philippines if no country is provided
          },
        });

        return await newUser.save();
      } catch (error) {
        throw new Error(error.message);
      }
    }),

    updateUser: withAuth(async (
      _,
      { id, firstName, middleName, lastName, email, password, address, role }
    ) => {
      try {
        const updates = {};

        if (firstName) updates.firstName = firstName;
        if (middleName) updates.middleName = middleName;
        if (lastName) updates.lastName = lastName;
        if (email) updates.email = email;
        if (password) updates.password = await bcrypt.hash(password, 10);
        if (role) updates.role = role;
        if (address) {
          updates.address = {
            ...(address.houseNumber && { houseNumber: address.houseNumber }),
            ...(address.street && { street: address.street }),
            ...(address.barangay && { barangay: address.barangay }),
            ...(address.municipality && { municipality: address.municipality }),
            ...(address.province && { province: address.province }),
            ...(address.postalCode && { postalCode: address.postalCode }),
            ...(address.country && { country: address.country }),
          };
        }

        const updatedUser = await User.findByIdAndUpdate(id, updates, {
          new: true,
        }).select("-password");
        if (!updatedUser) throw new Error("User not found");
        return updatedUser;
      } catch (error) {
        throw new Error(error.message);
      }
    }),

    deleteUser: withAuth(async (_, { id }) => {
      try {
        const deletedUser = await User.findByIdAndDelete(id).select("-password");
        if (!deletedUser) throw new Error("User not found");
        return deletedUser;
      } catch (error) {
        throw new Error(error.message);
      }
    }),
  },

  Query: {
    getUser: withAuth(async (_, { id }) => {
      try {
        const user = await User.findById(id).select("-password"); // Exclude password field
        if (!user) throw new Error("User not found");
        return user;
      } catch (error) {
        throw new Error(error.message);
      }
    }),

    getUsers: withAuth(async () => {
      try {
        return await User.find().select("-password"); // Exclude password field for all users
      } catch (error) {
        throw new Error(error.message);
      }
    }),
  },
}; 

export default resolvers;