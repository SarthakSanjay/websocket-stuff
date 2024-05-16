import express from 'express'
import { addFriend, getAllUserFriends } from '../controllers/friendship'

const router = express.Router()

router.route('/').post(addFriend)
router.route('/all').get(getAllUserFriends)

export default router