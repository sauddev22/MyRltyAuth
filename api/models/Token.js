/**
 * Token.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    token: {
      type: 'string',
      unique: true
    },
    user_id: {
      type: 'string',
      unique: true,
    }
  },

};

