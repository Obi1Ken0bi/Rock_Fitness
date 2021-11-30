

module.exports=class Admin{
    constructor(N_passport,Name,Experience) {
        this.n_passport=N_passport
        this.name=Name
        this.experience=Experience
    }
   async save(sql){
        let request = new sql.Request();
       request.input('N_passport', sql.Int, this.n_passport)
       request.input('Name', sql.VarChar(100), this.name)
       request.input('Experience', sql.Int, this.experience)
       request.query('insert into Admin(N_passport,Name,Experience) values(@N_passport,@Name,@Experience)',(err)=>{
           console.log(err)
       })
    }
    static async getAll(sql){
        let request = new sql.Request();
       const result=await request.query('select * from Admin')

        const result2=result.recordset

        return result.recordset
    }
}