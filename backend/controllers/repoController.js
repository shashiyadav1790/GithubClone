const mongoose = require("mongoose");
const User = require("../models/userModel");
const Issue = require("../models/issueModel");
const Repo = require("../models/repoModel");
const Repository = require("../models/repoModel");

const CreateRepository = async (req, res) => {
  const { owner, name, issue, content, description, visibility } = req.body;

  try {
    if (!name) {
      return res.status(404).send({ message: "Repository name is required" });
    }
    if (!mongoose.Types.ObjectId.isValid(owner)) {
      return res.status(404).send({ error: "Invalid User id" });
    }

    const newRepository = new Repository({
      name,
      description,
      visibility,
      content,
      owner,
    });

    const result = await newRepository.save();

    res.status(201).json({
      message: "Repository created",
      RepositoryId: result._id,
    });
  } catch (err) {
    console.error("Error during repository ceration", err.message);
    res.status(500).json("Server Error");
  }
};

const getAllRepository = async (req, res) => {
  try {
    const repository = await Repository.find({})
      .populate("owner")
      .populate("issues");
    res.json(repository);
  } catch (err) {
    console.error("Error during repository ceration", err.message);
    res.status(500).json("Server Error");
  }
};

const fetchAllRepositories = async (req, res) => {
  const { repoId } = req.params.id;

  try {
    const repository = await Repository.findById({ _id: repoId })
      .populate("owner")
      .populate("issues");

    if (!repository) {
      res.status(404).json("Repository Not Found");
    }
    res.json(repository);
  } catch (err) {
    console.error("Error during repository ceration", err.message);
    res.status(500).json("Server Error");
  }
};

const fetchRepositoryById = async (req, res) => {
  const { name } = req.params.name;

  try {
    const repository = await Repository.findById({ name: name })
      .populate("owner")
      .populate("issues");

    if (!repository) {
      res.status(404).json("Repository Not Found");
    }
    res.json(repository);
  } catch (err) {
    console.error("Error during repository ceration", err.message);
    res.status(500).json("Server Error");
  }
  res.send("Repository Fetched");
};

const fetchRepositoryByName = async (req, res) => {
  const userId = req.user;
  try {
    const repository = await Repository.find({ owner: userId });
    if (!repository || repository.length == 0) {
      res.status(404).send({ error: "User Repository Not Found" });
    }
    res.json({ message: "Repository Found", repository });
  } catch (err) {
    console.error("Error during fetching user repository !", err.message);
    res.status(500).json("Server Error");
  }
  res.send("repository fetched");
};

const fetchRepositoryByCurrentUser = async (req, res) => {
  const userId = req.user;
  try {
    const repository = await Repository.find({ owner: userId });
    if (!repository || repository.length == 0) {
      res.status(404).send({ error: "User Repository Not Found" });
    }
    res.json({ message: "Repository Found", repository });
  } catch (err) {
    console.error("Error during fetching user repository !", err.message);
    res.status(500).json("Server Error");
  }
  res.send("repository fetched");
};

const updateRepositoryById = async (req, res) => {
  const { id } = req.params;
  const { content, description } = req.body;

  try {
    const repository = await Repository.findById(id);
    if (!repository) {
      res.status(404).send({ error: "Repository Not Found" });
    }
    repository.description.push(description);
    repository.content.push = content;

    const updateRepository = await repository.save();

    res.json({
      message: "User Updated SuccessFully",
      repository: updateRepository,
    });
  } catch (err) {
    console.error("Error during updating user repository !", err.message);
    res.status(500).json("Server Error");
  }
};

const deleteRepositoryById = async (req, res) => {
  const { id } = req.params;
  try {
    const repository = await User.findByIdAndDelete(id);

    if (!repository) {
      res.status(404).send({ error: "Repository Not Foun" });
    }

    res.json({ message: "Repository deleted successfully" });
  } catch (err) {
    console.error("Error during updating user repository !", err.message);
    res.status(500).json("Server Error");
  }
};

const toggleVisibilityById = async (req, res) => {
  const { id } = req.params;

  try {
    const repository = await Repository.findById(id);
    if (!repository) {
      res.status(404).send({ error: "Repository Not Found" });
    }
    repository.description.push(description);
    repository.content.push = content;

    const updateRepository = await repository.save();

    res.json({
      message: "Repository visibility toggle successfully",
      repository: updateRepository,
    });
  } catch (err) {
    console.error("Error during toggle visibility !", err.message);
    res.status(500).json("Server Error");
  }
  res.send("toggle visiblilty");
};

module.exports = {
  CreateRepository,
  getAllRepository,
  fetchAllRepositories,
  fetchRepositoryById,
  fetchRepositoryByName,
  fetchRepositoryByCurrentUser,
  updateRepositoryById,
  deleteRepositoryById,
  toggleVisibilityById,
};
