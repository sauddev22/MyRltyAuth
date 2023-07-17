module.exports = {

  friendlyName: 'Logout',

  description: 'Logout user.',

  inputs: {
    token: {
      type: 'string',
      required: true
    }
  },

  exits: {

  },

  fn: async function({token}, exits) {
    sails.log.debug('calling user logout' );
    try {
      await sails.helpers.jwt.removeToken.with({ token });
    } catch (e) {
      sails.log.error('attempt to logout failed ', e);
    }
    return exits.success({ status: true, data: [], message: 'Logout' });
  }

};
