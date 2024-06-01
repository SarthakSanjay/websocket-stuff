import express from 'express'
import { acceptFriendReq, sendFriendRequest, getAllUserFriends, recivedFriendRequest } from '../controllers/friendship'
import { authMiddleware } from '../middleware/auth'

const router = express.Router()

router.route('/request').post(authMiddleware,sendFriendRequest)
router.route('/all').get(authMiddleware,getAllUserFriends)
router.route('/accept').put(authMiddleware,acceptFriendReq)
router.route('/all/request').get(authMiddleware,recivedFriendRequest)
export default router