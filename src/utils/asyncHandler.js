const asyncHandler = (requestHandler) => {
 // we can put anything in place of requestHandler we can put fn as well or anything this is just for readability
   return (req,res,next)=>{
    Promise.resolve(requestHandler(req,res,next)).catch((err)=>next(err))
 }

}

export {asyncHandler}

// const asyncHandler = (fn) => async (req,res, next) => {
//     try {
//     await fn()(req,res,next)

// } catch (error) {
//     res.status(err.code || 500).json({
//         success: false,
//         message: err.message
//     })
// }}

