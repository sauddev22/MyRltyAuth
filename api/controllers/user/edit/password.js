const { comparePrevPassword, generateEncryptedPassword } = require('../../../util');

module.exports = {


  friendlyName: 'Password',


  description: 'Password edit.',


  inputs: {
    current_password: {
      type: 'string',
      required: true
    },
    password: {
      type: 'string',
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
    serverError: {
      description: 'send server error',
      responseType: 'serverError',
    },
  },


  fn: async function ({password, current_password, user}, exits) {
    sails.log.debug('calling user/edit/password');
    try{
      const verifyPassword = await comparePrevPassword(current_password, user.password);
      if(!verifyPassword) {
        sails.log.debug('user has entered wrong password');
        return exits.success({status: false, data: [], message: 'You have entered wrong password.'});
      }
      const isSame = await comparePrevPassword(password, user.password);
      if(isSame) {
        sails.log.debug('user has entered same password');
        return exits.success({status: false, data: [], message: 'You have entered same password.'});
      }
      user.password = await generateEncryptedPassword(password);
      await User.update({id: user.id}).set({password: user.password});
      return exits.success({status: true, data: [], message: 'Password updated successfully'});
    }catch(e){
      sails.log.error('error user/edit/password', e);
      return exits.serverError({status: false, data: [], message: 'Unable to update password.'});
    }

  }


};
