module.exports=function(app){
    console.log("Directory Name",__dirname);//Directory Name C:\Users\akank\OneDrive\Desktop\Amish Folders\github-project\amish_node_project\router  +../src will go one directory up and go to src
    console.log("Directory Name",__filename);//File Name C:\Users\akank\OneDrive\Desktop\Amish Folders\github-project\amish_node_project\router\file_system.js
    // console.log("Directory Name1",__dirname+"/../src/file_system");
    // console.log("Directory Name2",__dirname+"/../../");
  // =================================== ASync ================================================

    app.post("/api/v1/file_system/async_fs/write_file_async",(req,res)=>{
        // const wite_file_instance = require("../src/file_system/async_fs/write_fille_async");
        const wite_file_instance = require(__dirname+"/../src/file_system/async_fs/write_fille_async");
        wite_file_instance.main(req,res);
    })

    app.get("/api/v1/file_system/async_fs/read_file_async",(req,res)=>{
        const read_file_instance = require(__dirname+"/../src/file_system/async_fs/read_file_async");
        read_file_instance.main(req,res);
    })

    app.get("/api/v1/file_system/async_fs/append_file_async",(req,res)=>{
        const append_file_instance = require(__dirname+"/../src/file_system/async_fs/append_file_async");
        append_file_instance.main(req,res);
    })

    app.get("/api/v1/file_system/async_fs/rename_file",(req,res)=>{
        const rename_file_instance = require(__dirname+"/../src/file_system/async_fs/rename_file_async");
        rename_file_instance.main(req,res);
    })
    app.get("/api/v1/file_system/async_fs/make_directory_async",(req,res)=>{
        const make_directory_async = require(__dirname+"/../src/file_system/async_fs/make_directory_async");
        make_directory_async.main(req,res);
    })
    app.get("/api/v1/file_system/async_fs/file_exist_async",(req,res)=>{
        const file_exist = require(__dirname+"/../src/file_system/async_fs/file_exist_async");
        file_exist.main(req,res);
    })
      // =================================== Sync ================================================
    app.post("/api/v1/file_system/sync_fs/write_fille_sync",(req,res)=>{
        const wite_file_instance = require(__dirname+"/../src/file_system/sync_fs/write_fille_sync");
        wite_file_instance.main(req,res);
    })
    app.get("/api/v1/file_system/sync_fs/read_file_sync",(req,res)=>{
        const read_file_instance = require(__dirname+"/../src/file_system/sync_fs/read_file_sync");
        read_file_instance.main(req,res);
    })
    app.get("/api/v1/file_system/sync_fs/append_file_sync",(req,res)=>{
        const append_file_instance = require(__dirname+"/../src/file_system/sync_fs/append_file_sync");
        append_file_instance.main(req,res);
    })
    app.get("/api/v1/file_system/sync_fs/rename_file_sync",(req,res)=>{
        const rename_file_instance = require(__dirname+"/../src/file_system/sync_fs/rename_file_sync");
        rename_file_instance.main(req,res);
    })
    app.get("/api/v1/file_system/sync_fs/make_directory_sync",(req,res)=>{
        const make_directory_instance = require(__dirname+"/../src/file_system/sync_fs/make_directory_sync");
        make_directory_instance.main(req,res);
    })
    app.get("/api/v1/file_system/sync_fs/file_exist_sync",(req,res)=>{
        const file_exist_instance = require(__dirname+"/../src/file_system/sync_fs/file_exist_sync");
        // const file_exist_instance = require(__dirname.concat("../src/file_system/sync_fs/file_exist_sync"));
        file_exist_instance.main(req,res);
    })

    // ========================================= Async_syn =========================================

    app.get("/api/v1/file_system/file_system_async_sync/file_write",(req,res)=>{
        const write = require(__dirname+"/../src/file_system/file_system_async_sync/file_write");
        write.main(req,res);
    })


    //===== generate dynamuc files =================
    app.post("/api/v1/file_system/dynamic_folder_file/generate_dynamic_files",function(req,res){
        let generate_dynamic_files = require(__dirname+"/../src/file_system/dynamic_folder_file/generate_dynamic_files");
        generate_dynamic_files.main(req,res);
    })


    //===== read folder =================
    app.get("/api/v1/file_system/read_directory/get_file_names",function(req,res){
        let get_file_names = require(__dirname+"/../src/file_system/read_directory/get_file_names");
        get_file_names.main(req,res);
    })
    //===== read folder =================
    app.get("/api/v1/file_system/read_directory/read_data_from_dir",function(req,res){
        let read_data_from_dir = require(__dirname+"/../src/file_system/read_directory/read_data_from_dir");
        read_data_from_dir.main(req,res);
    })



}