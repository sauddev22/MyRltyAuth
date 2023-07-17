const { generateEncryptedPassword, comparePrevPassword } = require('../../../util');
const bcrypt = require('bcrypt-nodejs');


module.exports = {


  friendlyName: 'Change password',


  description: '',


  inputs: {
    email: {
      type: 'string',
      required: true
    },
    password: {
      type: 'string',
      required: true
    },
    token: {
      type: 'string',
      required: true
    }
  },


  exits: {
    invalid: {
      responseType: 'badRequest',
    },
  },


  fn: async function ({email, token, password}, exits) {
    sails.log.debug('calling user/forget-password/change-password');
    try{
      const req = this.req;
      const res = this.res;
      const user = await User.getOne({email, forgetPasswordToken: token});
      if(!user) {
        throw new Error('Invalid OTP');
      }

      if(user.password){

        const samePassword = await comparePrevPassword(password, user.password);
        if (samePassword) {
          sails.log.debug('Password same as old one.');
          return exits.success({status: false, data: [], message: 'You have entered your old password.'});
        }
      }

      const obj = {
        // image: inputs.image,
        phone: user.phone,
        email: email,
        name: user.name,
        password: password
      };
      sails.log.debug('obj', obj);
      const validation = await sails.helpers.user.validate.with(obj);
      if ( validation.fails() ){

        let errors = validation.errors.all();
        let err_keys = Object.keys(errors);
        let err_response = '';

        for(let e=0; e<err_keys.length; e++){
          for(let ee=0; ee<errors[err_keys[e]].length; ee++){
            if ( err_response === '' ){
              err_response = errors[err_keys[e]][ee];
            }else{
              err_response = err_response+'\n'+errors[err_keys[e]][ee];
            }
          }
        }

        return res.send({
          status: false,
          message: err_response,
          data: {},
        });
      }



      const hashedPassword = await generateEncryptedPassword(password);
      await User.update({email, id: user.id}).set({ forgetPasswordToken: '', password: hashedPassword});

      sails.log.debug('Password changed.');
      return exits.success({status: true, data: [], message: 'Successfully changed password. Try login with new password.'});
    }catch(e){
      sails.log.error('error user/forget-password/change-password', e);
      return exits.invalid({status: false, data: [], message: e.message || 'server error'});
    }

  }


};