import {getAllUsers,FindUserByEmail ,creatUser } from "../models/UserModel.js";

const test = (req, res) => {
    res.status(200).json({message: 'WELCOME TO THE Rakkaranta-Holiday-Village SERVER.'});
}


export const Signup = async (req,res) => {
    const {name , email , password} = req.body;
    try {
        const existingUser = await FindUserByEmail(email);
        if(existingUser){
            res.status(400).json({message: 'Email Alread Exist..'});
        }
        const newUser = await creatUser(name, email, password);
        res.status(201).json({User: newUser,
            message: "User registered successfully...."
        })
    } catch (error) {
        console.error(error);
        res.status(500)
        .json(
            {message: "Something went wrong",
                error: error.message});
    }
}