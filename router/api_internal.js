module.exports=(app)=>{
    app.get("/api/v1/api_internal/call_other_api",function(req,res){
        const x = require(__dirname+"/../src/api_internal/call_other_api");
        x.main(req,res);
    })
}