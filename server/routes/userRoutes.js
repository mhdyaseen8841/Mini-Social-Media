const express = require('express')

const router = express.Router()
const  {registerUser,authUser,allUsers,sendReq,getReq} = require('../controllers/userControllers.js')
const protect = require('../middleware/authMiddleware.js')

router.route('/').post(registerUser).get(protect,allUsers);

 router.post('/login',authUser)

  router.route('/friendReq').post(protect,sendReq).get(protect,getReq)

  //router.post('/acceptReq',protect,acceptReq);
//   router.post('/deleteReq',protect,deleteReq);
//router.post('/viewUserProfile',protect,viewProfile);
//router.post('/viewAllFriends',protect,viewAllFriends);
// router.post('/viewMutualFriends',protect,viewMutualFriends);
module.exports = router