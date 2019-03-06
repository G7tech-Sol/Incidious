const User = require('../models/user');
const jwt = require('jsonwebtoken');
const config = require('../config/database');

module.exports = (router) => {

router.post('/register', (req, res) => {
    if (!req.body.email){
      res.json({ success : false , message : "Email Required "});
    } else {
      if(!req.body.username){
        res.json({ success : false , message : "Username is required" });
      } else {
        if(!req.body.password){
          res.json({ success : false , message : "Password Field is Empty"});
        } else {
          let user = new User({
            name: req.body.name,
            email : req.body.email,
            username : req.body.username,
            password : req.body.password,
          });
          user.save((err)=>{
            if (err){
              if(err.code === 11000){
                  res.json({ success : false , message : "Username or Email Already Exsit" });
              } else {
                if (err.errors){

                  if(err.errors.email){
                    res.json({success : false , message : err.errors.email.message})
                  }
                   else if (err.errors.username) {
                    res.json({success : false , message : err.errors.username.message})
                  } else if (err.errors.password) {
                    res.json({success :false , message : err.errors.password.message})
                  }
         } else {
                    res.json({ success : false , message : "user not saved ,Error :" , err});
                }
                     }
          } else {
              res.json({ success : true , message : " Congratulations User is Now registered"});
            }
          });
        }
      }
    }
  });

// router.get('/checkEmail/:email' ,(req,res)=>{
//   if(!req.params.email){
//     res.json({success: false , message : "E-Mail was not Provided"});
//   } else {
//     User.findOne({email:req.params.email},(err,user) =>{
//       if(err){
//         res.json({success: false , message :'err'});
//       } else {
//         if(!user){
//           res.json({success:true, message : "E-Mail is available"});
//           // res.json({success:false , message :"E-Mail is already taken"});
//         } else {
//           res.json({success:false , message :"E-Mail is already taken"});
//           // res.json({success:true, message : "E-Mail is available"});
//         }
//       }
//     });
//   }
// });

router.get('/checkEmail/:email', (req, res) => {
    // Check if email was provided in paramaters
    if (!req.params.email) {
      res.json({ success: false, message: 'E-mail was not provided' }); // Return error
    } else {

      // Search for user's e-mail in database;
      User.findOne({ email: req.params.email }, (err, user) => {
        if (err) {
          res.json({ success: false, message: err }); // Return connection error
        } else {
          // Check if user's e-mail is taken
          if (user) {
            res.json({ success: false, message: 'E-mail is already taken' }); // Return as taken e-mail
          } else {
            res.json({ success: true, message: 'E-mail is available' }); // Return as available e-mail
          }
        }
      });
    }
  });

router.get('/checkUsername/:username', (req,res)=>{
  if(!req.params.username){
    res.json({success: false , message : "Username was not Provided"});
  }else {
    User.findOne({username:req.params.username},(err,user) =>{
      if(err){
        res.json({success: false , message :'err'});
      } else {
        if(user){
          res.json({success:false , message :"Username is already taken"});
        } else {
          res.json({success:true, message : "Username is available"});
        }
      }
    });
  }
});

router.post('/login',(req,res)=>{
  if(!req.body.username){
    res.json({success : false , message : "username is not provided"});
  }else if(!req.body.password){
    res.json({success: false , message : "password is not entered"});
  } else{
    User.findOne({username: req.body.username}, (err,user)=>{
      if (err){
        res.json({success: false , message : err });
      } else if (!user){
        res.json({success:false , message : "user not found"});
      } else {
        const validPassword = user.comparePassword(req.body.password);
        if (!validPassword) {
          res.json ({scucess: false , message : "Password is Incorrrect"});
        } else {
          const token = jwt.sign({userId : user._id},config.secret,{expiresIn:10000000});
          res.json({success: true , message: 'Success!' , token:token ,user:{username : user.username}});
        }
      }
    })
  }

});



router.use((req, res, next) => {

  const token = req.headers['authorization']; // Create token found in headers
  // Check if token was found in headers
  if (!token) {
    res.json({ success: false, message: 'No token provided' }); // Return error
  } else {
    // Verify the token is valid
    jwt.verify(token, config.secret, (err, decoded) => {
      // Check if error is expired or invalid
      if (err) {
        res.json({ success: false, message: 'Token invalid: ' + err }); // Return error for token validation
      } else {
        req.decoded = decoded; // Create global variable to use in any request beyond
        next(); // Exit middleware
      }
    });
  }
});


router.get('/profile',(req,res)=>{
  User.findOne({_id : req.decoded.userId}).select('username , email').exec((err,user)=>{
    if(err){
      res.json({success:false , message: err});
    } else if (!user) {
      res.json({success: false, message: 'user not found'});
    } else {
      res.json ({success:true , user : user});
    }
  });
});

  return router;
}
