module.exports=function(app){
    require(__dirname+"/employee")(app);
    require(__dirname+"/file_system")(app);
    require(__dirname+"/flow_test_fs.js")(app);
    require(__dirname+"/pg_database.js")(app);
    require(__dirname+"/mongo_db")(app);
    require(__dirname+"/api_internal")(app);
}