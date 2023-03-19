const express = require('express')

const router = express.Router()
const  {registerUser,authUser,allUsers,sendReq,getReq,acceptReq,deleteReq,getUserDetails,viewAllFriends,viewMutualFriends,searchUser,deleteFriend} = require('../controllers/userControllers.js')
const protect = require('../middleware/authMiddleware.js')

router.route('/').post(registerUser).get(protect,allUsers);

 router.post('/login',authUser)

  router.route('/friendReq').post(protect,sendReq).get(protect,getReq)

  router.post('/acceptReq',protect,acceptReq);
  router.post('/deleteReq',protect,deleteReq);
  router.post('/viewUserProfile',protect,getUserDetails);
  router.post('/viewAllFriends',protect,viewAllFriends);
  router.post('/viewMutualFriends',protect,viewMutualFriends);
  router.post('/search',protect,searchUser);
  router.post('/removeFriend',protect,deleteFriend);
module.exports = router