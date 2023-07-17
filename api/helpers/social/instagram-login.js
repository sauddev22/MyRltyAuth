const request = require('request');
module.exports = {
  friendlyName: 'Facebook login',

  description: '',

  inputs: {
    token: {
      type: 'string',
      required: true,
    },
    hasAccessToken: {
      type: 'bool',
      defaultsTo: false
    }
  },

  exits: {
    success: {
      description: 'All done.',
    },
  },

  fn: async function (inputs, exits) {
    sails.log('calling helper general/insta-login');

    try {
      // let InstaAppId = sails.config.INSTAGRAM.APPID;
      // let InstaSecretKey = sails.config.INSTAGRAM.SECRET;
      let access_token = '';
      if (!inputs.hasAccessToken) {

        const options = {
          'method': 'POST',
          'url': 'https://api.instagram.com/oauth/access_token',
          formData: {
            'client_id': '5310099999040876',
            'client_secret': '5d15864d0e7655b83be2ee2a61b72b96',
            'code': inputs.token,
            'grant_type': 'authorization_code',
            'redirect_uri': 'https://myrlty123.herokuapp.com/sign-in'
          }
        };
        const response = await new Promise(((resolve, reject) => {
          request(options, (error, response) => {
            if (error) { reject(error); }
            resolve(response);
          });
        }));
        var receivedData3 = JSON.parse(response.body);
        access_token = receivedData3.access_token;

      } else {
        access_token = inputs.token;

      }
      //  sails.log.debug(access_token_code)
      if (access_token) {
        const options = {
          'method': 'GET',
          'url': 'https://graph.instagram.com/me?fields=id,username&access_token=' + access_token,

          formData: {

          }
        };
        request(options, (error, response1) => {
          if (error) { throw new Error(error); }
          var response_insta = JSON.parse(response1.body);
          sails.log.debug('taking back response from instagram back');
          return exits.success(response_insta);
          //  console.log(response.body);
        });
      }

      // var urlToRq = `https://graph.facebook.com/oauth/access_token?client_id=${fbAppId}&client_secret=${fbSecretKey}&grant_type=client_credentials`;

      // // Get information about the google user with the specified access token.
      // request.get({ url: urlToRq }, (err, response, body) => {
      //   if (err) {
      //     sails.log.error(`Error in fb login, Error: ${err}`);
      //     return exits.success(false);
      //   }
      //   var receivedData = JSON.parse(body);
      //   var app_access_token = receivedData.access_token || null;
      //   if (app_access_token) {
      //     urlToRq = `https://graph.facebook.com/debug_token?input_token=${inputs.token}&access_token=${app_access_token}`;

      //     request.get({ url: urlToRq }, (err2, response2, body2) => {
      //       if (err2) {
      //         sails.log.error(`Error in fb login, Error: ${err2}`);
      //         return exits.success(false);
      //       }
      //       var receivedData2 = JSON.parse(body2);
      //       //console.log("receivedData2:",receivedData2);
      //       if (!receivedData2.error) {
      //         fb_user_id = _.isUndefined(receivedData2.data.user_id)
      //           ? null
      //           : receivedData2.data.user_id;
      //         if (fb_user_id) {
      //           urlToRq = `https://graph.facebook.com/v2.5/me?fields=email,name,picture&access_token=${inputs.token}`;
      //           request.get(
      //             { url: urlToRq },
      //             (err3, response3, body3) => {
      //               if (err3) {
      //                 sails.log.error(`Error in fb login, Error: ${err3}`);
      //                 return exits.success(false);
      //               }
      //               var receivedData3 = JSON.parse(body3);
      //               console.log('fb user:', receivedData3);
      //               return exits.success(receivedData3);
      //             }
      //           ); //end get
      //         } else {
      //           return exits.success(false);
      //         }
      //       } else {
      //         return exits.success(false);
      //       }
      //     }); //end get
      //   } else {
      //     return exits.success(false);
      //   }
      // }); //end get
    } catch (error) {
      sails.log.error('error in helpers/social/fb-login:  ====>', error);
      return exits.success(false);
    }
  },
};
