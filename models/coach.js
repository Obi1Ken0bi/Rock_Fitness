

module.exports=class Coach{
    constructor(N_passport,Name,Experience,Phones=[],ID=0,ID_admin=76) {
        this.n_passport=N_passport
        this.name=Name
        this.experience=Experience
        this.id=ID
        this.phones=Phones
        this.id_adm=ID_admin
    }
    async insert(sql){try {

        let request = new sql.Request();
        request.input('N_passport', sql.Int, this.n_passport)
        request.input('Name', sql.NVarChar(100), this.name)
        request.input('Experience', sql.Int, this.experience)
        request.input('ID_adm')
        await request.query('insert into Coach(N_passport,Name,Experience,ID_admin) values(@N_passport,@Name,@Experience,@ID_adm)')
        if(this.phones!=[]){
            await this.getID(sql)

            for(const ph of this.phones){
                const request1=new sql.Request()
                request1.input('Id',sql.Int,this.id)
                request1.input('Phone',sql.NVarChar(20),ph)
                console.log('телефон='+ph)
                await request1.query('insert into Phone_Coach(Phone,ID) values(@Phone,@Id)')
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
        const result=await request.query('select * from Coach')

        //const result2=result.recordset

        return result.recordset
    }
    async getInfoByID(sql){

        let request = new sql.Request();
        request.input('ID',sql.Int,this.id)
        const result=await request.query('select * from Coach where ID=@ID')
        const records=result.recordset[0]
        this.n_passport=records.N_passport
        this.name=records.Name
        this.experience=records.Experience
        this.id_adm=records.ID_admin
        await this.getPhones(sql)
    }
    async getID(sql){
        let request = new sql.Request();
        request.input('N_passport', sql.Int, this.n_passport)
        const result=await request.query('select ID from Coach where N_passport=@N_passport')
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
            request.input('ID_admin',sql.Int,this.id_adm)
            await request.query('update Coach SET N_passport=@N_passport,Name=@Name,Experience=@Experience,ID_admin=@ID_admin WHERE ID=@ID')
            await request.query('delete from PhoneCoach where ID=@ID')
            for(const ph of this.phones){
                const request1=new sql.Request()
                request1.input('Id',sql.Int,this.id)
                request1.input('Phone',sql.NVarChar(20),ph)
                console.log('телефон='+ph)
                await request1.query('insert into Phone_Coach(Phone,ID) values(@Phone,@Id)')
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
            await request.query('delete from Coach where ID=@ID')
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
        const result=await request.query('select Phone from Phone_Coach where ID=@ID')
        //  console.log(result.recordset)

        this.phones=result.recordset
        // console.log(this)
        return this.phones

    }
}