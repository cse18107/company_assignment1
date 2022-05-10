const fs = require('fs');
const checkPassword = require('./utils/passwordChecker');
const checkFirstLastName = require('./utils/firstLastNameChecker');
const checkUsername = require('./utils/usernameChecker');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

dotenv.config({path:'./.env'});

let User = JSON.parse(
    fs.readFileSync(`${__dirname}/User.json`,'utf-8')
)

const getUser= (req,res) => {

    const token = req.headers.authorization.split(" ")[1];


    let decode ;

    try{
         decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
    }catch{
        res.status(401).json({
            result: false,
            error: "JWT Verification Failed"
        })
    }
   

    const username = decode.username

    const user = User.find(function(user){
        return user.username===username;
    });

    res.status(200).json({
        result:true,
        data:{
            fname:user.fname,
            lname:user.lname,
            password:user.password
        }
    })
};

const signup = async (req,res) => {
    let user = req.body;

    let {username,password,fname,lname} = user;



    if(!password || !username || !fname || !lname || password.split(" ").join("").length< 0){
        return res.status(404).json({
            result:false,
            error:"field can`t be empty",
        });
    }

    const existUser = User.find(function(user){
        return user.username===username;
    });

    if(existUser){
        return res.status(400).json({
            result:false,
            error:"username already exist",
        })
    }

    if(!checkUsername(username)){
        return res.status(400).json({
            result:false,
            error:'username check failed'
        })
    }

    if(!checkPassword(password)){
        return res.status(400).json({
            result:false,
            error:"password check failed",
        })
    }

    if(!checkFirstLastName(fname)){
        return res.status(400).json({
            result:false,
            error:"fname or lname check failed",
        })
    }

    if(!checkFirstLastName(lname)){
        return res.status(400).json({
            result:false,
            error:"fname or lname check failed",
        })
    }

    user.password = await bcrypt.hash(user.password,10);

    User = [...User,user]

    fs.writeFileSync(`${__dirname}/User.json`,JSON.stringify(User))

    res.status(200).json({
        result: true,
        message: "SignUp success. Please proceed to Signin"
    });
};

const signin = async (req,res) => {
    const user = req.body;

    const {username, password} = user;

    if(!password || !username || password.split(" ").join("").length< 0){
        return res.status(404).json({
            result:false,
            error:"field can`t be empty",
        });
    }

    const existUser = User.find(function(user){
        return user.username===username;
    });

    if(!existUser){
        return res.status(404).json({
            result:false,
            error:"user is not exist",
        })
    }

    const isCorrectPassword = await bcrypt.compare(password,existUser.password);

    if(!isCorrectPassword){
        return res.status(404).json({
            result:false,
            error:"Invalid username/password"
        });
    }

    const jwtToken = jwt.sign({ username: existUser.username, firstname: existUser.firstname }, process.env.JWT_SECRET_KEY);

    res.status(200).json({
        result:true,
        jwt:jwtToken,
        message:'SignIn success',
    })

}

module.exports ={getUser,signup,signin}