const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/loginDB")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// Schema
const userSchema = new mongoose.Schema({
    username: String,
    password: String
});

const User = mongoose.model("User", userSchema);

// Register API
app.post("/register", async (req, res) => {
    const { username, password } = req.body;

    const existing = await User.findOne({ username });
    if (existing) return res.json({ msg: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const newUser = new User({ username, password: hashed });
    await newUser.save();

    res.json({ msg: "User registered successfully" });
});

// Login API
app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) return res.json({ msg: "User not found" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.json({ msg: "Incorrect password" });

    res.json({ msg: "Login success" });
});

app.listen(5000, () => console.log("Server running on 5000"));
