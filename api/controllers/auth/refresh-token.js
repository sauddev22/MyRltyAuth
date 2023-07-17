module.exports = {


  friendlyName: 'Refresh token',


  description: '',


  inputs: {
    token: {
      type: 'string',
      required: true,
      description: 'Refresh token required to generate new access_token'
    }
  },


  exits: {
    invalid: {
      responseType: 'badRequest',
      description: '',
    },
    success: {
      responseType: 'ok',
      description: 'All done.',
    },
  },


  fn: async function ({token} , exits) {
    sails.log.debug('calling refresh-token', token);
    try {
      const tokens = await sails.helpers.jwt.refreshToken.with({ token });

      return exits.success({
        status: true,
        data: {
          access_token: tokens.accessToken,
          refresh_token: tokens.refreshToken
        },
        message: 'Token generated successfully'
      });
    } catch (e) {
      sails.log.error('Refresh Token ', e);
      return exits.invalid({status: false, data: [], message: e.message});

    }

  }


};
