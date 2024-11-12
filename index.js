require("dotenv").config()

const express = require('express')

const app = express()

const cors = require('cors')

require('./DB/connDB')

const PORT = 5000;

const session =require('express-session')

const passport = require('passport')

const OAuth2Strategy = require('passport-google-oauth2').Strategy

const userdb = require('./DB/userSchema')

const clientid = process.env.Clientid
const clinetsecret = process.env.Clinetsecret




app.use(cors({
    origin:"http://localhost:5173",
    methods:"GET,POST,PUT,DELETE",
    credentials:true 
}))
app.use(express.json())

app.use(session({
    secret:'123456wetuyikuykiu7',
    resave:false,
    saveUninitialized:true
}))

app.use(passport.initialize())
app.use(passport.session())

passport.use(
    new OAuth2Strategy({
        clientID:clientid,
        clientSecret:clinetsecret,
        callbackURL:"/auth/google/callback",
        scope:["profile","email"]
    },
    async(accessToken,refreshToken,profile,done)=>{
        console.log("profile",profile);
        
        try {
            let user = await userdb.findOne({googleId:profile.id});

            if(!user){
                user = new userdb({
                    googleId:profile.id,
                    displayName:profile.displayName,
                    email:profile.emails[0].value,
                    image:profile.photos[0].value
                });

                await user.save();
            }

            return done(null,user)
        } catch (error) {
            return done(error,null)
        }
    }
    )
)
passport.serializeUser((user,done)=>{
    done(null,user);
})

passport.deserializeUser((user,done)=>{
    done(null,user);
});

app.get("/auth/google",passport.authenticate("google",{scope:["profile","email","image"]}));

app.get("/auth/google/callback",passport.authenticate("google",{
    successRedirect:"http://localhost:5173/dashboard",
    failureRedirect:"http://localhost:5173/"
}))

app.get("/login",async(req,res)=>{

    if(req.user){
        res.status(200).json({massage:"user Login",user:req.user})
    }else{
        res.status(400).json({massage:"Not Authorized"})
    }

    // console.log("reqqqq",req.user);
    
})

app.listen(PORT,()=>{
    console.log(`server start at port on ${PORT}`);
    
})