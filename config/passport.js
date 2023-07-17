const passport = require('passport');
const LocalStratrgy = require('passport-local').Strategy;
const { comparePrevPassword } = require('../api/util');



// Serialize the User
passport.serializeUser(async (user, cb) => {
  const _user = await sails.helpers.jwt.generateToken.with({ user });

  cb(null, _user);
});

// Deserialize the User
passport.deserializeUser(async (user, cb) => {
  try{
    return cb(undefined, await User.getOne({id: user.id}));
  }catch(e){
    return cb(e, null);
  }
});

// Local
passport.use(
  new LocalStratrgy(
    {
      usernameField: 'email',
      passportField: 'password',
    },
    (async (email, password, cb) => {
      try{
        const user = await User.getOne({
          or: [{username: email}, {email: email}]
        });
        if (!user) {return cb(null, false, { message: 'Invalid credentials.' });}
        if (!user.password) {return cb(null, false, { message: 'Invalid credentials.' });}

        let res;
        if ( user.parentId ){
          res = user.password === password ? true : false;
        }else{
          res = await comparePrevPassword(password, user.password);
        }

        if (!res) {return cb(null, false, { message: 'Invalid credentials.' });}

        return cb(null, user, { message: 'Login Successful' });
      }catch(err){
        if (err) {return cb(err);}
      }
      // User.getOne({ email}).exec((err, user) => {
      //   if (err) {return cb(err);}
      //   if (!user) {return cb(null, false, { message: 'Invalid credentials.' });}

      //   bcrypt.compare(password, user.password, (err, res) => {
      //     if (err) {return cb(err);}
      //     if (!res) {return cb(null, false, { message: 'Invalid credentials.' });}
      //     return cb(null, user, { message: 'Login Successful' });
      //   });
      // });
    })
  )
);
