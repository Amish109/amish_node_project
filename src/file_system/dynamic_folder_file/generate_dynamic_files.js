const fs = require('fs');
const main = function(req,res){
    let folder_name = req.query.folder_name;
    let file_name = req.query.file_name;
    let data =  req.body;
    let number_of_filles =  req.query.number_of_filles;
    fs.mkdir(folder_name,function(err){
        for(let i=0;i<number_of_filles;i++){
            data["index"] = i;
            fs.writeFile(`${folder_name}/${file_name}_${i}.txt`,JSON.stringify(data),function(err){
                if(err){
                    console.log("Error in creating dynamicFiles",err);
                }
            })            
        }
        res.send("Files created successfully!");  
    })
}

module.exports={
    main
}