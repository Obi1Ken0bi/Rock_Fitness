const admin=require('../models/admin')
class ListController{
    async Employees(req,res,next){
    const sql=req.sql
    const request=new sql.Request()
    const listAdmins=await admin.getAll(sql)
    const listCoaches=await request.query('select * from Coach')
    const recordsAdmins=listAdmins
    const recordsCoaches=listCoaches.recordset
        let _admin
        const trueAdminList=[]
        await recordsAdmins.forEach(rofl=>{
            _admin=new admin(rofl.N_passport,rofl.Name,rofl.Experience,rofl.ID)
            _admin.getPhones(sql)
            //console.log(_admin)
            trueAdminList.push(_admin)
        })
    res.render('employees',{recordsAdmins:trueAdminList,recordsCoaches:recordsCoaches})
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
       //console.log(_admin)
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
async GetAdminCreate(req,res,next){
        res.render('adminCreate')
}
async PostAdminDelete(req,res,next){
        try {

            const sql=req.sql
         //   const {ID}=req.body
            const ID=req.params.id
            const newAdmin=new admin(undefined,undefined,undefined,ID)
          const error= await newAdmin.delete(sql)
            if(error){
                return res.status(400).json({message: "Something went wrong"})
            }
             return res.status(200).json({message:'success'})



        }catch (e) {
            return res.status(400).json({message: "Something went wrong"})
        }
}
async PostAdminEdit(req,res,next){
        try {
            const sql = req.sql
            const {ID,N_passport, Name, Experience} = req.body
            const newAdmin = new admin(N_passport, Name, Experience,ID)
            console.log(newAdmin.id)
            const error=    await newAdmin.update(sql)
            if(error){
                return res.status(400).json({message: "Something went wrong"})
            }
            return res.status(200).json({message:'success'})
        }catch (e) {
            return res.status(400).json({message: "Something went wrong"})
        }
}
async PostAdminCreate(req,res,next)
{
    try {


        const sql = req.sql
        const {N_passport, Name, Experience} = req.body
        const newAdmin = new admin(N_passport, Name, Experience)
        const error= await newAdmin.insert(sql)
        if(error){
            return res.status(400).json({message: "Something went wrong"})
        }
        return res.redirect('/list/employees')
    }

    catch (e){
        console.log(e)
        return res.status(400).json({message: "Something went wrong"})
    }

}}
module.exports=new ListController()