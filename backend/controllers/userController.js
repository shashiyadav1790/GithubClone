const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { MongoClient, ObjectId, ReturnDocument } = require("mongodb");
const dotenv = require("dotenv");
const onjectId = require("mongodb").ObjectId;
dotenv.config();

const uri = process.env.MONGO_URL;

let client;

async function connectClient() {
  try {
    if (!client) {
      client = new MongoClient(uri);
      await client.connect();
      console.log("Connected to MongoDB");
    }
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    throw error;
  }
}

async function signup(req, res) {
  const { username, password, email } = req.body;
  try {
    await connectClient();
    const db = client.db("githubClone");
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne({ username });
    if (user) {
      return res.status(400).json({ message: "User already exists!" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = {
      username,
      password: hashedPassword,
      email,
      repositories: [],
      followedUsers: [],
      starRepos: [],
    };

    const result = await usersCollection.insertOne(newUser);

    const token = jwt.sign(
      { id: result.insertId },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );
    res.json({ token, userId: result.insertId });
  } catch (err) {
    console.error("Error during signup : ", err.message);
    res.status(500).send("Server error");
  }
}

async function login(req, res) {
  const { email, password } = req.body;
  try {
    await connectClient();
    const db = client.db("githubClone");
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials!" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h",
    });
    res.json({ token, userId: user._id });
  } catch (err) {
    console.error("Error during login : ", err.message);
    res.status(500).send("Server error!");
  }
}

const getallUser = async (req, res) => {
  try {
    await connectClient();
    const db = client.db("githubClone");
    const usersCollection = db.collection("users");

    const user = await usersCollection.find({}).toArray();
    res.json(user);
  } catch (err) {
    console.err("Error during Fetching", err.message);
    res.status(500).send("server error");
  }
};

const getUserProfile = async (req, res) => {
  const currentId = req.params.id;
  try {
    await connectClient();
    const db = client.db("githubClone");
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne({
      id: new ObjectId(currentId),
    });

    if (!user) {
      return res.status(404).send("User not found !");
    }

    res.send(user, { message: "Profile Fatched" });
  } catch (err) {
    console.err("", err.message);
    res.status(500).send("server error");
  }
};
const updateUserProfile = async (req, res) => {
  const currentId = req.params.id;
  const { email, password } = req.body;
  try {
    await connectClient();
    const db = client.db("githubClone");
    const usersCollection = db.collection("users");

    let updateFields = { email };
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      updateFields.password = hashedPassword;
    }
    const result = await usersCollection.findOneAndUpdate(
      {
        _id: new ObjectId(currentId),
      },
      { $set: updateFields },
      { ReturnDocument: "after" }
    );
    if (!result.value) {
      return res.status(404).json({ message: "User not found" });
    }
    res.send(result.value);
  } catch (err) {
    console.err("", err.message);
    res.status(500).send("server error");
  }
};

const deleteUserProfile = async (req, res) => {
  const currentId = req.params.id;

  try {
    await connectClient();
    const db = client.db("githubClone");
    const usersCollection = db.collection("users");

    const result = await usersCollection.deleteOne({
      _id: new onjectId(currentId),
    });

    if (result.deleteCount == 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User Profile Deleted !" });
  } catch (err) {
    console.err("", err.message);
    res.status(500).send("server error");
  }
};

module.exports = {
  getallUser,
  signup,
  login,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
};
