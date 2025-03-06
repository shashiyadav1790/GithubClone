const fs = require("fs");
const path = require("path");
const {promisify} = require("util");


const readdir = promisify(fs.readdir);
const copyFile = promisify(fs.copyFile);

async function revertRepo(){
    const repoPath = path.resolve(process.cwd(),".apnaGit");
    const commitsPath = path.join(repoPath,"commits");



    try{

        const commitDir = path.join(commitsPath,commitId);
        const file = await readdir(commitDir);
        const parentDir = path.resolve(repoPath,"..");

        for(const files of file){
            await copyFile(path.join(commitDir,files),path.join(parentDir,file));
        }
        console.log(`commit ${commitId} reverted successfully`);


    }catch(err){
        console.error("Unable to revert".err);
    }

}