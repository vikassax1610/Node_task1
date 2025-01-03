const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const User = require("./models/User");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const path = require("path");
const dotenv = require("dotenv").config();

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "public")));

mongoose
  .connect((mongoURI = process.env.MONGO_URI), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB:", err);
  });

app.post("/api/user", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

const liveUsers = new Map();

io.on("connection", (socket) => {
  console.log("A user connected: " + socket.id);

  socket.on("joinRoom", (user) => {
    liveUsers.set(socket.id, {
      email: user.email,
      name: user.name,
      socketId: socket.id,
    });
    console.log(`User ${user.name} joined the room. Socket ID: ${socket.id}`);
    io.to("live users").emit("userList", Array.from(liveUsers.values()));
  });

  socket.on("disconnect", () => {
    liveUsers.delete(socket.id);
    io.to("live users").emit("userList", Array.from(liveUsers.values()));
    console.log(`User disconnected: ${socket.id}`);
  });

  socket.join("live users");
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
