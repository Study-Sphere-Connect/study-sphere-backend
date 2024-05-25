import express from 'express';
import AuthController from '../controllers/AuthController';
import { validate } from '../middlewares/zodValidate';
import { SignInSchema, SignUpSchema } from '../schemas/AuthSchemas';
import { authenticateJWT } from '../middlewares/jwt';

const router = express.Router();

router.post('/signup', validate(SignUpSchema), AuthController.signUp)
router.post('/signin', validate(SignInSchema), AuthController.signIn)
router.get('/userinfo', authenticateJWT, AuthController.getUserInfo)

export default router;