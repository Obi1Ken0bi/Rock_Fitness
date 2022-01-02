const admin=require('../models/admin')
const coach=require('../models/coach')
class ListController{
    async Employees(req,res,next){
    const sql=req.sql
    const request=new sql.Request()
    const listAdmins=await admin.getAll(sql)
    const listCoaches=await coach.getAll(sql)
        let _coach
        const trueCoachList=[]
        for(const coach1 of listCoaches){
            _coach=new coach(coach1.N_passport,coach1.Name,coach1.Experience,undefined,coach1.ID,coach1.ID_admin)
            await _coach.getPhones(sql)
            trueCoachList.push(_coach)
        }
        let _admin
        const trueAdminList=[]


        for(const rofl of listAdmins)
        {
            _admin=new admin(rofl.N_passport,rofl.Name,rofl.Experience,undefined,rofl.ID)
            await _admin.getPhones(sql)
            trueAdminList.push(_admin)
                //    console.log(_admin)
        }

     //   console.log(trueAdminList)
   return  res.render('employees',{recordsAdmins:trueAdminList,recordsCoaches:trueCoachList})
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
    //Тренеры
    async   GetCoachCreate(req,res,next){

        const sql=req.sql
        const allAdmins=await admin.getAll(sql)

        res.render('coachCreate',{admins:allAdmins})
    }
    async PostCoachDelete(req,res,next){
        try {

            const sql=req.sql
            //   const {ID}=req.body
            const ID=req.params.id
            const newCoach=new coach(undefined,undefined,undefined,undefined,ID,undefined)
            console.log(newCoach)
            const error= await newCoach.delete(sql)
            if(error){
                return res.status(400).json({message: "Something went wrong"})
            }
            return res.redirect('http://localhost:3000/list/employees')



        }catch (e) {
            return res.status(400).json({message: "Something went wrong"})
        }
    }
    async PostCoachEdit(req,res,next){
        try {
            const sql = req.sql
            const {ID,N_passport, Name, Experience,Phones,ID_admin} = req.body
            const newCoach = new coach(N_passport, Name, Experience,Phones,ID,ID_admin)
            console.log(newCoach.id)
            const error=    await newCoach.update(sql)
            if(error){
                return res.status(400).json({message: "Something went wrong"})
            }
            return res.redirect('/list/Coach/edit/'+newCoach.id)
        }catch (e) {
            return res.status(400).json({message: "Something went wrong"})
        }
    }
    async PostCoachCreate(req,res,next)
    {
        try {


            const sql = req.sql

            const {N_passport, Name, Experience, Phones,ID_admin} = req.body
            const newCoach = new coach(N_passport, Name, Experience,Phones,0,ID_admin)
            console.log(newCoach)
            const error= await newCoach.insert(sql)
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
    async GetCoachEdit(req,res){
        const sql=req.sql
        const ID=req.params.id
        const coach1=new coach(undefined,undefined,undefined,undefined,ID)
        await coach1.getInfoByID(sql)
        console.log(coach1)
        let phonesToOutput=''
        for(const Phone of coach1.phones){
            phonesToOutput+=Phone.Phone+','
        }
        phonesToOutput=phonesToOutput.slice(0,-1)
        console.log(phonesToOutput)
        const admin1=new admin(undefined,undefined,undefined,undefined,coach1.id_adm)
        const allAdmins=await admin1.getAllExcept(sql)
        console.log(allAdmins)
        return res.render('coachEdit',{coach1:coach1,phones:phonesToOutput,admins:allAdmins})
    }
}

module.exports=new ListController()