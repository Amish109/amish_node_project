const fs = require("fs");
const main =function(req,res){
    const data = req.body;
    const file_name = req.query.file_name;
    const async = req.query.async; 
    console.log("async == true",async== true);
    console.log("async",async);
    if(async=="true"){
        fs.writeFile(file_name,JSON.stringify(data),(err)=>{
            if(err){
                console.log("Error in Writing file using Async",err);
                res.send("Error in Writing file using Async");
            } else{
                console.log("File Writed successfully using Async");
                res.send("File Writed successfully using Async");
            }
        })
    } else {
        try {
            const write_file = fs.writeFileSync(file_name,JSON.stringify(data));
            console.log("File writed successfully using writeFileSync");
            res.send("File writed successfully using writeFileSync");
        } catch (error) {
            console.log("Error in writing in file using writeFileSync");
            res.send("Error in writing in file using writeFileSync");
            
        }
    }
}

module.exports={
    main:main
}