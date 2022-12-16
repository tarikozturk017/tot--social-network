import bcrypt from "bcrypt"; // encrypt password
import jwt from "jsonwebtoken" // way to send web token  for authorization
import User from "../models/User.js";

// REGISTER USER
export const register = async (req, res) => {
    try {
        const { // these will be sent from frontend
            firstName,
            lastName,
            email,
            password,
            picturePath,
            friends,
            location,
            occupation
        } = req.body; // destructure the parameters from request body

        const salt = await bcrypt.genSalt(); // random salt encryption. use it to encrypt password
        const passwordHash = await bcrypt.hash(password, salt); // hash the password w/ encryption

        const newUser = new User({
            firstName,
            lastName,
            email,
            password: passwordHash,
            picturePath,
            friends,
            location,
            occupation,
            viewedProfile: Math.floor(Math.random() * 10000),
            impressions: Math.floor(Math.random() * 10000)
        });
        const savedUser = await newUser.save();
        res.status(201).json(savedUser); // if success, send user 201 status code. Frontend receives the user 
    } catch (err){
        res.status(500).json({ error: err.message});
    }
};

// LOG IN
export const login = async (req, res) => {
    try {   
        const { email, password } = req.body;
        const user = await User.findOne({ email: email }); // email unq, find the user via email.
        if(!user) return res.status(400).json({ msg: "User does not exist. " });

        const isMatch = await bcrypt.compare(password, user.password); // uses salt to compare password entered is equals to user's password.
        if(!isMatch) return res.status(400).json({ msg: "Invalid credentials. " });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        delete user.password; // make sure not returning back to frontend
        res.status(200).json({ token, user })
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
}