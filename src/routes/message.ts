import express from 'express'
import { deleteMessage, getChatMessages } from '../controllers/message'
import { authMiddleware } from '../middleware/auth'
const router = express.Router()

router.route('/chat/:id').get(authMiddleware, getChatMessages)
router.route('/delete').delete(authMiddleware,deleteMessage)
export default router