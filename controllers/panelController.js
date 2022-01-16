const client = require('../models/client')
const visit = require('../models/visit')
const contract = require('../models/contract')
const {request} = require("express");
const admin = require("../models/admin");
const {validationResult} = require("express-validator");
const bcrypt = require("bcryptjs");

class panelController {
    async clientsGet(req, res, next) {
        const sql = req.sql //Сохраняем подключение к базе данных
        const clients = await client.getAll(sql) //Получаем список всех клиентов
        const trueClients = []
        console.log(clients)
        for (const cl of clients) {  //Цикл, в котором каждому клиенту добавляются телефоны из таблицы Phone_Admin
            const cl1 = new client(cl.N_passport, cl.Name, cl.Age, null, cl.Gender, cl.ID)
            await cl1.getPhones(sql)
            trueClients.push(cl1)
        }
        res.render('clientsList', {clients: trueClients}) //Передача представления пользователю
    }

    async clientsEdit(req, res, next) {
        const sql = req.sql
        const id = req.params.id

        const client1 = new client(undefined, undefined, undefined, undefined, undefined, id)
        await client1.getInfoByID(sql)
        let phonesToOutput = ''
        for (const Phone of client1.phones) {
            phonesToOutput += Phone.Phone + ','
        }
        phonesToOutput = phonesToOutput.slice(0, -1)
        res.render('clientEdit', {client: client1, phones: phonesToOutput})
    }

    async clientsEditPost(req, res, next) {
        const sql = req.sql
        const {n_passport, name, age, gender, Phones} = req.body
        const editedClient = new client(n_passport, name, age, Phones, gender)
        await editedClient.getID(sql)
        //    console.log(editedClient)
        await editedClient.update(sql)
        res.redirect('/adminpanel/clients')
    }

    async deleteClient(req, res, next) {
        const sql = req.sql
        const id = req.params.id //id клиента на удаление получается из адресной строки
        const client1 = new client(undefined, undefined, undefined, undefined, undefined, id) //Создается модель клиента с таким id
        await client1.delete(sql)//Вызывается метод удаления модели
        res.redirect('/adminpanel/clients') //Перенаправление на список клиентов
    }

    async createClient(req, res, next) {
        res.render('clientCreate')
    }

    async createClientPost(req, res, next) {
        try {
            const sql = req.sql
            const {n_passport, name, age, gender, Phones} = req.body


            const newClient = new client(n_passport, name, age, Phones, gender)
            const error = await newClient.insert(sql)
            if (error) {
                return next(error)
            }
            return res.redirect('/adminpanel/clients')

        } catch (e) {
            console.log(e)
            next(e)
        }

    }

    async panelHome(req, res, next) {
        res.render('adminPanel')
    }

    async visitsGet(req, res, next) {
        const sql = req.sql
        const visits = await visit.getAll(sql)
        const result = await sql.query('select * from Coach')
        const coaches = result.recordset
        // console.log(visits)
        res.render('visitList', {visits: visits, coaches: coaches})
    }

    async visitsEditPost(req, res, next) {
        const sql = req.sql
        const request = new sql.Request()
        const {client, coach, id, date} = req.body
        const dateStart1 = new Date()
        //   console.log(coach)
        dateStart1.setFullYear(parseInt(date.slice(0, 4)))
        dateStart1.setMonth(parseInt(date.slice(5, 7) - 1))
        dateStart1.setDate(parseInt(date.slice(8, 10)))
        const vis = new visit(id, client, dateStart1, coach)
        //  console.log(vis)
        await vis.update(sql)
        res.redirect('/adminpanel/visits')
    }

    async visitsEdit(req, res, next) {
        const sql = req.sql
        const request = new sql.Request()
        const id = req.params.id
        const visit1 = new visit(id, null, null)
        await visit1.getInfoByID(sql)
        let coach = null
        let coaches = null
        //   console.log(visit1)
        request.input('ID', sql.Int, visit1.idCoach)
        if (visit1.idCoach != null) {
            //      console.log(visit1.idCoach)

            const result = await request.query('select * from Coach where ID=@ID')
            coach = result.recordset[0]
            //  request.input('@ID',sql.Int,visit1.idCoach)
            const result2 = await request.query('select * from Coach where ID!=@ID')
            coaches = result2.recordset
            let aRolf = {}
            aRolf.Name = ' '
            aRolf.ID = ''
            coaches.push(aRolf)
        } else {
            const r2 = new sql.Request()
            const result2 = await r2.query('select * from Coach')
            coaches = result2.recordset
        }


        const client1 = new client(null, null, null, null, null, visit1.idClient)
        await client1.getInfoByID(sql)
        const clients = await client1.getAllExcept(sql)
        //    console.log(visit1)
        let year = visit1.date.getFullYear()
        let month = visit1.date.getMonth()
        let day = visit1.date.getDate()
        //   console.log(day)
        //   console.log(month)
        if (month.toString().length == 1)
            month = '0' + (month + 1)
        if (day.toString().length == 1)
            day = '0' + (day).toString()
        //  console.log(month,day)
        res.render('visitEdit', {
            visit: visit1,
            coach: coach,
            client: client1,
            otherClients: clients,
            otherCoaches: coaches,
            year: year,
            month: month,
            day: day
        })
    }

    async deleteVisit(req, res, next) {
        const id = req.params.id
        const vis = new visit(id, null, null)
        await vis.delete(req.sql)
        res.redirect('/adminpanel/visits')
    }

    async createVisit(req, res, next) {
        const sql = req.sql
        const request = new sql.Request()
        const clients = await client.getAll(sql)
        const result = await request.query('select * from Coach')
        const coaches = result.recordset
//console.log(clients)
        res.render('visitCreate', {coaches: coaches, clients: clients})
    }

    async createVisitPost(req, res, next) {
        const sql = req.sql
        let {date, coach, client} = req.body
        if (coach == '' || coach == null || coach == undefined)
            coach = null
        let dateStart1 = new Date()
        dateStart1.setFullYear(parseInt(date.slice(0, 4)))
        dateStart1.setMonth(parseInt(date.slice(5, 7)) - 1)
        dateStart1.setDate(parseInt(date.slice(8, 10)))
        const vis = new visit(null, client, dateStart1, coach)
        await vis.insert(sql)
        res.redirect('/adminpanel/visits')

    }

    async createQueryGet(req, res, next) {
        res.render('queryEnter')
    }

    async createQueryPost(req, res, next) {
        try {


            const {query} = req.body
            //    console.log(query)
            const sql = req.sql
            const request = new sql.Request()
            const result = await request.query(query)
            const respond = result.recordset
            //  console.log(result)
            return res.json(result)
        } catch (e) {
            next(e)
        }
    }

    async contractsList(req, res, next) {
        const contracts = await contract.getAll(req.sql)
        //  console.log(contracts)
        res.render('contractList', {contracts: contracts})
    }

    async contractEditPost(req, res, next) {
        const sql = req.sql
        let request = new sql.Request();
        let {dateStart, dateEnd, enterNumber, price, idAdm, id, idCl} = req.body
        const dateStart1 = new Date()
        const dateEnd1 = new Date()
        dateStart1.setFullYear(parseInt(dateStart.slice(0, 4)))
        dateStart1.setMonth(parseInt(dateStart.slice(5, 7)) - 1)
        dateStart1.setDate(parseInt(dateStart.slice(8, 10)))
        dateEnd1.setFullYear(parseInt(dateEnd.slice(0, 4)))
        dateEnd1.setMonth(parseInt(dateEnd.slice(5, 7)) - 1)
        dateEnd1.setDate(parseInt(dateEnd.slice(8, 10)))
        //  console.log('')
        if (idAdm == '')
            idAdm = null
        const cont = new contract(dateStart1, dateEnd1, enterNumber, price, idCl, idAdm, id)
        console.log(cont)
        await cont.update(sql)
        return res.redirect('/adminpanel/contracts')
    }

    async contractEdit(req, res, next) {
        const sql = req.sql
        let request = new sql.Request();
        const id = req.params.id
        //   console.log(id)
        const cont = new contract(null, null, null, null, null, null, id)
        await cont.getInfoByID(sql)
        console.log(cont)
        const yearStart = cont.dateStart.getFullYear().toString()

        let monthStart = '0' + (cont.dateStart.getMonth() + 1).toString()
        if (monthStart.length == 3) {
            monthStart = monthStart.slice(1)
        }
        let dayStart = '0' + cont.dateStart.getDate().toString()
        if (dayStart.length == 3) {
            dayStart = dayStart.slice(1)
        }
        const yearEnd = cont.dateEnd.getFullYear().toString()
        let monthEnd = '0' + (cont.dateEnd.getMonth() + 1).toString()
        if (monthEnd.length == 3) {
            monthEnd = monthEnd.slice(1)
        }
        let dayEnd = '0' + cont.dateEnd.getDate().toString()
        //   console.log(dayEnd)
        if (dayEnd.length == 3) {
            dayEnd = dayEnd.slice(1)
        }
        //  console.log(dayEnd)
        let adm = new admin(null, null, null, null, null)
        let otherAdmins = await admin.getAll(sql)
        if (cont.idAdmin != null) {
            adm = new admin(null, null, null, null, cont.idAdmin)
            otherAdmins = await adm.getAllExcept(sql)
            const admnull = {}
            admnull.ID = null
            admnull.Name = null
            otherAdmins.push(admnull)
            await adm.getInfoByID(sql)
            // console.log(adm)
        }
        const cl = new client(null, null, null, null, null, cont.idClient)
        await cl.getInfoByID(sql)
        const otherClients = await cl.getAllExcept(sql)

        // console.log(cont)
        res.render('contractEdit', {
            contract: cont,
            yearStart: yearStart,
            monthStart: monthStart,
            dayStart: dayStart,
            yearEnd: yearEnd,
            monthEnd: monthEnd,
            dayEnd: dayEnd,
            admin: adm,
            otherAdmins: otherAdmins,
            client: cl,
            otherClients: otherClients
        })
    }

    async createContract(req, res, next) {
        const sql = req.sql
        const clients = await client.getAll(sql)
        const admins = await admin.getAll(sql)
        const admnull = {}
        admnull.ID = null
        admnull.name = null
        //  console.log(admins)
        admins.push(admnull)
        res.render('contractCreate', {clients: clients, admins: admins})
    }

    async createContractPost(req, res, next) {
        let {dateStart, dateEnd, enterNumber, price, idAdm, idCL} = req.body
        const sql = req.sql
        const dateStart1 = new Date()
        const dateEnd1 = new Date()
        dateStart1.setFullYear(parseInt(dateStart.slice(0, 4)))
        dateStart1.setMonth(parseInt(dateStart.slice(5, 7)) - 1)
        dateStart1.setDate(parseInt(dateStart.slice(8, 10)))
        dateEnd1.setFullYear(parseInt(dateEnd.slice(0, 4)))
        dateEnd1.setMonth(parseInt(dateEnd.slice(5, 7)) - 1)
        dateEnd1.setDate(parseInt(dateEnd.slice(8, 10)))
        if (idAdm == 'not' || idAdm == '')
            idAdm = undefined
        const cont = new contract(dateStart1, dateEnd1, enterNumber, price, idCL, idAdm)
        console.log(cont)
        const err = await cont.insert(sql)
        if (err)
            next(err)
        res.redirect('/adminpanel/contracts/')
    }

    async deleteContract(req, res, next) {
        const id = req.params.id
        const con = new contract(null, null, null, null, null, null, id)
        await con.delete(req.sql)
        res.redirect('/adminpanel/contracts')
    }
}

module.exports = new panelController()