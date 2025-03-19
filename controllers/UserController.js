// controllers/UserController.js - Updated with role support
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import { 
  getAllUsers, 
  FindUserByEmail, 
  FindUserByUsername, 
  createUser, 
  DeleteUserByEmail,
  updateUserProfile,
  updateUserRole
} from "../models/UserModel.js";
import 'dotenv/config';

// Test endpoint
export const Test = (req, res) => {
    res.status(200).json({
      message: 'WELCOME TO THE Rakkaranta-Holiday-Village SERVER.'
    });
};

// Get all users (admin function)
export const GetUser = async (req, res) => {
    try {
        const users = await getAllUsers();
        res.status(200).json({
          status: 'success',
          results: users.length,
          data: { users }
        });
    } catch (error) {
        console.error(`Error fetching users: ${error.message}`);
        res.status(500).json({ 
          status: 'error',
          message: 'Server Error' 
        });
    }
};

// User registration
export const Signup = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Validate input
        if (!username || !email || !password) {
            return res.status(400).json({
              status: 'fail',
              message: 'Please provide username, email and password'
            });
        }

        // Check if email already exists
        const existingUser = await FindUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({
              status: 'fail',
              message: "Email already exists"
            });
        }

        // Check if username already exists
        const existingUsername = await FindUserByUsername(username);
        if (existingUsername) {
            return res.status(400).json({
              status: 'fail',
              message: "Username already exists"
            });
        }

        // Hash password and create user (role defaults to 'user' in database)
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await createUser(username, email, hashedPassword);

        res.status(201).json({
            user: newUser.username,
            message: "User registered successfully."
        });
    } catch (error) {
        console.error(`Error during signup: ${error.message}`);
        res.status(500).json({
          status: 'error',
          message: `Error during signup: ${error.message}`
        });
    }
};

// User login
export const Login = async (req, res) => {
    const { email, password } = req.body;
    
    try {
        // Validate input
        if (!email || !password) {
            return res.status(400).json({
              status: 'fail',
              message: 'Please provide email and password'
            });
        }

        // Find user by email
        const user = await FindUserByEmail(email);
        if (!user) {
            return res.status(401).json({ error: 'User Not Found.' });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Wrong Password.' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(200).json({ 
            message: 'Login successful',
            User: user.username,
            email: user.email,
            role: user.role,
            token: token
        });
    } catch (error) {
        console.error(`Error during login: ${error.message}`);
        res.status(500).json({
          status: 'error',
          message: 'Server Error'
        });
    }
};

// Get user profile
export const GetProfile = async (req, res) => {
    try {
        // User information is already attached to req by the auth middleware
        res.status(200).json({
            status: 'success',
            data: {
                user: {
                    id: req.user.id,
                    username: req.user.username,
                    email: req.user.email,
                    role: req.user.role
                }
            }
        });
    } catch (error) {
        console.error(`Error fetching profile: ${error.message}`);
        res.status(500).json({
          status: 'error',
          message: 'Server Error'
        });
    }
};

// Update user role (admin only)
export const UpdateUserRole = async (req, res) => {
    try {
        const { userId, newRole } = req.body;
        
        // Validate input
        if (!userId || !newRole) {
            return res.status(400).json({
              status: 'fail',
              message: 'Please provide userId and newRole'
            });
        }
        
        // Check if role is valid
        if (!['user', 'admin'].includes(newRole)) {
            return res.status(400).json({
              status: 'fail',
              message: 'Invalid role. Role must be either "user" or "admin"'
            });
        }
        
        // Update user role
        const updatedUser = await updateUserRole(userId, newRole);
        
        if (!updatedUser) {
            return res.status(404).json({
              status: 'fail',
              message: 'User not found'
            });
        }
        
        res.status(200).json({
            status: 'success',
            message: `User role updated to ${newRole}`,
            data: {
                user: updatedUser
            }
        });
    } catch (error) {
        console.error(`Error updating user role: ${error.message}`);
        res.status(500).json({
          status: 'error',
          message: 'Server Error'
        });
    }
};

// Update user profile
export const UpdateProfile = async (req, res) => {
    try {
        const { username } = req.body;
        
        // Only allowing username updates for simplicity
        if (!username) {
            return res.status(400).json({
              status: 'fail',
              message: 'Please provide data to update'
            });
        }
        
        // Check if new username already exists
        if (username !== req.user.username) {
            const existingUsername = await FindUserByUsername(username);
            if (existingUsername) {
                return res.status(400).json({
                  status: 'fail',
                  message: "Username already exists"
                });
            }
        }
        
        // Update profile
        const updatedUser = await updateUserProfile(req.user.id, { username });
        
        res.status(200).json({
            status: 'success',
            message: 'Profile updated successfully',
            data: {
                user: {
                    username: updatedUser.username,
                    email: updatedUser.email,
                    role: updatedUser.role
                }
            }
        });
    } catch (error) {
        console.error(`Error updating profile: ${error.message}`);
        res.status(500).json({
          status: 'error',
          message: 'Server Error'
        });
    }
};

// Delete user
export const DeleteUser = async (req, res) => {
    try {
        const { email } = req.body;
        
        // Extra security check
        if (email !== req.user.email) {
            return res.status(403).json({
              status: 'fail',
              message: 'You can only delete your own account'
            });
        }
        
        // Delete user
        const deletedUser = await DeleteUserByEmail(user.email);
        
        res.status(200).json({
            message: 'User deleted successfully',
            username: deletedUser.username,
            email: deletedUser.email
        });
    } catch (error) {
        console.error(`Error deleting user: ${error.message}`);
        res.status(500).json({
          status: 'error',
          message: 'Server Error'
        });
    }
};
