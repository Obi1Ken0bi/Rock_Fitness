const bcrypt = require('bcryptjs')
const {validationResult, body, cookie} = require('express-validator')
const {secret} = require('./../config')
const jwt = require('jsonwebtoken')
const client=require('../models/client')
const generateAccesToken = (login, role) => {
    const payload = {
        login, role
    }
    return jwt.sign(payload, secret, {expiresIn: '24h'})
}

class authController {

    async registration(req, res, next) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({message: 'Ошибка при регистрации', errors})
            }
            const sql = req.sql
            const {username1, password1,n_passport,name,age,gender,Phones} = req.body

            let request = new sql.Request();
            request.input('usernameinput', sql.NVarChar(20), username1)

            const candidate = await request.query('select login from [User] where login like @usernameinput')
            //console.log(candidate)
            if (candidate.rowsAffected[0] > 0) {
                return res.status(400).json({message: "Пользователь уже существует"})
            }
            const hashPassword = bcrypt.hashSync(password1, 7)
            request.input('passwordinput', sql.NVarChar(100), hashPassword)
           // console.log(hashPassword)
            const userDefault = 'USER'
            request.input('userrole', sql.NVarChar(20), userDefault)
            await request.query('insert into [User] values (@usernameinput,@passwordinput,@userrole)')
            const newClient=new client(n_passport,name,age,Phones,gender)
            await newClient.insert(sql)
            await newClient.getID(sql)
            const id=newClient.id
            const request1=new sql.Request()
            request1.input('username',sql.VarChar(20),username1)
            request1.input('id',sql.Int,id)
            console.log('id: '+id)
            const err=await request1.query('insert into User_Client(id,login) values(@id,@username)')
            if(err){
                console.log(err)
                return  next(err)
            }
            return res.redirect('/')

        } catch (e) {
            console.log(e)
            next(e)
        }
    }

    async login(req, res, next) {
        try {
          //  console.log(req.body)
            const sql = req.sql
            let request = new sql.Request();
            const {login, password} = req.body
            request.input('usernameinput', sql.NVarChar(20), login)
            const queryResult = await request.query('select login,password,role from [User] where login like @usernameinput')
            console.log(queryResult)
            if(!queryResult.recordset[0]){
                return res.status(400).json({message: "Пользователь " + login + " не найден"})
            }
               const loginFromQuery = queryResult.recordset[0].login
            if (!loginFromQuery) {
                return res.status(400).json({message: "Пользователь " + loginFromQuery + " не найден"})
            }

            const roleFromQuery = queryResult.recordset[0].role
            const passwordFromQuery = queryResult.recordset[0].password
            const validPassword = bcrypt.compareSync(password, passwordFromQuery)
            if (!validPassword) {
                return res.status(400).json({message: "Введен неверный пароль"})
            }
            console.log(roleFromQuery)
            const token = generateAccesToken(loginFromQuery, roleFromQuery)
            return   res.cookie('id',token,{signed:true}).json({token})
            //res.json({token})


        } catch (e) {
            console.log(e)
          return   next(e)

        }
    }

    async getUsers(req, res, next) {
        try {
            const sql = req.sql
            let request = new sql.Request();
            const queryResult = await request.query('select login,password,role from [User] ')
            return res.json(queryResult)

        } catch (e) {
            console.log(e)
            next(e)

        }
    }
}

module.exports = new authController()