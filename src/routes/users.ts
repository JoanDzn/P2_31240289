import express from 'express';
import { Request, Response, Router } from 'express';

const router: Router = express.Router();
router.get('/', (req: Request, res: Response) => {
  res.render('index', { title: 'Express' });
});

export default router;
