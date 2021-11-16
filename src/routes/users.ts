import express from 'express';

const router = express.Router();
import { body, check } from 'express-validator';
import { HttpError } from '../models/http-error';

import { signUp, login, getUsers } from '../controllers/users-controllers';
router.get('/', getUsers);

router.post(
  '/sign-up',
  [
    check('firstName').not().isEmpty(),
    check('lastName').not().isEmpty(),
    check('email').normalizeEmail().isEmail(),
    check('password').isLength({ min: 6 }),
    body('confirmPassword').custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new HttpError("Passwords don't match");
      }
      return true;
    }),
  ],
  signUp
);

router.post('/login', login);

module.exports = router;
