const asyncHandler = require("express-async-handler");
const User = require("../model/userModel");
const Friend = require("../model/FriendModel");
const Friendreq = require("../model/FriendreqModel");
const generateToken = require("../config/generateToken");


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
        $or: [
            { name: { $regex: req.query.search, $options: 'i' } },
            { email: { $regex: req.query.search, $options: 'i' } },
        ],
    }:{};

    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } })
    
    res.send(users)
    
});


const sendReq = asyncHandler(async (req, res) => {
 const userid=req.body.userid;
 //check for this user already sent request or not
    const checkreq = await Friendreq.findOne({$and:[{from:req.user._id},{to:userid}]})
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
        console.log(reqdata);
        res.status(201).json(reqdata)
    }else{
        res.status(400)
        throw new Error('something went wrong')
    }
})

module.exports = {registerUser,authUser,allUsers,getReq,sendReq};


