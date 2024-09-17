const fs = require("fs");
const main=function(req,res){
const file_name = req.query.file_name;
const data =  req.body;
//  fs.appendFile(file_name,JSON.stringify(data),(error,data)=>{
//     if(error){
//         res.send(error);
//     } else {
//         res.send("Append successfully")
//     }
//  })
const append=fs.appendFileSync(file_name,JSON.stringify(data),"utf8")
    console.log("Append Sucessfully using sync");
    res.send("Append Sucessfully using sync");
}

module.exports={
    main:main
}