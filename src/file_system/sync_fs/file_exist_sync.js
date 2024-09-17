const fs= require("fs");
const main = function(req,res){
    const path_to_check = req.query.path_to_check;
    // fs.exists(path_to_check,(exists)=>{
    //     exists?console.log("File exists"):console.log("File does not exists");
    //     res.send(exists);
    // })
    const exists = fs.existsSync(path_to_check);
    console.log("Exists:-",exists);
    res.send(exists);
}

module.exports={
    main:main
}