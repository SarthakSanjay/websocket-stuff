import express from "express";
import { getAllUser, getUserDetails, loginUser, registerUser, searchUser, updateUserDetail } from "../controllers/user";
import { authMiddleware } from "../middleware/auth";

const router = express.Router()

router.route('/register').post(registerUser)
router.route('/login').post(loginUser)
router.route('/all').get(authMiddleware , getAllUser )
router.route('/details').get(authMiddleware,getUserDetails).patch(authMiddleware,updateUserDetail)
router.route('/search').get(authMiddleware,searchUser)
export default router