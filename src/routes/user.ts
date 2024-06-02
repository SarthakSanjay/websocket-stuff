import express from "express";
import { getAllUser, getAdminDetails, loginUser, registerUser, searchUser, updateUserDetail, getUserDetails } from "../controllers/user";
import { authMiddleware } from "../middleware/auth";

const router = express.Router()

router.route('/register').post(registerUser)
router.route('/login').post(loginUser)
router.route('/all').get(authMiddleware , getAllUser )
router.route('/details').get(authMiddleware,getAdminDetails).patch(authMiddleware,updateUserDetail)
router.route('/search').get(authMiddleware,searchUser)
router.route('/:id').get(authMiddleware,getUserDetails)
export default router