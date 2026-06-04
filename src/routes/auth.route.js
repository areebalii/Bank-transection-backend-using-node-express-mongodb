import express from 'express';
import { login, Logout, register } from '../controllers/auth.controller.js';

const router = express.Router();

router.post("/register", register)
router.post("/login", login)

// POST api/auth/logout
router.post("/logout", Logout)


export default router;