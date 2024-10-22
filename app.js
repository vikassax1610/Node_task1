const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://vikas:axBk7Jwjs8iELf3l@cluster0.pael6.mongodb.net/mydatabase?retryWrites=true&w=majority";

mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("Error connecting to MongoDB Atlas", err));

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  mobile: {
    type: String,
    match: [/^\d{10}$/, "Mobile number must be 10 digits"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    unique: true,
    lowercase: true,
    trim: true,
  },
  address: String,
  street: String,
  city: String,
  state: String,
  country: String,
  loginId: {
    type: String,
    match: [
      /^[a-zA-Z0-9]{8,}$/,
      "Login ID must be at least 8 characters, alphanumeric",
    ],
  },
  password: {
    type: String,
    match: [
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/,
      "Password must contain 6 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character",
    ],
  },
  creationTime: Date,
  lastUpdatedTime: Date,
});

const User = mongoose.model("User", userSchema);

app.use(express.static("public"));

app.post("/saveData", async (req, res) => {
  try {
    const creationTime = new Date();
    const lastUpdatedTime = creationTime;

    const newUser = new User({
      ...req.body,
      creationTime,
      lastUpdatedTime,
    });

    await newUser.save();
    res.status(200).send("Data saved successfully");
  } catch (error) {
    console.error("Error saving data:", error);
    res.status(500).send("Error saving data");
  }
});

app.get("/getData", async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    console.error("Error retrieving data:", error);
    res.status(500).send("Error retrieving data");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
