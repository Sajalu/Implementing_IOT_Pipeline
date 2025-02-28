import {getAllUsers,FindUserByEmail , createUser} from "../models/UserModel.js";


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

        const newUser = await createUser(username, email, password);

        res.status(201).json({
            user: newUser.username,
            message: "User registered successfully.",
        });
    } catch (error) {
        console.error(`Error during signup: ${error.message}`);
        res.status(500).json({ message: `Error During Signup: ${error.message}` });
    }
};

export const Login = async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await FindUserByEmail(email);
        if(!user || user.password !== password) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        res.status(200).json({ 
            message: 'Login successful', 
            User: user.username,
            email: user.email,
        })
    } catch (error) {
        console.error(`Error during login: ${error.message}`);
        res.status(500).json({ message: 'Server Error' });
    }
}