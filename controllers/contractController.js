const admin = require('../models/admin')
const contract = require('../models/contract')

class contractController {
    async BuyContractGet(req, res, next) {
        const currentDate = new Date()
        const year = currentDate.getFullYear().toString()
        const month = '0' + (currentDate.getMonth() + 1).toString()
        const day = '0' + currentDate.getDate().toString()
        const nextYear = (parseInt(year) + 1).toString()

        const admins = await admin.getAll(req.sql)
        //  console.log(admins)
        res.render('contractBuy', {year: year, month: month, day: day, nextYear: nextYear, admins: admins})

    }

    async BuyContractPost(req, res, next) {
        let {dateStart, dateEnd, enterNumber, price, idAdm} = req.body
        const sql = req.sql
        const login = req.session.login
        let request = new sql.Request();
        request.input('login', sql.NVarChar(20), login)
        const queryResult = await request.query('select id from User_Client where login=@login')
        const id = queryResult.recordset[0].id
        // console.log(dateStart)
        //  console.log(dateEnd)
        const dateStart1 = new Date()
        const dateEnd1 = new Date()
        dateStart1.setFullYear(parseInt(dateStart.slice(0, 4)))
        dateStart1.setMonth(parseInt(dateStart.slice(5, 7)) - 1)
        dateStart1.setDate(parseInt(dateStart.slice(8, 10)))
        dateEnd1.setFullYear(parseInt(dateEnd.slice(0, 4)))
        dateEnd1.setMonth(parseInt(dateEnd.slice(5, 7)) - 1)
        dateEnd1.setDate(parseInt(dateEnd.slice(8, 10)))
        if (idAdm == 'not')
            idAdm = undefined
        const cont = new contract(dateStart1, dateEnd1, enterNumber, price, id, idAdm)
        // console.log(cont)
        const err = await cont.insert(sql)
        if (err)
            next(err)
        res.redirect('/contract')
    }

    async checkConractGet(req, res, next) {
        const sql = req.sql
        const login = req.session.login
        let request = new sql.Request();
        request.input('login', sql.NVarChar(20), login)
        const queryResult = await request.query('select id from User_Client where login=@login')
        const id = queryResult.recordset[0].id
        const cont = new contract(null, null, null, null, id)
        await cont.getID(sql)
        await cont.getInfoByID(sql)
        const yearStart = cont.dateStart.getFullYear().toString()
        const monthStart = '0' + (cont.dateStart.getMonth() + 1).toString()
        const dayStart = '0' + cont.dateStart.getDate().toString()
        const yearEnd = cont.dateEnd.getFullYear().toString()
        const monthEnd = '0' + (cont.dateEnd.getMonth() + 1).toString()
        const dayEnd = '0' + cont.dateEnd.getDate().toString()
        let name = String()
        if (cont.idAdmin != null) {
            const adm = new admin(null, null, null, null, cont.idAdmin)
            await adm.getInfoByID(sql)
            name = adm.name
        } else {
            name = ' '
        }
        // console.log(cont)
        res.render('contractView', {
            contract: cont,
            yearStart: yearStart,
            monthStart: monthStart,
            dayStart: dayStart,
            yearEnd: yearEnd,
            monthEnd: monthEnd,
            dayEnd: dayEnd,
            name: name
        })
    }

    async updateEntersPost(req, res, next) {
        const sql = req.sql
        const {price, enterNumber, id} = req.body
        const cont = new contract(null, null, null, null, null, null, id)
        await cont.getInfoByID(sql)
        //  console.log(cont)
        cont.price += parseInt(price)
        cont.enterNumber += parseInt(enterNumber)
        await cont.addEnters(sql)
        res.redirect('/contract')

    }
}

module.exports = new contractController()