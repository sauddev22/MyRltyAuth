const Validator = require('validatorjs');

module.exports = {


  friendlyName: 'Validate',


  description: 'Validate user.',


  inputs: {
    // image: {
    //   type: 'string',
    //   required: true
    // },

    // phone: {
    //   type:'number',
    // required: true
    // },
    email: {
      type: 'string',
      required: true,
    },
    name: {
      type: 'string',
      required: true
    },
    password: {
      type: 'string',
      required: true
    },
    username: {
      type: 'string'
    }
  },


  exits: {

    success: {
      description: 'All done.',
    },

  },


  fn: async function (inputs) {
    sails.log.debug('calling user/validate');

    const rules = {
      name: 'required|max:100',
      username: 'alpha_num|max:100',
      email: 'required|email',
      password: 'required|min:6|regex:/^(?=.*[0-9])(?=.*[A-Z])\\S{6,40}$/'
    };


    const validation = new Validator(inputs, rules, {'regex.password': 'Password should contain 1 Uppercase letter and 1 numeric'});
    return validation;
  }


};

