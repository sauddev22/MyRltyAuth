const { generateRandomString } = require('../../../util');

module.exports = {


  friendlyName: 'Confirm otp',


  description: '',


  inputs: {
    otp: {
      type: 'string',
      required: true
    },
    email: {
      type: 'string',
      isEmail: true,
      required: true
    }
  },


  exits: {
    invalid: {
      responseType: 'badRequest',
      description: 'Driver not exists',
    },
  },


  fn: async function ({email, otp}, exits) {
    sails.log.debug('calling user/forget-password/confirm-otp', {otp, email});
    try{
      const user = await User.getOne({email, otp});
      if(!user) {
        throw new Error('Invalid OTP');
      }
      
      const forgetPasswordToken =  generateRandomString();
      await User.update({email, id: user.id}).set({otp:'', forgetPasswordToken});

      // user.forgetPasswordToken = generateRandomString();
      // user.otp = '';

      sails.log.debug('user/forget-password/confirm-otp');
      return exits.success({status: true, data: {
        token : forgetPasswordToken,
        email :  user.email
      }, message: 'Success'});
    }catch(e){
      sails.log.error('error confirm-otp', e);
      return exits.invalid({status: false, data: [], message: e.message});
    }

  }


};
