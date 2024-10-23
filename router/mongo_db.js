module.exports=function(app){
    app.post("/api/v1/mongo_db/create_api",(req,res)=>{
        const x = require(__dirname+"/../src/mongo_db/create_api");
        x.main(req,res);
    })
    app.get("/api/v1/mongo_db/read_api",(req,res)=>{
        const x = require(__dirname+"/../src/mongo_db/read_api");
        x.main(req,res);
    })
    app.put("/api/v1/mongo_db/update_api",(req,res)=>{
        const x = require(__dirname+"/../src/mongo_db/update_api");
        x.main(req,res);
    })
    app.delete("/api/v1/mongo_db/delete_api",(req,res)=>{
        const x = require(__dirname+"/../src/mongo_db/delete_api");
        x.main(req,res);
    })
   
}