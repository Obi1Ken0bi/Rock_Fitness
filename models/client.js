

module.exports=class Client{
    constructor(N_passport,Name,Age,Phones=[],Gender,ID=0) {
        this.n_passport=N_passport
        this.name=Name
        this.age=Age
        this.id=ID
        this.phones=Phones
        this.gender=Gender
    }
    async insert(sql){try {

        console.log(this.name)
        let request = new sql.Request();
        request.input('N_passport', sql.Int, this.n_passport)
        request.input('Name', sql.NVarChar(100), this.name)
        request.input('Age', sql.Int, this.age)
        request.input('Gender',sql.VarChar(10),this.gender)
        await request.query('insert into Client(N_passport,Name,Age,Gender) values(@N_passport,@Name,@Age,@Gender)')
        if(this.phones!==[]){
            await this.getID(sql)

            console.log(this.phones)
            for(const ph of this.phones){
                const request1=new sql.Request()
                request1.input('Id',sql.Int,this.id)
                request1.input('Phone',sql.NVarChar(20),ph)
                console.log('телефон='+ph)
                await request1.query('insert into Phone_Client(Phone,ID) values(@Phone,@Id)')
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
        const result=await request.query('select * from Client')

        //const result2=result.recordset

        return result.recordset
    }
    async getAllExcept(sql){
        let request = new sql.Request();
        request.input('id',sql.Int,this.id)
        const result=await request.query('select * from Client where ID!=@id')

        //const result2=result.recordset

        return result.recordset
    }
    async getInfoByID(sql){

        let request = new sql.Request();
        request.input('ID',sql.Int,this.id)
        const result=await request.query('select * from Client where ID=@ID')
        const records=result.recordset[0]
        this.n_passport=records.N_passport
        this.name=records.Name
        this.age=records.Age
        this.gender=records.Gender
        await this.getPhones(sql)
    }
    async getID(sql){
        let request = new sql.Request();
        request.input('N_passport', sql.Int, this.n_passport)
        const result=await request.query('select ID from Client where N_passport=@N_passport')
        this.id=result.recordset[0].ID


    }
    async update(sql){
        try {


            // await this.getID(sql)
            let request = new sql.Request()
            request.input('ID', sql.Int, this.id)
            request.input('N_passport', sql.Int, this.n_passport)
            request.input('Name', sql.NVarChar(100), this.name)
            request.input('Age', sql.Int, this.age)
            request.input('Gender',sql.VarChar(10),this.gender)
            await request.query('update Client SET N_passport=@N_passport,Name=@Name,Age=@Age,Gender=@Gender WHERE ID=@ID')
            await request.query('delete from Phone_Client where ID=@ID')
            for(const ph of this.phones){
                const request1=new sql.Request()
                request1.input('Id',sql.Int,this.id)
                request1.input('Phone',sql.NVarChar(20),ph)
                console.log('телефон='+ph)
                await request1.query('insert into Phone_Client(Phone,ID) values(@Phone,@Id)')
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
            await request.query('delete from Client where ID=@ID')
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
        const result=await request.query('select Phone from Phone_Client where ID=@ID')
        //  console.log(result.recordset)

        this.phones=result.recordset
        // console.log(this)
        return this.phones

    }
}