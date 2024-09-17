module.exports=function(app){
  // =================================== ASync ================================================

    app.post("/api/v1/file_system/async_fs/write_file_async",(req,res)=>{
        const wite_file_instance = require("../src/file_system/async_fs/write_fille_async");
        wite_file_instance.main(req,res);
    })

    app.get("/api/v1/file_system/async_fs/read_file_async",(req,res)=>{
        const read_file_instance = require("../src/file_system/async_fs/read_file_async");
        read_file_instance.main(req,res);
    })

    app.get("/api/v1/file_system/async_fs/append_file_async",(req,res)=>{
        const append_file_instance = require("../src/file_system/async_fs/append_file_async");
        append_file_instance.main(req,res);
    })

    app.get("/api/v1/file_system/async_fs/rename_file",(req,res)=>{
        const rename_file_instance = require("../src/file_system/async_fs/rename_file_async");
        rename_file_instance.main(req,res);
    })
    app.get("/api/v1/file_system/async_fs/make_directory_async",(req,res)=>{
        const make_directory_async = require("../src/file_system/async_fs/make_directory_async");
        make_directory_async.main(req,res);
    })
    app.get("/api/v1/file_system/async_fs/file_exist_async",(req,res)=>{
        const file_exist = require("../src/file_system/async_fs/file_exist_async");
        file_exist.main(req,res);
    })

    // =================================== Sync ================================================
    app.post("/api/v1/file_system/sync_fs/write_fille_sync",(req,res)=>{
        const wite_file_instance = require("../src/file_system/sync_fs/write_fille_sync");
        wite_file_instance.main(req,res);
    })
    app.get("/api/v1/file_system/sync_fs/read_file_sync",(req,res)=>{
        const read_file_instance = require("../src/file_system/sync_fs/read_file_sync");
        read_file_instance.main(req,res);
    })
    app.get("/api/v1/file_system/sync_fs/append_file_sync",(req,res)=>{
        const append_file_instance = require("../src/file_system/sync_fs/append_file_sync");
        append_file_instance.main(req,res);
    })
    app.get("/api/v1/file_system/sync_fs/rename_file_sync",(req,res)=>{
        const rename_file_instance = require("../src/file_system/sync_fs/rename_file_sync");
        rename_file_instance.main(req,res);
    })
    app.get("/api/v1/file_system/sync_fs/make_directory_sync",(req,res)=>{
        const make_directory_instance = require("../src/file_system/sync_fs/make_directory_sync");
        make_directory_instance.main(req,res);
    })
    app.get("/api/v1/file_system/sync_fs/file_exist_sync",(req,res)=>{
        const file_exist_instance = require("../src/file_system/sync_fs/file_exist_sync");
        file_exist_instance.main(req,res);
    })
}