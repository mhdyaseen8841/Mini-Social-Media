const mongoose = require('mongoose')

const friendModel = mongoose.Schema(
    {
        userId:{ 
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"},

        friends:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
        },],
      
       
    }
    ,{
        timestamps:true,
    }
)

const Friends =mongoose.model("Friends",friendModel)
module.exports=Friends

