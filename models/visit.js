

module.exports=class Visit{
    constructor(ID,ID_Client,Date,ID_Coach=null) {
        this.id=ID
        this.idClient=ID_Client
        this.date=Date
        this.idCoach=ID_Coach
    }


    async insert(sql){try {

        let request = new sql.Request();
        request.input('Date1', sql.DateTime, this.date)
        request.input('ID_Client',sql.Int,this.idClient)
        if(this.idCoach!=null){
            request.input('ID_Coach',sql.Int,this.idCoach)
            await request.query('insert into Visit(ID_Client,Date_,ID_Coach) values(@ID_Client,@Date1,@ID_Coach)')
        }
        else {
             await request.query('insert into Visit(ID_Client,Date_,ID_Coach) values(@ID_Client,@Date1,null)')
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
        const result=await request.query('select * from Visit')

        //const result2=result.recordset

        return result.recordset
    }

    async getInfoByID(sql){
        try {


            let request = new sql.Request();
            request.input('ID', sql.Int, this.id)
            const result = await request.query('select * from Visit where ID=@ID')
            const records = result.recordset[0]
            this.id=records.ID
            this.date=records.Date_
            this.idClient=records.ID_Client
            this.idCoach=records.ID_Coach
        }
        catch (e){
            return e
        }
        return
    }
    async getID(sql){
        try {


            let request = new sql.Request();
            request.input('ID_Client', sql.Int, this.idClient)
            request.input('Date',sql.DateTime,this.date)
            const result = await request.query('select ID from Visit where ID_Client=@ID_Client,Date_=@Date')
            this.id = result.recordset[0].ID
        }catch (e) {
            return e
        }
        return

    }
    async update(sql){
        try {


            // await this.getID(sql)
            let request = new sql.Request()
            request.input('Date1', sql.DateTime, this.date)
            request.input('ID_Client',sql.Int,this.idClient)

            request.input('ID',sql.Int,this.id)
          //  console.log(this.idCoach!='')
            if(this.idCoach!='') {
                request.input('ID_Coach', sql.Int, this.idCoach)
               await request.query('update Visit SET ID_Client=@ID_Client,Date_=@Date1,ID_Coach=@ID_Coach WHERE ID=@ID')
            }
            else {
                await request.query('update Visit SET ID_Client=@ID_Client,Date_=@Date1,ID_Coach=null WHERE ID=@ID')

            }
        }
        catch (e) {
            console.log(e)
            return e
        }
        return
    }
    async delete(sql){
        try {


            //    await  this.getID(sql)
            let request=new sql.Request()
            request.input('ID', sql.Int, this.id)
            await request.query('delete from Visit where ID=@ID')

        }catch (e) {
            return e
        }
        return
    }

}