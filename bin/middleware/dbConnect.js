const sql = require('mssql')
const config = {
    server: '34.65.189.252',
    database: 'Fitness_Club2',
    user: 'sqlserver',
    password: 'abobusamogus',
    trustServerCertificate: true,
   // instanceName: 'mssqlserver',
    encrypt: true
}
module.exports = (req, res, next) => {
    sql.connect(config, (err) => {
        if (err) console.log(err)
        req.sql = sql
        next()
    })
}