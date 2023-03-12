const mongoose = require('mongoose')

const friendReqModel = mongoose.Schema(
    {
        userId:{ 
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"},

        friendsreq:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
        },],
      
       
    }
    ,{
        timestamps:true,
    }
)

const friendReq =mongoose.model("friendReq",friendReqModel)
module.exports=friendReq

