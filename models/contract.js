

module.exports=class Contract{
    constructor(Date_Start,Date_End,EnterNumber,Price,ID_Client,ID_Admin=undefined,ID=0) {
        this.dateStart=Date_Start
        this.dateEnd=Date_End
        this.enterNumber=EnterNumber
        this.id=ID
        this.price=Price
        this.idClient=ID_Client
        this.idAdmin=ID_Admin
    }
    async addEnters(sql){
        try {


            let request = new sql.Request();
            request.input('EnterNumber', sql.Int, this.enterNumber)
            request.input('Price', sql.Int, this.price)
            request.input('ID', sql.Int, this.id)
            await request.query('update Contract set Price=@Price,EnterNumber=@EnterNumber where ID=@ID')
        }catch (e) {
            return e

        }
        return
    }
    async insert(sql){try {

     //   console.log(this.dateEnd)
        let request = new sql.Request();
        request.input('Date_Start', sql.DateTime, this.dateStart)
        request.input('Date_End', sql.DateTime, this.dateEnd)
        request.input('EnterNumber', sql.Int, this.enterNumber)
        request.input('Price', sql.Int, this.price)
        request.input('ID_Client',sql.Int,this.idClient)
        if(this.idAdmin!='undefined'){
        request.input('ID_Admin',sql.Int,this.idAdmin)
            await request.query('insert into Contract(Date_Start,Date_End,EnterNumber,Price,ID_Client,ID_Admin) values(@Date_Start,@Date_End,@EnterNumber,@Price,@ID_Client,@ID_Admin)')
        }
        else {
            await request.query('insert into Contract(Date_Start,Date_End,EnterNumber,Price,ID_Client,ID_Admin) values(@Date_Start,@Date_End,@EnterNumber,@Price,@ID_Client,null)')
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
        const result=await request.query('select * from Contract')

        //const result2=result.recordset

        return result.recordset
    }
    async getAllExcept(sql){
        let request = new sql.Request();
        request.input('id',sql.Int,this.id)
        const result=await request.query('select * from Contract where ID!=@id')

        //const result2=result.recordset

        return result.recordset
    }
    async getInfoByID(sql){
try {


    let request = new sql.Request();
    request.input('ID', sql.Int, this.id)
    const result = await request.query('select * from Contract where ID=@ID')
    const records = result.recordset[0]
    this.dateStart = records.Date_Start
    this.dateEnd = records.Date_End
    this.enterNumber = records.EnterNumber
    this.price = records.Price
    this.idClient = records.ID_Client
    this.idAdmin = records.ID_Admin
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
            const result = await request.query('select ID from Contract where ID_Client=@ID_Client')
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
            request.input('Date_Start', sql.DateTime, this.dateStart)
            request.input('Date_End', sql.DateTime, this.dateEnd)
            request.input('EnterNumber', sql.Int, this.enterNumber)
            request.input('Price', sql.Int, this.price)
            request.input('ID_Client',sql.Int,this.idClient)

            request.input('ID',sql.Int,this.id)
            if(this.idAdmin!=null) {
                request.input('ID_Admin', sql.Int, this.idAdmin)
                await request.query('update Contract SET Date_Start=@Date_Start,Date_End=@Date_End,EnterNumber=@EnterNumber,Price=@Price,ID_Client=@ID_Client,ID_Admin=@ID_Admin WHERE ID=@ID')
            }else{
                await request.query('update Contract SET Date_Start=@Date_Start,Date_End=@Date_End,EnterNumber=@EnterNumber,Price=@Price,ID_Client=@ID_Client,ID_Admin=null WHERE ID=@ID')
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
            await request.query('delete from Contract where ID=@ID')

        }catch (e) {
            return e
        }
        return
    }

}