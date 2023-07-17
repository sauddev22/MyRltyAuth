/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {
  /***************************************************************************
   *                                                                          *
   * Make the view located at `views/homepage.ejs` your home page.            *
   *                                                                          *
   * (Alternatively, remove this and add an `index.html` file in your         *
   * `assets` directory)                                                      *
   *                                                                          *
   ***************************************************************************/

  'GET /': function (req, res) {
    res.send({ status: 'Auth Alive' });
  },

  /***************************************************************************
   *                                                                          *
   * More custom routes here...                                               *
   * (See https://sailsjs.com/config/routes for examples.)                    *
   *                                                                          *
   * If a request to a URL doesn't match any of the routes in this file, it   *
   * is matched against "shadow routes" (e.g. blueprint routes).  If it does  *
   * not match any of those, it is matched against static assets.             *
   *                                                                          *
   ***************************************************************************/

  // Auth

  'POST /api/v1/login': 'AuthController.login',
  'POST /api/v1/register': 'AuthController.register',
  '/api/v1/logout': { action: 'user/logout' },

  // Routes Register
  /**
   * inputs:
   *  - email
   *
   * process:
   *  - check if email exist in request table
   *    - if email not exist than save email with otp in request table with expiry.
   *    - if email exists than send Otp with expiry.
   *
   * output:
   *  - success/error.
   */
  'POST /api/v1/auth/sendOtp': { action: 'auth/send-otp' },

  /**
   * It will be used to signup user.
   *
   * inputs:
   *  - email
   *  - image
   *  - name
   *  - password
   *  - otp
   *
   * process:
   *  - check if email exist in request table
   *  - validate request
   *  - create user
   *  - remove user from request table.
   *  - login user
   *
   * output:
   *  - login user and send jwt tokens.
   */
  'POST /api/v1/auth/signup': { action: 'auth/signup' },
  'POST /api/v1/auth/admin-signup': { action: 'auth/admin-signup' },
  // ------------------------------------------------------
  /**
   * inputs:
   *  - token
   *
   * process:
   *  - remove token from db
   *
   * output:
   *  - Success
   */
  'POST /api/v1/auth/logout': { action: 'auth/signout' },
  /**
   * inputs:
   *  - refresh token
   *
   * process:
   *  - refresh token using refresh token given by client
   *
   * output:
   *  - new token
   */
  'POST /api/v1/auth/refreshToken': { action: 'auth/refresh-token' },
  /**
   * inputs:
   *  - email
   *  - pwd
   *
   * process:
   *  - check email and pwd
   *
   * outpus:
   *  - send jwt
   */
  'POST /api/v1/auth/login': { action: 'auth/login/local' },

  /**
   * inputs:
   *  - email
   *
   * process:
   *  - check email and send otp
   *
   * outputs:
   *  - success/error
   */
  'POST /api/v1/forget-password': { action: 'user/forget-password' },

  'POST /api/v1/admin/forget-password': { action: 'user/admin/forget-password' },

  /**
   * inputs:
   *  - email
   *  - otp
   *
   * process:
   *  - confirm email and otp
   *  - generate random id and send it in response
   *
   * outputs:
   *  - send random id
   */
  'POST /api/v1/forget-password/confirm': { action: 'user/forget-password/confirm-otp' },
  /**
   * inputs:
   *  - email
   *  - token
   *  - password
   *
   * process:
   *  - confirm email and token
   *  - update encrypted password
   *
   * outputs:
   *  - success/error
   */
  'POST /api/v1/forget-password/change-password': { action: 'user/forget-password/change-password' },

  /**
   * Edit Profile - Change password
   * inputs:
   *  - password
   *
   * process:
   *  - check current and prev pwd
   *  - update encrypted password
   *
   * outputs:
   *  - success/error
   */
  'POST /api/v1/user/edit/password': { action: 'user/edit/password' },
  /**
   * Edit Profile - Update name or image
   * inputs:
   *  - name
   *  - image
   *
   * process:
   *  - if image is provided remove prev image and upload new one.
   *  - update name
   *
   * outputs:
   *  - success/error
   */
  'POST /api/v1/user/edit/profile': { action: 'user/edit/profile' },

  // SSO
  // 'POST /auth/login/google': { action: 'auth/login/google' },
  // 'POST /auth/login/facebook': { action: 'auth/login/facebook' },
  // 'POST /auth/login/apple': { action: 'auth/login/apple' },



  // social logins
  'POST /api/v1/social-login': {
    action: 'social-login',
  },

  // temp
  // 'GET /api/v1/banner': { action: 'banner/get' }
  'GET /api/v1/user/get': { action: 'user/get' },
  'PUT /api/v1/user/edit': { action: 'user/edit' },

  'GET /api/v1/users': { action: 'users/get' },
  'GET /api/v1/users/:id': { action: 'users/get-one' },
  'POST /api/v1/users': { action: 'users/create' },
  'PUT /api/v1/users/:id': { action: 'users/update' },
  'DELETE /api/v1/users/:id': { action: 'users/delete' },
  'DELETE /api/v1/users': { action: 'users/bulkdelete' },
  'POST /api/v1/reset-password': { action: 'user/reset-password' },

  'POST /api/v1/user/signupotp': { action: 'user/confirm-signup-otp' },
  /* Public Users */
  'GET /api/v1/publicuser': { action: 'publicuser/get' },
  'POST /api/v1/logout': 'AuthController.logout',

  'POST /api/v1/user/confirm-otp': { action: 'auth/confirm-otp' },

};
