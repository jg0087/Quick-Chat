// server.js
require('dotenv').config()
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/authRoutes");
const UserModel = require("./models/User");
const cors = require("cors");



const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// mongodb+srv://qc-admin:<password>@quick-chat-cluster.ixm0r1k.mongodb.net/
mongoose
  .connect(
    process.env.MONGO_URI,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Define user and message schemas
const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Reference to the User model
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  body: String,
  timestamp: Date,
});

const User = UserModel;
const Message = mongoose.model("Message", messageSchema);

// Authorization Middleware
const authorize = (req, res, next) => {
  // Check for Authorization header
  const authHeader = req.headers.authorization;

  // Check if token is present
  if (!authHeader) {
    return res.status(401).json({ error: "Unauthorized: Missing token" });
  }

  // Extract token from header
  const token = authHeader.split(" ")[1];

  try {
    // Verify token
    const decoded = jwt.verify(token, "your_secret_key");

    // Attach decoded user ID to request object
    req.userId = decoded.userId;

    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    // Token is invalid
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
};

// Routes
app.use("/api/auth", authRoutes);

app.post("/api/register", authorize, async (req, res) => {
  try {
    console.log(req.body);

    const { email, username, password } = req.body;
    const user = new User({ email, username, password });
    await user.save();
    res.status(201).send("User registered successfully");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

const jwt = require("jsonwebtoken");
const { applyDefaults } = require("./models/User");

app.get("/api/messages", authorize, async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, "your_secret_key");
    const userId = decoded.userId;
    const messages = await Message.find({
      $or: [{ sender: userId }, { receiver: userId }],
    })
      .populate("sender", "email")
      .populate("receiver", "email");
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).send(err.message);
  }
});
app.get("/api/users", authorize, async (req, res) => {
  try {
    const messages = await User.find();
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post("/api/message", async (req, res) => {
  try {
    // Extract sender and receiver information from the request body
    const { sender, receiver, body } = req.body;

    // Find sender and receiver user IDs from the User model
    const senderUser = await User.findOne({ email: sender });
    const receiverUser = await User.findOne({ email: receiver });

    // Check if sender and receiver exist
    if (!senderUser || !receiverUser) {
      return res.status(404).json({ error: "Sender or receiver not found" });
    }

    // Validate request body against message schema and create a new message
    const newMessage = new Message({
      sender: senderUser._id,
      receiver: receiverUser._id,
      body,
      timestamp: new Date(),
    });

    // Save the message to the database
    await newMessage.save();

    res
      .status(201)
      .json({ message: "Message created successfully", newMessage });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.delete("/api/message/:id", async (req, res) => {
  try {
    const messageId = req.params.id;

    // Check if the message exists
    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }

    // Delete the message from the database
    await Message.findByIdAndDelete(messageId);

    res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    console.error("Error deleting message:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.put("/api/message/:id", async (req, res) => {
  try {
    const messageId = req.params.id;
    const { body } = req.body;

    // Find the message by ID
    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }

    // Update the message body
    message.body = body;

    // Save the updated message
    await message.save();

    res.status(200).json({ message: "Message updated successfully", message });
  } catch (error) {
    console.error("Error updating message:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


