const fs= require("fs");
const main= (req,res)=>{
    const file_name = req.query.file_name;
    const data = fs.readFileSync(file_name,{ encoding: 'utf8', flag: 'r' });
    // const data = fs.readFileSync(file_name);// gives buffer as console
    console.log("data",data);
    res.send(data);
    // fs.readFile(file_name,"utf-8",(err,data)=>{
    //     if(err){
    //         res.send(err);
    //     } else{
    //         res.send(data)
    //     }
    // })
}

module.exports={
    main:main
}