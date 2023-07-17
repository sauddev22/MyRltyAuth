
const request = require('request');
async function getToken(get_token_from_code){
  return new Promise(function (resolve, reject) {
      return request(get_token_from_code, function (err3, _response, body5) {
      if (err3) {
        sails.log.error(`Error in linkedin login, Error: ${err3}`);
        return reject(false);
      }

      resolve(JSON.parse(body5));
    });




  });
}
module.exports = {
  friendlyName: 'linkedin login',

  description: '',

  inputs: {
    token: {
      type: 'string',
      required: true,
    },
    redirectUri:{
      type: 'string',
    },
    platform:{
      type: 'string',
    }
  },

  exits: {
    success: {
      description: 'All done.',
    },
  },

  fn: async function (inputs, exits) {
    sails.log('calling helper general/linkedin-login');

    try {
      let qw = null;
      if(inputs.platform == 'app'){
        qw = inputs.token;
      }else{
        let code = inputs.token
        let Redirect_uri = inputs.redirectUri
        
        var get_token_from_code = {
         'method': 'POST',
         'url': `https://www.linkedin.com/oauth/v2/accessToken?grant_type=authorization_code&client_id=78trrwdfp4c0as&client_secret=Z0a6OYduf10vxzMf&code=${code}&redirect_uri=${Redirect_uri}&Content-Type=application/x-www-form-urlencoded`,
        
        
       };
       
       qw = await getToken(get_token_from_code);
   
      }
     

     //using token to get username
     let lt_token; 
     if(inputs.platform == 'app'){
       lt_token = qw;

     }else{
       lt_token = qw.access_token;
     }
     var config = {
        method: 'get',
        url:'https://api.linkedin.com/v2/me',

        headers: { 
          'Authorization': `Bearer ${lt_token}`, 
         
        }
      };
      // Get information about the google user with the specified access token.
      request.get(config, (err, response, body) => {
        if (err) {
         //   sails.log.debug(err)
          sails.log.error(`Error in linkedin login, Error: ${err}`);
          return exits.success(false);
        }
        var receivedData = JSON.parse(body);
        if(receivedData.status === 401){
          return exits.success({
            status: false,
            message: receivedData.message,
            data: {},
          });
        }
        
        var first_name = receivedData.firstName.localized.en_US
        var last_name = receivedData.lastName.localized.en_US
        var element = {};
        element.first_name = first_name;
        element.last_name = last_name;
        var app_access_token = receivedData.id || null;
        if (app_access_token) {
           //using token to get email
            var options = {
                'method': 'GET',
                'url': 'https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))',
                'headers': {
                  'Authorization': `Bearer ${lt_token}`,
                },
                formData: {
              
                }
              };
              request(options, function (err2, response,body4) {
                if (err2) {
                    sails.log.error(`Error in linkedin login, Error: ${err2}`);
                    return exits.success(false);
                  }  
                   body4 = JSON.parse(body4);
                   email = body4.elements[0]["handle~"].emailAddress
                   element.email = email
                   return exits.success(element);
                   
              });

        //   request.get({ url: options }, (err2, response2, body2) => {
        //     sails.log.debug(body2)


        //     if (err2) {
                
        //       sails.log.error(`Error in linkedin login, Error: ${err2}`);
        //       return exits.success(false);
        //     }
        //     var receivedData2 = JSON.parse(response2);
        //   }); //end get
        } else {
          return exits.success(false);
        }
      }); //end get
    } catch (error) {
      sails.log.error('error in helpers/social/fb-login:  ====>', error);
      return exits.success(false);
    }
  },
};
