const router = require("express").Router();
const friends = require("./friends");
const login = require("./login");
const jwt = require("jsonwebtoken");
const checkLogin = require("../DB/log/check-login");
const getUser = require("../DB/log/user");
const emoji = require("./emoji");
const sendmsg = require("./send-msg");
const getConverstion = require("./conversation");
const signup = require("./signup");

const verifyJwt =  (req, res, next) => {
    const {token} = req.cookies
    if(!token){
        res.send('no token plz login')
    }else{
        jwt.verify(token, process.env.SECRET, async (err, decoded )=>{
        if(err){
            res.json({auth: false, msg: 'failed to auth'})
        }else{
            let startGetUser = await checkLogin(decoded.username, decoded.password)
            req.user =startGetUser.username
            next()
        }
    })
    }   
  }
  
router.use('/login', login)
router.use('/signup', signup)
router.use('/friends', verifyJwt,  friends)
router.use('/emoji', verifyJwt,  emoji)
router.use('/sendmsg', verifyJwt,  sendmsg)
router.use('/conversation', verifyJwt,  getConverstion)

router.use('/auth', verifyJwt, async (req, res) =>{
    let checkingDataRow = await  getUser(req.user)
    let {fullname,avatar,username,email,} = checkingDataRow
   res.json({toLogin: true, avatar,fullname,username,email})
})

module.exports = router
