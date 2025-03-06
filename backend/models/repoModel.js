const mongoose = require("mongoose");
const { required } = require("yargs");
const {Schema} = mongoose;


const RepoSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String
    },
    content: [
       {
        type: String,
       }
    ],
    visibility: {
        type: Boolean,
    },
    owner:{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    issues: [
        {
            type: Schema.Types.ObjectId,
            ref: "Issue",
        }
    ]

})

const Repository = mongoose.model("Repository",RepoSchema);

module.exports = Repository;