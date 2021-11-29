const bcrypt=require('bcryptjs')
const {validationResult}=require('express-validator')
const {secret}=require('./../config')
const jwt=require('jsonwebtoken')
const generateAccesToken=(login,role)=>{
const payload={
    login,role
}
return jwt.sign(payload,secret,{expiresIn: '24h'})
}
class authController{

    async registration(req,res,next){
        try {
            const errors=validationResult(req)
            if(!errors.isEmpty()){
                return res.status(400).json({message:'Ошибка при регистрации',errors})
            }
            const sql=req.sql
            const{username,password}=req.body
            let request=new sql.Request();
            request.input('usernameinput',sql.VarChar(20),username)

            const candidate=await request.query('select login from [User] where login like @usernameinput')
            console.log(candidate)
            if(candidate.rowsAffected[0]>0){
                return res.status(400).json({message:"Пользователь уже существует"})
            }
            const hashPassword=bcrypt.hashSync(password, 7)
            request.input('passwordinput',sql.VarChar(100),hashPassword)
            console.log(hashPassword)
            const userDefault='USER'
            request.input('userrole',sql.VarChar(20),userDefault)
            await request.query('insert into [User] values (@usernameinput,@passwordinput,@userrole)')
            return res.json({message:'Пользователь успешно зарегистрирован'})

        }catch (e){
            console.log(e)
            next(e)
        }
    }
    async login(req,res,next){
        try {
            const sql=req.sql
            let request=new sql.Request();
            const {username,password}=req.body
            request.input('usernameinput',sql.VarChar(20),username)
            const queryResult=await request.query('select login,password,role from [User] where login like @usernameinput')
            console.log(queryResult)
            const loginFromQuery=queryResult.recordset[0].login
            if(!loginFromQuery){
                return res.status(400).json({message:"Пользователь "+loginFromQuery+" не найден"})
            }

            const roleFromQuery=queryResult.recordset[0].role
            const passwordFromQuery=queryResult.recordset[0].password
            const validPassword=bcrypt.compareSync(password,passwordFromQuery)
            if(!validPassword){
                return res.status(400).json({message:"Введен неверный пароль"})
            }
            console.log(roleFromQuery)
            const token=generateAccesToken(loginFromQuery,roleFromQuery)
            return res.json({token})

        }catch (e){
            console.log(e)
            next(e)

        }
    }
    async getUsers(req,res,next){
        try {
            const sql=req.sql
            let request=new sql.Request();
            const queryResult=await request.query('select login,password,role from [User] ')
            return res.json(queryResult)

        }catch (e){
            console.log(e)
            next(e)

        }
    }
}
module.exports=new authController()