const mongoose = require("mongoose");
const { required } = require("yargs");
const { default: Repository } = require("./repoModel");
const {Schema} = mongoose;

const IssueSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ["open","closed"],
        default: "open",
    },
    Repository: {
        type: Schema.Types.ObjectId,
        ref: "repository",
        required: true,

    }
})

const Issue = mongoose.model("Issue",IssueSchema);

module.exports = Issue;