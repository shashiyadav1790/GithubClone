const mongoose = require("mongoose");
const User = require("../models/userModel");
const Issue = require("../models/issueModel");
const Repo = require("../models/repoModel");
const Repository = require("../models/repoModel");

const createIssue = async(req,res)=>{
    const {title,description} = req.body;
    const {id} = req.params;

    try{
        const issue = new Issue({
            title: title,
            description: description,
            RepositoryId : id,
        })
        await issue.save();
        res.status(201).json(issue);

    }catch(err){
        console.error("Error during issue creation:",err.message);
        res.status(500).send("server Erorr")
    }
}

const updateIssue = async(req,res)=>{
    const {id} = req.params;
    const {title,description,status} = req.body;

    try{

        const issue = await Issue.findById(id);
        if(!issue){
            res.status(404).send("Issue not found");
        }
        issue.title = title;
        issue.description = description;
        issue.status = status;

        await issue.save();

        res.json({message: "issue updated successfully",issue});


    }catch(err){
        console.error("Error during Updating Issue:",err.message);
        res.status(500).send("server Erorr")
    }

}

const deleteIssueById = async(req,res)=>{

    const {id} = req.params;

    try{
        const issue =  await Issue.findByIdAndDelete(id);

        if(!issue){
            res.status(404).send("Issue not found");
        }

        res.status(200).json({message: "Issue deleted successfully"});

    }catch(err){
        console.error("Error during Deleted Issue:",err.message);
        res.status(500).send("server Erorr")

    }

}
const getAllIssue = async(req,res)=>{

    const {id} = req.params;
    try{
        const issue = await Issue.findById({repository: id});
        if(!issue){
            res.status(404).send("Issue not found");
        }
        res.status(200).json(issue);

    }catch(err){
        console.error("Error during Deleted Issue:",err.message);
        res.status(500).send("server Erorr")

    }
}

const getIssueById = async(req,res)=>{
    const {id} = req.params;

    try{
        const issue = await Issue.findById(id);
        if(!issue){
            res.status(404).send("Issue not found");
        }
        res.status(200).json(issue);

    }catch(err){
        console.error("Error during Deleted Issue:",err.message);
        res.status(500).send("server Erorr")

    }
}

module.exports = {createIssue,updateIssue,deleteIssueById,getAllIssue,getIssueById};