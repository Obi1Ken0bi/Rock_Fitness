const admin=require('../models/admin')
class ListController{
    async Employees(req,res,next){
    const sql=req.sql
    const request=new sql.Request()
    const listAdmins=await request.query('select * from Admin')
    const listCoaches=await request.query('select * from Coach')
    const recordsAdmins=listAdmins.recordset
    const recordsCoaches=listCoaches.recordset
    res.render('employees',{recordsAdmins:recordsAdmins,recordsCoaches:recordsCoaches})
}
async Admin(req,res,next){
    const sql=req.sql
    //const recordsAdmins=await
        admin.getAll(sql).then(
        (result)=>{//console.log(result)
            res.render('admins',{recordsAdmins:result})

        }
    )
   // console.log(recordsAdmins)
    //res.render('admins',{recordsAdmins:recordsAdmins})
}
}
module.exports=new ListController()