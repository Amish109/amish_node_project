const fs = require("fs");
const main = function(req,res){
    let directory_name =req.query.directory_name;
    // fs.mkdir(directory_name,{recursive:true},(err)=>{
    //     // Amish name or path
    //     if(err){
    //         console.log("Error in making the directory",err);
    //         res.send(err);
    //     } else {
    //         console.log("Directory created sucessfully")
    //         res.send("Directory created sucessfully");
    //     }
    // })
    const directory = fs.mkdirSync(directory_name,{recursive:true})
    console.log("Sync Directory Created sucessfully",directory);
    res.send("Sync Directory Created sucessfully");
}

module.exports={
    main:main
}