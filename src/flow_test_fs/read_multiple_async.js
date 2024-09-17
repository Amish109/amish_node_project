const fs = require("fs");
const main=function(req,res){
    let async_count = 3;
    let response_data="";
    let a="";
    let b="";
    let c="";
    fs.readFile("Amish_async_sync.txt",{encoding:"utf8"},(err,data)=>{
        if(err){
            console.log("error in reading file");
        } else{
            console.log("data from Amish_async_sync.txt",data)
        }
        a=data;
        async_count--
        if(async_count==0){
            res.send(a+b+c);
        }
    });

    fs.readFile("Amish_new_sync.txt",{encoding:"utf8"},(err,data)=>{
        if(err){
            console.log("error in reading file");
        } else{
            console.log("data from Amish_new_sync.txt",data)
        }
        b=data;
        async_count--
        if(async_count==0){
            res.send(a+b+c);
        }
    });

    fs.readFile("Amish_new.txt",{encoding:"utf8"},(err,data)=>{
        if(err){
            console.log("error in reading file");
        } else{
            console.log("data from Amish_new.txt",data)
        }
        c=data;
        async_count--
        if(async_count==0){
            res.send(a+b+c);
        }
    });

    console.log("Test flow async");
}

module.exports={
    main
}


/*
call back functions are async 
-- each async function are excuted together
-- we can use await but then it will behave as sync fs functions
-- each file might take diff time to execute and function with low time will be given out first
-- we need to handle the flow to make the flow asynchronus and also get the data as expected
-- we can use a flag to keep track of async functions executed and when all are executed then we will return data 

*/