const express = require('express');
const router = express.Router();

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const validateSignup = [
    // added to check user input has firstName & lastName + that it cannot be null (in model)
    check('firstName')
      .exists({ checkFalsy: true })
      .withMessage('Please provide a first name.'),
    check('lastName')
      .exists({ checkFalsy: true })
      .withMessage('Please provide a last name.'),
    check('email')
      .exists({ checkFalsy: true })
      .isEmail()
      .withMessage('Please provide a valid email.'),
    check('username')
      .exists({ checkFalsy: true })
      .isLength({ min: 4 })
      .withMessage('Please provide a username with at least 4 characters.'),
    check('username')
      .not()
      .isEmail()
      .withMessage('Username cannot be an email.'),
    check('password')
      .exists({ checkFalsy: true })
      .isLength({ min: 6 })
      .withMessage('Password must be 6 characters or more.'),
    handleValidationErrors // note this is from the ..utils/validation.js
  ];

router.post(
    '/',
    validateSignup, // from the above; need to validate registration info first
    // do they have firstName, lastName, username, email, etc.?
    async (req, res) => {
      const { firstName, lastName, email, username, password } = req.body;

      // custom err res for user already exists with specified email
      // condition to find whether email has been used in db already
      if (await User.findOne({
        where: { 
          email: email
        }
      })){
        res.status(403)
        return res.json({
          message: "User already exists",
          statusCode: 403,
          errors: {
            "email": "User with that email already exists"
          }
        })
      }

      // custom err res for user already exists with specified email
      // condition to find whether username has been used in db already
      if (await User.findOne({
        where: { 
          username: username
        }
      })){
        res.status(403)
        return res.json({
          message: "User already exists",
          statusCode: 403,
          errors: {
            "username": "User with that username already exists"
          }
        })
      }



      const user = await User.signup({ firstName, lastName, email, username, password });
  
      await setTokenCookie(res, user);
  
      return res.json({
        user: user
      });
    }
  );

module.exports = router;