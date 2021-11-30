

module.exports=class Admin{
    constructor(N_passport,Name,Experience,ID=0) {
        this.n_passport=N_passport
        this.name=Name
        this.experience=Experience
        this.id=ID
        this.phones=[]
    }
   async insert(sql){
        let request = new sql.Request();
       request.input('N_passport', sql.Int, this.n_passport)
       request.input('Name', sql.VarChar(100), this.name)
       request.input('Experience', sql.Int, this.experience)
       request.query('insert into Admin(N_passport,Name,Experience) values(@N_passport,@Name,@Experience)',(err)=>{
         //  console.log(err)
       })
    }
    static async getAll(sql){
        let request = new sql.Request();
       const result=await request.query('select * from Admin')

        //const result2=result.recordset

        return result.recordset
    }
    async getID(sql){
        let request = new sql.Request();
        request.input('N_passport', sql.Int, this.n_passport)
      const result=await request.query('select ID from Admin where N_passport=@N_passport')
            this.id=result.recordset[0].ID


    }
    async update(sql){
        await  this.getID(sql)
        let request=new sql.Request()
        request.input('ID', sql.Int, this.id)
        request.input('N_passport', sql.Int, this.n_passport)
        request.input('Name', sql.VarChar(100), this.name)
        request.input('Experience', sql.Int, this.experience)
        request.query('update Admin SET N_passport=@N_passport,Name=@Name,Experience=@Experience WHERE ID=@ID',(err)=> {
            //  console.log(err)})
        })
    }
    async delete(sql){

        await  this.getID(sql)
        let request=new sql.Request()
        request.input('ID', sql.Int, this.id)
        request.query('delete from Admin where ID=@ID')
    }
    async getPhones(sql){
        await  this.getID(sql)
       // console.log(this)
        let request=new sql.Request()
        request.input('ID', sql.Int, this.id)
       const result=await request.query('select Phone from Phone_Admin where ID=@ID')
    //    console.log(result.recordset)

            this.phones=result.recordset
      //  console.log(this)
        return

    }
}