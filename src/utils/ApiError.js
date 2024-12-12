class ApiError extends Error{
    constructor(
        statusCode,
        message = "Something went wrong! ", // most hated message in developer community because it does not give information about the error
        errors = [],
        stack = "" // stack here means error stack

    ){

        super(message)
        this.statusCode = statusCode
        this.data = null
        this.message = message
        this.success = false
        this.errors  = errors
        if(stack){
            this.stack = stack
        } else{
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

export {ApiError}