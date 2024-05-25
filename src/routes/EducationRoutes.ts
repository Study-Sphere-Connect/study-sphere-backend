import express from 'express';
import EducationController from '../controllers/EducationController';
import { validate } from '../middlewares/zodValidate';
import { CreateEducationSchema, VerifyEducationSchema } from '../schemas/EducationSchema';
import { authenticateJWT } from '../middlewares/jwt';

const router = express.Router();

router.post('/create', authenticateJWT, validate(CreateEducationSchema), EducationController.createEducation)
router.post('/verify', authenticateJWT, validate(VerifyEducationSchema), EducationController.verifyEducation)
router.get('/get', authenticateJWT, EducationController.getUserEducation);

export default router;