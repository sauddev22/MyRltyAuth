/**
 * @typedef {Object} SOCIALINPUTS
 * @property {String} token
 * @property {String} tokenType
 * @property {String} email
 * @property {String} name
 * @property {e.Response} res
 * @property {e.Request} req
 */
module.exports = {
  friendlyName: 'Social login',

  description: '',

  inputs: {
    token: {
      type: 'string',
      required: true,
    },
    tokenType: {
      type: 'string',
      required: true,
      isIn: ['facebook', 'google', 'apple', 'instagram', 'linkedin', 'googleV1'],
    },
    redirectUri:{
      type: 'string',
    },
    platform:{
      type: 'string',
    },
    hasAccessToken: {
      type: 'bool',
      defaultsTo: false
    },
    email: {
      type: 'string'
    },
    name: {
      type: 'string',
      defaultsTo: ''
    }
  },

  exits: {
    ok: {
      description: 'Send ok response',
      responseType: 'ok',
    },
    forbidden: {
      description: 'Send forbidden response',
      responseType: 'forbidden',
    },
    serverError: {
      description: 'send server error',
      responseType: 'serverError',
    },
    invalid: {
      responseType: 'badRequest',
      description: 'Driver not exists',
    },
  },
  /**
   *
   * @param {SOCIALINPUTS} inputs
   * @param {*} exits
   * @returns
   */
  fn: async function (inputs, exits) {
    sails.log('calling action user/social-login');
    let req = this.req;

    try {
      let isNewUser = false;
      let response = null;
      let rec = {};
      switch (inputs.tokenType) {
        case 'facebook': {
          response = await sails.helpers.social.fbLogin(inputs.token);
          if (_.isObject(response) && !_.isUndefined(response.email)) {
            rec = {
              name: response.name,
              email: response.email,
              image: response.picture.data.url || null,
            };
          }
          break;
        }
        case 'google': {
          response = await sails.helpers.social.googleLogin(inputs.token);

          if (_.isObject(response) && !_.isUndefined(response.email)) {
            rec = {
              name: `${response.given_name} ${response.family_name}`,
              email: response.email,
              image: response.picture || null,
            };
          }
          break;
        }
        case 'googleV1': {
          response = await sails.helpers.social.v1.googleLogin(inputs.token);

          if (_.isObject(response) && !_.isUndefined(response.email)) {
            rec = {
              name: `${response.given_name} ${response.family_name}`,
              email: response.email,
              image: response.picture || null,
            };
          }
          break;
        }
        case 'linkedin': {
          response = await sails.helpers.social.linkedinLogin(inputs.token,inputs.redirectUri,inputs.platform);
          sails.log.debug(response)
          if (_.isObject(response) && !_.isUndefined(response.email)) {
            rec = {
              name: `${response.first_name} ${response.last_name}`,
              email: response.email,
             // image: response.picture || 'no image found',
            };
          }
          break;
        }
        case 'instagram': {
          response = await sails.helpers.social.instagramLogin(inputs.token, inputs.hasAccessToken);
          if (_.isObject(response) && !_.isUndefined(response.username)) {
            sails.log.debug(response.username);
            rec = {
              name: `${response.username}`,
              email: 'abc@gmail.com',
              platform: 'instagram',


            };
          }
          break;
        }
        case 'apple': {
          sails.log.debug('calling apple signon');
          if (!_.isNil(inputs.email)) {
            response = {
              email: inputs.email,
              name: inputs.name
            };
            rec = {
              name: response.name,
              email: response.email,
              image: '',
            };
          } else {
            sails.log.debug('invalid payload: Email is missing');
            return exits.invalid({ status: false, data: [], message: 'Email required.' });
          }
          break;
        }
        default:
          throw new Error('Token type is not valid');
      }


      if (rec.email) {
        sails.log.debug('check if user exists');
        sails.log.debug({
          rec
        });
        let user = await User.getOne({ email: response.email });
        if (!user) {
          isNewUser = true;
          sails.log.debug('user didnot exits. creating user');
          user = await User.create(rec).fetch();
        }

        sails.log.debug('check if user blocked');
        let userBlocked = await User.getOne({ email: response.email, isBlocked: 1 });
        if (userBlocked) {

          sails.log.debug('You are currently blocked. please contact Administrator');
          return exits.forbidden({
            status: false,
            message: 'You are currently blocked. please contact Administrator',
            data: [],
          });
        }

        sails.log.debug('using login');
        const _user = await passportLogin(user, req);

        sails.log.debug('sending response');
        return exits.success({
          status: true,
          data: { ..._user, isNewUser },
          message: 'Logged in successfully'
        });
      }
      return exits.ok({
        status: false,
        message: 'Unable to login, invalid token',
        data: [],
      });
    } catch (error) {
      sails.log.error('error in api/controllers/social-login: ====>>>', error);
      return exits.serverError({
        status: false,
        message: 'Something went wrong',
        data: [],
      });
    }
  },
};



function passportLogin(user, req) {
  return new Promise((resolve, reject) => {
    sails.log.debug('trying to login with ', user);
    req.login(user, (err) => { // event loop
      if (err) { return reject(err); }
      sails.log('User ' + user.id + ' has logged in');
      return resolve(user);
    });
  });
}
