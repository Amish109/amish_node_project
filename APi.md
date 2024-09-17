## FLow of API
-- app.js :- 
            require router folder (index.js of router) in app.js which exports a function which will take app as parameter

            ## app.js:- 
            require("./router")(app)

-- In router/index.js
   we will require the function of different endpoints made in different folder for example :- employee.js , file_syatem.js
   these files will contain all the endpoints and this file will export a default fun which takes app as parameter


    ## in router/file_system.js
   export modules=function(app){
    app.get("/api/v1/file_system/read_file_async",(req,res)=>{
        // we can write logic here like res.send or make a diff file in src contaaining the logic
        const read_file_asunc_instance = requre("../src/file_system/read_file_async");
         read_file_asunc_instance.main();
    })
   }

    ## src/file_system/read_file_async
    const fs require("fs");
    const main = function(req,res){
        fs.readfile("","utf-8",(err,data)=>{
            if(err)=>{
                res.send(err)
            } else {
                res.send(data)
            }
        })
    }
    module.exports={
        main
    }
