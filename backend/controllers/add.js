const fs = require("fs").promises;
const path = require("path");


async function AddRepo(filePath){
    const repoPath = path.resolve(process.cwd(),".apnaGit");
    const stagingPath = path.join(repoPath,"staging");

    try{
        await fs.mkdir(stagingPath,{recursive: true});
        const fileName = path.basename(filePath);
        await fs.copyFile(filePath,path.join(stagingPath,fileName));
        console.log(`File ${fileName} added to the staging area`);
    }catch(e){
        console.error("error adding File: ",e)
    }
    
}
module.exports = {AddRepo}