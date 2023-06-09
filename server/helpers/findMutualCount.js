const asyncHandler = require("express-async-handler");
const User = require("../model/userModel");
const Friend = require("../model/FriendModel");

const mongoose = require('mongoose');



const getMutualCount=async(user1,user2)=>{
    let count=0;

    let currentUserId = user1;
    let viewedUserId = user2;

//     const thisuserfriendlist = await Friend.findOne({ userId: user._id });
        


     // Retrieve the list of friends for the current user
     const friend = await Friend.findOne({ userId: currentUserId });
     if(friend){
         const friends = await User.find({ _id: { $in: friend.friends } });
         const friend2 = await Friend.findOne({ userId: viewedUserId });
   if(friend2){
     
     const friends2 = await User.find({ _id: { $in: friend2.friends } });
   
     // Find the intersection of the two lists

     let mutualFriendsCount = friends.filter((friend) =>
    friends2.some((friend2) => friend2._id.toString() === friend._id.toString())
).length;

    return(mutualFriendsCount);
   }else{
 return 0;
   }
        
 
     }else{
        
         return 0;
     
     }
    
}

module.exports = { getMutualCount };