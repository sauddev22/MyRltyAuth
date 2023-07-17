const { generateOtp } = require("../../util");

module.exports = {


  friendlyName: 'Forget password',


  description: '',


  inputs: {
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


  fn: async function ({email}, exits) {
    sails.log.debug('calling user/forget-password', email);
    try{
      const user = await User.getOne({email});
      if(user) {
        const otp = generateOtp();
        //const otp = 5555;
        
        await User.update({email}).set({otp});
        await sails.helpers.auth.sendOtp.with({
          email: email,
          otp
        });
        return exits.success({status: true, data: [], message: 'OTP sent successfully'});
      }
      else{
        return exits.invalid({status: false, data: [], message: "No email found."});
      }
      
    }catch(e){
      sails.log.error('error forget pwd', e);
      return exits.invalid({status: false, data: [], message: e.message});
    }


  }


};
