const express = require("express");
const repoController = require("../controllers/repoController");
const repoRouter = express.Router();

repoRouter.post("/repo/create",repoController.CreateRepository);
repoRouter.get("/repo/all",repoController.getAllRepository);
repoRouter.get("/repo/:id",repoController.fetchRepositoryById);
repoRouter.get("/repo/name/:name",repoController.fetchRepositoryByName);
repoRouter.get("/repo/user/:userId",repoController.fetchRepositoryByCurrentUser);
repoRouter.put("/repo/update/:id",repoController.updateRepositoryById);
repoRouter.delete("/repo/delete/:id",repoController.deleteRepositoryById);
repoRouter.patch("/repo/toggle/:id",repoController.toggleVisibilityById);


module.exports = repoRouter;