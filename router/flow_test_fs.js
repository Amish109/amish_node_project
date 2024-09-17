module.exports=function(app){
    app.get("/api/v1/flow_test_fs/read_multiple_async",(req,res)=>{
        const read_multiple = require(__dirname+"/../src/flow_test_fs/read_multiple_async");
        read_multiple.main(req,res);
    })
}