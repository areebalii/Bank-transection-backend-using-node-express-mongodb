import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { createAccount } from '../controllers/account.controller.js';

const router = express.Router();

/**
 * @route   GET /api/accounts/
 * @desc    create a new account
 * @access  protected
 */
router.post("/", authMiddleware, createAccount)




export default router;