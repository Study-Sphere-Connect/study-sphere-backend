import express from "express"
import { authenticateJWT } from "../middlewares/jwt";
import PostController  from "../controllers/PostController"
import { upload } from "../configs/multer";

const router = express.Router();

router.get('/', authenticateJWT, PostController.getAllPosts);

router.get('/:id', authenticateJWT, PostController.getPostById);

router.post('/create', authenticateJWT, upload.single('file'), PostController.createPost);

router.post('/delete/:id', authenticateJWT, PostController.deletePost);

router.post('/like/:id', authenticateJWT, PostController.likePost);


export default router;