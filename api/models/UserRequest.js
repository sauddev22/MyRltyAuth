/**
 * UserRequest.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    email: {
      type: 'string',
      required: true,
      isEmail: true,
      unique: true,
    },
    otp: {
      type: 'string',
      required: true
    }
  },

};

