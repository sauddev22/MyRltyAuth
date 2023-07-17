const randomstring = require('randomstring');
const bcrypt = require('bcrypt-nodejs');

module.exports = {
  comparePrevPassword: async function(newPassword, prevPassword) {
    return new Promise((resolve, reject) => {
      bcrypt.compare(newPassword, prevPassword, async (err, res) => {
        if (err) {
          sails.log.error('Error changing password.', err);
          return reject('Error changing password. Please try again or contact administrator');
        }

        return resolve(res);
      });

    });
  },
  generateOtp: function() {
    return randomstring.generate({
      length: 4,
      charset: 'numeric',
    });
  },
  generateRandomString: function() {
    return randomstring.generate();
  },
  generateEncryptedPassword: function(password) {
    return new Promise(((resolve, reject) => {
      bcrypt.genSalt(10, (err, salt) => {
        if(err) {
          sails.log.error('error generating salt', err);
          return reject(err);
        }
        bcrypt.hash(password, salt, null, (err, hash) => {
          if (err) {
            sails.log.error('error encrypting password', err);
            return reject(err);
          }


          return resolve(hash);
        });
      });

    }));
  }
};
