module.exports = {


  friendlyName: 'Update Child User',


  description: '',


  inputs: {

    child_id:{
      type: 'string',
      required: true
    },
    // password:{
    //   type: 'string',
    //   required: true
    // },
    privacy:{
      type:'string',
    }
  },


  exits: {
    invalid: {
      responseType: 'badRequest',
      description: 'Driver not exists',
    },
  },


  fn: async function (inputs, exits) {
    const {privacy, child_id} = inputs;
    sails.log.debug('calling user/child/update.js', {privacy, child_id});
    try{
      const req = this.req;
      const res = this.res;

      const data = await sails.models.user.getOne({id: child_id});
      sails.log.debug('data', data);
      // if (!data) {

      // }

      // const obj = {
      //   password: data.password,
      //   email: data.email,
      //   name: data.username,
      //   phone: data.phone

      // };

      // sails.log.debug('object' , obj);


      // const validation = await sails.helpers.user.validate.with(obj);
      // sails.log.debug('validate', validation.fails());
      // if ( validation.fails() ){

      //   let errors = validation.errors.all();
      //   sails.log.debug('valid err:' , errors);
      //   let err_keys = Object.keys(errors);
      //   let err_response = '';

      //   for(let e=0; e<err_keys.length; e++){
      //     for(let ee=0; ee<errors[err_keys[e]].length; ee++){
      //       if ( err_response === '' ){
      //         err_response = errors[err_keys[e]][ee];
      //       }else{
      //         err_response = err_response+'\n'+errors[err_keys[e]][ee];
      //       }
      //     }
      //   }

      //   sails.log.debug('res:' ,err_response);

      //   return res.send({
      //     status: false,
      //     message: err_response,
      //     data: {},
      //   });
      // }

      const _obj = {

        // password: inputs.password,
        privacy:inputs.privacy.toLowerCase()
      };

      await sails.models.user.update({id: child_id}).set(_obj);
      const user = await sails.models.user.getOne({id: child_id});
      sails.log.debug('debug',user);
      return exits.success({
        status: true,
        data: user.id,
        message: 'Child Updated successfully'
      });

    }catch(e){
      sails.log.error('error in user/child/update.js', e);
      return exits.invalid({status: false, data: [], message: e.message});

    }

  }


};
