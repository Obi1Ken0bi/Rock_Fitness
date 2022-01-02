const admin=require('../models/admin')
const client=require('../models/client')
class profileController{
async adminProfile(req,res,next){
    if (req.session.login) {
        const sql = req.sql
        const login = req.session.login
        let request = new sql.Request();
        request.input('login', sql.NVarChar(20), login)
        const queryResult = await request.query('select id from User_Admin where login=@login')
        const id = queryResult.recordset[0].id
        const myAdmin = new admin(undefined, undefined, undefined, undefined, id)
        await myAdmin.getInfoByID(sql)
        res.render('adminProfile', {admin: myAdmin, login: login})
    }
    else{
        res.send('cant access')
    }

}
    async clientProfile(req,res,next){
        if (req.session.login) {
            const sql = req.sql
            const login = req.session.login
            let request = new sql.Request();
            request.input('login', sql.NVarChar(20), login)
            const queryResult = await request.query('select id from User_Client where login=@login')
            const id = queryResult.recordset[0].id
            const client1 = new client(undefined, undefined, undefined, undefined,undefined ,id)
            await client1.getInfoByID(sql)
            res.render('clientProfile', {client: client1, login: login})
        }
        else{
            res.send('cant access')
        }

    }
    async profileEditGet(req,res,next){
        const sql = req.sql
        const login = req.session.login
        let request = new sql.Request();
        request.input('login', sql.NVarChar(20), login)
        const queryResult = await request.query('select id from User_Client where login=@login')
        const id = queryResult.recordset[0].id
        const client1 = new client(undefined, undefined, undefined, undefined,undefined ,id)
        await client1.getInfoByID(sql)
        let phonesToOutput=''
        for(const Phone of client1.phones){
            phonesToOutput+=Phone.Phone+','
        }
        phonesToOutput=phonesToOutput.slice(0,-1)
        res.render('profileEdit',{client:client1,phones:phonesToOutput})
    }
    async profileEditPost(req,res,next){
    const sql=req.sql
    const  {n_passport,name,age,gender,Phones}=req.body
        const editedClient=new client(n_passport,name,age,Phones,gender)
        await editedClient.getID(sql)
        console.log(editedClient)
        await editedClient.update(sql)
        res.redirect('/myprofile')
    }

async profileDeleteGet(req, res, next){
    const sql = req.sql
    const login = req.session.login
    let request = new sql.Request();
    request.input('login', sql.NVarChar(20), login)
    const queryResult = await request.query('select id from User_Client where login=@login')
    const id = queryResult.recordset[0].id
    const client1 = new client(undefined, undefined, undefined, undefined,undefined ,id)
    await client1.delete(sql)
    await request.query('delete from [User] where login=@login')
    res.redirect('/logout')
}
}


module.exports=new profileController()