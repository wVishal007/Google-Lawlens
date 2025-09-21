import express from 'express';
import isauthenticated from '../middlewares/isauthenticated.js';
import { getAllUsers, login,registerUser } from '../controllers/user.controller.js';

const router = express.Router();
router.route('/register').post(registerUser)
router.route('/login').post(login)
router.route('/all').get(isauthenticated,getAllUsers)
// router.route('/logout').get(logout)


export default router;
