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
   //  await  recordsAdmins.forEach (rofl=>{
      //      _admin=new admin(rofl.N_passport,rofl.Name,rofl.Experience,rofl.ID)
  // _admin.phones= _admin.getPhones(sql)
          //  console.log(_admin)
            //console.log(_admin)
          //  trueAdminList.push(_admin)
      //  })

        for(const rofl of recordsAdmins)
        {
            _admin=new admin(rofl.N_passport,rofl.Name,rofl.Experience,undefined,rofl.ID)
            await _admin.getPhones(sql)
            trueAdminList.push(_admin)
                //    console.log(_admin)
        }

     //   console.log(trueAdminList)
   return  res.render('employees',{recordsAdmins:trueAdminList,recordsCoaches:recordsCoaches})
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
            const newAdmin=new admin(undefined,undefined,undefined,undefined,ID)
            console.log(newAdmin)
          const error= await newAdmin.delete(sql)
            if(error){
                return res.status(400).json({message: "Something went wrong"})
            }
             return res.redirect('http://localhost:3000/list/employees')



        }catch (e) {
            return res.status(400).json({message: "Something went wrong"})
        }
}
async PostAdminEdit(req,res,next){
        try {
            const sql = req.sql
            const {ID,N_passport, Name, Experience,Phones} = req.body
            const newAdmin = new admin(N_passport, Name, Experience,Phones,ID)
            console.log(newAdmin.id)
            const error=    await newAdmin.update(sql)
            if(error){
                return res.status(400).json({message: "Something went wrong"})
            }
            return res.redirect('/list/Admin/edit/'+newAdmin.id)
        }catch (e) {
            return res.status(400).json({message: "Something went wrong"})
        }
}
async PostAdminCreate(req,res,next)
{
    try {


        const sql = req.sql

        const {N_passport, Name, Experience, Phones} = req.body
        const newAdmin = new admin(N_passport, Name, Experience,Phones)
        console.log(newAdmin)
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

}
   async GetAdminEdit(req,res){
        const sql=req.sql
        const ID=req.params.id
        const admin1=new admin(undefined,undefined,undefined,undefined,ID)
        await admin1.getInfoByID(sql)
       console.log(admin1)
       let phonesToOutput=''
       for(const Phone of admin1.phones){
           phonesToOutput+=Phone.Phone+','
       }
       phonesToOutput=phonesToOutput.slice(0,-1)
       console.log(phonesToOutput)
       return res.render('adminEdit',{admin1:admin1,phones:phonesToOutput})
    }
}

module.exports=new ListController()