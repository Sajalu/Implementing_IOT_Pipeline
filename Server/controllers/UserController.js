import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import {getAllUsers, FindUserByEmail, FindUserByUsername, createUser, DeleteUserByEmail} from "../models/UserModel.js";
import dotenv from "dotenv";
dotenv.config();

export const Test = (req, res) => {
    res.status(200).json({message: 'WELCOME TO THE Rakkaranta-Holiday-Village SERVER.'});
}

export const GetUser = async (req, res) => {
    try {
        const users = await getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        console.error(`Error fetching users: ${error.message}`);
        res.status(500).json({ message: 'Server Error' });
    }
}

export const Signup = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const existingUser = await FindUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: "Email Already Exists." });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await createUser(username, email, hashedPassword);

        res.status(201).json({
            user: {
                username: newUser.username,
                email: newUser.email,
                role: 'user'
            },
            message: "User registered successfully.",
        });
    } catch (error) {
        console.error(`Error during signup: ${error.message}`);
        res.status(500).json({ message: `Error During Signup: ${error.message}` });
    }
};

export const Login = async (req, res) => {
    const {email, password} = req.body;
    try {
        // Find the User by email
        const user = await FindUserByEmail(email);
        if(!user) {
            return res.status(401).json({ error: 'User Not Found.' });
        }

        // compare the User Password
        const ismatch = await bcrypt.compare(password, user.password);
        if (!ismatch){
            return res.status(401).json({ error: 'Wrong Password.' });
        }

        // Generate JWT token with all the information needed for both services
        const token = jwt.sign(
            {
                id: user.id, 
                email: user.email,
                // Include these fields for compatibility with edge service
                role: user.role || 'user'
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(200).json({ 
            message: 'Login successful', 
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role || 'user'
            }
        });
    } catch (error) {
        console.error(`Error during login: ${error.message}`);
        res.status(500).json({ message: 'Server Error' });
    }
}

// Delete User Data Using email
export const DeleteUser = async (req, res) => {
    const {email} = req.body;

    try {
        const user = await FindUserByEmail(email);
        if(!user){
            return res.status(404).json({ message: 'User not found' });
        }
        await DeleteUserByEmail(user.email);
        res.status(200).json({ 
            message: 'User deleted successfully',
            username: user.username,
            email: user.email
        });

    } catch (error) {
        console.error(`Error deleting user: ${error.message}`);
        res.status(500).json({ message: "Server Error" });
    }
}