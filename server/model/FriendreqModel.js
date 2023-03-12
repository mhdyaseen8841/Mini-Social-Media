const mongoose = require('mongoose')

const friendReqModel = mongoose.Schema(
    {
        from:{ 
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"},

        to:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
        },
      
       
    }
    ,{
        timestamps:true,
    }
)

const friendReq =mongoose.model("friendReq",friendReqModel)
module.exports=friendReq

