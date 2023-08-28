import express, { Request, Response } from 'express';
import authRoutes from '../components/auth/auth.router';
import userRoutes from '../components/user/user.router';
import postRoutes from '../components/post/post.router';

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
  res.send('Risevest 🚀 ');
});

router.use('/auth', authRoutes);

router.use('/users', userRoutes);

router.use('/posts', postRoutes);

export default router;
