import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { createAccount, getAccountBalance, getUserAccounts } from '../controllers/account.controller.js';

const router = express.Router();

/**
 * @route   GET /api/accounts/
 * @desc    create a new account
 * @access  protected
 */
router.post("/", authMiddleware, createAccount)

// @route   GET /api/accounts/
// @desc    get all accounts of the user
// @access  protected
router.get("/", authMiddleware, getUserAccounts)

// @route   GET /api/accounts/balance/:accountId
// @desc    get the balance of a specific account
// @access  protected
router.get("/balance/:accountId", authMiddleware, getAccountBalance)



export default router;