module.exports = {


  friendlyName: 'Delete Child User',


  description: '',


  inputs: {

    id:{
      type: 'string',
      required: true
    },

  },


  exits: {
    invalid: {
      responseType: 'badRequest',
      description: 'Driver not exists',
    },
  },


  fn: async function ({id}, exits) {
    // const {privacy, child_id} = inputs;
    sails.log.debug('calling user/child/delete.js', { id});
    try{
      const req = this.req;
      const res = this.res;

      const data = await sails.models.user.getOne({id: id});
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
      let datetime = await sails.helpers.datetime.datetime.with({'date':true,'time':true});
      sails.log.debug('date',datetime);
      const _obj = {

        // password: inputs.password,
        deletedAt:datetime
      };

      await sails.models.user.update({id: id}).set(_obj);
      return exits.success({
        status: true,
        data: id,
        message: 'Child Deleted successfully'
      });

    }catch(e){
      sails.log.error('error in user/child/update.js', e);
      return exits.invalid({status: false, data: [], message: e.message});

    }

  }


};
