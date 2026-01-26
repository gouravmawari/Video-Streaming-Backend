let errorMiddleware = function(err,req,res,next){
    return res.status( err.statusCode || 500).json({
        status : err.status || 'error',
        statusCode : err.statusCode || 500,
        message : err.isOperational ? err.message : "something went wrong"
    })
}
module.exports = errorMiddleware;