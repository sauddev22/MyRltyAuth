module.exports = {


  friendlyName: 'Create Child User',


  description: '',


  inputs: {

    parent_id:{
      type: 'string',
      required: true
    },
    username:{
      type: 'string',
      required: true
    },
    password:{
      type: 'string',
      required: true
    },
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
    const {username, parent_id} = inputs;
    sails.log.debug('calling user/child/create.js', {username, parent_id});
    try{
      const req = this.req;
      const res = this.res;

      const data = await sails.models.user.getOne({username});
      sails.log.debug('data', data);
      if (data) {
        throw new Error('Username already exist');
      }

      const parentdata = await sails.models.user.getOne({id: parent_id});
      sails.log.debug('parentData', parentdata.phone);
      const d = new Date();
      const time= d.getTime();
      const email = inputs.username.replace(/ /g, '')+'.'+time+'@yopmail.com';
      sails.log.debug('email', email);
      const obj = {
        password: inputs.password,
        email: email,
        // phone: parentdata.phone,
        name: inputs.username,
        username: inputs.username
      };

      sails.log.debug('object' , obj);


      const validation = await sails.helpers.user.validate.with(obj);
      sails.log.debug('validate', validation.fails());
      if ( validation.fails() ){

        let errors = validation.errors.all();
        sails.log.debug('valid err:' , errors);
        let err_keys = Object.keys(errors);
        let err_response = '';

        for(let e=0; e<err_keys.length; e++){
          for(let ee=0; ee<errors[err_keys[e]].length; ee++){
            if ( err_response === '' ){
              err_response = errors[err_keys[e]][ee];
            }else{
              err_response = err_response+'\n'+errors[err_keys[e]][ee];
            }
          }
        }

        sails.log.debug('res:' ,err_response);

        return res.send({
          status: false,
          message: err_response,
          data: {},
        });
      }

      const _obj = {
        parentId: inputs.parent_id,
        username: inputs.username,
        password: inputs.password,
        email: email,
        phone: parentdata.phone,
        name:inputs.username,
        privacy: inputs.privacy ? inputs.privacy.toLowerCase(): 'private'
      };

      await sails.models.user.create(_obj);
      const user = await sails.models.user.getOne({email});
      return exits.success({
        status: true,
        data: user.id,
        message: 'Child created successfully'
      });

    }catch(e){
      sails.log.error('error in user/child/create.js', e);
      return exits.invalid({status: false, data: [], message: e.message});

    }

  }


};
