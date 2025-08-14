import express from 'express';
import { registerUser, loginUser, googleSignIn } from '../controllers/authController';
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google', googleSignIn);

export default router;

// File: backend/src/routes/resumeRoutes.ts
import express from 'express';
import { uploadResume, getResumeResults, getUserResumes } from '../controllers/resumeController';
import { protect } from '../middleware/authMiddleware';
import { upload } from '../config/multerConfig';

const router = express.Router();

router.route('/upload').post(protect, upload.single('resume'), uploadResume);
router.route('/history').get(protect, getUserResumes);
router.route('/:id').get(protect, getResumeResults);

export default router;

// File: backend/src/routes/jobRoutes.ts
import express from 'express';
import { getJobsForResume } from '../controllers/jobController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/:resumeId', protect, getJobsForResume);

export default router;
