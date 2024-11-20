module.exports=(app)=>{
    app.get("/api/v1/events/events",function(req,res){
        const x = require(__dirname+"/../src/events/events");
        x.main(req,res);
    })
}