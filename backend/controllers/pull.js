const fs = require("fs");
const path = require("path");
const {s3,s3_bucket} = require("../config/aws-config");


async function pullRepo(){
    const repoPath = path.resolve(process.cwd(),".apnaGit");
    const commitPath = path.join(repoPath,"commits");

    try{
        const data  = await s3.listObjectsV2({
            Bucket: s3_bucket,
            Prefic: "commits/",
        })
        .promise();

        const objects = data.Contents;

        for(const object of objects){
            const key = object.key;
            const commitDir = path.join(commitPath,path.dirname(key).split('/').pop());

            await fs.mkdir(commitDir,{recursive: true});
            const params = {
                Bucket: s3_bucket,
                key: key,
            }

            const fileContent = await s3.getObject(params).promise();
            await  fs.writeFile(path.join(repoPath,key),fileContent.Body);

            console.log("all commits pulled from s3 successfully")
        }
        
    }catch(err){
        console.error("Failed to Pull Repository",err);
    }
}