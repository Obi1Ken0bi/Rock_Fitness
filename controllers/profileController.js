const admin=require('../models/admin')
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


}

module.exports=new profileController()