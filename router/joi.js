module.exports=(app)=>{
    app.post("/api/v1/joi_validation/joi",function(req,res){
        const x = require(__dirname+"/../src/events/events");
        x.main(req,res);
    })
}