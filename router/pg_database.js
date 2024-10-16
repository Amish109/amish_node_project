module.exports=function(app){
// ================================ CRUD ================================
app.post("/api/v1/pg_sql_db/create_api_pg_db",function(req,res){
    const postgres_create_api = require(__dirname+"/../src/pg_sql_db/create_api_pg_db");
    postgres_create_api.main(req,res);
})
app.get("/api/v1/pg_sql_db/read_api_pg_db",function(req,res){
    const postgres_read_api = require(__dirname+"/../src/pg_sql_db/read_api_pg_db");
    postgres_read_api.main(req,res);
})
app.put("/api/v1/pg_sql_db/update_api_pg_db/:id",function(req,res){
    const update_api = require(__dirname+"/../src/pg_sql_db/update_api_pg_db");
    update_api.main(req,res);
})
app.delete("/api/v1/pg_sql_db/delete_api_pg_db/:id",function(req,res){
    const postgres_delete_api = require(__dirname+"/../src/pg_sql_db/delete_api_pg_db");
    postgres_delete_api.main(req,res);
})


// =============================================================================

// ================================= EMP List (operations) ====================

// I] Search based on filtering the words that matches anywhere in the data
app.get("/api/v1/pg_sql_db/emp/get_emp_list",(req,res)=>{
    const postgres_get_emp_api = require(__dirname+"/../src/pg_sql_db/emp/get_emp_list");
    postgres_get_emp_api.main(req,res);
})

// 2] Pagination

app.get("/api/v1/pg_sql_db/emp/get_employee_pagination",(req,res)=>{
    const postgres_pagination_api = require(__dirname+"/../src/pg_sql_db/emp/get_employee_pagination");
    postgres_pagination_api.main(req,res);
})

}