module.exports=function(app){
    app.get("/",(req,res)=>{
        let x= require(__dirname+"/../src/employee/get_employee");
        x.main(req,res)
    })

    app.get("/employee/:id/:subId",(req,res)=>{
        let x= require(__dirname+"/../src/employee/get_employee");
        x.main_with_slug(req,res)
    })

    app.get("/employee_query",(req,res)=>{
        let x= require(__dirname+"/../src/employee/get_employee");
        x.main_with_query(req,res)
    })

    app.post("/employee_body_data",(req,res)=>{
        let x= require(__dirname+"/../src/employee/get_employee");
        x.main_with_body(req,res)
    })
    app.get("/employee_header_data",function(req,res) {
        let x= require(__dirname+"/../src/employee/get_employee");
        x.main_with_header(req,res)
    })
}
// module.exports=function(app){
//     app.get("/",function(req,res) {
//     res.send("Hello world!");
// })
// }