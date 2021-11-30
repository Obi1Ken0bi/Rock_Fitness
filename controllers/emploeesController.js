const admin=require('../models/admin')
class ListController{
    async Employees(req,res,next){
    const sql=req.sql
    const request=new sql.Request()
    const listAdmins=await admin.getAll(sql)
    const listCoaches=await request.query('select * from Coach')
    const recordsAdmins=listAdmins
    const recordsCoaches=listCoaches.recordset
    res.render('employees',{recordsAdmins:recordsAdmins,recordsCoaches:recordsCoaches})
}
async Admin(req,res,next){
    const sql=req.sql
    //const recordsAdmins=await
    const adminList=    await admin.getAll(sql)
    let _admin
    const trueAdminList=[]
   await adminList.forEach(rofl=>{
        _admin=new admin(rofl.N_passport,rofl.Name,rofl.Experience)
        _admin.getPhones(sql)
        trueAdminList.push(_admin)
    })
   // console.log(trueAdminList)
  // await trueAdminList.forEach( (kek)=>{
   //     kek.getPhones(sql)
  //  })
   // console.log(trueAdminList)
    //res.send('aboba')

   // console.log(recordsAdmins)
    return  res.render('admins',{recordsAdmins:trueAdminList})
}
}
module.exports=new ListController()