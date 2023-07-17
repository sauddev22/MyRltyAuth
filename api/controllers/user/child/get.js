module.exports = {


  friendlyName: 'Get child users',


  description: '',


  inputs: {

    parent_id:{
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


  fn: async function (inputs, exits) {
    const {parent_id} = inputs;
    sails.log.debug('calling user/child/get.js', {parent_id});
    try{
      const data = await sails.models.user.find({parentId: parent_id, deletedAt : null});

      console.log({data});

      return exits.success({
        status: true,
        data: data,
        message: 'Childrens listed successfully'
      });
      // });

    }catch(e){
      sails.log.error('error in user/child/get.js', e);
      return exits.invalid({status: false, data: [], message: e.message});

    }

  }

};
