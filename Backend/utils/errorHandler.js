class Errorhandler extends Error{
    constructor(messege,statusCode){
        super(messege);
        this.statusCode=statusCode

        Error.captureStackTrace(this,this.constructor)
    }
}

module.exports=Errorhandler