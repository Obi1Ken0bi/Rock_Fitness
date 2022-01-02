

module.exports=class Admin{
    constructor(N_passport,Name,Experience,Phones=[],ID=0) {
        this.n_passport=N_passport
        this.name=Name
        this.experience=Experience
        this.id=ID
        this.phones=Phones
    }
   async insert(sql){try {

console.log(this.name)
        let request = new sql.Request();
       request.input('N_passport', sql.Int, this.n_passport)
       request.input('Name', sql.NVarChar(100), this.name)
       request.input('Experience', sql.Int, this.experience)
       await request.query('insert into Admin(N_passport,Name,Experience) values(@N_passport,@Name,@Experience)')
   if(this.phones!=[]){
      await this.getID(sql)

       console.log(this.phones)
       for(const ph of this.phones){
           const request1=new sql.Request()
           request1.input('Id',sql.Int,this.id)
           request1.input('Phone',sql.NVarChar(20),ph)
            console.log('телефон='+ph)
           await request1.query('insert into Phone_Admin(Phone,ID) values(@Phone,@Id)')
       }
   }
   }
   catch (e){
       console.log(e)
       return e
   }
   return
    }
    static async getAll(sql){
        let request = new sql.Request();
       const result=await request.query('select * from Admin')

        //const result2=result.recordset

        return result.recordset
    }
     async getAllExcept(sql){
        let request = new sql.Request();
        request.input('id',sql.Int,this.id)
        const result=await request.query('select * from Admin where ID!=@id')

        //const result2=result.recordset

        return result.recordset
    }
    async getInfoByID(sql){

        let request = new sql.Request();
        request.input('ID',sql.Int,this.id)
        const result=await request.query('select * from Admin where ID=@ID')
        const records=result.recordset[0]
        this.n_passport=records.N_passport
        this.name=records.Name
        this.experience=records.Experience
        await this.getPhones(sql)
    }
    async getID(sql){
        let request = new sql.Request();
        request.input('N_passport', sql.Int, this.n_passport)
      const result=await request.query('select ID from Admin where N_passport=@N_passport')
            this.id=result.recordset[0].ID


    }
    async update(sql){
        try {


           // await this.getID(sql)
            let request = new sql.Request()
            request.input('ID', sql.Int, this.id)
            request.input('N_passport', sql.Int, this.n_passport)
            request.input('Name', sql.NVarChar(100), this.name)
            request.input('Experience', sql.Int, this.experience)
            await request.query('update Admin SET N_passport=@N_passport,Name=@Name,Experience=@Experience WHERE ID=@ID')
            await request.query('delete from Phone_Admin where ID=@ID')
            for(const ph of this.phones){
                const request1=new sql.Request()
                request1.input('Id',sql.Int,this.id)
                request1.input('Phone',sql.NVarChar(20),ph)
                console.log('телефон='+ph)
                await request1.query('insert into Phone_Admin(Phone,ID) values(@Phone,@Id)')
            }
            return
        }catch (e) {
            console.log(e)
            return e
        }
    }
    async delete(sql){
try {


    //    await  this.getID(sql)
        let request=new sql.Request()
        request.input('ID', sql.Int, this.id)
       await request.query('delete from Admin where ID=@ID')
    return
}catch (e) {
    return e
}
    }
    async getPhones(sql){
        await  this.getID(sql)
      //  console.log(this)
        let request=new sql.Request()
        request.input('ID', sql.Int, this.id)
       const result=await request.query('select Phone from Phone_Admin where ID=@ID')
      //  console.log(result.recordset)

            this.phones=result.recordset
       // console.log(this)
        return this.phones

    }
}