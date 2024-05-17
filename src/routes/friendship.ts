import express from 'express'
import { addFriend, getAllUserFriends } from '../controllers/friendship'
import { authMiddleware } from '../middleware/auth'

const router = express.Router()

router.route('/').post(authMiddleware,addFriend)
router.route('/all').get(authMiddleware,getAllUserFriends)

export default router