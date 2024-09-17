const fs = require("fs");
const main=function(req,res){
    const new_name=req.query.new_name;
    const old_name=req.query.old_name;
    fs.rename(old_name, new_name, (err)=>{
        if(err){
            console.log("Error in renaming file",err);
            res.send(err);
        } else {
            console.log("File Renamed sucessfully");
            res.send("Renamed sucessfully");
        }
    } );
}

module.exports={
    main:main
}