const fs = require("fs");
const main= (req,res)=>{
    let err_flag=false;
    let res_send=false;
    let folder_name = req.query.folder_name;
    fs.readdir(folder_name,(err,data)=>{
        fs.unlink(`all_data_from_${folder_name}_folder.txt`,(err)=>{
            data.forEach((file)=>{
                fs.readFile(`${folder_name}/${file}`,"utf8",(err,data)=>{
                    if(err && err_flag==false){
                        err_flag=true;
                        console.log(err);
                        res.send(err);
                        return;
                    } else if(!err){
                        // console.log("Data to append :-",data , "of file:- ",file);
                        fs.appendFile(`all_data_from_${folder_name}_folder.txt`,data,(err)=>{
                            if(err && err_flag==false){
                                err_flag=true;
                                console.log(err);
                                res.send(err);
                                return;
    
                            } else if(res_send==false && !err){
                                res_send=true;
                                res.send("File appended Sucessfully");
                            }
                        })
                    }
                })
            })
            
        })
        // res.send("Data Appended successfully");
    })
}

module.exports={
    main
}