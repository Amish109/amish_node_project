module.exports=function(app){
    require(__dirname+"/employee")(app);
    require(__dirname+"/file_system")(app);
}