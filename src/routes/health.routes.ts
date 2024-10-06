import { Router, Request, Response } from 'express';

const router = Router();

/**
 * Health Check Route
 * @route GET /health
 * @desc Responds with the status of the server
 * @access Public
 */
router.get('/', (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK' });
});

export default router;
