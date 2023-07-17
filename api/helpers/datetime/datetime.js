
module.exports = {
  friendlyName: 'Datetime',

  description: '',

  inputs: {
    time:{
      type:'boolean',
      defaultsTo: false
    },
    date:{
      type:'boolean',
      defaultsTo: false
    }
  },

  exits: {},

  fn: async function (inputs, exits) {
    sails.log.debug('calling helpers/datetime/datetime');
    // For todays date;
    Date.prototype.today = function () { 
        return this.getFullYear()+"-"+(((this.getMonth()+1) < 10)?"0":"") + (this.getMonth()+1) +"-"+ ((this.getDate() < 10)?"0":"") + this.getDate() ;
    }
    
    // For the time now
    Date.prototype.timeNow = function () {
        return ((this.getHours() < 10)?"0":"") + this.getHours() +":"+ ((this.getMinutes() < 10)?"0":"") + this.getMinutes() +":"+ ((this.getSeconds() < 10)?"0":"") + this.getSeconds();
    }
    const newDate = new Date();
    let datetime = "";  
    if(inputs.date){
      datetime += newDate.today();
    }
    if(inputs.time){
      datetime += inputs.date ? " " : "";
      datetime += newDate.timeNow();
    }
    
    return exits.success(datetime);
   
  },
};
