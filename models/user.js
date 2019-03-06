 const mongoose = require('mongoose');
 mongoose.Promise = global.Promise ;
 const Schema = mongoose.Schema;
 const bcrypt = require ('bcrypt-nodejs');

 let emailLengthChecker = (email) =>{
   if (!email){
    return false;
  } else {
    if (email.length > 30 || email.length < 5){
      return false;
    } else {
      return true;
    }
  }
 };

 let validEmailChecker = (email) =>{
   if (!email){
     return false;
   } else {
     const regExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
     return regExp.test(email);
   }
 };


const emailValidator = [
  {
    validator : emailLengthChecker , message: 'Email Length should be less then 30 but minimum 5 character long'
  },
  {
    validator : validEmailChecker , message: 'Must be a valid Email'
  }
];

let usernameLengthChecker = (username) =>{
  if(!username){
    return false;
  } else{
    if(username.length <5 || username.length > 10){
      return false;
    } else {
      return true;
    }
  }
};
 let usernameValidator = (username) =>{
   if (!username){
     return false;
   }
   else {
     const regExp = /^[a-zA-Z0-9]+$/;
     return regExp.test(username);
   }
 };

const userNameValidator = [
  {
    validator : usernameLengthChecker, message : " username must be greater then 5 but less then 10"
  },
  {
    validator : usernameValidator, message: "No special character to be used"
  }
];

let passwordLengthValidator = (password) =>{
  if(!password){
    return false;
  } else if (password.length < 8) {
    return false;
  } else{
    return true;
  }
};

let validpassword =(password) =>{
  if(!password){
    return false;
  } else{
    regExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/ ;
    return regExp.test(password);
  }
};

const passwordvalidator =[
  {
    validator : passwordLengthValidator , message : "Password length should be atleast 8 characters long"
  },
  {
    validator : validpassword , message : "Password Should Contain atleast 1 Number , lowercase and uppercase letter. And No specialCharectors"
  }
];

 const userSchema = new Schema({
   name: {type:String, required: true , lowercase:true},
   email : {type:String , required:true , unique:true , lowercase:true , validate : emailValidator },
   username : { type:String , required:true, unique:true , lowercase:true , validate : userNameValidator},
   password : { type:String , required: true , validate : passwordvalidator}

 });



 userSchema.pre('save',function(next){
   if(!this.isModified('password')){
     return next();
   } else {
     bcrypt.hash(this.password, null, null,(err,hash) =>{
       if (err){
         return next(err);
       } else {
         this.password = hash ;
        return  next();
       }

     });
   }
 });
 userSchema.methods.comparePassword = function (password){
   return bcrypt.compareSync(password , this.password);
 };

 module.exports = mongoose.model('User', userSchema) ;
