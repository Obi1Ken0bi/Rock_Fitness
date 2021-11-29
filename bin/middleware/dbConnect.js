const sql = require('mssql')
const config = {
    server: 'localhost',
    database: 'Fitness_Club',
    user:'root',
    password:'root',
    trustServerCertificate: true,
    instanceName:'mssqlserver',
    encrypt:true
}
module.exports=(req,res,next)=>{
    sql.connect(config, (err) => {
        if (err) console.log(err)
        req.sql = sql
        next()
})}