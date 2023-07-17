module.exports = {


  friendlyName: 'Edit',


  description: 'Edit user.',


  inputs: {
    image: {
      type: 'string'
    },
    name: {
      type: 'string'
    },
    password: {
      type: 'string'
    },
    email: {
      type: 'string'
    },
    phone_number: {
      type: 'string'
    },
    user:{
      type: 'ref'
    }
    
  },


  exits: {

  },


  fn: async function (inputs) {

    try {
      const data = inputs
      sails.log("Calling edit-profile/editprofile");
      const check = await sails.models.user.findOne({
          id: inputs.user.id
      });
      sails.log.debug('token data')
      sails.log.debug(check)
      
      if (check.length < 1) {
          return {
              status: false,
              message: "No such user found",
              data: {}
          }
      }

      // const { status, data, headers } = await sails.helpers.request.with({
      //     req: this.req,  
      //     type: 'PUT',
      //     server: 'AUTH',
      //     endpoint: 'users/'+inputs.user.id,
      //     params: inputs
      // });
      // this.res.set(headers);
      // [exitsName, responseData] = await sails.helpers.response.with({
      //     status: status,
      //     data: data,
      // });

      // sails.log(responseData , "responsedata");

      // Auth Server Name Change
      const matchedColumns = {
          phone : inputs.phone_number
      }
      const postregistration = await sails.models.user.updateOne({
          id: inputs.user.id,
          
      }).set(matchedColumns);
      return { status: true, message: "Successfull", data: postregistration }
  } catch (error) {
      return { status: false, message: error.message, data: {} }
  }

  }


};
