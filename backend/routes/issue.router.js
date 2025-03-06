const express = require("express");
const issueController = require("../controllers/issueController");
const issueRouter = express.Router();

issueRouter.post("/issue/create",issueController.createIssue);
issueRouter.put("/issue/update/:id",issueController.updateIssue);
issueRouter.delete("/issue/delete/:id",issueController.deleteIssueById);
issueRouter.get("/issue/all",issueController.getAllIssue);
issueRouter.get("/issue/:id",issueController.getIssueById);



module.exports = issueRouter;