const express = require("express");
const cors = require("cors");
const http = require("http");
const {Server} = require("socket.io");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");


const yargs = require("yargs");

const { hideBin } = require("yargs/helpers");
const { initRepo } = require("./controllers/init");
const { commitRepo } = require("./controllers/commit");
const { pullRepo } = require("./controllers/pull");
const { pushRepo } = require("./controllers/push");
const { revertRepo } = require("./controllers/revert");
const { AddRepo } = require("./controllers/add");
const { Socket } = require("dgram");

const mainRouter = require("./routes/main.router");

dotenv.config();

yargs(hideBin(process.argv)) 
  .command("start","Starts a new server",{},startServer)
  .command("init", "Initialize a new repository", {}, initRepo)
  .command(
    "add <file>",
    "Add a file to the new repository",
    (yargs) => {
      yargs.positional("file"),
        { describe: "file to add the staging area", type: "string" };
    },
    (argv)=>{
        AddRepo(argv.file);
    }
  )
  .command(
    "commit <message>",
    "Commit the stage the file",
    (yargs) => {
      yargs.positional("message"),
        { describe: "Commit message", type: "string" };
    },
    (argv)=>{
        commitRepo(argv.message);
    }
  )
  .command("push", "Push commit to s3", {}, pushRepo)
  .command("pull", "Pull commit to from s3", {}, pullRepo)
  .command(
    "revert <CommitID",
    "Revert to the specified commit",
    (yargs) => {
      yargs.positional("commitID", {
        describe: "Commit Id to revert to ",
        type: "string",
      });
    },
    revertRepo
  )
  .demandCommand(1, "You need atLeast One Command")
  .help().argv;


  async function startServer(){

    const app = express();
    const port = process.env.PORT || 8080
    console.log("Server login Called");

    app.use(bodyParser.json());
    app.use(express.json());
    const mongoURl  = process.env.MONGO_URL;

    await mongoose.connect(mongoURl).then((res)=>{console.log("MONGO_DB connection succusfully")}).catch((err)=>{console.log("MONGO_DB CONNECTED FAILED:",err)});

    app.use(cors({origin: "*"}));
    app.use("/",mainRouter);

  

    const httpServer = http.createServer(app);

    const io = new Server(httpServer,{
      cors: {
        origin: "*",
        method: ["GET","POST"]

      }
   });
   io.on("connection",(Socket)=>{
    Socket.on("joinRoom",(userId)=>{
      user = userId;
      console.log("========");
      console.log(user);
      console.log("========");
      Socket.join(userId);
    })
   })

   const db = mongoose.connection;
   db.once("open",()=>{
    console.log("corud operations called");
   })
    

   httpServer.listen(port,()=>{
    console.log("Server is running on port",port);
   })
  }
