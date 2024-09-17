const fs= require("fs");
const main= (req,res)=>{
    const file_name = req.query.file_name;
    fs.readFile(file_name,"utf-8",(err,data)=>{
        if(err){
            res.send(err);
        } else{
            res.send(data)
        }
    })
}

module.exports={
    main:main
}