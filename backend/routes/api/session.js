const express = require('express')
// had to import requireAuth to handle "require authentication: true" in get current user
const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');
const router = express.Router();
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const validateLogin = [
    check('credential')
      .exists({ checkFalsy: true })
      .withMessage('Email or username is required'),
    check('password')
      .exists({ checkFalsy: true })
      .withMessage('Password is required'),
    handleValidationErrors
  ];

router.post('/', validateLogin, async (req, res, next) => {
      const { credential, password } = req.body;

      // don't need this because can keep validations in express-validators defined in validateLogin
      // // come back to this custom error handling, it uses ../utils/validation.js file actually from User.login(...)
      // if (!credential && !password) {
      //   res.status(400)
      //   return res.json({
      //     message: "Validation error",
      //     statusCode: 400,
      //     errors: {
      //       "credential": "Email or username is required",
      //       "password": "Password is required"
      //     }
      //   })
      // }
      // if (!credential) {
      //   res.status(400)
      //   return res.json({
      //     message: "Validation error",
      //     statusCode: 400,
      //     errors: {
      //       "credential": "Email or username is required"
      //     }
      //   })
      // }
      // if (!password) {
      //   res.status(400)
      //   return res.json({
      //     message: "Validation error",
      //     statusCode: 400,
      //     errors: {
      //       "password": "Password is required"
      //     }
      //   })
      // }

      const user = await User.login({ credential, password });

      // custom err res for log in a user with invalid credentials / pw
      if (!user) {
        res.status(401)
        return res.json({
          message: "Invalid credentials",
          statusCode: "401"
        })
      }
  
      // this was the one provided to us by auth-me, differs from the api docs
      // it is either no user or pw invalid - vague error msg because don't want to give client any potential clues
      if (!user) {
        const err = new Error('Invalid credentials');
        err.status = 401;
        err.title = 'Invalid credentials';
        err.errors = ['The provided credentials were invalid.'];
        return next(err);
      }
  
      await setTokenCookie(res, user);
  
      return res.json({
        user: user
      });
    }
  );

// logs user out (note, added in postman custom since aa doesn't test for it "Logout (HT)")
router.delete('/', (_req, res) => {
    res.clearCookie('token');
    return res.json({ message: 'success' });
  }
);

// user should stil have token if they've logged in; can verify their token validity via jwt methods
// get current user
router.get('/', requireAuth, restoreUser, (req, res) => {
      const { user } = req;
      if (user) {
        return res.json({
          user: user.toSafeObject(),
          // if i remove .toSafeObject(), res.body will show firstName and lastName as desired from API,
          // not sure what that method does, can't find online or find its def within vscode
          // nvm it was defined in the user.js model, can include firstName, lastName there to populate in res.body
        });
      } else return res.json({ user: null });
    }
  );
  

module.exports = router;