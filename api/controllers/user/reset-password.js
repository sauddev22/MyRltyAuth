const abc= require("../../util");
const { generateEncryptedPassword, comparePrevPassword } = require('../../util');
const bcrypt = require('bcrypt-nodejs');


module.exports = {


  friendlyName: 'Reset password',


  description: 'Reset password',


  inputs: 
    {
      oldPassword: {
        type: 'string',
        required: true
      },

    password: {
        type: 'string',
       // isEmail: true,
        required: true
      },

    user: {
      type: 'ref',
      required: true
    } 
  },


  exits: {
    invalid: {
      responseType: 'badRequest',
      description: 'Driver not exists',
    },
  },


  fn: async function (inputs, exits) {
   // sails.log.debug('calling user/reset-password', inputs.user.email);
    try{
      sails.log.debug(inputs.user.email)
      const userData = await User.getOne({email:inputs.user.email});
      const pass = await abc.generateEncryptedPassword(inputs.password)
          
      if(userData){
      bcrypt.compare(inputs.oldPassword, userData.password, async function(err, res) {
        if (res == true){
          sails.log.debug(res) 
          bcrypt.compare(inputs.password, userData.password, async function(err, res) {
          if(res == true){
            return exits.success({status: false, data: [], message: "Please choose a new password"});
          }else{
            await User.update({email:inputs.user.email}).set({password: pass});
            return exits.success({status: true, data: [], message: "Password has been updated successfully"});
          
          }  
          })
          }
        else{
          return exits.success({status: false, data: [], message: "incorrect old password"});
        }
      });
    }else{
      return exits.invalid({status: false, data: [], message: "No user found."});
    }
      
      
    }catch(e){
      sails.log.error('error forget pwd', e);
      return exits.invalid({status: false, data: [], message: e.message});
    }


  }


};
