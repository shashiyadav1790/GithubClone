const fs = require("fs");
const path = require("path");
const {s3,s3_bucket } = require("../config/aws-config");

async function pushRepo(){
    const repoPath = path.resolve(process,cwd(),".apnaGit");
    const commitPath = path.join(repoPath,"commits");

    try{
        const commitDirs = await fs.readdir(commitPath);
        for(const commitDir of commitDirs ){
            const commitPath=  path.join(commitPath,commitDir)
            const files = await fs.readdir(commitPath)

            for(const file of files){
                const filePath =  path.join(commitPath,file);
                const fileContent = await fs.readFile(filePath);
                const params = {
                    Bucket: s3_bucket,
                    Key: `commits/${commitDir}/${file}`,
                    Body: fileContent,
                }
                await s3.upload(params).promise();
            }
        }
    }catch(err){
        console.error("Error pushing to s3:",err);
    }
}

module.exports = {pushRepo}