const asyncHandler = require("express-async-handler");
const User = require("../model/userModel");
const Friend = require("../model/FriendModel");
const Friendreq = require("../model/FriendreqModel");
const generateToken = require("../config/generateToken");
const mongoose = require('mongoose');


const { getMutualCount } = require('../helpers/findMutualCount');

const registerUser =asyncHandler(async(req,res)=>{
const {name,email,password,pic} = req.body;

if(!name || !email || !password){
    res.status(400)
    throw new Error('Please enter all fields')
}
const userExist = await User.findOne({email})
if(userExist){
    res.status(400)
    throw new Error('User already exist')
}
const user = await User.create({
    name,
    email,
    password,
    pic
})

if(user){
    res.status(201).json({
        _id:user._id,
        name:user.name,
        email:user.email,
        pic:user.pic,
        token:generateToken(user._id)
    
    })
}else{
    res.status(400)
    throw new Error('Invalid user data')
}
})



const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({email})
    if(user&& (await user.matchPassword(password))){
        res.json({
            _id:user._id,
            name:user.name,
            email:user.email,
            pic:user.pic,
            token:generateToken(user._id)
        })
    }else{
        res.status(401)
        throw new Error('Invalid email or password')
    }   
})




const allUsers = asyncHandler(async (req, res) => {
    const keyword = req.query.search ? {   
        name: { $regex: req.query.search, $options: 'i' }
    } : {};
    const users = await User.find({ ...keyword, _id: { $ne: req.user._id } });
    res.send(users);
});


const searchUser = asyncHandler(async (req, res) => {
 
    const keyword = req.query.search ? {   
        $or: [
            { name: { $regex: req.query.search, $options: 'i' } },
            { email: { $regex: req.query.search, $options: 'i' } },
        ],
    }:{};

    const getuser = await User.find(keyword).find({ _id: { $ne: req.user._id } })
   
    const users=getuser;
    let mutualCount=0;
    //compare each users with friend list
    //login user friend list
    const friend = await Friend.findOne({ userId: req.user.id });
    let userarr=[];
    if(friend){
        //check here mutual friend count
        for(let i = 0; i < users.length; i++) {
            mutualCount = await getMutualCount(req.user._id, users[i]._id);
            let isFriend = friend.friends.includes(users[i]._id);
            //get this user friend list
      
            const obj = {
                _id: users[i]._id,
                name: users[i].name,
                email: users[i].email,
                pic: users[i].pic,
                friend: isFriend,
                mutualCount: mutualCount
            }
            userarr.push(obj);
        }
    } else {
        for(let i = 0; i < users.length; i++) {
            const obj = {
                _id: users[i]._id,
                name: users[i].name,
                email: users[i].email,
                pic: users[i].pic,
                friend: false,
                mutualCount: mutualCount
            }
            userarr.push(obj);
        }
    }
    res.send(userarr)
    
});




const sendReq = asyncHandler(async (req, res) => {
 const userid=req.body.userid;
 //check for this user already sent request or not
 const checkreq = await Friendreq.findOne({
    $or: [
      { $and: [{ from: req.user._id }, { to: userid }] },
      { $and: [{ from: userid }, { to: req.user._id }] },
    ],
  });
  
    if(checkreq){
        res.status(400)
        throw new Error('Request already sent')
    }
    
    //check for this user already friend or not
    const friend = await Friend.findOne({ userId: req.user.id });
    // Check if the user is already a friend
    if(friend){
    const isFriend = friend.friends.includes(userid);
    if(isFriend){
        res.status(400)
        throw new Error('Already friend')
    }
    }

    //add req to db
    const reqdata = await Friendreq.create({
        from:req.user._id,
        to:userid
    })
    const populatedReqdata = await Friendreq.findOne({ _id: reqdata._id })
    .populate("to", "name pic email")
    .exec();

    if(reqdata){
       
        res.status(201).json({
            populatedReqdata
        })
    }else{
        res.status(400)
        throw new Error('something went wrong')
    }


})


const getReq = asyncHandler(async (req, res) => {

    const reqdata = await Friendreq.find({to:req.user._id}).populate("from","name pic email")
    if(reqdata){
        res.status(201).json(reqdata)
    }else{
        res.status(400)
        throw new Error('something went wrong')
    }
})


const acceptReq = asyncHandler(async (req, res) => {
   
    const userId =req.body.id;
    //find reqid using users ids
    
    

 const frndreq = await Friendreq.findOne({$and:[{from:userId},{to:req.user._id}]})
 if(frndreq){
    //add friend to friend list
    const friend = await Friend.findOne({ userId: frndreq.to });
    if(friend){
        friend.friends.push(frndreq.from)
        await friend.save()
    }else{
        const newFriend = await Friend.create({
            userId: frndreq.to,
            friends: [frndreq.from],
        });
    }

    //add friend to friend list
    const friend2 = await Friend.findOne({ userId: frndreq.from });
    if(friend2){
        friend2.friends.push(frndreq.to)
        await friend2.save()
    }else{
        const newFriend = await Friend.create({
            userId: frndreq.from,
            friends: [frndreq.to],
        });
    }

    //delete req
    await Friendreq.findByIdAndDelete(frndreq._id)
    res.status(201).json({msg:"friend added"})
    }else{
        res.status(400)
        throw new Error('something went wrong')
    }

})


const deleteReq = asyncHandler(async (req, res) => {

    const reqId = req.body.reqId;

    const frndreq = await Friendreq.findByIdAndDelete(reqId)
    if(frndreq){
        res.status(201).json({msg:"req deleted"})
    }else{
        res.status(400)
        throw new Error('something went wrong')
    }

}) 

const deleteFriend = asyncHandler(async (req, res) => {
    const userID = req.body.id;
    //delete friend from friend list

    try{

        const friend = await Friend.findOne({ userId: req.user.id });
        if(friend){
            friend.friends.pull(userID)
            await friend.save()
        }
    
        //delete friend from friend list
    
        const friend1 =await Friend.findOne({userId:userID})
        if(friend1){
            friend1.friends.pull(req.user.id)
            await friend.save()
        }
        res.status(201).json({msg:"friend deleted"})
    }catch(err){

res.status(400).json({msg:"something went wrong"})
    }
   
})  

    

const getUserDetails = asyncHandler(async (req, res) => {
    uid =req.body.id;
    const user = await User.findById(uid);
    if (user) {
        res.json(user);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

const viewAllFriends = asyncHandler(async (req, res) => {
    const friend = await Friend.findOne({ userId: req.user.id });
    if (friend) {
        const friends = await User.find({ _id: { $in: friend.friends } });
        res.json(friends);
    } else {
       res.json([]);
    }
})

const viewMutualFriends = asyncHandler(async (req, res) => {
    let currentUserId = req.user.id;
    let viewedUserId = req.body.id;
   
    // Check if viewed user ID is defined
    if (!viewedUserId) return res.status(400).json({ message: 'Viewed user ID is missing' });
  
   
    // Retrieve the list of friends for the current user
    const friend = await Friend.findOne({ userId: currentUserId });
    if(friend){
        const friends = await User.find({ _id: { $in: friend.friends } });
        const friend2 = await Friend.findOne({ userId: viewedUserId });
  if(friend2){
    
    const friends2 = await User.find({ _id: { $in: friend2.friends } });
  
    // Find the intersection of the two lists
    const mutualFriends = friends.filter((friend) =>
    friends2.some((friend2) => friend2._id.toString() === friend._id.toString())
);
    res.json(mutualFriends);
  }else{
res.json([]);
  }
       

    }else{
        res.json([]);
    
    }
    
  });
  
  
  

module.exports = {registerUser,authUser,allUsers,getReq,sendReq,acceptReq,deleteReq,deleteFriend,getUserDetails,viewAllFriends,viewMutualFriends,searchUser};

