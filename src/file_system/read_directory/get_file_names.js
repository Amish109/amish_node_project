const fs = require('fs');
function main(req,res){
    let folder_name = req.query.folder_name;
    fs.readdir(folder_name,(err,data)=>{
        console.log("Folder names",data);
        res.send(data);
    })
}

module.exports={
    main
}