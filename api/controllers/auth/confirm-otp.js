const { constant } = require('lodash');

module.exports = {


  friendlyName: 'Confirm otp',


  description: '',


  inputs: {
    // image: {
    //   type: 'string',
    //   required: true
    // },

    phone: {
      type: 'string',
      // required: true
    },
    email: {
      type: 'string',
      required: true,
      isEmail: true,
    },
    name: {
      type: 'string',
      required: true
    },
    password: {
      type: 'string',
      required: true
    },
    otp: {
      type: 'string',
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
    const { email, otp } = inputs;
    sails.log.debug('calling confirm-otp', { email, otp });
    try {
      const req = this.req;
      const res = this.res;
      const data = await sails.models.userrequest.findOne({ email, otp });
      sails.log.debug('data', data);
      if (!data) {
        throw new Error('Invalid OTP');
      }

      const obj = {
        // image: inputs.image,
        // phone: inputs.phone,
        email: inputs.email,
        name: inputs.name,
        password: inputs.password
      };
      sails.log.debug('obj', obj);
      const validation = await sails.helpers.user.validate.with(obj);
      if (validation.fails()) {

        let errors = validation.errors.all();
        let err_keys = Object.keys(errors);
        let err_response = '';

        for (let e = 0; e < err_keys.length; e++) {
          for (let ee = 0; ee < errors[err_keys[e]].length; ee++) {
            if (err_response === '') {
              err_response = errors[err_keys[e]][ee];
            } else {
              err_response = err_response + '\n' + errors[err_keys[e]][ee];
            }
          }
        }

        return res.send({
          status: false,
          message: err_response,
          data: {},
        });
      }

      await sails.models.user.create(obj);
      await sails.models.userrequest.destroy({ email, otp });
      const user = await sails.models.user.getOne({ email });
      req.login(user, (err) => {
        if (err) { return res.badRequest(err); }
        user.followers = 0;
        user.following = 0;
        sails.log('User ' + user.id + ' has logged in');
        return res.send({
          status: true,
          message: 'Logged in successfully',
          data: user,
        });
      });
    } catch (e) {
      sails.log.error('error registration', e);
      // const _msg = typeof e !== 'string'? 'Unknown Error' : e;
      return exits.invalid({ status: false, data: [], message: e.message });

    }
    // All done.
    return;

  }


};
