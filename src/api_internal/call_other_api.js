
// const { MongoClient } = require('mongodb');
var Client = require('node-rest-client').Client;
var client = new Client();

function main(req,res){
   let counter=2;
   let res_data={};
    client.get('http://localhost:9998/api/v1/file_system/sync_fs/read_file_sync?file_name=Amish_sync.txt', function (data, response) {
        res_data.read_file=data.toString();
        counter--;
        if(counter==0){
         console.log(res_data)
         res.send(res_data)
        }
     });
     client.get('http://localhost:9998/api/v1/pg_sql_db/read_api_pg_db', function (data, response) {
        res_data.postgre=data;
        counter--;
        if(counter==0){
         console.log(res_data)
         res.send(res_data)
        }
     });
}

module.exports = {
        main 
}

